'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

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
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  prevUrl,
  nextUrl,
  position = 'bottom',
}) => {
  const { t } = useTranslation()
  const { page: currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

  if (totalPages <= 1) return null

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
          ? 'w-full border-t border-border/50 bg-background/50 backdrop-blur-sm'
          : 'w-full '
      }
      onKeyDown={handleKeyDown}
    >
      <div className={`container mx-auto px-4 ${position === 'top' ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Previous Page */}
          <div className="flex-1 min-w-0">
            {hasPrevPage && prevUrl ? (
              <Link
                href={prevUrl}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                aria-label={t('common.previous') + ' ' + t('common.page')}
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-200"
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
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                    {t('common.previous')}
                  </div>
                  <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors duration-200">
                    {t('common.page')}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-3 text-foreground/30" aria-disabled="true">
                <div className="text-sm">{t('common.previous')}</div>
                <div className="text-sm font-medium">—</div>
              </div>
            )}
          </div>

          {/* Current Page */}
          <div className="flex-shrink-0 px-4">
            <div className="text-center">
              <div className="text-xs text-foreground/60 mb-1 transition-colors duration-200">
                {t('common.showing')} {currentPage} {t('common.of')} {totalPages}
              </div>
              <h3
                className="text-sm font-medium text-foreground max-w-xs truncate transition-colors duration-200"
                aria-current="page"
              >
                {t('common.page')} {currentPage}
              </h3>
            </div>
          </div>

          {/* Next Page */}
          <div className="flex-1 min-w-0">
            {hasNextPage && nextUrl ? (
              <Link
                href={nextUrl}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-right"
                aria-label={t('common.next') + ' ' + t('common.page')}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                    {t('common.next')}
                  </div>
                  <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors duration-200">
                    {t('common.page')}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-200"
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
              <div className="p-3 text-foreground/30 text-right" aria-disabled="true">
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
