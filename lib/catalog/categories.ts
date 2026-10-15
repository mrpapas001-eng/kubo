import { CATEGORIES as MASTER_CATEGORIES } from "@/data/categories";

export type CategoryKey = string;

export type Category = {
  key: CategoryKey;
  label: string;
  subcategories: { key: string; label: string }[];
};

// Compatibility adapter for older imports. The source of truth is data/categories.ts.
export const CATEGORIES: Category[] = MASTER_CATEGORIES.map((category) => ({
  key: category.slug,
  label: category.label,
  subcategories: category.subcategories.map((sub) => ({
    key: sub.slug,
    label: sub.label,
  })),
}));

export function getCategory(key: CategoryKey) {
  return CATEGORIES.find((category) => category.key === key) ?? null;
}
