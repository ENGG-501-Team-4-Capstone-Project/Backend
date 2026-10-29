export type Confidence = 'high' | 'low';

export interface ReadTagBody {
  image: string;
}

export interface TagField {
  id: string;
  label: string;
  value: string | null;
  units: string | null;
  confidence: Confidence;
}

export interface TagReading {
  fields: TagField[];
}
