export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type Brand = {
  id: string;
  name: string;
  createdAt: string;
};

export type Inventory = {
  productId: string;
  stock: number;
  minStock: number;
  updatedAt: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  price: string | number;
  cost: string | number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  categoryId: string;
  brandId: string | null;
  category: Category;
  brand: Brand | null;
  inventory: Inventory | null;
};
export type InventoryProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  price: string | number;
  cost: string | number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  categoryId: string;
  brandId: string | null;
  category: Category;
  brand: Brand | null;
};

export type InventoryItem = {
  productId: string;
  stock: number;
  minStock: number;
  updatedAt: string | null;
  product: InventoryProduct;
};