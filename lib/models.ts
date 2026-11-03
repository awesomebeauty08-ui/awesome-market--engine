export const MODELS = [
  { id: 'anthropic/claude-sonnet-5.5', label: 'Claude Sonnet 5.5' },
  { id: 'openai/gpt-5.5', label: 'GPT-5.5' },
  { id: 'anthropic/claude-haiku-5.5', label: 'Claude Haiku 5.5 (fast)' },
] as const

export type ModelId = (typeof MODELS)[number]['id']

export const DEFAULT_MODEL: ModelId = MODELS[0].id

export function isModelId(value: unknown): value is ModelId {
  return MODELS.some((m) => m.id === value)
}

export function extractHtml(raw: string): string {
  const fenced = raw.match(/```(?:html)?\s*\n([\s\S]*?)(?:```|$)/i)
  const body = fenced ? fenced[1] : raw
  const start = body.search(/<!doctype html|<html/i)
  return (start >= 0 ? body.slice(start) : body).trim()
}
