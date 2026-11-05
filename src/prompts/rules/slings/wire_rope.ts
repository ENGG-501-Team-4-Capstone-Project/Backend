import type { InspectionRule } from '../../../types/inspection.js';

export const WIRE_ROPE_SLING_RULES: InspectionRule[] = [
  {
    id: 'WR1 - No broken or protruding wires',
    pass: 'Along the whole visible length of the rope there are no wire ends or strands sticking out, and no fraying or unravelling',
    fail: 'Any wire ends or strands sticking out of the rope, or any fraying or unravelling anywhere along its length',
    appliesTo: 'WIRE_ROPE_SLING'
  },
  {
    id: 'WR2 - No kinks, crushing or distortion',
    pass: 'The rope keeps a uniform round shape with no kinks, flattened sections, bulges or opened-up strands (bird caging)',
    fail: 'Any kink, crushed or flattened section, bulge or opened-up strands',
    appliesTo: 'WIRE_ROPE_SLING'
  },
  {
    id: 'WR3 - No severe abrasion or corrosion',
    pass: 'No worn flat or shiny scraped sections and no heavy rust or pitting on the rope',
    fail: 'Any worn flat or shiny scraped section, or heavy rust or pitting',
    appliesTo: 'WIRE_ROPE_SLING'
  }
];
