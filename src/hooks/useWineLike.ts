import { useState, useEffect } from 'react'
import { graphqlRequest } from '@/lib/graphql-client'

const createWineFeedbackMutation = `mutation CreateWineFeedback($wine: Int!, $feedback: WineFeedback_feedback_MutationInput!) {\n  createWineFeedback(data: { wine: $wine, feedback: $feedback }) {\n    id\n    feedback\n  }\n}`

const deleteWineFeedbackMutation = `mutation DeleteWineFeedback($id: Int!) {\n  deleteWineFeedback(id: $id) {\n    id\n  }\n}`

const getWineFeedbackQuery = `query GetWineFeedback($wine: JSON!) {\n  WineFeedbacks(where: { wine: { equals: $wine } }, limit: 1) {\n    docs {\n      id\n      feedback\n    }\n  }\n}`

interface UseWineLikeOptions {
  wineId: number
  onLikeChange?: (liked: boolean) => void
}

interface WineFeedbackDoc {
  id: number
  feedback: string
}

interface WineFeedbacksResponse {
  WineFeedbacks: {
    docs: WineFeedbackDoc[]
  }
}

interface CreateWineFeedbackResponse {
  createWineFeedback: {
    id: number
    feedback: string
  }
}

export const useWineLike = ({ wineId, onLikeChange }: UseWineLikeOptions) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [feedbackId, setFeedbackId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const likedWines = JSON.parse(sessionStorage.getItem('likedWines') || '[]')
      const feedbackIds = JSON.parse(sessionStorage.getItem('feedbackIds') || '{}')

      setLiked(likedWines.includes(wineId))
      setFeedbackId(feedbackIds[wineId] || null)
    }
  }, [wineId])

  const toggleLike = async (): Promise<void> => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      if (liked) {
        // Unlike: remove from sessionStorage and delete feedback
        if (feedbackId) {
          setLiked(false)
          setFeedbackId(null)

          const likedWines = JSON.parse(sessionStorage.getItem('likedWines') || '[]')
          const updatedLikedWines = likedWines.filter((id: number) => id !== wineId)
          sessionStorage.setItem('likedWines', JSON.stringify(updatedLikedWines))

          const feedbackIds = JSON.parse(sessionStorage.getItem('feedbackIds') || '{}')
          delete feedbackIds[wineId]
          sessionStorage.setItem('feedbackIds', JSON.stringify(feedbackIds))

          // Call GraphQL mutation to delete feedback
          await graphqlRequest({
            query: deleteWineFeedbackMutation,
            variables: { id: feedbackId },
          })
        }
      } else {
        // Check if feedback already exists for this wine
        const existingFeedback = await graphqlRequest<WineFeedbacksResponse>({
          query: getWineFeedbackQuery,
          variables: { wine: wineId },
        })

        if (
          existingFeedback.data?.WineFeedbacks?.docs &&
          existingFeedback.data.WineFeedbacks.docs.length > 0
        ) {
          // Feedback already exists, just update state
          const existingId = existingFeedback.data.WineFeedbacks.docs[0].id
          setLiked(true)
          setFeedbackId(existingId)

          const likedWines = JSON.parse(sessionStorage.getItem('likedWines') || '[]')
          if (!likedWines.includes(wineId)) {
            likedWines.push(wineId)
            sessionStorage.setItem('likedWines', JSON.stringify(likedWines))
          }

          const feedbackIds = JSON.parse(sessionStorage.getItem('feedbackIds') || '{}')
          feedbackIds[wineId] = existingId
          sessionStorage.setItem('feedbackIds', JSON.stringify(feedbackIds))
        } else {
          // Create new feedback
          const result = await graphqlRequest<CreateWineFeedbackResponse>({
            query: createWineFeedbackMutation,
            variables: { wine: wineId, feedback: 'like' },
          })

          if (result.data?.createWineFeedback) {
            setLiked(true)
            setFeedbackId(result.data.createWineFeedback.id)

            const likedWines = JSON.parse(sessionStorage.getItem('likedWines') || '[]')
            likedWines.push(wineId)
            sessionStorage.setItem('likedWines', JSON.stringify(likedWines))

            const feedbackIds = JSON.parse(sessionStorage.getItem('feedbackIds') || '{}')
            feedbackIds[wineId] = result.data.createWineFeedback.id
            sessionStorage.setItem('feedbackIds', JSON.stringify(feedbackIds))
          }
        }
      }

      onLikeChange?.(!liked)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update like status')
      // Revert state on error
      setLiked(liked)
      setFeedbackId(feedbackId)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    liked,
    isLoading,
    error,
    toggleLike,
  }
}
