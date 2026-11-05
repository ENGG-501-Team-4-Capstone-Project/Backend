type SLINGS = 'WIRE_ROPE_SLING' | 'SYNTHETIC_WEB_SLING' | 'POLYESTER_ROUNDSLING' | 'CHAIN_SLING';
type HOOKS = '';
type GENERAL_TYPES = 'ALL' | 'SLING' | 'HOOK';

export type RIG_TYPE = GENERAL_TYPES | SLINGS;

export interface InspectionRule {
  id: string;
  pass: string;
  fail: string;
  appliesTo: RIG_TYPE;
}
