import React from 'react'
import { Icon } from '@/components/Icon'
import { WINE_CONSTANTS } from '@/constants/wine'

interface WineActionButtonsProps {
  showLike?: boolean
  showMeh?: boolean
  showDislike?: boolean
  showShare?: boolean
  onLike?: () => void
  onMeh?: () => void
  onDislike?: () => void
  onShare?: () => void
  t?: (key: string) => string // Optional translation function
  activeLike?: boolean // Active state for like
  activeMeh?: boolean // Active state for meh
  activeDislike?: boolean // Active state for dislike
}

export const WineActionButtons: React.FC<WineActionButtonsProps> = ({
  showLike = false,
  showMeh = false,
  showDislike = false,
  showShare = false,
  onLike,
  onMeh,
  onDislike,
  onShare,
  t = (x) => x,
  activeLike = false,
  activeMeh = false,
  activeDislike = false,
}) => {
  return (
    <div className="flex gap-2">
      {showLike && (
        <button
          onClick={onLike}
          className="interactive rounded-full p-1 focus-ring"
          aria-label={t('wine.actions.like')}
          type="button"
        >
          <Icon
            name="like"
            variant={activeLike ? 'color' : 'white'}
            width={WINE_CONSTANTS.ICON_SIZE}
            height={WINE_CONSTANTS.ICON_SIZE}
          />
        </button>
      )}
      {showMeh && (
        <button
          onClick={onMeh}
          className="interactive rounded-full p-1 focus-ring"
          aria-label={t('wine.actions.meh')}
          type="button"
        >
          <Icon
            name="meh"
            variant={activeMeh ? 'color' : 'white'}
            width={WINE_CONSTANTS.ICON_SIZE}
            height={WINE_CONSTANTS.ICON_SIZE}
          />
        </button>
      )}
      {showDislike && (
        <button
          onClick={onDislike}
          className="interactive rounded-full p-1 focus-ring"
          aria-label={t('wine.actions.dislike')}
          type="button"
        >
          <Icon
            name="dislike"
            variant={activeDislike ? 'color' : 'white'}
            width={WINE_CONSTANTS.ICON_SIZE}
            height={WINE_CONSTANTS.ICON_SIZE}
          />
        </button>
      )}
      {showShare && (
        <button
          onClick={onShare}
          className="interactive rounded-full p-1 focus-ring"
          aria-label={t('wine.actions.share')}
          type="button"
        >
          <Icon
            name="share"
            variant="color"
            width={WINE_CONSTANTS.ICON_SIZE}
            height={WINE_CONSTANTS.ICON_SIZE}
          />
        </button>
      )}
    </div>
  )
}
