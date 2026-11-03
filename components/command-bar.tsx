'use client'

import { ArrowUp, Square } from 'lucide-react'
import { MODELS, type ModelId } from '@/lib/models'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  isLoading: boolean
  model: ModelId
  onModelChange: (model: ModelId) => void
  placeholder: string
}

export function CommandBar({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  model,
  onModelChange,
  placeholder,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="rounded-xl border border-border bg-surface focus-within:border-accent/60 transition-colors"
    >
      <label htmlFor="command" className="sr-only">
        Command
      </label>
      <textarea
        id="command"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || e.shiftKey) return
          if (e.nativeEvent.isComposing || e.keyCode === 229) return
          e.preventDefault()
          onSubmit()
        }}
        rows={2}
        maxLength={4000}
        placeholder={placeholder}
        className="block w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <label className="sr-only" htmlFor="model">
          Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => onModelChange(e.target.value as ModelId)}
          className="min-w-0 rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-muted focus:outline-none focus:border-accent/60"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop building"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background hover:opacity-90"
          >
            <Square className="size-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Build"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-30"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </form>
  )
}
