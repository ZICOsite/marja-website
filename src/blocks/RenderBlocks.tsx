import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { StatsBlock } from '@/blocks/Statistics/Component'
import { SolutionsBlock } from '@/blocks/Solutions/Component'
import { AboutCompanyBlock } from '@/blocks/AboutCompany/Component'
import { ClientsBlock } from '@/blocks/Clients/Component'
import { PopularProductsBlock } from '@/blocks/PopularProducts/Component'
import { TimelineBlockComponent } from '@/blocks/Timeline/Component'
import { TeamBlockComponent } from '@/blocks/Team/Component'
import { LatestPostsBlock } from '@/blocks/LatestPosts/Component'
import { ContactsBlockComponent } from '@/blocks/Contacts/Component'
import { CompletedProjectsBlock } from '@/blocks/CompletedProjects/Component'
import { DownloadsBlockComponent } from '@/blocks/Downloads/Component'
import { DocumentationBlockComponent } from '@/blocks/Documentation/Component'
import { CareersBlockComponent } from '@/blocks/Careers/Component'
import { ReadySolutionsBlockComponent } from '@/blocks/ReadySolutions/Component'
import { WarrantyIntroBlockComponent } from '@/blocks/WarrantyIntro/Component'
import { MarketingAnalysisBlockComponent } from '@/blocks/MarketingAnalysis/Component'
import { CompanyGrowthBlockComponent } from '@/blocks/CompanyGrowth/Component'
import { WarrantyFeaturesBlockComponent } from '@/blocks/WarrantyFeatures/Component'
import { LeanIntroBlockComponent } from '@/blocks/LeanIntro/Component'
import { LeanPrinciplesBlockComponent } from '@/blocks/LeanPrinciples/Component'
import { LeanToolsBlockComponent } from '@/blocks/LeanTools/Component'
import { LeanResultsBlockComponent } from '@/blocks/LeanResults/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  features: FeaturesBlock,
  stats: StatsBlock,
  solutions: SolutionsBlock,
  aboutCompany: AboutCompanyBlock,
  clients: ClientsBlock,
  popularProducts: PopularProductsBlock,
  timeline: TimelineBlockComponent,
  team: TeamBlockComponent,
  latestPosts: LatestPostsBlock,
  contacts: ContactsBlockComponent,
  completedProjects: CompletedProjectsBlock,
  downloads: DownloadsBlockComponent,
  documentation: DocumentationBlockComponent,
  careers: CareersBlockComponent,
  readySolutions: ReadySolutionsBlockComponent,
  warrantyIntro: WarrantyIntroBlockComponent,
  marketingAnalysis: MarketingAnalysisBlockComponent,
  companyGrowth: CompanyGrowthBlockComponent,
  warrantyFeatures: WarrantyFeaturesBlockComponent,
  leanIntro: LeanIntroBlockComponent,
  leanPrinciples: LeanPrinciplesBlockComponent,
  leanTools: LeanToolsBlockComponent,
  leanResults: LeanResultsBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale?: string
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} locale={locale} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
