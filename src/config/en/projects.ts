/**
 * Projects configuration — ordered by Uli Ecosystem lifecycle:
 * Active → MVP → Maintained → Merged
 */

import type { Project } from '../../types';

import pixuli from './projects/pixuli.json';
import readuli from './projects/readuli.json';
import omnivuli from './projects/omnivuli.json';
import calluli from './projects/calluli.json';
import vireuli from './projects/vireuli.json';
import rootuli from './projects/rootuli.json';
import vitaluli from './projects/vitaluli.json';
import profiliuli from './projects/profiliuli.json';
import asair from './projects/asair.json';
import stationuli from './projects/stationuli.json';

export const projects: readonly Project[] = [
  // 🟢 Active
  pixuli,
  readuli,
  omnivuli,
  calluli,
  vireuli,
  rootuli,
  // 🟡 MVP
  vitaluli,
  // 🔵 Maintained
  profiliuli,
  // 🔀 Merged
  asair,
  stationuli,
] as Project[];
