// Sorting component constants
export const SORT_CONSTANTS = {
  BUTTON_GAP: 'gap-4',
  ICON_GAP: 'gap-1',
  ICON_SIZE: 'w-5 h-5',
} as const

export const SORT_OPTIONS = [
  {
    value: 'createdAt',
    icon: 'date',
    tooltipKey: 'sorting.newest',
  },
  {
    value: 'price',
    icon: 'price',
    tooltipKey: 'sorting.price',
  },
  {
    value: 'name',
    icon: 'alphabet',
    tooltipKey: 'sorting.name',
  },
] as const
