"use client";

import { useState, useEffect, Fragment } from "react";
import { getProjects, deleteProject } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/Toast";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  client?: string;
  duration?: string;
  technologies?: string[];
  key_results?: string[];
  image?: string;
  created_at: string;
}

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const data = await getProjects();
        const sortedProjects = (data || []).sort((a: Project, b: Project) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setProjects(sortedProjects);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch projects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjects(projects.filter((project) => project.id !== projectToDelete.id));
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const categories = [
    "Web Development",
    "Mobile Development",
    "Cloud Solutions",
    "IoT Solutions",
    "Education Tech",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/admin/project/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Project
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto transition-colors duration-300">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                S.N
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[200px]">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[200px]">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[300px]">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 sticky right-0 bg-gray-50 dark:bg-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
            {loading ? (
              <TableSkeleton rows={5} columns={4} showImage={true} />
            ) : filteredProjects.length === 0 ? (
              <TableEmptyState 
                message={selectedCategory ? `No projects found in "${selectedCategory}".` : "No projects found."} 
                colSpan={6} 
              />
            ) : (
              paginatedProjects.map((project, index) => (
                <Fragment key={project.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.image ? (
                        <Image
                          src={`${project.image}`}
                          alt={project.title}
                          width={50}
                          height={50}
                          className="object-contain rounded"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                            e.currentTarget.srcset = "";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 max-w-[180px]">{project.title}</div>
                    </td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 max-w-[280px]">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
                      <button
                        onClick={() => toggleRow(project.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mr-2"
                      >
                        {expandedRow === project.id ? (
                          <ChevronUp className="h-5 w-5 inline" />
                        ) : (
                          <ChevronDown className="h-5 w-5 inline" />
                        )}
                      </button>
                      <Link
                        href={`/admin/project/${project.id}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => {
                          setProjectToDelete(project);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === project.id && (
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td colSpan={6} className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                          <p><strong>Title:</strong> {project.title}</p>
                          <p><strong>Category:</strong> {project.category}</p>
                          <p><strong>Client:</strong> {project.client || 'N/A'}</p>
                          <p><strong>Duration:</strong> {project.duration || 'N/A'}</p>
                          <p><strong>Description:</strong> {project.description}</p>
                          <p><strong>Technologies:</strong> {project.technologies?.join(', ') || 'None'}</p>
                          {project.key_results && project.key_results.length > 0 && (
                            <div>
                              <strong>Key Results:</strong>
                              <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                                {project.key_results.map((result, idx) => (
                                  <li key={idx}>{result}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredProjects.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredProjects.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <Transition show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl transition-colors">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the project{" "}
                  <span className="font-semibold">{projectToDelete?.title}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 flex items-center disabled:opacity-50 transition-colors"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}