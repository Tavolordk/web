import { apiFetch } from '@/lib/api';
import { NewProductForm } from './new-product-form';
import { Brand, Category } from '@/types/product';

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    apiFetch<Category[]>('/categories'),
    apiFetch<Brand[]>('/brands'),
  ]);

  return <NewProductForm categories={categories} brands={brands} />;
}