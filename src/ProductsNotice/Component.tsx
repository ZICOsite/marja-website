import { MessageCircleWarning } from 'lucide-react'

type Props = {
  text?: string
}

export function ProductsNoticeCard({ text }: Props) {
  return (
    <div className="rounded-2xl bg-muted/60 border border-border p-4 flex flex-col items-center text-center gap-4 w-full">
      <div className="text-primary">
        <MessageCircleWarning className="w-14 h-14" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-foreground leading-relaxed">{text}</p>
    </div>
  )
}
