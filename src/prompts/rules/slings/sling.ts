import type { InspectionRule } from '../../../types/inspection.js';

const GENERAL_SLING_INSPECTION_RULES: InspectionRule[] = [
  {
    id: 'SL1 - Design Factor of At Least 5:1',
    pass: 'The load is within (breaking strength)/5',
    fail: 'The load exceeds safe working load of (breaking strength)/5',
    appliesTo: 'WIRE_ROPE_SLING'
  }
];

export const SLING_INSPECTION_RULES: InspectionRule[] = [...GENERAL_SLING_INSPECTION_RULES];
