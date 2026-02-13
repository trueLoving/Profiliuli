/**
 * Projects configuration (Chinese)
 * Import all project JSON files here
 */

import type { Project } from '../../types';

import asair from './projects/asair.json';
import pixuli from './projects/pixuli.json';
import stationuli from './projects/stationuli.json';
import profiliuli from './projects/profiliuli.json';

export const projects: readonly Project[] = [asair, pixuli, stationuli, profiliuli] as Project[];

