import { apiFetch } from '@/lib/api';
import { InventoryOutputForm } from './inventory-output-form';
import { InventoryItem } from '@/types/product';

export default async function InventoryOutputPage() {
  const inventory = await apiFetch<InventoryItem[]>('/inventory');

  return <InventoryOutputForm inventory={inventory} />;
}