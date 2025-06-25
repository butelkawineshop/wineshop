'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { NAVIGATION_CONSTANTS } from '@/constants/navigation'

interface PaginationInfo {
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface PaginationProps {
  pagination: PaginationInfo
  prevUrl: string | null
  nextUrl: string | null
  position?: 'top' | 'bottom'
  onPrevClick?: (e?: React.MouseEvent) => void
  onNextClick?: (e?: React.MouseEvent) => void
}

export function Pagination({
  pagination,
  prevUrl,
  nextUrl,
  position = 'bottom',
  onPrevClick,
  onNextClick,
}: PaginationProps): React.JSX.Element | null {
  const { t } = useTranslation()
  const { page: currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

  if (totalPages <= 1) return null

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowLeft' && hasPrevPage && prevUrl) {
      window.location.href = prevUrl
    } else if (e.key === 'ArrowRight' && hasNextPage && nextUrl) {
      window.location.href = nextUrl
    }
  }

  return (
    <div
      role="navigation"
      aria-label="Pagination"
      tabIndex={-1}
      className={
        position === 'top'
          ? `w-full ${NAVIGATION_CONSTANTS.BORDER_STYLE} ${NAVIGATION_CONSTANTS.BACKGROUND_STYLE}`
          : 'w-full '
      }
      onKeyDown={handleKeyDown}
    >
      <div className={`container mx-auto px-4 ${position === 'top' ? 'py-2' : 'py-4'}`}>
        <div className={`flex items-center justify-between ${NAVIGATION_CONSTANTS.CONTAINER_GAP}`}>
          {/* Previous Page */}
          <div className={`${NAVIGATION_CONSTANTS.FLEX_1} ${NAVIGATION_CONSTANTS.MIN_WIDTH}`}>
            {hasPrevPage && (prevUrl || onPrevClick) ? (
              prevUrl ? (
                <Link
                  href={prevUrl}
                  className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES} hover:scale-[1.02] cursor-pointer`}
                  aria-label={t('common.previous') + ' ' + t('common.page')}
                >
                  <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                    <svg
                      className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                  >
                    <div
                      className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.previous')}
                    </div>
                    <div
                      className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.page')}
                    </div>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={(e) => onPrevClick?.(e)}
                  className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES} hover:scale-[1.02] w-full text-left cursor-pointer`}
                  aria-label={t('common.previous') + ' ' + t('common.page')}
                >
                  <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                    <svg
                      className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                  >
                    <div
                      className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.previous')}
                    </div>
                    <div
                      className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.page')}
                    </div>
                  </div>
                </button>
              )
            ) : (
              <div className={`p-3 ${NAVIGATION_CONSTANTS.DISABLED_OPACITY}`} aria-disabled="true">
                <div className="text-sm">{t('common.previous')}</div>
                <div className="text-sm font-medium">—</div>
              </div>
            )}
          </div>

          {/* Current Page */}
          <div
            className={`${NAVIGATION_CONSTANTS.FLEX_SHRINK} ${NAVIGATION_CONSTANTS.CENTER_PADDING}`}
          >
            <div className="text-center">
              <div
                className={`text-xs ${NAVIGATION_CONSTANTS.TEXT_OPACITY} mb-1 transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
              >
                {t('common.showing')} {currentPage} {t('common.of')} {totalPages}
              </div>
              <h3
                className={`text-sm font-medium text-foreground max-w-xs truncate transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                aria-current="page"
              >
                {t('common.page')} {currentPage}
              </h3>
            </div>
          </div>

          {/* Next Page */}
          <div className={`${NAVIGATION_CONSTANTS.FLEX_1} ${NAVIGATION_CONSTANTS.MIN_WIDTH}`}>
            {hasNextPage && (nextUrl || onNextClick) ? (
              nextUrl ? (
                <Link
                  href={nextUrl}
                  className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES} hover:scale-[1.02] text-right cursor-pointer`}
                  aria-label={t('common.next') + ' ' + t('common.page')}
                >
                  <div
                    className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                  >
                    <div
                      className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.next')}
                    </div>
                    <div
                      className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.page')}
                    </div>
                  </div>
                  <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                    <svg
                      className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={(e) => onNextClick?.(e)}
                  className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES} hover:scale-[1.02] w-full text-right cursor-pointer`}
                  aria-label={t('common.next') + ' ' + t('common.page')}
                >
                  <div
                    className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                  >
                    <div
                      className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.next')}
                    </div>
                    <div
                      className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {t('common.page')}
                    </div>
                  </div>
                  <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                    <svg
                      className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              )
            ) : (
              <div
                className={`p-3 ${NAVIGATION_CONSTANTS.DISABLED_OPACITY} text-right`}
                aria-disabled="true"
              >
                <div className="text-sm">{t('common.next')}</div>
                <div className="text-sm font-medium">—</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
