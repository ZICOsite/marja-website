// Root path is handled by next-intl middleware which redirects to /uz
import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/uz')
}
