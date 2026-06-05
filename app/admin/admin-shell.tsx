'use client';

import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Store,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

type AdminShellProps = {
  children: ReactNode;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  iconBoxClassName: string;
  iconClassName: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    iconBoxClassName: 'bg-blue-100',
    iconClassName: 'text-blue-700',
  },
  {
    label: 'Productos',
    href: '/admin/productos',
    icon: Package,
    iconBoxClassName: 'bg-indigo-100',
    iconClassName: 'text-indigo-700',
  },
  {
    label: 'Inventario',
    href: '/admin/inventario',
    icon: Boxes,
    iconBoxClassName: 'bg-cyan-100',
    iconClassName: 'text-cyan-700',
  },
  {
    label: 'Pedidos',
    href: '/admin/pedidos',
    icon: ShoppingCart,
    iconBoxClassName: 'bg-emerald-100',
    iconClassName: 'text-emerald-700',
  },
  {
    label: 'Caducidades',
    href: '/admin/caducidades',
    icon: Clock3,
    iconBoxClassName: 'bg-amber-100',
    iconClassName: 'text-amber-700',
  },
  {
    label: 'Reportes',
    href: '/admin/reportes',
    icon: BarChart3,
    iconBoxClassName: 'bg-violet-100',
    iconClassName: 'text-violet-700',
  },
  {
    label: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
    iconBoxClassName: 'bg-slate-200',
    iconClassName: 'text-slate-700',
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    setCollapsed((current) => !current);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  const sidebarWidthClass = collapsed
    ? 'lg:grid-cols-[96px_1fr]'
    : 'lg:grid-cols-[300px_1fr]';

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#eef3f9] text-slate-950">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className={cn('min-h-dvh lg:grid', sidebarWidthClass)}>
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 lg:relative lg:inset-auto lg:z-20 lg:min-h-dvh lg:w-auto lg:translate-x-0 lg:overflow-visible',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex min-h-dvh flex-col">
            <div className="flex h-24 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className={cn(
                  'flex min-w-0 items-center gap-3',
                  collapsed && 'lg:justify-center',
                )}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm">
                  <Store size={24} strokeWidth={2.3} />
                </div>

                <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-blue-700">
                    Miscelánea
                  </p>
                  <p className="text-2xl font-extrabold leading-none tracking-tight text-slate-950">
                    Anahí
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>

              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:flex"
                aria-label={collapsed ? 'Desplegar menú' : 'Plegar menú'}
              >
                {collapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            </div>

            <div className="px-4 py-5">
              <div
                className={cn(
                  'rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4',
                  collapsed && 'lg:hidden',
                )}
              >
                <p className="text-sm font-bold text-slate-900">
                  Centro de control
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Inventario, ventas, pedidos y caducidades.
                </p>
              </div>

              <nav className="mt-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'group relative flex items-center rounded-2xl py-3 transition-all duration-200',
                        collapsed
                          ? 'lg:justify-center lg:px-0'
                          : 'justify-between px-3',
                        isActive
                          ? 'bg-blue-50 text-slate-950 shadow-sm ring-1 ring-blue-100'
                          : 'text-slate-700 hover:bg-slate-50',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center',
                          collapsed ? 'lg:justify-center' : 'gap-3',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                            isActive ? 'bg-white shadow-sm' : item.iconBoxClassName,
                          )}
                        >
                          <Icon
                            size={20}
                            strokeWidth={2.2}
                            className={item.iconClassName}
                          />
                        </div>

                        <span
                          className={cn(
                            'text-sm font-semibold',
                            collapsed && 'lg:hidden',
                          )}
                        >
                          {item.label}
                        </span>
                      </div>

                      {!collapsed && isActive && (
                        <span className="rounded-full bg-blue-700 px-3 py-1 text-[11px] font-bold text-white">
                          Activo
                        </span>
                      )}

                      {collapsed && isActive && (
                        <span className="absolute right-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-l-full bg-blue-700 lg:block" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto border-t border-slate-100 px-4 py-4">
              <div className={cn('space-y-4', collapsed && 'lg:hidden')}>
                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Tienda activa
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-slate-950">
                        Zacualpan, Guerrero
                      </p>
                    </div>

                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.85)]" />
                  </div>

                  <button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    Cambiar sucursal
                  </button>
                </div>

                <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <TriangleAlert
                        size={20}
                        className="text-amber-600"
                        strokeWidth={2.3}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Alerta rápida
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        1 lote próximo a vencer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'mt-4 flex items-center',
                  collapsed ? 'lg:justify-center' : 'gap-3',
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-blue-700">
                  <UserRound size={21} strokeWidth={2.3} />
                </div>

                <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
                  <p className="truncate text-sm font-bold text-slate-950">
                    Admin Anahí
                  </p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 h-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.25em] text-blue-700">
                    Centro de operaciones
                  </p>
                  <h1 className="truncate text-lg font-extrabold text-slate-950 sm:text-xl">
                    Miscelánea Anahí
                  </h1>
                </div>
              </div>

              <div className="hidden w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 xl:flex">
                <Search size={20} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos, pedidos, clientes..."
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
                <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-400 w-18">
                  Ctrl K
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 xl:hidden"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>

                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Notificaciones"
                >
                  <Bell size={20} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    3
                  </span>
                </button>

                <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-sm font-bold text-white">
                    A
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Admin Anahí
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Administrador
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1500px] px-4 pb-24 pt-5 sm:px-6 md:px-8 lg:pb-10 lg:pt-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}