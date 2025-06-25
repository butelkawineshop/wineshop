/**
 * Navigation component constants
 * Centralized constants for ItemNavigation and Pagination components
 */

export const NAVIGATION_CONSTANTS = {
  // API limits
  MAX_NAVIGATION_ITEMS: 1000,

  // Animation durations
  TRANSITION_DURATION: 200,
  ANIMATION_DURATION: 500,
  LOADING_DELAY: 100,

  // Motion settings
  MOTION_STIFFNESS: 400,
  MOTION_DAMPING: 24,
  HOVER_SCALE: 1.06,
  TAP_SCALE: 0.98,

  // CSS classes
  CONTAINER_GAP: 'gap-4',
  BUTTON_GAP: 'gap-3',
  ICON_SIZE: 'w-5 h-5',
  BORDER_STYLE: 'border-t border-border/50',
  BACKGROUND_STYLE: 'bg-background/50 backdrop-blur-sm',
  HOVER_BACKGROUND: 'hover:bg-foreground/10',
  HOVER_TEXT: 'hover:text-background',
  TRANSITION_CLASSES: 'transition-all duration-200 ease-in-out transform',
  TEXT_OPACITY: 'text-foreground/60',
  DISABLED_OPACITY: 'text-foreground/30',

  // Layout
  CONTAINER_PADDING: 'px-4 py-4',
  CENTER_PADDING: 'px-4',
  MIN_WIDTH: 'min-w-0',
  FLEX_1: 'flex-1',
  FLEX_SHRINK: 'flex-shrink-0',
} as const
