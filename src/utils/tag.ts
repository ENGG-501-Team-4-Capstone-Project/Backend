import type { TagField, TagReading } from '../types/tag.js';

export function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'field'
  );
}

export function parseModelJson(content: string): unknown {
  return JSON.parse(content.replace(/```json|```/g, '').trim());
}

export function normalizeReading(rawReading: unknown): TagReading {
  const rawReadingObject = (rawReading ?? {}) as { fields?: unknown };
  if (!Array.isArray(rawReadingObject.fields)) throw new Error('missing fields array');

  const seenSlugCounts = new Map<string, number>();
  const fields: TagField[] = rawReadingObject.fields
    .filter((rawField): rawField is Record<string, unknown> => typeof rawField === 'object' && rawField !== null)
    .map((rawField) => {
      const label = String(rawField.label ?? '').trim() || 'Unlabeled';
      const baseSlug = slugify(label);
      const occurrenceCount = (seenSlugCounts.get(baseSlug) ?? 0) + 1;
      seenSlugCounts.set(baseSlug, occurrenceCount);
      return {
        id: occurrenceCount === 1 ? baseSlug : `${baseSlug}_${occurrenceCount}`,
        label,
        value: rawField.value == null ? null : String(rawField.value),
        units: rawField.units == null ? null : String(rawField.units),
        confidence: rawField.confidence === 'high' ? 'high' : 'low'
      };
    });

  return { fields };
}
