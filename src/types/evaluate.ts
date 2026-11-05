import type { InspectionRule, RIG_TYPE } from './inspection.js';
import type { TagField } from './tag.js';

export interface EvaluateBody {
  tagInformation: TagField[];
  images: string[];
  rigType: RIG_TYPE;
}

type EvaluationStatus = 'pass' | 'fail' | 'cannot_assess';
type Cannot_Assess_Reason = 'needs_touch_or_measurement' | 'ambiguous' | 'image_quality' | 'not_visible';

export interface EvaluationVerdict {
  status: EvaluationStatus;
  cannot_assess_reason?: Cannot_Assess_Reason;
  violations?: InspectionRule[];
}
