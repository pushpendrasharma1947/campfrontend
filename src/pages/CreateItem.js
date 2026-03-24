import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api";
import ItemForm from "../components/ItemForm";

export default function CreateItem() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createItem(values);
    navigate("/");
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sell an item</h1>
        <p className="mt-2 text-slate-600">
          Fill in the details below to post an item in the marketplace.
        </p>
      </header>

      <ItemForm
        onSubmit={handleSubmit}
        submitLabel="Post Item"
        onSuccess={() => {
          // no-op; redirect happens in handleSubmit
        }}
      />
    </main>
  );
}
