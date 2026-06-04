import Link from 'next/link';
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

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[290px_1fr]">
        <aside className="relative overflow-hidden bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900 px-6 py-8 text-white">
          <div className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col">
            <div>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15"
              >
                ← Volver a la tienda
              </Link>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-100/90">
                  Miscelánea Anahí
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight">
                  Panel administrador
                </h1>

                <p className="mt-3 text-sm leading-6 text-blue-100/90">
                  Control total de inventario, ventas, pedidos y caducidades.
                </p>
              </div>
            </div>

            <nav className="mt-10 space-y-3">
              <Link
                href="/admin"
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 font-bold text-blue-800 shadow-lg"
              >
                <span>Dashboard</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs">
                  Inicio
                </span>
              </Link>

              <Link
                href="/admin/productos"
                className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white transition hover:bg-white/15"
              >
                <span>Productos</span>
                <span className="text-xs text-blue-100">Gestión</span>
              </Link>

              <Link
                href="/admin/inventario"
                className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white transition hover:bg-white/15"
              >
                <span>Inventario</span>
                <span className="text-xs text-blue-100">Stock</span>
              </Link>

              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white">
                <span>Pedidos</span>
                <span className="text-xs text-blue-100">Operación</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white">
                <span>Caducidades</span>
                <span className="text-xs text-blue-100">Lotes</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white">
                <span>Reportes</span>
                <span className="text-xs text-blue-100">Análisis</span>
              </div>
            </nav>

            <div className="mt-10 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">Resumen rápido</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Ventas hoy</p>
                  <p className="mt-2 text-2xl font-black">
                    {formatCurrency(dashboard.salesToday.total)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Pendientes</p>
                  <p className="mt-2 text-2xl font-black">
                    {dashboard.pendingOrders}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Bajo stock</p>
                  <p className="mt-2 text-2xl font-black">
                    {dashboard.lowStockProducts}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-blue-100">Por vencer</p>
                  <p className="mt-2 text-2xl font-black">
                    {dashboard.expiringSoonProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-sm text-blue-100/95">
              <p className="font-bold text-white">Sucursal</p>
              <p className="mt-2 leading-6">
                Zacualpan, Costa de Guerrero
              </p>
            </div>
          </div>
        </aside>

        <section className="px-5 py-5 md:px-8 md:py-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200/80 px-6 py-6 md:px-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-700">
                    Vista general
                  </p>

                  <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                    Dashboard operativo
                  </h2>

                  <p className="mt-3 max-w-2xl text-base text-slate-500">
                    Consulta el estado actual de ventas, inventario, pedidos,
                    lotes y movimientos de mercancía.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/admin/productos"
                    className="rounded-2xl bg-blue-700 px-6 py-3 text-center font-bold text-white shadow-sm transition hover:bg-blue-800"
                  >
                    Administrar productos
                  </Link>

                  <Link
                    href="/admin/inventario"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Ver inventario
                  </Link>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              <div className="mb-8 rounded-[1.8rem] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-[1px] shadow-lg">
                <div className="rounded-[1.7rem] bg-white px-6 py-6 md:px-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">
                        Resumen general
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Datos actualizados en tiempo real desde tu backend y tu
                        base de datos.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-blue-50 px-5 py-3 text-sm font-bold text-blue-800">
                      Tienda: Zacualpan, Costa de Guerrero
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
                {cards.map((card) => (
                  <article
                    key={card.title}
                    className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-bold text-slate-500">
                        {card.title}
                      </p>

                      <div className="h-11 w-11 rounded-2xl bg-blue-50 transition group-hover:bg-blue-100" />
                    </div>

                    <h3 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
                      {card.value}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_1fr]">
                <section className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">
                        Productos más vendidos
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Artículos con mayor salida.
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-700 px-4 py-2 text-xs font-bold text-white">
                      Top ventas
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {dashboard.bestSellingProducts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <p className="text-sm font-semibold text-slate-500">
                          Todavía no hay productos vendidos.
                        </p>
                      </div>
                    ) : (
                      dashboard.bestSellingProducts.map((product, index) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-lg font-black text-white">
                              {index + 1}
                            </div>

                            <div>
                              <h4 className="font-black text-slate-950">
                                {product.productName}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                {product.brand ?? 'Sin marca'} ·{' '}
                                {product.category ?? 'Sin categoría'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-black text-blue-800">
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
                </section>

                <section className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">
                        Movimientos recientes
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Entradas, salidas, ventas y ajustes.
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                      Inventario
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {dashboard.recentMovements.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <p className="text-sm font-semibold text-slate-500">
                          Todavía no hay movimientos de inventario.
                        </p>
                      </div>
                    ) : (
                      dashboard.recentMovements.map((movement) => (
                        <div
                          key={movement.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-black text-slate-950">
                                {movement.product.name}
                              </h4>

                              <p className="mt-1 text-sm font-semibold text-blue-700">
                                {movement.type} · {movement.quantity} piezas
                              </p>

                              {movement.reason && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {movement.reason}
                                </p>
                              )}
                            </div>

                            <p className="shrink-0 text-right text-xs font-semibold text-slate-400">
                              {formatDate(movement.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}