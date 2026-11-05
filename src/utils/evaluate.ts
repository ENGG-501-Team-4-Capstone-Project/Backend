import { INSPECTION_RULES } from '../prompts/rules/rules.js';
import type { InspectionRule, RIG_TYPE } from '../types/inspection.js';

export function getInspectionRules(rigType: RIG_TYPE): InspectionRule[] {
  return INSPECTION_RULES.filter((rule) => rule.appliesTo === rigType || rule.appliesTo === 'ALL');
}
