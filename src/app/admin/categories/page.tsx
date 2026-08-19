"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { AdminCategory } from "@/lib/adminTypes";
import { useAuthStore } from "@/lib/authStore";

export default function AdminCategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canManage = user?.role === "admin" || user?.role === "editor";

  function loadCategories() {
    adminFetch<AdminCategory[]>("/api/categories").then(setCategories).catch(() => {});
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await adminFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      setName("");
      setDescription("");
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-navy mb-6">Categories</h1>

      {canManage && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <PlusCircle size={16} />
            Add
          </button>
        </form>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-navy">{cat.name}</p>
              {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
            </div>
            <span className="text-xs text-gray-400">{cat.post_count} articles</span>
          </div>
        ))}
      </div>
    </div>
  );
}
