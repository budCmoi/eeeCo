import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { fetchOrderHistory, fetchProfile, getGoogleAuthUrl } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';
import type { Order, UserProfile } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { token: queryToken, role, email, name } = router.query;

    if (typeof queryToken === 'string' && typeof role === 'string' && typeof email === 'string') {
      const nextUser: UserProfile = {
        _id: 'session-user',
        email,
        name: typeof name === 'string' ? name : 'Client',
        role: role === 'admin' ? 'admin' : 'user'
      };

      setSession(queryToken, nextUser);
      void router.replace('/account', undefined, { shallow: true });
    }
  }, [router, setSession]);

  useEffect(() => {
    async function hydrateAccount() {
      if (!token) {
        return;
      }

      setLoadingOrders(true);

      const [profile, orderHistory] = await Promise.all([fetchProfile(), fetchOrderHistory()]);

      if (profile) {
        setSession(token, profile);
      }

      setOrders(orderHistory);
      setLoadingOrders(false);
    }

    void hydrateAccount();
  }, [setSession, token]);

  const denied = router.query.denied === 'admin';
  const paymentSuccess = router.query.payment === 'demo-success';

  function signInAsDemo(role: UserProfile['role']) {
    setSession(`demo-${role}-token`, {
      _id: `demo-${role}`,
      name: role === 'admin' ? 'Admin Atelier' : 'Private Client',
      email: role === 'admin' ? 'admin@eeeco.com' : 'client@eeeco.com',
      role
    });
  }

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
            <p className="eyebrow">Account</p>
            <h1 className="mt-4 font-display text-5xl text-ivory md:text-6xl">Google login, demo access, and order history.</h1>

            {denied ? (
              <div className="mt-6 rounded-[1.4rem] border border-[#d9c8ae]/25 bg-[#d9c8ae]/10 px-4 py-3 text-sm text-[#f0e5d6]">
                Admin access is protected. Authenticate with an administrator account to enter the private dashboard.
              </div>
            ) : null}

            {paymentSuccess ? (
              <div className="mt-6 rounded-[1.4rem] border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                Demo checkout completed. In production, Stripe will redirect back here after payment confirmation.
              </div>
            ) : null}

            {user ? (
              <div className="mt-8 space-y-5">
                <div className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-ivory/42">Signed in</p>
                  <p className="mt-3 text-2xl text-ivory">{user.name}</p>
                  <p className="mt-2 text-sm text-ivory/64">{user.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ivory/42">Role: {user.role}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {user.role === 'admin' ? (
                    <Link href="/admin-secret">
                      <Button>Open admin panel</Button>
                    </Link>
                  ) : null}
                  <Button variant="secondary" onClick={clearSession}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
                <p className="text-sm leading-7 text-ivory/68">
                  Connect through Google OAuth to sync account data, view order history, and access private features. The backend endpoint is ready for Passport Google OAuth.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={getGoogleAuthUrl()} className="inline-block">
                    <Button>Continue with Google</Button>
                  </a>
                  <Button variant="secondary" onClick={() => signInAsDemo('user')}>
                    Demo client access
                  </Button>
                  <Button variant="secondary" onClick={() => signInAsDemo('admin')}>
                    Demo admin access
                  </Button>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ivory/38">
                  Demo access is local-only and exists to validate the account and admin flows before OAuth credentials are configured.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Orders</p>
                <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">Private order history.</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {loadingOrders ? (
                <div className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5 text-sm text-ivory/62">Loading orders...</div>
              ) : orders.length ? (
                orders.map((order) => (
                  <div key={order._id} className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-ivory/42">{order._id}</p>
                        <p className="mt-2 text-sm text-ivory/64">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/60">
                        {order.status}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 border-t border-white/8 pt-4 text-sm text-ivory/66">
                      {order.items.map((item) => (
                        <div key={`${order._id}-${item.product.slug}-${item.size}`} className="flex items-center justify-between gap-4">
                          <span>
                            {item.product.name} / {item.size} / x{item.quantity}
                          </span>
                          <span>${item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5 text-sm text-ivory/62">
                  No orders yet. Complete checkout to populate the history.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}