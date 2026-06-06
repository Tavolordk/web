import { apiFetch } from '@/lib/api';
import { InventoryAdjustForm } from './inventory-adjust-form';
import { InventoryItem } from '@/types/product';

type InventoryProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function InventoryProductPage({
  params,
}: InventoryProductPageProps) {
  const { productId } = await params;

  const inventory = await apiFetch<InventoryItem>(
    `/inventory/${productId}`,
  );

  return <InventoryAdjustForm inventory={inventory} />;
}