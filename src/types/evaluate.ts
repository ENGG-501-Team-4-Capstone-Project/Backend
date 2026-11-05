import type { TagField } from './tag.js';

export interface EvaluateBody {
  tagInformation: TagField[];
  images: string[];
}
