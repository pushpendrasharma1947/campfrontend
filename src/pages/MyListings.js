import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteItem, fetchItems } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

function getUserIdFromToken(user) {
  if (!user) return null;
  return user.id || user._id || user.sub || null;
}

export default function MyListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const userId = useMemo(() => getUserIdFromToken(user), [user]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const allItems = await fetchItems();
      const mine = (allItems || []).filter((item) => {
        const seller = item.seller_id ?? item.sellerId ?? item.owner_id ?? item.ownerId;
        return seller && userId && String(seller) === String(userId);
      });
      setItems(mine);
    } catch (err) {
      console.error(err);
      setError("Unable to load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteItem(id);
      await fetchMyItems();
    } catch (err) {
      console.error(err);
      setError("Failed to delete item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My listings</h1>
          <p className="mt-1 max-w-xl text-slate-600">
            View and manage items you have posted in CampusKart.
          </p>
        </div>
        <div className="text-sm text-slate-500">{loading ? "Loading..." : `${items.length} item${items.length === 1 ? "" : "s"}`}</div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-800">{error}</div>
      ) : null}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-72 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
          You have not posted any items yet. Head to "Sell Item" to create a listing.
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id ?? item._id} className="relative">
              <ItemCard item={item} />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(item.id ?? item._id)}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id ?? item._id)}
                  disabled={deletingId === (item.id ?? item._id)}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingId === (item.id ?? item._id) ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
