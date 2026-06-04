import Link from 'next/link';
import {
  AlertTriangle,
  CalendarClock,
  CircleX,
  ClipboardList,
  DollarSign,
  PackageX,
  Truck,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { DashboardResponse } from '@/types/dashboard';

function formatCurrency(value: string | number) {
  const numericValue = Number(value);

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getMovementLabel(type: string) {
  const labels: Record<string, string> = {
    ENTRY: 'Entrada',
    OUTPUT: 'Salida',
    SALE: 'Venta',
    ADJUSTMENT: 'Ajuste',
    WASTE: 'Merma',
    RETURN: 'Devolución',
  };

  return labels[type] ?? type;
}

const kpiIconMap = {
  'Ventas del día': DollarSign,
  'Pedidos pendientes': ClipboardList,
  'Pedidos entregados': Truck,
  'Productos agotados': PackageX,
  'Bajo stock': AlertTriangle,
  'Próximos a vencer': CalendarClock,
  'Productos vencidos': CircleX,
};

function getCardAccent(title: string) {
  const accents: Record<string, string> = {
    'Ventas del día': 'bg-blue-100 text-blue-700',
    'Pedidos pendientes': 'bg-amber-100 text-amber-700',
    'Pedidos entregados': 'bg-emerald-100 text-emerald-700',
    'Productos agotados': 'bg-red-100 text-red-700',
    'Bajo stock': 'bg-orange-100 text-orange-700',
    'Próximos a vencer': 'bg-violet-100 text-violet-700',
    'Productos vencidos': 'bg-rose-100 text-rose-700',
  };

  return accents[title] ?? 'bg-slate-100 text-slate-700';
}

export default async function AdminPage() {
  const dashboard = await apiFetch<DashboardResponse>('/reports/dashboard');

  const cards = [
    {
      title: 'Ventas del día',
      value: formatCurrency(dashboard.salesToday.total),
      description: `${dashboard.salesToday.ordersCount} pedidos vendidos hoy`,
    },
    {
      title: 'Pedidos pendientes',
      value: dashboard.pendingOrders,
      description: 'Pedidos por confirmar o preparar',
    },
    {
      title: 'Pedidos entregados',
      value: dashboard.deliveredOrders,
      description: 'Pedidos finalizados',
    },
    {
      title: 'Productos agotados',
      value: dashboard.outOfStockProducts,
      description: 'Sin stock disponible',
    },
    {
      title: 'Bajo stock',
      value: dashboard.lowStockProducts,
      description: 'Productos por debajo del mínimo',
    },
    {
      title: 'Próximos a vencer',
      value: dashboard.expiringSoonProducts,
      description: 'Lotes que vencen pronto',
    },
    {
      title: 'Productos vencidos',
      value: dashboard.expiredProducts,
      description: 'Deben retirarse o marcarse como merma',
    },
  ];

  const alertItems = [
    {
      title: 'Productos agotados',
      value: dashboard.outOfStockProducts,
      description:
        dashboard.outOfStockProducts > 0
          ? 'Revisa productos sin stock.'
          : 'No hay productos agotados.',
      className: 'border-red-100 bg-red-50 text-red-700',
    },
    {
      title: 'Bajo stock',
      value: dashboard.lowStockProducts,
      description:
        dashboard.lowStockProducts > 0
          ? 'Hay productos por debajo del mínimo.'
          : 'Todo tu inventario está bien.',
      className: 'border-amber-100 bg-amber-50 text-amber-700',
    },
    {
      title: 'Por vencer',
      value: dashboard.expiringSoonProducts,
      description:
        dashboard.expiringSoonProducts > 0
          ? 'Hay lotes próximos a vencer.'
          : 'No hay lotes próximos a vencer.',
      className: 'border-orange-100 bg-orange-50 text-orange-700',
    },
    {
      title: 'Pedidos pendientes',
      value: dashboard.pendingOrders,
      description:
        dashboard.pendingOrders > 0
          ? 'Hay pedidos por atender.'
          : 'No hay pedidos pendientes.',
      className: 'border-blue-100 bg-blue-50 text-blue-700',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-500 p-[1px] shadow-[0_18px_45px_rgba(37,99,235,0.18)] lg:rounded-[1.8rem]">
        <div className="relative overflow-hidden rounded-[1.45rem] bg-blue-700 px-5 py-8 text-white sm:px-7 sm:py-9 lg:rounded-[1.75rem] lg:px-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-6 hidden h-24 w-64 rounded-t-full bg-white/10 md:block" />

          <div className="relative z-10 flex flex-col items-center justify-center gap-7 text-center xl:flex-row xl:justify-between xl:text-left">
            <div className="flex max-w-3xl flex-col items-center xl:items-start">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-blue-100 sm:text-sm">
                Vista general
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Dashboard operativo
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                Consulta ventas, inventario, pedidos, caducidades y movimientos
                de mercancía en tiempo real.
              </p>
            </div>

            <div className="grid w-full max-w-[440px] gap-3 sm:grid-cols-2">
              <Link
                href="/admin/productos"
                className="flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-blue-800 shadow-lg transition hover:bg-blue-50 sm:text-base"
              >
                Administrar productos
              </Link>

              <Link
                href="/admin/inventario"
                className="flex min-h-[56px] items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/15 sm:text-base"
              >
                Ver inventario
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = kpiIconMap[card.title as keyof typeof kpiIconMap];

          return (
            <article
              key={card.title}
              className="group flex min-h-[205px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getCardAccent(
                  card.title,
                )}`}
              >
                {Icon && <Icon size={25} strokeWidth={2.3} />}
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                {card.title}
              </p>

              <h3 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
                {card.value}
              </h3>

              <p className="mt-3 max-w-[220px] text-center text-sm leading-6 text-slate-500">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7">
            <div className="flex flex-col items-center justify-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Productos más vendidos
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Artículos con mayor salida en tu tienda.
                </p>
              </div>

              <Link
                href="/admin/productos"
                className="flex min-h-[40px] w-fit items-center justify-center rounded-full bg-blue-50 px-5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Ver todos
              </Link>
            </div>

            <div className="mt-7 space-y-4">
              {dashboard.bestSellingProducts.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Todavía no hay productos vendidos.
                  </p>
                </div>
              ) : (
                dashboard.bestSellingProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex min-h-[110px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-center sm:flex-row sm:justify-between sm:text-left"
                  >
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:text-left">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-lg font-bold text-white">
                        {index + 1}
                      </div>

                      <div className="flex flex-col items-center sm:items-start">
                        <h4 className="font-semibold text-slate-950">
                          {product.productName}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {product.brand ?? 'Sin marca'} ·{' '}
                          {product.category ?? 'Sin categoría'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end">
                      <p className="font-bold text-blue-800">
                        {product.quantitySold} pzas
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {formatCurrency(product.totalSold)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7">
            <div className="flex flex-col items-center justify-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Movimientos recientes
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Entradas, salidas, ventas y ajustes.
                </p>
              </div>

              <Link
                href="/admin/inventario"
                className="flex min-h-[40px] w-fit items-center justify-center rounded-full bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Ver inventario
              </Link>
            </div>

            <div className="mt-7 space-y-4">
              {dashboard.recentMovements.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Todavía no hay movimientos de inventario.
                  </p>
                </div>
              ) : (
                dashboard.recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center sm:flex-row sm:justify-between sm:text-left"
                  >
                    <div className="flex flex-col items-center sm:items-start">
                      <h4 className="font-semibold text-slate-950">
                        {movement.product.name}
                      </h4>

                      <p className="mt-2 text-sm font-semibold text-blue-700">
                        {getMovementLabel(movement.type)} ·{' '}
                        {movement.quantity} piezas
                      </p>

                      {movement.reason && (
                        <p className="mt-1 max-w-[520px] text-sm text-slate-500">
                          {movement.reason}
                        </p>
                      )}
                    </div>

                    <p className="mt-3 shrink-0 text-xs font-semibold text-slate-400 sm:mt-0 sm:text-right">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7">
            <div className="flex flex-col items-center justify-center gap-3">
              <h3 className="text-2xl font-bold text-slate-950">
                Alertas y pendientes
              </h3>

              <p className="text-sm text-slate-500">
                Estado operativo del negocio.
              </p>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-50 px-3 text-xs font-bold text-red-600">
                {dashboard.outOfStockProducts +
                  dashboard.lowStockProducts +
                  dashboard.expiringSoonProducts +
                  dashboard.pendingOrders}
              </span>
            </div>

            <div className="mt-7 space-y-3">
              {alertItems.map((alert) => (
                <div
                  key={alert.title}
                  className={`flex min-h-[112px] flex-col items-center justify-center rounded-2xl border p-5 text-center ${alert.className}`}
                >
                  <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-3 text-sm font-bold">
                    {alert.value}
                  </span>

                  <p className="mt-3 font-bold">{alert.title}</p>

                  <p className="mt-1 max-w-[260px] text-sm text-slate-600">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-7 text-center text-white shadow-[0_20px_45px_rgba(37,99,235,0.18)]">
            <p className="text-sm font-bold text-blue-100">Reporte del día</p>

            <h3 className="mt-3 text-2xl font-bold">
              Mantén tu inventario al día
            </h3>

            <p className="mt-3 max-w-[320px] text-sm leading-6 text-blue-100">
              Revisa productos próximos a vencer, ventas recientes y mercancía
              con bajo stock.
            </p>

            <Link
              href="/admin/reportes"
              className="mt-6 flex min-h-[46px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
            >
              Ver reporte
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}