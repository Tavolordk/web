export type SalesToday = {
  total: string | number;
  ordersCount: number;
};

export type BestSellingProduct = {
  productId: string;
  productName: string;
  category: string | null;
  brand: string | null;
  quantitySold: number;
  totalSold: string | number;
};

export type RecentMovement = {
  id: string;
  productId: string;
  batchId: string | null;
  type: string;
  quantity: number;
  reason: string | null;
  createdBy: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: string | number;
    category?: {
      name: string;
    } | null;
    brand?: {
      name: string;
    } | null;
  };
  batch?: {
    id: string;
    batchCode: string | null;
    expirationDate: string | null;
  } | null;
};

export type DashboardResponse = {
  salesToday: SalesToday;
  pendingOrders: number;
  deliveredOrders: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  expiringSoonProducts: number;
  expiredProducts: number;
  bestSellingProducts: BestSellingProduct[];
  recentMovements: RecentMovement[];
};