'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <MDEditor
      value={value}
      onChange={(val) => onChange(val ?? '')}
      height={400}
      data-color-mode="light"
    />
  )
}
