import { apiFetch } from '@/lib/api';
import { NewBatchForm } from './new-batch-form';
import { Product } from '@/types/product';

export default async function NewBatchPage() {
  const products = await apiFetch<Product[]>('/products');

  return <NewBatchForm products={products} />;
}