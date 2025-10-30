export const CATEGORY_ORDER = [
  "OTC Medicine",
  "5 hr energy",
  "Deodorant",
  "Rolling papers",
  "Lighters",
  "Incense",
  "Trojan",
  "Batteries",
  "Others",
];

export function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug) {
  const normalized = slug.replace(/-/g, " ").toLowerCase();
  return CATEGORY_ORDER.find(
    (category) => category.toLowerCase() === normalized
  );
}
