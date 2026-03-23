import type { CollectionBeforeChangeHook } from 'payload'

type SpecItem = { attribute: string; value: string }
type AttrDoc = { id: string; slug: string }

/**
 * Перед сохранением товара собирает плоский массив filterValues вида "slug:value"
 * из характеристик с пометкой filterable: true.
 * Это позволяет делать быстрые WHERE-запросы в каталоге.
 */
export const flattenSpecifications: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data.specifications?.length) {
    data.filterValues = []
    return data
  }

  const attrIds = (data.specifications as SpecItem[]).map((s) => s.attribute).filter(Boolean)

  if (!attrIds.length) {
    data.filterValues = []
    return data
  }

  const { docs: attrs } = await req.payload.find({
    collection: 'attributes',
    where: {
      and: [{ id: { in: attrIds } }, { filterable: { equals: true } }],
    },
    depth: 0,
    overrideAccess: true,
    req,
  })

  data.filterValues = (attrs as AttrDoc[]).flatMap((attr) => {
    const spec = (data.specifications as SpecItem[]).find((s) => s.attribute === attr.id)
    if (!spec?.value) return []
    return [{ value: `${attr.slug}:${spec.value}` }]
  })

  return data
}
