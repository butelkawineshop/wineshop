// UI component constants
export const UI_CONSTANTS = {
  // Slider
  SLIDER_MIN_PERCENTAGE: 0,
  SLIDER_MAX_PERCENTAGE: 1,
  SLIDER_HANDLE_SIZE: 'w-4 h-4',
  SLIDER_TRACK_HEIGHT: 'h-2',

  // Dropdown
  DROPDOWN_OFFSET_PX: 4,
  DROPDOWN_MIN_WIDTH_PX: 300,

  // Z-index
  DROPDOWN_Z_INDEX: 9999,

  // Wine card dimensions
  WINE_CARD_HEIGHT: 'h-64',

  // Image quality
  DEFAULT_IMAGE_QUALITY: 75,

  // Toast notifications
  TOAST: {
    POSITION: 'top-right' as const,
    AUTO_CLOSE_MS: 5000,
    HIDE_PROGRESS_BAR: false,
    NEWEST_ON_TOP: true,
    CLOSE_ON_CLICK: true,
    RTL: false,
    PAUSE_ON_FOCUS_LOSS: true,
    DRAGGABLE: true,
    PAUSE_ON_HOVER: true,
    THEME: 'light' as const,
  },
} as const

export const ICON_CONSTANTS = {
  // Icon dimensions
  DEFAULT_SIZE: 24,
  LOGO_SIZE: 128,

  // Transition settings
  TRANSITION_DURATION: 'duration-200',

  // Icon variants
  VARIANTS: {
    WHITE: 'white',
    COLOR: 'color',
    SWITCH: 'switch',
    ACTIVE: 'active',
  },
} as const
