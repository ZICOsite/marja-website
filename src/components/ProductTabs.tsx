'use client'

import { Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

type SpecGroup = {
  groupName: string | null
  items: { attrName: string; value: string; unit: string | null }[]
}

type Document = {
  label?: string | null
  fileUrl?: string | null
  filename?: string | null
}

type Props = {
  description?: React.ReactNode
  hasDescription: boolean
  specGroups: SpecGroup[]
  documents: Document[]
  labels: {
    description: string
    specifications: string
    documents: string
    noDocuments: string
    downloadDocument: string
  }
}

export function ProductTabs({ description, hasDescription, specGroups, documents, labels }: Props) {
  const defaultTab = hasDescription ? 'description' : specGroups.length > 0 ? 'specs' : 'docs'

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 gap-0">
        {hasDescription && (
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {labels.description}
          </TabsTrigger>
        )}
        {specGroups.length > 0 && (
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {labels.specifications}
          </TabsTrigger>
        )}
        <TabsTrigger
          value="docs"
          className="rounded-none border-b-2 border-transparent px-6 py-3 text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          {labels.documents}
        </TabsTrigger>
      </TabsList>

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
                <div className="rounded-xl border border-border overflow-hidden">
                  {group.items.map((spec, si) => (
                    <div
                      key={si}
                      className={`flex items-center px-5 py-3 ${
                        si % 2 === 0 ? 'bg-background' : 'bg-sidebar-accent/40'
                      }`}
                    >
                      <span className="text-muted-foreground flex-1">{spec.attrName}</span>
                      <span className="font-medium">
                        {spec.value}
                        {spec.unit && (
                          <span className="text-muted-foreground ml-1">{spec.unit}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      )}

      {/* Документация — аккордионы */}
      <TabsContent value="docs" className="mt-8">
        {documents.length === 0 ? (
          <p className="text-muted-foreground">{labels.noDocuments}</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {documents.map((doc, i) => {
              const name = doc.label ?? doc.filename ?? labels.downloadDocument
              return (
                <AccordionItem key={i} value={`doc-${i}`}>
                  <AccordionTrigger className="text-xl">{name}</AccordionTrigger>
                  <AccordionContent>
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                      >
                        <Download size={16} />
                        {labels.downloadDocument}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">{labels.noDocuments}</span>
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
