type SLINGS = 'WIRE_ROPE_SLING';
type GENERAL_TYPES = 'ALL' | 'SLING';

export type RIG_TYPE = GENERAL_TYPES | SLINGS;

export interface InspectionRule {
  id: string;
  pass: string;
  fail: string;
  appliesTo: RIG_TYPE;
}
