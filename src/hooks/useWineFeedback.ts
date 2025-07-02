import { useState, useEffect } from 'react'
import { graphqlRequest } from '@/lib/graphql-client'

const createWineFeedbackMutation = `mutation CreateWineFeedback($wine: Int!, $feedback: WineFeedback_feedback_MutationInput!) {\n  createWineFeedback(data: { wine: $wine, feedback: $feedback }) {\n    id\n    feedback\n  }\n}`

const deleteWineFeedbackMutation = `mutation DeleteWineFeedback($id: Int!) {\n  deleteWineFeedback(id: $id) {\n    id\n  }\n}`

const getWineFeedbackQuery = `query GetWineFeedback($wine: JSON!) {\n  WineFeedbacks(where: { wine: { equals: $wine } }, limit: 1) {\n    docs {\n      id\n      feedback\n    }\n  }\n}`

type FeedbackType = 'like' | 'meh' | 'dislike'

interface UseWineFeedbackOptions {
  wineId: number
  onFeedbackChange?: (feedbackType: FeedbackType | null) => void
}

interface FeedbackState {
  activeFeedback: FeedbackType | null
  feedbackId: number | null
  isLoading: boolean
  error: string | null
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

export const useWineFeedback = ({ wineId, onFeedbackChange }: UseWineFeedbackOptions) => {
  const [state, setState] = useState<FeedbackState>({
    activeFeedback: null,
    feedbackId: null,
    isLoading: false,
    error: null,
  })

  // Initialize state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feedbackData = JSON.parse(sessionStorage.getItem('wineFeedback') || '{}')
      const wineFeedback = feedbackData[wineId]

      if (wineFeedback) {
        setState((prev) => ({
          ...prev,
          activeFeedback: wineFeedback.type,
          feedbackId: wineFeedback.id,
        }))
      }
    }
  }, [wineId])

  const setFeedback = async (feedbackType: FeedbackType | null): Promise<void> => {
    if (state.isLoading) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // If clicking the same feedback type, remove it (toggle off)
      if (state.activeFeedback === feedbackType) {
        feedbackType = null
      }

      // If there's an existing feedback, delete it first
      if (state.feedbackId) {
        await graphqlRequest({
          query: deleteWineFeedbackMutation,
          variables: { id: state.feedbackId },
        })
      }

      // If setting a new feedback type, create it
      if (feedbackType) {
        // Check if feedback already exists for this wine
        const existingFeedback = await graphqlRequest<WineFeedbacksResponse>({
          query: getWineFeedbackQuery,
          variables: { wine: wineId },
        })

        if (
          existingFeedback.data?.WineFeedbacks?.docs &&
          existingFeedback.data.WineFeedbacks.docs.length > 0
        ) {
          // Feedback already exists, update it
          const existingId = existingFeedback.data.WineFeedbacks.docs[0].id
          // Note: We'd need an update mutation here, but for now we'll delete and recreate
          await graphqlRequest({
            query: deleteWineFeedbackMutation,
            variables: { id: existingId },
          })
        }

        // Create new feedback
        const result = await graphqlRequest<CreateWineFeedbackResponse>({
          query: createWineFeedbackMutation,
          variables: { wine: wineId, feedback: feedbackType },
        })

        if (result.data?.createWineFeedback) {
          const newFeedbackId = result.data.createWineFeedback.id

          // Update session storage
          const feedbackData = JSON.parse(sessionStorage.getItem('wineFeedback') || '{}')
          feedbackData[wineId] = { type: feedbackType, id: newFeedbackId }
          sessionStorage.setItem('wineFeedback', JSON.stringify(feedbackData))

          setState((prev) => ({
            ...prev,
            activeFeedback: feedbackType,
            feedbackId: newFeedbackId,
            isLoading: false,
          }))
        }
      } else {
        // Removing feedback
        const feedbackData = JSON.parse(sessionStorage.getItem('wineFeedback') || '{}')
        delete feedbackData[wineId]
        sessionStorage.setItem('wineFeedback', JSON.stringify(feedbackData))

        setState((prev) => ({
          ...prev,
          activeFeedback: null,
          feedbackId: null,
          isLoading: false,
        }))
      }

      onFeedbackChange?.(feedbackType)
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to update feedback',
        isLoading: false,
      }))
    }
  }

  const like = () => setFeedback('like')
  const meh = () => setFeedback('meh')
  const dislike = () => setFeedback('dislike')
  const removeFeedback = () => setFeedback(null)

  return {
    // State
    activeFeedback: state.activeFeedback,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    like,
    meh,
    dislike,
    removeFeedback,
    setFeedback,

    // Convenience getters
    isLiked: state.activeFeedback === 'like',
    isMeh: state.activeFeedback === 'meh',
    isDisliked: state.activeFeedback === 'dislike',
  }
}
