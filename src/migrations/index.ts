import * as migration_20260316_075246 from './20260316_075246';
import * as migration_20260323_105522 from './20260323_105522';
import * as migration_20260323_132708 from './20260323_132708';
import * as migration_20260324_123441 from './20260324_123441';
import * as migration_20260325_135059 from './20260325_135059';
import * as migration_20260325_140035 from './20260325_140035';
import * as migration_20260327_140339 from './20260327_140339';
import * as migration_20260330_103624 from './20260330_103624';
import * as migration_20260330_112929 from './20260330_112929';
import * as migration_20260330_115004 from './20260330_115004';
import * as migration_20260330_130000_rename_top_bar_to_contact_info from './20260330_130000_rename_top_bar_to_contact_info';
import * as migration_20260330_141217 from './20260330_141217';
import * as migration_20260331_131649 from './20260331_131649';

export const migrations = [
  {
    up: migration_20260316_075246.up,
    down: migration_20260316_075246.down,
    name: '20260316_075246',
  },
  {
    up: migration_20260323_105522.up,
    down: migration_20260323_105522.down,
    name: '20260323_105522',
  },
  {
    up: migration_20260323_132708.up,
    down: migration_20260323_132708.down,
    name: '20260323_132708',
  },
  {
    up: migration_20260324_123441.up,
    down: migration_20260324_123441.down,
    name: '20260324_123441',
  },
  {
    up: migration_20260325_135059.up,
    down: migration_20260325_135059.down,
    name: '20260325_135059',
  },
  {
    up: migration_20260325_140035.up,
    down: migration_20260325_140035.down,
    name: '20260325_140035',
  },
  {
    up: migration_20260327_140339.up,
    down: migration_20260327_140339.down,
    name: '20260327_140339',
  },
  {
    up: migration_20260330_103624.up,
    down: migration_20260330_103624.down,
    name: '20260330_103624',
  },
  {
    up: migration_20260330_112929.up,
    down: migration_20260330_112929.down,
    name: '20260330_112929',
  },
  {
    up: migration_20260330_115004.up,
    down: migration_20260330_115004.down,
    name: '20260330_115004',
  },
  {
    up: migration_20260330_130000_rename_top_bar_to_contact_info.up,
    down: migration_20260330_130000_rename_top_bar_to_contact_info.down,
    name: '20260330_130000_rename_top_bar_to_contact_info',
  },
  {
    up: migration_20260330_141217.up,
    down: migration_20260330_141217.down,
    name: '20260330_141217',
  },
  {
    up: migration_20260331_131649.up,
    down: migration_20260331_131649.down,
    name: '20260331_131649'
  },
];
