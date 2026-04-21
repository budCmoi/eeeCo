import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Package, PlusCircle, User } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { fetchOrderHistory, fetchProfile, getGoogleAuthUrl } from '@/services/auth';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import type { Order, UserProfile } from '@/types';

type Tab = 'profile' | 'orders' | 'messages' | 'sell';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
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
    async function hydrate() {
      if (!token) return;
      setLoadingOrders(true);
      const [profile, orderHistory] = await Promise.all([fetchProfile(), fetchOrderHistory()]);
      if (profile) {
        setSession(token, profile);
        setEditName(profile.name);
        setEditBio(profile.bio ?? '');
      }
      setOrders(orderHistory);
      setLoadingOrders(false);
    }
    void hydrate();
  }, [setSession, token]);

  async function handleLocalAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const endpoint = loginMode === 'register' ? '/auth/register' : '/auth/login';
      const body =
        loginMode === 'register'
          ? { name: loginName, email: loginEmail, password: loginPassword }
          : { email: loginEmail, password: loginPassword };
      const res = await api.post<{ accessToken: string; user: UserProfile }>(endpoint, body);
      setSession(res.data.accessToken, res.data.user);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setLoginError(typeof msg === 'string' ? msg : 'Identifiants incorrects');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      await api.patch('/users/me', { name: editName.trim(), bio: editBio.trim() });
      if (token) setSession(token, { ...user, name: editName.trim(), bio: editBio.trim() });
    } finally {
      setSavingProfile(false);
    }
  }

  function signInAsDemo(role: UserProfile['role']) {
    const id = 'demo-' + role;
    setSession(id + '-token', {
      _id: id,
      name: role === 'admin' ? 'Admin EEECO' : 'Client Demo',
      email: role === 'admin' ? 'admin@eeeco.com' : 'client@eeeco.com',
      role
    });
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profil', icon: <User className="h-4 w-4" /> },
    { id: 'orders', label: 'Commandes', icon: <Package className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'sell', label: 'Vendre', icon: <PlusCircle className="h-4 w-4" /> }
  ];

  return (
    <>
      <Head>
        <title>Mon compte — EEECO</title>
      </Head>

      <div className="min-h-screen px-4 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          {!user ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <p className="eyebrow mb-3">Mon compte</p>
              <h1 className="mb-10 font-display text-4xl text-white md:text-5xl">
                Connexion &amp; inscription
              </h1>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="mb-5 flex gap-3">
                    {(['login', 'register'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setLoginMode(m)}
                        className={
                          'rounded-full px-4 py-1.5 text-sm transition-all ' +
                          (loginMode === m ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white')
                        }
                      >
                        {m === 'login' ? 'Se connecter' : 'Creer un compte'}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLocalAuth} className="space-y-3">
                    {loginMode === 'register' && (
                      <input
                        className="input-base"
                        placeholder="Votre nom"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        required
                        minLength={2}
                      />
                    )}
                    <input
                      type="email"
                      className="input-base"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      className="input-base"
                      placeholder="Mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    {loginError && <p className="text-xs text-red-400">{loginError}</p>}
                    <Button type="submit" disabled={loginLoading} className="w-full rounded-full">
                      {loginLoading ? 'Chargement...' : loginMode === 'login' ? 'Se connecter' : 'Creer mon compte'}
                    </Button>
                  </form>
                </div>

                <div className="space-y-3">
                  <a href={getGoogleAuthUrl()} className="block">
                    <Button variant="secondary" className="w-full rounded-full">
                      Continuer avec Google
                    </Button>
                  </a>
                  <div className="border-t border-white/8 pt-3">
                    <p className="mb-3 text-xs text-white/30">Acces demo</p>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1 rounded-full text-xs" onClick={() => signInAsDemo('user')}>
                        Demo client
                      </Button>
                      <Button variant="secondary" className="flex-1 rounded-full text-xs" onClick={() => signInAsDemo('admin')}>
                        Demo admin
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-green-600/20 text-green-400">
                  {user.avatar ? (
                    <img src={user.avatar} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h1 className="font-display text-2xl text-white">{user.name}</h1>
                  <p className="text-sm text-white/40">{user.email}</p>
                </div>
              </div>

              <div className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02] p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      'flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-all ' +
                      (activeTab === tab.id ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white')
                    }
                  >
                    {tab.icon}
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'profile' && (
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                  <h2 className="mb-5 text-sm font-medium text-white/60">Informations personnelles</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs text-white/40">Nom</label>
                      <input className="input-base" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-white/40">Bio</label>
                      <textarea
                        className="input-base resize-none"
                        rows={3}
                        placeholder="Quelques mots sur vous..."
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        maxLength={250}
                      />
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin-secret">
                        <Button variant="secondary" className="rounded-full">Panneau admin</Button>
                      </Link>
                    )}
                    <div className="flex gap-3">
                      <Button onClick={handleSaveProfile} disabled={savingProfile} className="rounded-full">
                        {savingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                      <Button variant="secondary" className="rounded-full" onClick={clearSession}>
                        Se deconnecter
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {loadingOrders ? (
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 text-sm text-white/40">
                      Chargement des commandes...
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order._id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/30">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="mt-1 text-sm text-white">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-white/50">
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-4 border-t border-white/8 pt-4">
                          <p className="text-sm font-medium text-white">{order.total.toFixed(2)} EUR</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 text-center">
                      <Package className="mx-auto mb-3 h-8 w-8 text-white/20" />
                      <p className="text-sm text-white/40">Aucune commande pour le moment</p>
                      <Link href="/shop" className="mt-3 inline-block text-sm text-green-400 underline underline-offset-4">
                        Parcourir la boutique
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 text-center">
                  <MessageSquare className="mx-auto mb-3 h-8 w-8 text-white/20" />
                  <p className="mb-4 text-sm text-white/40">Accedez a toutes vos conversations</p>
                  <Link href="/messages">
                    <Button className="rounded-full">Ouvrir la messagerie</Button>
                  </Link>
                </div>
              )}

              {activeTab === 'sell' && (
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 text-center">
                  <PlusCircle className="mx-auto mb-3 h-8 w-8 text-green-400/60" />
                  <h2 className="mb-2 font-display text-xl text-white">Vendez vos articles</h2>
                  <p className="mb-6 text-sm text-white/40">
                    Publiez en quelques minutes et rejoignez notre communaute de vendeurs.
                  </p>
                  <Link href="/sell">
                    <Button className="rounded-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Publier un article
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
