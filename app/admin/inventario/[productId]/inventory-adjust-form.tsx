'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Loader2,
  PackageCheck,
  Save,
} from 'lucide-react';
import { InventoryItem } from '@/types/product';

type InventoryAdjustFormProps = {
  inventory: InventoryItem;
};

type ManualAdjustForm = {
  stock: string;
  minStock: string;
};

type MovementForm = {
  quantity: string;
  reason: string;
};

export function InventoryAdjustForm({ inventory }: InventoryAdjustFormProps) {
  const router = useRouter();

  const [manualForm, setManualForm] = useState<ManualAdjustForm>({
    stock: String(inventory.stock),
    minStock: String(inventory.minStock),
  });

  const [entryForm, setEntryForm] = useState<MovementForm>({
    quantity: '',
    reason: '',
  });

  const [outputForm, setOutputForm] = useState<MovementForm>({
    quantity: '',
    reason: '',
  });

  const [loadingAction, setLoadingAction] = useState<
    'manual' | 'entry' | 'output' | null
  >(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function requestApi(path: string, options: RequestInit) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL no está configurada');
    }

    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'No se pudo actualizar el inventario');
    }

    return response.json();
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoadingAction('manual');

    try {
      await requestApi(`/inventory/${inventory.productId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stock: Number(manualForm.stock),
          minStock: Number(manualForm.minStock),
        }),
      });

      setSuccess('Inventario actualizado correctamente.');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al actualizar el inventario',
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleEntrySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoadingAction('entry');

    try {
      await requestApi(`/inventory/${inventory.productId}/entry`, {
        method: 'POST',
        body: JSON.stringify({
          quantity: Number(entryForm.quantity),
          reason: entryForm.reason || 'Entrada de mercancía desde admin',
        }),
      });

      setEntryForm({
        quantity: '',
        reason: '',
      });

      setSuccess('Entrada de mercancía registrada correctamente.');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar la entrada',
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleOutputSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoadingAction('output');

    try {
      await requestApi(`/inventory/${inventory.productId}/output`, {
        method: 'POST',
        body: JSON.stringify({
          quantity: Number(outputForm.quantity),
          reason: outputForm.reason || 'Salida de mercancía desde admin',
        }),
      });

      setOutputForm({
        quantity: '',
        reason: '',
      });

      setSuccess('Salida de mercancía registrada correctamente.');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar la salida',
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-6">
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

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
              Inventario
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {inventory.product.name}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Ajusta existencias, registra entradas, salidas y controla el stock
              mínimo de este producto.
            </p>
          </div>

          <div className="flex min-h-[120px] min-w-[180px] flex-col items-center justify-center rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5 text-center">
            <PackageCheck size={28} className="text-blue-700" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Stock actual
            </p>
            <p className="mt-1 text-4xl font-extrabold text-blue-800">
              {inventory.stock}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              mínimo {inventory.minStock}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleManualSubmit}
          className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-950">
              Ajuste manual
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Úsalo cuando hagas conteo físico o necesites corregir existencias.
            </p>
          </div>

          <div className="mt-7 grid gap-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Stock actual
              </label>
              <input
                min="0"
                type="number"
                value={manualForm.stock}
                onChange={(event) =>
                  setManualForm((current) => ({
                    ...current,
                    stock: event.target.value,
                  }))
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
                value={manualForm.minStock}
                onChange={(event) =>
                  setManualForm((current) => ({
                    ...current,
                    minStock: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'manual'}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAction === 'manual' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar ajuste
                </>
              )}
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <form
            onSubmit={handleEntrySubmit}
            className="rounded-[1.8rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ArrowUpCircle size={25} />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Entrada de mercancía
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Suma unidades al inventario.
              </p>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-[0.5fr_1fr_auto] md:items-end">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Cantidad
                </label>
                <input
                  required
                  min="1"
                  type="number"
                  value={entryForm.quantity}
                  onChange={(event) =>
                    setEntryForm((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Motivo
                </label>
                <input
                  type="text"
                  value={entryForm.reason}
                  onChange={(event) =>
                    setEntryForm((current) => ({
                      ...current,
                      reason: event.target.value,
                    }))
                  }
                  placeholder="Ej. Compra a proveedor"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction === 'entry'}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === 'entry' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Registrar'
                )}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleOutputSubmit}
            className="rounded-[1.8rem] border border-red-100 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <ArrowDownCircle size={25} />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Salida de mercancía
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Descuenta unidades por pérdida, merma o salida manual.
              </p>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-[0.5fr_1fr_auto] md:items-end">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Cantidad
                </label>
                <input
                  required
                  min="1"
                  type="number"
                  value={outputForm.quantity}
                  onChange={(event) =>
                    setOutputForm((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Motivo
                </label>
                <input
                  type="text"
                  value={outputForm.reason}
                  onChange={(event) =>
                    setOutputForm((current) => ({
                      ...current,
                      reason: event.target.value,
                    }))
                  }
                  placeholder="Ej. Merma, producto dañado, ajuste"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction === 'output'}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === 'output' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Registrar'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}