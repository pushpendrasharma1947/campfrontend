import { useEffect, useMemo, useState } from "react";
import { fetchItems } from "../api/api";
import ItemCard from "../components/ItemCard";

const CATEGORY_OPTIONS = [
  "",
  "Books",
  "Electronics",
  "Cycle",
  "Furniture",
  "Clothing",
  "Other",
];

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filters = useMemo(
    () => ({
      search,
      category,
      min_price: minPrice,
      max_price: maxPrice,
    }),
    [search, category, minPrice, maxPrice]
  );

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await fetchItems(filters);
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Unable to load items. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [filters]);

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-6xl px-4 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
            <p className="mt-1 max-w-xl text-slate-600">
              Browse items posted by fellow students. Click “Sell Item” to add your own.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {loading ? "Fetching latest items..." : `${items.length} item${items.length === 1 ? "" : "s"} available`}
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-slate-700">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or description"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "" ? "All categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-slate-700">Price range</label>
            <div className="mt-2 flex gap-2">
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Min"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Max"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-72 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
              No items found yet. Be the first to post!
            </div>
          ) : (
            items.map((item) => <ItemCard key={item.id ?? item._id} item={item} />)
          )}
        </section>
      )}
    </main>
  );
}
