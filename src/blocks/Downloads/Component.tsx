'use client'

import { Archive, Download, File, FileImage, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utilities/ui'

type MediaFile = {
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
}

type FileItem = {
  id?: string | null
  name: string
  file: MediaFile | string | number
}

type Props = {
  heading?: string | null
  files?: FileItem[] | null
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileTypeIcon({ mimeType }: { mimeType?: string | null }) {
  if (mimeType?.includes('pdf'))
    return <FileText className="w-5 h-5 text-red-500 shrink-0" />
  if (mimeType?.startsWith('image/'))
    return <FileImage className="w-5 h-5 text-blue-400 shrink-0" />
  if (mimeType?.includes('zip') || mimeType?.includes('rar') || mimeType?.includes('archive'))
    return <Archive className="w-5 h-5 text-amber-500 shrink-0" />
  return <File className="w-5 h-5 text-muted-foreground shrink-0" />
}

export const DownloadsBlockComponent = ({ heading, files }: Props) => {
  const t = useTranslations('downloads')

  const items = (files ?? []).filter(
    (f): f is FileItem & { file: MediaFile } =>
      typeof f.file === 'object' && f.file !== null,
  )

  if (items.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-10">
            {heading}
          </h2>
        )}

        <div className="border border-border rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px] gap-4 px-6 py-3 bg-muted/50 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{t('name')}</span>
            <span className="text-right">{t('size')}</span>
            <span className="text-right">{t('download')}</span>
          </div>

          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                'group flex flex-col sm:grid sm:grid-cols-[1fr_100px_120px] gap-2 sm:gap-4 items-start sm:items-center px-6 py-4 hover:bg-muted/30 transition-colors',
                i < items.length - 1 && 'border-b border-border',
              )}
            >
              {item.file.url ? (
                <a
                  href={item.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 min-w-0 hover:underline"
                >
                  <FileTypeIcon mimeType={item.file.mimeType} />
                  <span className="text-sm font-medium leading-snug">{item.name}</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <FileTypeIcon mimeType={item.file.mimeType} />
                  <span className="text-sm font-medium leading-snug">{item.name}</span>
                </div>
              )}

              <span className="text-xs text-muted-foreground sm:text-right pl-8 sm:pl-0">
                {formatFileSize(item.file.filesize)}
              </span>

              {item.file.url ? (
                <a
                  href={item.file.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-8 sm:pl-0 sm:justify-end flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap group-hover:gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t('download')}
                </a>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
