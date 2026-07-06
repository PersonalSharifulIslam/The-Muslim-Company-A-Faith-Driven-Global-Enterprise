import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, X, Check, ImageIcon, Loader2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

type Product = {
  id: number; name: string; slug: string; description: string | null;
  price: number | null; currency: string; image_url: string | null;
  category: string | null; min_qty: number;
};

export default function EStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [preorderProduct, setPreorderProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  useEffect(() => {
    document.title = "E-Store — Pre-Order Products | The Muslim Company";
    const desc = "Browse and pre-order products from The Muslim Company's official online store. Submit a pre-order request and our team will confirm availability and delivery.";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', desc);
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', 'https://www.themuslim.company/e-store'); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/e-store'; document.head.appendChild(_cl); }
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-page-schema', 'true');
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "E-Store", "item": "https://www.themuslim.company/e-store" },
      ],
    });
    document.head.appendChild(s);

    load();
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("store_products").select("*").eq("active", true).order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  return (
    <SiteLayout>
      <Helmet>
        <title>E-Store — Pre-Order Products | The Muslim Company</title>
        <meta name="description" content="Browse and pre-order products from The Muslim Company's official online store. Submit a pre-order request and our team will confirm availability and delivery." />
        <link rel="canonical" href="https://www.themuslim.company/e-store" />
      </Helmet>

      <div className="bg-background min-h-screen">
        <section className="bg-primary py-20 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">E-Store</p>
              <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Pre-Order Our Products</h1>
              <p className="font-sans text-sm text-primary-foreground/60 max-w-xl mx-auto">
                Browse products from The Muslim Company. This is a pre-order store — submit a request for the item and
                quantity you want, and our team will contact you directly to confirm price, availability, and delivery.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-secondary animate-spin" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-8 h-8 text-primary/20 mx-auto mb-3" />
                <p className="font-sans text-sm text-primary/60">No products are listed yet. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                    onClick={() => setDetailProduct(p)}
                    className="bg-card border border-primary/10 hover:border-secondary/40 transition-colors overflow-hidden flex flex-col cursor-pointer">
                    <div className="h-52 bg-background flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-primary/15" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {p.category && <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/70 mb-1">{p.category}</p>}
                      <h3 className="font-serif text-lg text-primary mb-1">{p.name}</h3>
                      {p.description && <p className="font-sans text-sm text-primary/55 leading-relaxed line-clamp-3 mb-3 flex-1">{p.description}</p>}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <p className="font-sans text-sm text-secondary font-medium">
                          {p.price != null ? `${p.currency} ${p.price.toLocaleString()}` : "Price on request"}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreorderProduct(p); }}
                          className="bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-9 px-4 hover:bg-secondary/90 transition-colors"
                        >
                          Pre-Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onPreorder={() => { setPreorderProduct(detailProduct); setDetailProduct(null); }}
        />
      )}
      {preorderProduct && (
        <PreorderModal product={preorderProduct} onClose={() => setPreorderProduct(null)} />
      )}
    </SiteLayout>
  );
}

function ProductDetailModal({ product, onClose, onPreorder }: { product: Product; onClose: () => void; onPreorder: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 sticky top-0 bg-background">
          <h2 className="font-serif text-lg text-primary">Product Details</h2>
          <button onClick={onClose} className="text-primary/65 hover:text-primary"><X className="w-5 h-5" /></button>
        </div>
        <div className="h-64 bg-card flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-12 h-12 text-primary/15" />
          )}
        </div>
        <div className="p-6">
          {product.category && <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/70 mb-2">{product.category}</p>}
          <h3 className="font-serif text-2xl text-primary mb-3">{product.name}</h3>
          <p className="font-sans text-base text-secondary font-medium mb-4">
            {product.price != null ? `${product.currency} ${product.price.toLocaleString()}` : "Price on request"}
          </p>
          {product.description ? (
            <p className="font-sans text-sm text-primary/65 leading-relaxed whitespace-pre-line mb-4">{product.description}</p>
          ) : (
            <p className="font-sans text-sm text-primary/40 italic mb-4">No additional description provided.</p>
          )}
          {product.min_qty > 1 && (
            <p className="font-sans text-xs text-primary/50 mb-4">Minimum pre-order quantity: {product.min_qty}</p>
          )}
          <button
            onClick={onPreorder}
            className="w-full bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-11 hover:bg-secondary/90 transition-colors"
          >
            Pre-Order This Product
          </button>
        </div>
      </div>
    </div>
  );
}

function PreorderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(product.min_qty || 1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !phone.trim()) { setError("Name and phone number are required."); return; }
    setError("");
    setSubmitting(true);
    try {
      const { error: err } = await supabase.from("preorders").insert({
        product_id: product.id, product_name: product.name, customer_name: name.trim(),
        phone: phone.trim(), email: email.trim() || null, quantity: quantity || 1, notes: notes.trim() || null,
      });
      if (err) throw err;
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
          <h2 className="font-serif text-lg text-primary">Pre-Order: {product.name}</h2>
          <button onClick={onClose} className="text-primary/65 hover:text-primary"><X className="w-5 h-5" /></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <Check className="w-10 h-10 text-secondary mx-auto mb-3" />
            <p className="font-serif text-lg text-primary mb-2">Request Received</p>
            <p className="font-sans text-sm text-primary/60 mb-6">
              Thank you. Our team will contact you shortly at {phone} to confirm your pre-order.
            </p>
            <button onClick={onClose} className="bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6">
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-400/10 text-red-400 font-sans text-sm">{error}</div>}
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Your Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Phone *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Quantity</label>
                <input type="number" min={product.min_qty || 1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
            </div>
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Email (optional)</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div>
              <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full px-3 py-2 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <button onClick={submit} disabled={submitting}
              className="w-full bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-11 hover:bg-secondary/90 transition-colors disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Pre-Order Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
