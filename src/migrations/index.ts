import * as migration_20250626_214748_fix_climates_schema from './20250626_214748_fix_climates_schema'

export const migrations = [
  {
    up: migration_20250626_214748_fix_climates_schema.up,
    down: migration_20250626_214748_fix_climates_schema.down,
    name: '20250626_214748_fix_climates_schema',
  },
]
