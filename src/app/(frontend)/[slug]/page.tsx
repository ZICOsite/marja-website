// Locale homepage: /uz → slug='uz', contentSlug defaults to 'home'
import PageTemplate, { generateMetadata } from './[contentSlug]/page'

// Конфиг сегмента Next не подхватывает через реэкспорт — задаём здесь явно.
// Главная — ISR; при публикации её сразу сбрасывают хуки revalidatePage /
// revalidateProduct / revalidateProject, revalidate — страховка.
export const revalidate = 3600

export default PageTemplate
export { generateMetadata }
