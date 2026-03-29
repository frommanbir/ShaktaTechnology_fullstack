"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getCareerTypes,
  createCareerType,
  updateCareerType,
  deleteCareerType,
} from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Plus, Edit, Trash2, Tags, Save, X, Loader2 } from "lucide-react";

interface CareerType {
  id: number;
  name: string;
  created_at?: string;
}

export default function CareerTypesPage() {
  const { toast } = useToast();
  const [types, setTypes] = useState<CareerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form state — null means "create new", a type means "editing"
  const [editingType, setEditingType] = useState<CareerType | null>(null);
  const [formName, setFormName] = useState("");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCareerTypes();
      setTypes(data);
    } catch {
      toast({ title: "Error", description: "Failed to load employment types.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const resetForm = () => {
    setFormName("");
    setEditingType(null);
    setFormMode("create");
  };

  const startEdit = (type: CareerType) => {
    setEditingType(type);
    setFormName(type.name);
    setFormMode("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);

    try {
      if (formMode === "edit" && editingType) {
        await updateCareerType(editingType.id, { name: formName.trim() });
        setTypes((prev) =>
          prev.map((t) => (t.id === editingType.id ? { ...t, name: formName.trim() } : t))
        );
        toast({ title: "Updated", description: `"${formName}" updated successfully.` });
      } else {
        const result = await createCareerType({ name: formName.trim() });
        setTypes((prev) => [...prev, result.data]);
        toast({ title: "Created", description: `"${formName}" added as a new employment type.` });
      }
      resetForm();
    } catch (err: any) {
      const apiError = err.response?.data;
      let message = "Failed to save employment type.";
      if (apiError?.errors?.name) message = apiError.errors.name[0];
      else if (apiError?.message) message = apiError.message;
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: CareerType) => {
    if (!confirm(`Delete "${type.name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(type.id);
      await deleteCareerType(type.id);
      setTypes((prev) => prev.filter((t) => t.id !== type.id));
      if (editingType?.id === type.id) resetForm();
      toast({ title: "Deleted", description: `"${type.name}" removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete type.", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Tags className="text-blue-600 dark:text-blue-400" />
            Employment Types
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage the employment types available when posting job opportunities.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Types Table */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">All Types</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {types.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">#</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" /></td>
                      </tr>
                    ))
                  ) : types.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No employment types yet. Create your first one →
                      </td>
                    </tr>
                  ) : (
                    types.map((type, index) => (
                      <tr
                        key={type.id}
                        className={`transition-colors ${
                          editingType?.id === type.id
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50/80 dark:hover:bg-gray-700/40"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{type.name}</span>
                          {editingType?.id === type.id && (
                            <span className="ml-2 text-xs text-blue-500 font-medium">editing…</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => startEdit(type)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(type)}
                              disabled={deletingId === type.id}
                              className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === type.id ? (
                                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full inline-block" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — Create / Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  {formMode === "edit" ? (
                    <>
                      <Edit size={18} className="text-blue-500" />
                      Edit Type
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="text-blue-500" />
                      New Type
                    </>
                  )}
                </h2>
                {formMode === "edit" && (
                  <button
                    onClick={resetForm}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Cancel edit"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Remote, Part-time, Freelance…"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                    autoFocus={formMode === "create"}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    This name will appear exactly as typed in the job type dropdown.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  {formMode === "edit" && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving || !formName.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving…
                      </>
                    ) : formMode === "edit" ? (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Type
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Current types as pills for quick reference */}
              {types.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                    Existing Types
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <span
                        key={t.id}
                        onClick={() => startEdit(t)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          editingType?.id === t.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600"
                        }`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
