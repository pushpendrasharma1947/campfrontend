import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const {
    id,
    _id,
    title,
    description,
    price,
    category,
    condition,
    image,
  } = item || {};

  const itemId = id || _id;

  const formattedPrice = typeof price === "number" ? `₹${price.toFixed(2)}` : price;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={title || "Item"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title || "Untitled"}</h2>
            <p className="mt-1 max-h-12 overflow-hidden text-sm text-slate-600">{description || "No description provided."}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {formattedPrice || "N/A"}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{category || "General"}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{condition || "Unknown"}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/chat/${itemId}`)}
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Chat about this item
        </button>
      </div>
    </article>
  );
}
