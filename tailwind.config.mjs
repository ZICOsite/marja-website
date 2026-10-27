/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 30s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 30s) linear infinite',
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              // Брендбук п. 2.1: без этого typography красит жирный, ссылки, маркеры и т. п.
              // своей серой палитрой (#101828 и др.). Токены меняются вместе с темой.
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-lead': 'var(--foreground)',
              '--tw-prose-bold': 'var(--foreground)',
              '--tw-prose-links': 'var(--primary)',
              '--tw-prose-counters': 'var(--muted-foreground)',
              '--tw-prose-bullets': 'var(--muted-foreground)',
              '--tw-prose-hr': 'var(--border)',
              '--tw-prose-quotes': 'var(--foreground)',
              '--tw-prose-quote-borders': 'var(--marja-gold)',
              '--tw-prose-captions': 'var(--muted-foreground)',
              '--tw-prose-kbd': 'var(--foreground)',
              '--tw-prose-code': 'var(--foreground)',
              '--tw-prose-pre-code': 'var(--marja-white)',
              '--tw-prose-pre-bg': 'var(--marja-navy)',
              '--tw-prose-th-borders': 'var(--border)',
              '--tw-prose-td-borders': 'var(--border)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
