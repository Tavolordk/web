'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  CalendarClock,
  Loader2,
  PackagePlus,
  Save,
} from 'lucide-react';
import { Product } from '@/types/product';

type NewBatchFormProps = {
  products: Product[];
};

type FormState = {
  productId: string;
  batchCode: string;
  quantity: string;
  expirationDate: string;
  purchasePrice: string;
  salePrice: string;
  supplierName: string;
};

const initialState: FormState = {
  productId: '',
  batchCode: '',
  quantity: '',
  expirationDate: '',
  purchasePrice: '',
  salePrice: '',
  supplierName: '',
};

export function NewBatchForm({ products }: NewBatchFormProps) {
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
        productId: form.productId,
        batchCode: form.batchCode.trim() || undefined,
        quantity: Number(form.quantity),
        expirationDate: form.expirationDate || undefined,
        purchasePrice: form.purchasePrice
          ? Number(form.purchasePrice)
          : undefined,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        supplierName: form.supplierName.trim() || undefined,
      };

      const response = await fetch(`${apiUrl}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo registrar el lote');
      }

      router.push('/admin/caducidades');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar el lote',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7 xl:text-left">
        <div className="flex flex-col items-center justify-between gap-5 xl:flex-row">
          <div>
            <Link
              href="/admin/caducidades"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft size={18} />
              Volver a caducidades
            </Link>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
              Lotes y caducidades
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Registrar lote
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Registra una entrada de mercancía por lote, con cantidad, proveedor
              y fecha de caducidad para controlar productos próximos a vencer.
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
                Guardar lote
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <PackagePlus size={28} />
            </div>

            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Producto y lote
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Selecciona el producto y define el código del lote.
            </p>
          </div>

          <div className="mt-7 grid gap-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Producto
              </label>

              <select
                required
                value={form.productId}
                onChange={(event) =>
                  updateField('productId', event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Selecciona producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} · SKU {product.sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Código de lote
              </label>

              <input
                type="text"
                value={form.batchCode}
                onChange={(event) =>
                  updateField('batchCode', event.target.value)
                }
                placeholder="Ej. PEPSI-JUN-2026"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Proveedor
              </label>

              <input
                type="text"
                value={form.supplierName}
                onChange={(event) =>
                  updateField('supplierName', event.target.value)
                }
                placeholder="Ej. Proveedor local"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <CalendarClock size={28} />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Existencia y caducidad
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Define cantidad, fecha de vencimiento y precios del lote.
              </p>
            </div>

            <div className="mt-7 grid gap-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Cantidad
                </label>

                <input
                  required
                  min="1"
                  type="number"
                  value={form.quantity}
                  onChange={(event) =>
                    updateField('quantity', event.target.value)
                  }
                  placeholder="Ej. 24"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Fecha de caducidad
                </label>

                <input
                  type="date"
                  value={form.expirationDate}
                  onChange={(event) =>
                    updateField('expirationDate', event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Precio compra
                  </label>

                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.purchasePrice}
                    onChange={(event) =>
                      updateField('purchasePrice', event.target.value)
                    }
                    placeholder="Ej. 14"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Precio venta
                  </label>

                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.salePrice}
                    onChange={(event) =>
                      updateField('salePrice', event.target.value)
                    }
                    placeholder="Ej. 18"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-blue-100 bg-blue-50 p-6 text-center shadow-sm sm:p-7">
            <h3 className="text-xl font-bold text-blue-900">
              ¿Qué pasa al guardar?
            </h3>

            <p className="mt-3 text-sm leading-6 text-blue-800">
              Se crea el lote, se suma la cantidad al inventario del producto y
              se registra un movimiento de entrada.
            </p>
          </div>
        </aside>
      </section>
    </form>
  );
}