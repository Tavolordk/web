'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowLeft,
  Loader2,
  PackageX,
  Save,
} from 'lucide-react';
import { InventoryItem } from '@/types/product';

type InventoryOutputFormProps = {
  inventory: InventoryItem[];
};

type FormState = {
  productId: string;
  quantity: string;
  reason: string;
};

const initialState: FormState = {
  productId: '',
  quantity: '',
  reason: '',
};

export function InventoryOutputForm({ inventory }: InventoryOutputFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedInventory = inventory.find(
    (item) => item.productId === form.productId,
  );

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

      const response = await fetch(`${apiUrl}/inventory/${form.productId}/output`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          quantity: Number(form.quantity),
          reason: form.reason.trim() || 'Salida de mercancía desde admin',
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo registrar la salida');
      }

      router.push('/admin/inventario');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar la salida',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStock =
    selectedInventory !== undefined
      ? selectedInventory.stock - Number(form.quantity || 0)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[1.7rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7 xl:text-left">
        <div className="flex flex-col items-center justify-between gap-5 xl:flex-row">
          <div>
            <Link
              href="/admin/inventario"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft size={18} />
              Volver a inventario
            </Link>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.28em] text-red-700">
              Inventario
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Salida de mercancía
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Registra merma, productos dañados, pérdidas o salidas manuales
              que descuentan unidades del inventario.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || nextStock < 0}
            className="flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                Registrar salida
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

      {nextStock < 0 && selectedInventory && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          No puedes sacar más piezas de las que hay en inventario.
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <ArrowDownCircle size={28} />
            </div>

            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Datos de salida
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Selecciona producto, cantidad y motivo de la salida.
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
                onChange={(event) => updateField('productId', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              >
                <option value="">Selecciona producto</option>
                {inventory.map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {item.product.name} · Stock actual {item.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Cantidad a descontar
              </label>

              <input
                required
                min="1"
                type="number"
                value={form.quantity}
                onChange={(event) => updateField('quantity', event.target.value)}
                placeholder="Ej. 2"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Motivo
              </label>

              <input
                type="text"
                value={form.reason}
                onChange={(event) => updateField('reason', event.target.value)}
                placeholder="Ej. Merma, producto dañado, pérdida"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>
        </div>

        <aside className="rounded-[1.8rem] border border-red-100 bg-red-50 p-6 text-center shadow-sm sm:p-7">
          <PackageX size={32} className="mx-auto text-red-700" />

          <h3 className="mt-4 text-2xl font-bold text-red-950">
            Resumen
          </h3>

          {selectedInventory ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Producto
                </p>
                <p className="mt-2 font-bold text-slate-950">
                  {selectedInventory.product.name}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Stock actual
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-950">
                    {selectedInventory.stock}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Nuevo stock
                  </p>
                  <p
                    className={
                      nextStock < 0
                        ? 'mt-2 text-3xl font-extrabold text-red-700'
                        : 'mt-2 text-3xl font-extrabold text-emerald-700'
                    }
                  >
                    {nextStock}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-red-800">
              Selecciona un producto para ver el resumen de la salida.
            </p>
          )}
        </aside>
      </section>
    </form>
  );
}