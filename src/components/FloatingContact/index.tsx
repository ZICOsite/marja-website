import { getCachedGlobal } from '@/utilities/getGlobals'
import type { ContactInfo } from '@/payload-types'
import { FloatingContactButtons } from './Buttons.client'

type Props = {
  locale: string
}

// Плавающий блок контактов в правом нижнем углу: Telegram + звонок + заявка на консультацию.
// Телефон подхватывается из глобала ContactInfo (первый номер).
export const FloatingContact = async ({ locale }: Props) => {
  const data = (await getCachedGlobal('contact-info', 0, locale)()) as ContactInfo

  const phoneNumber = data?.phones?.[0]?.number
  const telHref = phoneNumber ? `tel:${phoneNumber.replace(/[^+\d]/g, '')}` : null

  return <FloatingContactButtons telHref={telHref} phoneNumber={phoneNumber} />
}
