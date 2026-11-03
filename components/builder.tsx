'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { Zap } from 'lucide-react'
import { CommandBar } from './command-bar'
import { OutputPanel } from './output-panel'
import { DEFAULT_MODEL, extractHtml, type ModelId } from '@/lib/models'

const EXAMPLES = [
  'A Pomodoro timer with task list and stats',
  'A snake game with touch controls and high scores',
  'A landing page for an orange juice brand',
  'A budget tracker with charts',
  'A markdown notes app with search',
  'A drum machine with 8 pads',
]

export function Builder() {
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL)
  const [currentHtml, setCurrentHtml] = useState('')
  const [lastCommand, setLastCommand] = useState('')

  const { completion, input, setInput, complete, stop, isLoading, error, setCompletion } =
    useCompletion({
      api: '/api/build',
      onFinish: (_prompt, result) => setCurrentHtml(extractHtml(result)),
    })

  const streamingHtml = extractHtml(completion)
  const shownHtml = isLoading ? streamingHtml : currentHtml || streamingHtml
  const hasOutput = Boolean(shownHtml) || isLoading

  const run = (command: string) => {
    const prompt = command.trim()
    if (!prompt || isLoading) return
    setLastCommand(prompt)
    setInput('')
    complete(prompt, { body: { model, previousHtml: currentHtml || undefined } })
  }

  const reset = () => {
    setCurrentHtml('')
    setCompletion('')
    setLastCommand('')
  }

  return (
    <main className="mx-auto flex h-dvh max-w-6xl flex-col gap-4 px-4 py-4 md:py-6">
      <header className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Zap className="size-4 fill-current" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Awesome Engine</span>
        {hasOutput && lastCommand && (
          <span className="ml-2 truncate font-mono text-xs text-muted">{`> ${lastCommand}`}</span>
        )}
      </header>

      {hasOutput ? (
        <OutputPanel html={shownHtml} isLoading={isLoading} onReset={reset} />
      ) : (
        <section className="flex flex-1 flex-col justify-center gap-6 py-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Build anything.
              <br />
              <span className="text-accent">One command.</span>
            </h1>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-muted md:text-base">
              Describe an app, game, tool, or site. The engine writes the full code and runs it live in
              seconds. Then keep talking to change it.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Example commands">
            {EXAMPLES.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => run(example)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error.message || 'Something went wrong. Try again.'}
        </p>
      )}

      <CommandBar
        value={input}
        onChange={setInput}
        onSubmit={() => run(input)}
        onStop={stop}
        isLoading={isLoading}
        model={model}
        onModelChange={setModel}
        placeholder={currentHtml ? 'Describe a change…' : 'Build me a…'}
      />
    </main>
  )
}
