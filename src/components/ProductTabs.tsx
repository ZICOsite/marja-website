'use client'

import { FileText } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

type SpecGroup = {
  groupName: string | null
  items: { attrName: string; value: string; unit: string | null; standardValue: string | null }[]
}

type DocumentFile = {
  label?: string | null
  fileUrl?: string | null
  filename?: string | null
}

type DocumentGroup = {
  category?: string | null
  files: DocumentFile[]
}

type Props = {
  description?: React.ReactNode
  hasDescription: boolean
  specGroups: SpecGroup[]
  documents: DocumentGroup[]
  productTitle?: string
  standardLabel?: string | null
  qualityNote?: string | null
  warrantyNote?: string | null
  labels: {
    description: string
    specifications: string
    documents: string
    noDocuments: string
    downloadDocument: string
    specIndicator: string
    specIndicatorValue: string
    specActualValues: string
  }
}

export function ProductTabs({
  description,
  hasDescription,
  specGroups,
  documents,
  productTitle,
  standardLabel,
  qualityNote,
  warrantyNote,
  labels,
}: Props) {
  const defaultTab = hasDescription ? 'description' : specGroups.length > 0 ? 'specs' : 'docs'

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="relative overflow-hidden">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 gap-0 overflow-x-auto">
          {hasDescription && (
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm sm:px-6 sm:text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none whitespace-nowrap"
            >
              {labels.description}
            </TabsTrigger>
          )}
          {specGroups.length > 0 && (
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm sm:px-6 sm:text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none whitespace-nowrap"
            >
              {labels.specifications}
            </TabsTrigger>
          )}
          <TabsTrigger
            value="docs"
            className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm sm:px-6 sm:text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none whitespace-nowrap"
          >
            {labels.documents}
          </TabsTrigger>
        </TabsList>
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background pointer-events-none" />
      </div>

      {/* Описание */}
      {hasDescription && (
        <TabsContent value="description" className="mt-8">
          {description}
        </TabsContent>
      )}

      {/* Характеристики */}
      {specGroups.length > 0 && (
        <TabsContent value="specs" className="mt-8">
          <div className="space-y-8">
            {specGroups.map((group, gi) => (
              <div key={gi}>
                {group.groupName && (
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    {group.groupName}
                  </h3>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border text-sm">
                    <thead>
                      <tr>
                        <th
                          rowSpan={2}
                          className="border border-border px-4 py-3 text-left font-semibold bg-muted/50 w-2/5 align-middle"
                        >
                          {labels.specIndicator}
                        </th>
                        <th
                          colSpan={2}
                          className="border border-border px-4 py-3 text-center font-semibold bg-muted/50"
                        >
                          {labels.specIndicatorValue}
                          {productTitle && <span className="font-bold"> {productTitle}</span>}
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-3 text-center font-semibold bg-muted/30 w-[30%]">
                          {standardLabel ?? ''}
                        </th>
                        <th className="border border-border px-4 py-3 text-center font-semibold bg-muted/30 w-[30%]">
                          {labels.specActualValues}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((spec, si) => (
                        <tr key={si} className={si % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                          <td className="border border-border px-4 py-3 align-middle">
                            {spec.attrName}
                          </td>
                          <td className="border border-border px-4 py-3 text-center align-middle">
                            {spec.standardValue ?? '—'}
                          </td>
                          <td className="border border-border px-4 py-3 text-center align-middle font-medium">
                            {spec.value}
                            {spec.unit && (
                              <span className="text-muted-foreground ml-1">{spec.unit}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Текстовые блоки под таблицей */}
            {qualityNote && (
              <div className="border border-border rounded px-5 py-4 text-sm">{qualityNote}</div>
            )}
            {warrantyNote && (
              <div className="border border-border rounded px-5 py-4 text-sm italic">
                {warrantyNote}
              </div>
            )}
          </div>
        </TabsContent>
      )}

      {/* Документация — аккордионы */}
      <TabsContent value="docs" className="mt-8">
        {documents.length === 0 ? (
          <p className="text-muted-foreground">{labels.noDocuments}</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {documents.map((group, i) => {
              const groupName = group.category ?? labels.documents
              return (
                <AccordionItem key={i} value={`doc-${i}`}>
                  <AccordionTrigger className="text-xl">{groupName}</AccordionTrigger>
                  <AccordionContent>
                    {group.files.length === 0 ? (
                      <span className="text-muted-foreground text-sm">{labels.noDocuments}</span>
                    ) : (
                      <ul className="space-y-2 flex flex-wrap gap-4">
                        {group.files.map((f, fi) => {
                          const fileName = f.label ?? f.filename ?? labels.downloadDocument
                          return (
                            <li key={fi} className="w-full max-w-32">
                              {f.fileUrl ? (
                                <a
                                  href={f.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center text-center gap-2 text-primary hover:underline text-sm font-medium"
                                >
                                  <FileText size={100} strokeWidth={1.5} />
                                  {fileName}
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">{fileName}</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </TabsContent>
    </Tabs>
  )
}
