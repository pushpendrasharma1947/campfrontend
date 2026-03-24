import { useEffect, useState } from "react";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "",
  image_url: "",
};

export default function ItemForm({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState(DEFAULT_VALUES);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ ...DEFAULT_VALUES, ...initialValues });
    setPreviewUrl(initialValues?.image_url || "");
    setImageFile(null);
  }, [initialValues]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", Number(form.price) || 0);
      formData.append("category", form.category);
      formData.append("condition", form.condition);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await onSubmit(formData);
      setMessage("Saved successfully.");
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.error;
      setError(serverMessage || "Unable to save item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            placeholder="e.g. MacBook Pro 2019"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            placeholder="e.g. Electronics"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          placeholder="Tell buyers what makes this item great..."
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Photo</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
          <p className="mt-1 text-xs text-slate-500">Max 5MB. JPG or PNG.</p>
        </label>

        {previewUrl ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-full max-w-full rounded-xl object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No image selected
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Price</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">₹</span>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-r-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="0.00"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Condition</span>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Used">Used</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
