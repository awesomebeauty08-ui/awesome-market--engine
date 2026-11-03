'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Code2, Copy, Download, ExternalLink, Eye, RotateCcw } from 'lucide-react'

type Props = {
  html: string
  isLoading: boolean
  onReset: () => void
}

export function OutputPanel({ html, isLoading, onReset }: Props) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const activeTab = isLoading ? 'code' : tab

  useEffect(() => {
    if (isLoading && codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight
    }
  }, [html, isLoading])

  const download = () => {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'app.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const openInTab = () => {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    window.open(url, '_blank', 'noopener')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lines = html.split('\n').length

  return (
    <section
      aria-label="Build output"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2">
        <div role="tablist" className="flex items-center gap-1">
          <TabButton active={activeTab === 'preview'} disabled={isLoading} onClick={() => setTab('preview')}>
            <Eye className="size-3.5" /> Preview
          </TabButton>
          <TabButton active={activeTab === 'code'} onClick={() => setTab('code')}>
            <Code2 className="size-3.5" /> Code
          </TabButton>
        </div>
        <div className="flex items-center gap-0.5">
          {isLoading ? (
            <span className="flex items-center gap-2 px-2 font-mono text-xs text-accent">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              {lines} lines
            </span>
          ) : (
            <>
              <IconButton label={copied ? 'Copied' : 'Copy code'} onClick={copy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </IconButton>
              <IconButton label="Download HTML" onClick={download}>
                <Download className="size-4" />
              </IconButton>
              <IconButton label="Open in new tab" onClick={openInTab}>
                <ExternalLink className="size-4" />
              </IconButton>
              <IconButton label="Start over" onClick={onReset}>
                <RotateCcw className="size-4" />
              </IconButton>
            </>
          )}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {activeTab === 'preview' ? (
          <iframe
            title="Generated app preview"
            srcDoc={html}
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-pointer-lock"
            className="absolute inset-0 size-full bg-white"
          />
        ) : (
          <pre
            ref={codeRef}
            className="absolute inset-0 overflow-auto p-4 font-mono text-xs leading-relaxed text-muted"
          >
            <code>{html || 'Starting engine…'}</code>
          </pre>
        )}
      </div>
    </section>
  )
}

function TabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
        active ? 'bg-background text-foreground' : 'text-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  )
}
