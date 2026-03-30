"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCareers, deleteCareer, toggleCareerStatus } from "@/lib/api";
import { Career } from "@/components/types/CareerTypes";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Briefcase, ToggleLeft, ToggleRight, Search, ChevronDown, Eye } from "lucide-react";
import { Fragment } from "react";
import { useToast } from "@/components/Toast";

type FilterStatus = "all" | "active" | "inactive";

export default function CareersAdminPage() {
  const { toast } = useToast();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const data = await getCareers();
      setCareers(data);
    } catch (err) {
      console.error("Error fetching careers:", err);
      setError("Failed to fetch careers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (career: Career) => {
    const newStatus = !career.is_active;
    try {
      setTogglingId(career.id);
      await toggleCareerStatus(career.id);
      setCareers((prev) =>
        prev.map((c) => (c.id === career.id ? { ...c, is_active: !career.is_active } : c))
      );
      toast({
        title: newStatus ? "Activated" : "Deactivated",
        description: `"${career.title}" is now ${newStatus ? "visible to the public" : "hidden from the public"}.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update career status.",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      setDeletingId(id);
      await deleteCareer(id);
      const newCareers = careers.filter((c) => c.id !== id);
      setCareers(newCareers);

      const newTotalPages = Math.ceil(newCareers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
      toast({
        title: "Deleted",
        description: "Career opportunity deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting career:", err);
      setError("Failed to delete the job posting.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter logic
  const filteredCareers = careers.filter((c) => {
    const matchesStatus =
      filter === "active" ? c.is_active !== false :
      filter === "inactive" ? c.is_active === false : true;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      c.title?.toLowerCase().includes(q) ||
      c.department?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q);
    const matchesType = !typeFilter || c.type === typeFilter;
    return matchesStatus && matchesSearch && matchesType;
  });

  const jobTypes = [...new Set(careers.map((c) => c.type).filter(Boolean))];

  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
  const paginatedCareers = filteredCareers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterCounts = {
    all: careers.length,
    active: careers.filter((c) => c.is_active !== false).length,
    inactive: careers.filter((c) => c.is_active === false).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Briefcase className="text-blue-600 dark:text-blue-400" />
                Career Opportunities
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage job postings and recruitment.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search jobs..."
                  className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-52 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value as FilterStatus); setCurrentPage(1); }}
                  className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none transition-all cursor-pointer min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active ({filterCounts.active})</option>
                  <option value="inactive">Inactive ({filterCounts.inactive})</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none transition-all cursor-pointer min-w-[120px]"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <Link
                href="/admin/careers/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <Plus size={20} />
                <span>Post New Job</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 flex items-center animate-shake">
            <span className="flex-1 text-sm font-medium">{error}</span>
            <button onClick={() => setError("")} className="ml-2 hover:opacity-70">&times;</button>
          </div>
        )}

        {/* Content Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">S.N</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <TableSkeleton rows={5} columns={6} />
                ) : filteredCareers.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message={
                      <div className="flex flex-col items-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <Briefcase className="text-gray-400 dark:text-gray-500" size={32} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {filter === "all" ? "No job postings found." : `No ${filter} job postings.`}
                        </p>
                        {filter === "all" && (
                          <Link href="/admin/careers/add" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Create your first job posting
                          </Link>
                        )}
                      </div>
                    }
                  />
                ) : (
                  paginatedCareers.map((career, index) => {
                    const isActive = career.is_active !== false;
                    return (
                      <Fragment key={career.id}>
                        <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-all group border-b border-gray-100 dark:border-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{career.title}</div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mt-1">{career.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {career.department || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {career.location || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm sticky right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                            <div className="flex justify-end gap-1">
                              <Link
                                href={`/admin/careers/${career.id}/view`}
                                className="p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              
                              <button
                                onClick={() => handleToggleStatus(career)}
                                disabled={togglingId === career.id}
                                title={isActive ? "Deactivate" : "Activate"}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                  isActive
                                    ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                    : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
                                }`}
                              >
                                {togglingId === career.id ? (
                                  <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full inline-block" />
                                ) : isActive ? (
                                  <ToggleRight size={18} />
                                ) : (
                                  <ToggleLeft size={18} />
                                )}
                              </button>

                              <Link
                                href={`/admin/careers/${career.id}/edit`}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Edit Job"
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() => handleDelete(career.id)}
                                disabled={deletingId === career.id}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                title="Delete Job"
                              >
                                {deletingId === career.id ? (
                                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent animate-spin rounded-full inline-block" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && filteredCareers.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCareers.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
  );
}
