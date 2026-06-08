import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  CalendarClock,
  CirclePlus,
  Clock3,
  Package,
  PackageX,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { ProductBatch } from '@/types/product';

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

function formatDate(value: string | null) {
  if (!value) {
    return 'Sin caducidad';
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function getDaysUntilExpiration(value: string | null) {
  if (!value) {
    return null;
  }

  const today = new Date();
  const expiration = new Date(value);

  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const diffInMs = expiration.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

function getBatchStatus(batch: ProductBatch) {
  const days = getDaysUntilExpiration(batch.expirationDate);

  if (days === null) {
    return {
      label: 'Sin caducidad',
      className: 'border-slate-100 bg-slate-50 text-slate-700',
      iconClassName: 'bg-slate-100 text-slate-700',
      icon: Package,
      helper: 'Producto sin fecha registrada',
    };
  }

  if (days < 0) {
    return {
      label: 'Vencido',
      className: 'border-red-100 bg-red-50 text-red-700',
      iconClassName: 'bg-red-100 text-red-700',
      icon: PackageX,
      helper: `Venció hace ${Math.abs(days)} día(s)`,
    };
  }

  if (days === 0) {
    return {
      label: 'Vence hoy',
      className: 'border-orange-100 bg-orange-50 text-orange-700',
      iconClassName: 'bg-orange-100 text-orange-700',
      icon: AlertTriangle,
      helper: 'Debe venderse o retirarse hoy',
    };
  }

  if (days <= 7) {
    return {
      label: 'Urgente',
      className: 'border-orange-100 bg-orange-50 text-orange-700',
      iconClassName: 'bg-orange-100 text-orange-700',
      icon: AlertTriangle,
      helper: `Vence en ${days} día(s)`,
    };
  }

  if (days <= 15) {
    return {
      label: 'Próximo',
      className: 'border-amber-100 bg-amber-50 text-amber-700',
      iconClassName: 'bg-amber-100 text-amber-700',
      icon: CalendarClock,
      helper: `Vence en ${days} día(s)`,
    };
  }

  return {
    label: 'Vigente',
    className: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    iconClassName: 'bg-emerald-100 text-emerald-700',
    icon: ShieldCheck,
    helper: `Vence en ${days} día(s)`,
  };
}

export default async function ExpirationPage() {
  const [allBatches, expiringSoonBatches, expiredBatches] = await Promise.all([
    apiFetch<ProductBatch[]>('/batches'),
    apiFetch<ProductBatch[]>('/batches/expiring-soon?days=15'),
    apiFetch<ProductBatch[]>('/batches/expired'),
  ]);

  const activeBatches = allBatches.filter((batch) => batch.quantity > 0);
  const batchesWithoutExpiration = activeBatches.filter(
    (batch) => !batch.expirationDate,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7 xl:text-left">
        <div className="flex flex-col items-center justify-between gap-5 xl:flex-row">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
              Lotes y caducidades
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Control de caducidades
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Revisa productos vencidos, próximos a vencer y lotes activos para
              reducir mermas y vender primero lo que caduca antes.
            </p>
          </div>

          <Link
            href="/admin/caducidades/nuevo"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            <CirclePlus size={20} />
            Registrar lote
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Package size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Lotes activos
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {activeBatches.length}
          </h3>
        </article>

        <article className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <CalendarClock size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Próximos a vencer
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {expiringSoonBatches.length}
          </h3>
        </article>

        <article className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <PackageX size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Vencidos
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {expiredBatches.length}
          </h3>
        </article>

        <article className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Clock3 size={24} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Sin caducidad
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-950">
            {batchesWithoutExpiration.length}
          </h3>
        </article>
      </section>

      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col items-center justify-between gap-4 text-center xl:flex-row xl:text-left">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              Lotes registrados
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Control de existencias por lote y fecha de caducidad.
            </p>
          </div>

          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar lote o producto..."
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.4fr_0.9fr_0.7fr_0.8fr_0.9fr_0.8fr] bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 xl:grid">
            <div>Producto</div>
            <div>Lote</div>
            <div>Cantidad</div>
            <div>Caducidad</div>
            <div>Proveedor</div>
            <div>Estado</div>
          </div>

          <div className="divide-y divide-slate-200">
            {activeBatches.length === 0 ? (
              <div className="flex min-h-[160px] items-center justify-center p-6 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Todavía no hay lotes activos registrados.
                </p>
              </div>
            ) : (
              activeBatches.map((batch) => {
                const status = getBatchStatus(batch);
                const Icon = status.icon;

                return (
                  <article
                    key={batch.id}
                    className="grid gap-4 px-5 py-5 xl:grid-cols-[1.4fr_0.9fr_0.7fr_0.8fr_0.9fr_0.8fr] xl:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        {batch.product.imageUrl ? (
                          <Image
                            src={batch.product.imageUrl}
                            alt={batch.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-full w-full items-center justify-center ${status.iconClassName}`}
                          >
                            <Icon size={26} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-950">
                          {batch.product.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          SKU: {batch.product.sku}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {batch.product.category?.name ?? 'Sin categoría'} ·{' '}
                          {batch.product.brand?.name ?? 'Sin marca'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">
                        {batch.batchCode ?? 'Sin código'}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        ID: {batch.id.slice(0, 8)}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">
                        {batch.quantity} pzas
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Venta: {formatCurrency(batch.salePrice)}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">
                        {formatDate(batch.expirationDate)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {status.helper}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">
                        {batch.supplierName ?? 'Sin proveedor'}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Compra: {formatCurrency(batch.purchasePrice)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
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