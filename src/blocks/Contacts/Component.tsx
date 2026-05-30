import { Mail, MapPin, Phone } from 'lucide-react'

type Office = {
  name: string
  address: string
  hours?: string | null
  mapUrl?: string | null
  id?: string | null
}

type PhoneItem = {
  number: string
  label?: string | null
  id?: string | null
}

type Props = {
  officesTitle?: string | null
  offices?: Office[] | null
  contactsTitle?: string | null
  phones?: PhoneItem[] | null
  email?: string | null
  emailLabel?: string | null
  mapEmbedUrl?: string | null
  description?: string | null
}

export const ContactsBlockComponent = ({
  officesTitle,
  offices,
  contactsTitle,
  phones,
  email,
  emailLabel,
  mapEmbedUrl,
  description,
}: Props) => {
  const hasOffices = offices && offices.length > 0
  const hasPhones = phones && phones.length > 0

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-10">
            {hasOffices && (
              <div>
                {officesTitle && (
                  <h2 className="text-2xl font-bold mb-6">{officesTitle}</h2>
                )}
                <ul className="flex flex-col gap-5">
                  {offices.map((office, i) => (
                    <li key={i} className="flex gap-3">
                      <MapPin className="shrink-0 mt-1 text-primary" size={18} />
                      <div>
                        <p className="font-semibold text-sm md:text-lg">{office.name}</p>
                        {office.mapUrl ? (
                          <a
                            href={office.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground text-balance hover:text-primary transition-colors font-sans"
                          >
                            {office.address}
                          </a>
                        ) : (
                          <p className="text-muted-foreground text-balance">{office.address}</p>
                        )}
                        {office.hours && (
                          <p className="text-muted-foreground">{office.hours}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <hr className="border-[var(--primary)]" />
            {(hasPhones || email) && (
              <div>
                {contactsTitle && (
                  <h2 className="text-2xl font-bold mb-6">{contactsTitle}</h2>
                )}
                {hasPhones && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {phones.map((phone, i) => (
                      <li key={i} className="flex gap-3">
                        <Phone className="shrink-0 mt-1 text-primary" size={18} />
                        <div>
                          <a
                            href={`tel:${phone.number.replace(/\s/g, '')}`}
                            className="font-semibold hover:text-primary transition-colors text-sm"
                          >
                            {phone.number}
                          </a>
                          {phone.label && (
                            <p className="text-muted-foreground text-sm">{phone.label}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {email && (
                  <div className="flex gap-3">
                    <Mail className="shrink-0 mt-1 text-primary" size={18} />
                    <div>
                      <a
                        href={`mailto:${email}`}
                        className="font-semibold hover:text-primary transition-colors font-sans"
                      >
                        {email}
                      </a>
                      {emailLabel && (
                        <p className="text-muted-foreground text-sm">{emailLabel}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {mapEmbedUrl && (
            <div className="w-full h-[400px] lg:h-auto min-h-[300px] rounded-lg overflow-hidden border border-border">
              <iframe
                src={mapEmbedUrl}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                title="Map"
              />
            </div>
          )}
        </div>

        {description && (
          <p className="mt-10 text-sm md:text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  )
}
