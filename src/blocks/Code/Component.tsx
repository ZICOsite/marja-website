import { cn } from '@/utilities/ui'

import { Code } from './Component.client'

export type CodeBlockProps = {
  code: string
  language?: string
  blockType: 'code'
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock = ({ className, code, language }: Props) => {
  return (
    <div className={cn(className, 'not-prose')}>
      <Code code={code} language={language} />
    </div>
  )
}
