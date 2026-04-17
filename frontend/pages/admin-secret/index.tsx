import { mockOrderHistory, mockProducts } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';

const mockUsers = [
  { id: 'usr-001', name: 'Admin Atelier', email: 'admin@eeeco.com', role: 'admin' },
  { id: 'usr-002', name: 'Private Client', email: 'client@eeeco.com', role: 'user' },
  { id: 'usr-003', name: 'Runway Buyer', email: 'buyer@eeeco.com', role: 'user' }
];

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const revenue = mockOrderHistory.reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
          <p className="eyebrow">Admin secret</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-5xl text-ivory md:text-6xl">Private operations dashboard.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/64 md:text-base">
                Product, order, and user management routes are backed by role-protected backend endpoints. This page provides a premium control surface for the admin experience.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-ivory/64">
              Logged in as {user?.name ?? 'Administrator'}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Revenue', value: formatPrice(revenue) },
              { label: 'Products', value: String(mockProducts.length) },
              { label: 'Orders', value: String(mockOrderHistory.length) },
              { label: 'Users', value: String(mockUsers.length) }
            ].map((metric) => (
              <div key={metric.label} className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/42">{metric.label}</p>
                <p className="mt-4 text-3xl text-ivory">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Manage products</p>
                  <h2 className="mt-3 font-display text-4xl text-ivory">Catalog control</h2>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/8">
                <table className="min-w-full divide-y divide-white/8 text-left text-sm text-ivory/70">
                  <thead className="bg-black/20 text-xs uppercase tracking-[0.18em] text-ivory/42">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {mockProducts.slice(0, 6).map((product) => (
                      <tr key={product.slug}>
                        <td className="px-4 py-4">{product.name}</td>
                        <td className="px-4 py-4">{product.category}</td>
                        <td className="px-4 py-4">{formatPrice(product.price)}</td>
                        <td className="px-4 py-4">{product.inventory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
              <p className="eyebrow">Manage orders</p>
              <h2 className="mt-3 font-display text-4xl text-ivory">Fulfillment stream</h2>
              <div className="mt-6 space-y-4">
                {mockOrderHistory.map((order) => (
                  <div key={order._id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-ivory/42">{order._id}</p>
                        <p className="mt-2 text-sm text-ivory/64">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/60">
                        {order.status}
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/8 pt-4 text-sm text-ivory/66">
                      Total {formatPrice(order.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
            <p className="eyebrow">Manage users</p>
            <h2 className="mt-3 font-display text-4xl text-ivory">Account access</h2>
            <div className="mt-6 space-y-4">
              {mockUsers.map((entry) => (
                <div key={entry.id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base text-ivory">{entry.name}</p>
                      <p className="mt-1 text-sm text-ivory/58">{entry.email}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/60">
                      {entry.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}