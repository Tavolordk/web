'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Brand, Category } from '@/types/product';

type NewProductFormProps = {
  categories: Category[];
  brands: Brand[];
};

type FormState = {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price: string;
  cost: string;
  categoryId: string;
  brandId: string;
  stock: string;
  minStock: string;
  imageUrl: string;
};

const initialState: FormState = {
  name: '',
  description: '',
  sku: '',
  barcode: '',
  price: '',
  cost: '',
  categoryId: '',
  brandId: '',
  stock: '0',
  minStock: '0',
  imageUrl: '',
};

export function NewProductForm({ categories, brands }: NewProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL no está configurada');
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        sku: form.sku.trim(),
        barcode: form.barcode.trim() || undefined,
        price: Number(form.price),
        cost: form.cost ? Number(form.cost) : undefined,
        categoryId: form.categoryId,
        brandId: form.brandId || undefined,
        stock: Number(form.stock || 0),
        minStock: Number(form.minStock || 0),
        imageUrl: form.imageUrl.trim() || undefined,
      };

      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo crear el producto');
      }

      router.push('/admin/productos');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al crear el producto',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col items-center justify-between gap-5 text-center xl:flex-row xl:text-left">
          <div>
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft size={18} />
              Volver a productos
            </Link>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
              Catálogo
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Nuevo producto
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Registra un producto con precio, categoría, marca e inventario
              inicial.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar producto
              </>
            )}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-950">
              Información del producto
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Datos principales visibles en catálogo y administración.
            </p>
          </div>

          <div className="mt-7 grid gap-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Nombre del producto
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Ej. Pepsi 600 ml"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                placeholder="Descripción breve del producto"
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  SKU
                </label>
                <input
                  required
                  type="text"
                  value={form.sku}
                  onChange={(event) => updateField('sku', event.target.value)}
                  placeholder="Ej. PEPSI-600"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Código de barras
                </label>
                <input
                  type="text"
                  value={form.barcode}
                  onChange={(event) =>
                    updateField('barcode', event.target.value)
                  }
                  placeholder="Ej. 750000000001"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                URL de imagen
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(event) => updateField('imageUrl', event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-950">
                Precio e inventario
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Control inicial de venta, costo y stock.
              </p>
            </div>

            <div className="mt-7 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Precio venta
                  </label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      updateField('price', event.target.value)
                    }
                    placeholder="18"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Costo
                  </label>
                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.cost}
                    onChange={(event) => updateField('cost', event.target.value)}
                    placeholder="14"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Stock inicial
                  </label>
                  <input
                    min="0"
                    type="number"
                    value={form.stock}
                    onChange={(event) =>
                      updateField('stock', event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Stock mínimo
                  </label>
                  <input
                    min="0"
                    type="number"
                    value={form.minStock}
                    onChange={(event) =>
                      updateField('minStock', event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-950">
                Clasificación
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Organiza el producto por categoría y marca.
              </p>
            </div>

            <div className="mt-7 grid gap-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Categoría
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField('categoryId', event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Selecciona categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Marca
                </label>
                <select
                  value={form.brandId}
                  onChange={(event) => updateField('brandId', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Sin marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </form>
  );
}