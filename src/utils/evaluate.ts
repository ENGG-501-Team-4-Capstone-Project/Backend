import { INSPECTION_RULES } from '../prompts/rules/rules.js';
import type { InspectionRule, RIG_TYPE } from '../types/inspection.js';

const RIG_PARENTS: Partial<Record<RIG_TYPE, RIG_TYPE[]>> = {
  WIRE_ROPE_SLING: ['SLING']
};

export function getInspectionRules(rigType: RIG_TYPE): InspectionRule[] {
  const scopes = ['ALL', rigType, ...(RIG_PARENTS[rigType] ?? [])];
  return INSPECTION_RULES.filter((rule) => scopes.includes(rule.appliesTo));
}
