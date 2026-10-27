import localFont from 'next/font/local'

// Брендбук п. 2.4, ТЗ раздел 2: заголовки — AvantGardeCTT, текст — Fact (ParaType).
// Подключаем только начертания, которые реально встречаются в вёрстке: Light не
// используется, SemiBold в комплекте нет — font-semibold (600) браузер рисует
// настоящим Bold (ближайший вес выше), а не синтезирует.
export const fact = localFont({
  src: [
    { path: './Fact-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Fact-Medium.woff2', weight: '500', style: 'normal' },
    { path: './Fact-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-fact',
  display: 'swap',
})

// Пока есть только Regular: font-bold на заголовках браузер утолщает синтетически.
// Когда придёт AvantGardeCTT-Bold, добавить его сюда с weight: '700'.
// В шрифте нет Ё/ё, узбекской/таджикской/казахской кириллицы, ʻ ʼ и № — эти знаки
// берутся из Arial (fallback с подогнанными метриками), а для tg/kk заголовки целиком
// переключены на Fact в globals.css.
export const avantGarde = localFont({
  src: [{ path: './AvantGardeCTT.woff2', weight: '400', style: 'normal' }],
  variable: '--font-avantgarde',
  display: 'swap',
})
