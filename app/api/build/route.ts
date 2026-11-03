import { createUIMessageStreamResponse, streamText, toUIMessageStream } from 'ai'
import { DEFAULT_MODEL, isModelId } from '@/lib/models'

export const maxDuration = 300

const MAX_PROMPT = 4000
const MAX_PREVIOUS = 200_000

const SYSTEM = `You are Awesome Engine, an expert product engineer and designer that builds complete, working web apps from a single command.

Output rules (strict):
- Respond with ONE complete, self-contained HTML document and nothing else. Start with <!DOCTYPE html>. No markdown fences, no explanations.
- All CSS and JavaScript must be inline. You MAY load libraries only from https://cdn.tailwindcss.com, https://esm.sh, https://cdn.jsdelivr.net, https://unpkg.com, and Google Fonts.
- The app must be fully functional: real interactions, real state, real logic. No placeholders, no "TODO", no lorem ipsum.
- Persist user data with localStorage when the app benefits from persistence (it runs in a sandbox with no backend).
- Do not use alert(), confirm(), or prompt(); build in-page UI instead.
- Make it responsive and mobile-first, accessible (semantic HTML, labels, contrast), and visually polished with a coherent palette of 3-5 colors.
- For images, use inline SVG, CSS, or emoji-free icon libraries from the allowed CDNs. Never reference local files.
- For games, use <canvas> or DOM with keyboard AND touch controls.`

export async function POST(req: Request) {
  let body: { prompt?: unknown; model?: unknown; previousHtml?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  if (!prompt) return new Response('Prompt is required', { status: 400 })
  if (prompt.length > MAX_PROMPT) return new Response('Prompt is too long', { status: 413 })

  const model = isModelId(body.model) ? body.model : DEFAULT_MODEL
  const previousHtml =
    typeof body.previousHtml === 'string' ? body.previousHtml.slice(0, MAX_PREVIOUS) : ''

  const userPrompt = previousHtml
    ? `Here is the current app:\n\n${previousHtml}\n\nApply this change and return the full updated HTML document:\n${prompt}`
    : `Build this: ${prompt}`

  const result = streamText({
    model,
    system: SYSTEM,
    prompt: userPrompt,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        const message = error instanceof Error ? error.message : ''
        if (/credit card/i.test(message)) {
          return 'AI Gateway needs a credit card on file for this Vercel team before it can build. Add one in your Vercel dashboard under AI Gateway to unlock free credits.'
        }
        return 'The engine hit an error. Please try again.'
      },
    }),
  })
}
