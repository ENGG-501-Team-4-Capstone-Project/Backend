type SLINGS = 'WIRE_ROPE_SLING' | 'SYNTHETIC_WEB_SLING' | 'POLYESTER_ROUNDSLING' | 'CHAIN_SLING';
type HOOKS = '';

export type RIG_TYPE = 'ALL' | SLINGS;

export interface InspectionRule {
  id: string;
  pass: string;
  fail: string;
  appliesTo: RIG_TYPE;
}
