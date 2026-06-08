import { apiFetch } from '@/lib/api';
import { InventoryEntryForm } from './inventory-entry-form';
import { InventoryItem } from '@/types/product';

export default async function InventoryEntryPage() {
  const inventory = await apiFetch<InventoryItem[]>('/inventory');

  return <InventoryEntryForm inventory={inventory} />;
}