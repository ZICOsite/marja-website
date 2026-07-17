import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import type { ContactInfo } from '@/payload-types'

type Props = {
  locale: string
}

// Структурированные данные Organization для Google (Knowledge Panel, локальный поиск, карты).
export const OrganizationJsonLd = async ({ locale }: Props) => {
  const data = (await getCachedGlobal('contact-info', 0, locale)()) as ContactInfo
  const baseUrl = getServerSideURL()

  const addresses = (data?.addresses ?? []).filter((item) => item?.label)
  const phones = (data?.phones ?? []).filter((item) => item?.number)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MARJA',
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/logo.png`,
    description: 'MARJA — производитель систем водоснабжения и канализации.',
    ...(data?.email ? { email: data.email } : {}),
    ...(phones.length > 0 ? { telephone: phones[0]?.number } : {}),
    sameAs: ['https://telegram.me/uz_marja'],
    ...(addresses.length > 0
      ? {
          department: addresses.map((address) => ({
            '@type': 'LocalBusiness',
            name: 'MARJA',
            address: address.label,
            ...(address.url ? { hasMap: address.url } : {}),
          })),
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
