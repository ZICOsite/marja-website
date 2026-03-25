import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, meta } = originalDoc

  // originalDoc.title is an object when localized: { uz: '...', ru: '...', ... }
  // We flatten all locale titles into the search document so the document is
  // discoverable regardless of which locale the user searches from.
  const titleByLocale = originalDoc.title

  const titleForSearch =
    typeof titleByLocale === 'object' && titleByLocale !== null
      ? Object.values(titleByLocale).filter(Boolean).join(' ')
      : titleByLocale || ''

  if (collection === 'products') {
    const { sku, shortDescription, inStock, price, currency, priceOnRequest, heroImage, categories } =
      originalDoc

    const modifiedDoc: DocToSync = {
      ...searchDoc,
      slug,
      title: titleForSearch,
      meta: {
        ...meta,
        title: meta?.title || titleForSearch,
        image: meta?.image?.id || meta?.image,
        description: meta?.description,
      },
      categories: [],
      sku: sku ?? null,
      shortDescription: shortDescription ?? null,
      inStock: inStock ?? null,
      price: price ?? null,
      currency: currency ?? null,
      priceOnRequest: priceOnRequest ?? null,
      heroImage: typeof heroImage === 'object' && heroImage !== null ? heroImage.id : heroImage ?? null,
    }

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const populatedCategories: { id: string | number; title: string }[] = []
      for (const category of categories) {
        if (!category) {
          continue
        }

        if (typeof category === 'object') {
          populatedCategories.push(category)
          continue
        }

        const doc = await req.payload.findByID({
          collection: 'product-categories',
          id: category,
          disableErrors: true,
          depth: 0,
          locale: 'all',
          select: { title: true },
          req,
        })

        if (doc !== null) {
          const catTitle =
            typeof doc.title === 'object' && doc.title !== null
              ? Object.values(doc.title).filter(Boolean).join(' ')
              : doc.title || ''
          populatedCategories.push({ id: doc.id, title: catTitle })
        } else {
          console.error(
            `Failed. Product category not found when syncing collection '${collection}' with id: '${id}' to search.`,
          )
        }
      }

      modifiedDoc.categories = populatedCategories.map((each) => ({
        relationTo: 'product-categories',
        categoryID: String(each.id),
        title: each.title,
      }))
    }

    return modifiedDoc
  }

  // --- Posts (and other collections) ---
  const { categories } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    title: titleForSearch,
    meta: {
      ...meta,
      title: meta?.title || titleForSearch,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        locale: 'all',
        select: { title: true },
        req,
      })

      if (doc !== null) {
        // Merge all locale titles for category search too
        const catTitle =
          typeof doc.title === 'object' && doc.title !== null
            ? Object.values(doc.title).filter(Boolean).join(' ')
            : doc.title || ''
        populatedCategories.push({ id: doc.id, title: catTitle })
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
