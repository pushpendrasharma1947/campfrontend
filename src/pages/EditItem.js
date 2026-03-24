import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItem, updateItem } from "../api/api";
import ItemForm from "../components/ItemForm";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchItem(id);
        if (mounted) setItem(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Unable to load item.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    await updateItem(id, values);
    navigate("/my-listings");
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit listing</h1>
        <p className="mt-2 text-slate-600">Update your listing details and save changes.</p>
      </header>

      {loading ? (
        <div className="h-64 rounded-2xl bg-slate-200" />
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-800">{error}</div>
      ) : (
        <ItemForm
          initialValues={item}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          onCancel={() => navigate("/my-listings")}
        />
      )}
    </main>
  );
}
