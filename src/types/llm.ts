export interface PromptInstructions {
  systemLevel: string;
  userLevel: string;
}

export type UserContent = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };

export interface PromptPayloadContent {
  text?: string;
  data?: unknown;
  imageUrls?: string[];
}
