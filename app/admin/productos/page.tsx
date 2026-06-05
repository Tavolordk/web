import Link from 'next/link';
import {
  Barcode,
  Boxes,
  CirclePlus,
  Package,
  Pencil,
  Search,
  Tags,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Product } from '@/types/product';

function formatCurrency(value: string | number | null) {
  if (value === null) {
    return '—';
  }

  const numericValue = Number(value);

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
}

function getStockStatus(product: Product) {
  const stock = product.inventory?.stock ?? 0;
  const minStock = product.inventory?.minStock ?? 0;

  if (stock === 0) {
    return {
      label: 'Agotado',
      className: 'bg-red-50 text-red-700 border-red-100',
    };
  }

  if (stock <= minStock) {
    return {
      label: 'Bajo stock',
      className: 'bg-amber-50 text-amber-700 border-amber-100',
    };
  }

  return {
    label: 'Disponible',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
}

export default async function AdminProductsPage() {
  const products = await apiFetch<Product[]>('/products');

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col items-center justify-between gap-5 text-center xl:flex-row xl:text-left">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
              Catálogo
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Productos
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Administra productos, precios, marcas, categorías, códigos de
              barras e inventario actual de Miscelánea Anahí.
            </p>
          </div>

          <Link
            href="/admin/productos/nuevo"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            <CirclePlus size={20} />
            Nuevo producto
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="flex min-h-[145px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Package size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Total productos
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {products.length}
          </h3>
        </article>

        <article className="flex min-h-[145px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Boxes size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Con existencia
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {products.filter((product) => (product.inventory?.stock ?? 0) > 0).length}
          </h3>
        </article>

        <article className="flex min-h-[145px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Tags size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Bajo stock
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {
              products.filter((product) => {
                const stock = product.inventory?.stock ?? 0;
                const minStock = product.inventory?.minStock ?? 0;

                return stock > 0 && stock <= minStock;
              }).length
            }
          </h3>
        </article>

        <article className="flex min-h-[145px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <Barcode size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Agotados
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {products.filter((product) => (product.inventory?.stock ?? 0) === 0).length}
          </h3>
        </article>
      </section>

      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col items-center justify-between gap-4 text-center xl:flex-row xl:text-left">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              Lista de productos
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Consulta el estado actual del catálogo.
            </p>
          </div>

          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 xl:grid">
            <div>Producto</div>
            <div>Categoría / Marca</div>
            <div>Precio</div>
            <div>Stock</div>
            <div>Estado</div>
            <div className="text-right">Acción</div>
          </div>

          <div className="divide-y divide-slate-200">
            {products.length === 0 ? (
              <div className="flex min-h-[160px] items-center justify-center p-6 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Todavía no hay productos registrados.
                </p>
              </div>
            ) : (
              products.map((product) => {
                const status = getStockStatus(product);

                return (
                  <article
                    key={product.id}
                    className="grid gap-4 px-5 py-5 xl:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] xl:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Package size={24} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-950">
                          {product.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {product.category?.name ?? 'Sin categoría'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.brand?.name ?? 'Sin marca'}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-blue-800">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Costo: {formatCurrency(product.cost)}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">
                        {product.inventory?.stock ?? 0} pzas
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Mínimo: {product.inventory?.minStock ?? 0}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="flex justify-start xl:justify-end">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                      >
                        <Pencil size={18} />
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}