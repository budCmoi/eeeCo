import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CloudUpload, Plus, Trash2, X } from 'lucide-react';

import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/Button';
import type { Category } from '@/types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const COLORS = ['Noir', 'Blanc', 'Gris', 'Beige', 'Marron', 'Vert', 'Bleu', 'Rouge', 'Rose', 'Jaune', 'Orange', 'Violet', 'Multicolore'];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7);
}

export default function SellPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    details: '',
    sizes: [] as string[],
    colors: [] as string[],
    inventory: '1',
    deliveryDays: '5',
    collection: ''
  });

  useEffect(() => {
    if (!user) {
      router.replace('/account');
      return;
    }
    api.get<Category[]>('/categories').then((res) => setCategories(res.data ?? []));
  }, [user, router]);

  function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6 - images.length);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 6));
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleArrayItem(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (images.length === 0) { setError('Ajoutez au moins une photo'); return; }
    if (!form.name.trim() || !form.category || !form.price || !form.description.trim()) {
      setError('Remplissez tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Upload images
      const uploadedImages: { src: string; alt: string }[] = [];
      for (const img of images) {
        const fd = new FormData();
        fd.append('file', img.file);
        const res = await api.post<{ url: string }>('/uploads', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages.push({ src: res.data.url, alt: form.name });
      }

      await api.post('/products', {
        slug: slugify(form.name),
        name: form.name.trim(),
        category: form.category,
        collection: form.collection.trim() || undefined,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        description: form.description.trim(),
        details: form.details
          .split('\n')
          .map((d) => d.trim())
          .filter(Boolean),
        sizes: form.sizes.length > 0 ? form.sizes : ['Unique'],
        colors: form.colors.length > 0 ? form.colors : ['Voir photos'],
        images: uploadedImages,
        inventory: parseInt(form.inventory, 10) || 1,
        deliveryDays: parseInt(form.deliveryDays, 10) || 5
      });

      router.push('/account');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Erreur lors de la publication');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Vendre un article — EEECO</title>
        <meta name="description" content="Publiez votre article en vente sur EEECO en quelques minutes." />
      </Head>

      <div className="min-h-screen px-6 pb-24 pt-28 md:px-12">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow mb-3">Nouveau listing</p>
            <h1 className="mb-8 font-display text-3xl text-white md:text-4xl">Vendre un article</h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photos */}
            <section>
              <label className="mb-3 block text-sm font-medium text-white/70">
                Photos <span className="text-white/30">(max 6)</span>
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden">
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 text-white/30 transition-colors hover:border-green-600/50 hover:text-green-light">
                    <CloudUpload className="h-5 w-5" />
                    <span className="mt-1 text-[0.6rem]">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageAdd}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </section>

            {/* Infos de base */}
            <section className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Titre *</label>
                <input
                  className="input-base"
                  placeholder="Ex : Veste en cuir vintage Schott NYC"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  maxLength={120}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Catégorie *</label>
                  <select
                    className="input-base"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    required
                  >
                    <option value="">Sélectionner…</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Collection / Marque</label>
                  <input
                    className="input-base"
                    placeholder="Ex : Nike, Zara, Vintage…"
                    value={form.collection}
                    onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Prix (€) *</label>
                  <input
                    type="number"
                    className="input-base"
                    placeholder="25.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Prix original (€)</label>
                  <input
                    type="number"
                    className="input-base"
                    placeholder="60.00"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Stock</label>
                  <input
                    type="number"
                    className="input-base"
                    min="1"
                    value={form.inventory}
                    onChange={(e) => setForm((f) => ({ ...f, inventory: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/50">Délai livraison (jours)</label>
                  <input
                    type="number"
                    className="input-base"
                    min="1"
                    max="30"
                    value={form.deliveryDays}
                    onChange={(e) => setForm((f) => ({ ...f, deliveryDays: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Description *</label>
                <textarea
                  className="input-base min-h-[100px] resize-y"
                  placeholder="Décrivez votre article : état, matière, taille réelle…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  maxLength={2000}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/50">
                  Détails supplémentaires <span className="text-white/25">(une ligne par point)</span>
                </label>
                <textarea
                  className="input-base min-h-[80px] resize-y"
                  placeholder={'100% cuir véritable\nFabriqué en France\nTrès bon état'}
                  value={form.details}
                  onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                />
              </div>
            </section>

            {/* Tailles */}
            <section>
              <label className="mb-3 block text-sm font-medium text-white/70">Tailles disponibles</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, sizes: toggleArrayItem(f.sizes, size) }))}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                      form.sizes.includes(size)
                        ? 'border-green-600 bg-green-600/20 text-green-light'
                        : 'border-white/10 text-white/50 hover:border-white/25'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Couleurs */}
            <section>
              <label className="mb-3 block text-sm font-medium text-white/70">Couleurs</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, colors: toggleArrayItem(f.colors, color) }))}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                      form.colors.includes(color)
                        ? 'border-green-600 bg-green-600/20 text-green-light'
                        : 'border-white/10 text-white/50 hover:border-white/25'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full py-3.5 text-base"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Publication…
                </span>
              ) : (
                'Publier l\'article'
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
