import type { InspectionRule } from '../../types/inspection.js';
import { SLING_INSPECTION_RULES } from './slings/sling.js';

const GENERAL_INSPECTION_RULES: InspectionRule[] = [
  {
    id: 'G1 - No Heat Damage',
    pass: 'No evidence of heat damage (melting, charring, discolouration from excessive heat)',
    fail: 'Any evidence of heat damage',
    appliesTo: 'ALL'
  },
  {
    id: 'G2 - Fitting and end attachments undamaged',
    pass: 'Fittings and end attachments are not pitted, corroded, cracked, bent, twisted or broken',
    fail: 'Any of these conditions are visible',
    appliesTo: 'ALL'
  },
  {
    id: 'G3 - Load is within capacity',
    pass: 'Rated capacity for the hitch type in use is at least the load weight',
    fail: 'Capacity is below the load or cannot be determined',
    appliesTo: 'ALL'
  }
];

export const INSPECTION_RULES: InspectionRule[] = [...GENERAL_INSPECTION_RULES, ...SLING_INSPECTION_RULES];
