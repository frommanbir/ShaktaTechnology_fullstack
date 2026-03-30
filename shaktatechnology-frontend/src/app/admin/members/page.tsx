"use client";

import { useEffect, useState, Fragment, useCallback } from "react";
import { getMembers, deleteMember } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Loader2,
  User,
  Pencil,
  FileText,
  File as FileIcon,
  Download,
  X,
  Trash2,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import SearchBar from "@/components/SearchBar";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  role?: string;
  experience?: string;
  projects_involved?: string;
  image?: string;
  about?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  address?: string;
  education?: string;
  member_order?: number;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMembers(page, limit);
      setMembers(res.data || []);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function exportMemberToPDF(member: Member) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(46, 91, 255);
      doc.text(member.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(member.position || "Professional", pageWidth / 2, 28, { align: "center" });

      if (member.department) {
        doc.setFontSize(12);
        doc.text(member.department, pageWidth / 2, 34, { align: "center" });
      }

      // Contact Line
      doc.setDrawColor(200);
      doc.line(20, 40, pageWidth - 20, 40);

      let yPos = 50;

      // Contact Information
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("CONTACT INFORMATION", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;

      const contactData = [
        ["Email", member.email],
        ["Phone", member.phone || "-"],
        ["Address", member.address || "-"],
        ["Social", [
          member.linkedin ? "LinkedIn" : "",
          member.github ? "GitHub" : "",
          member.facebook ? "Facebook" : ""
        ].filter(Boolean).join(", ") || "-"]
      ];

      autoTable(doc, {
        startY: yPos,
        body: contactData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
        margin: { left: 20 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Sections helper
      const addSection = (title: string, content: string) => {
        if (!content) return;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(46, 91, 255);
        doc.text(title, 20, yPos);
        doc.line(20, yPos + 2, 60, yPos + 2);
        yPos += 8;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(content, pageWidth - 40);
        doc.text(splitText, 20, yPos);
        yPos += splitText.length * 5 + 10;
      };

      addSection("PROFESSIONAL SUMMARY", member.about || "");
      addSection("EXPERIENCE", member.experience || "");
      addSection("EDUCATION", member.education || "");
      addSection("PROJECTS INVOLVED", member.projects_involved || "");

      if (member.role) {
        addSection("ADDITIONAL INFO", `Role: ${member.role}`);
      }

      doc.save(`${member.name.replace(/\s+/g, "_")}_CV.pdf`);
      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
    }
  }

  async function exportMemberToWord(member: Member) {
    toast.loading("Generating Word document...");
    try {
      const createSectionHeading = (text: string) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: text,
              bold: true,
              size: 28,
              color: "2E5BFF",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 400 },
          border: { bottom: { color: "2E5BFF", size: 4, style: "single" } },
        });
      };

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
              },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.name.toUpperCase(),
                    bold: true,
                    size: 36,
                    color: "1A1A1A",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.position || "Professional",
                    bold: true,
                    size: 26,
                    color: "2E5BFF",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              
              createSectionHeading("CONTACT INFORMATION"),
              new Paragraph({
                children: [
                  new TextRun({ text: "Email: ", bold: true, size: 22 }),
                  new TextRun({ text: member.email, size: 22 }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Phone: ", bold: true, size: 22 }),
                  new TextRun({ text: member.phone || "-", size: 22 }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Address: ", bold: true, size: 22 }),
                  new TextRun({ text: member.address || "-", size: 22 }),
                ],
                spacing: { after: 120 },
              }),

              ...(member.about
                ? [
                    createSectionHeading("PROFESSIONAL SUMMARY"),
                    new Paragraph({
                      children: [new TextRun({ text: member.about, size: 22 })],
                      spacing: { after: 400 },
                    }),
                  ]
                : []),
              ...(member.experience
                ? [
                    createSectionHeading("EXPERIENCE"),
                    new Paragraph({
                      children: [new TextRun({ text: member.experience, size: 22 })],
                      spacing: { after: 400 },
                    }),
                  ]
                : []),
              ...(member.education
                ? [
                    createSectionHeading("EDUCATION"),
                    new Paragraph({
                      children: [new TextRun({ text: member.education, size: 22 })],
                      spacing: { after: 400 },
                    }),
                  ]
                : []),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Generated on " + new Date().toLocaleDateString(),
                    size: 18,
                    color: "999999",
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 600 },
              }),
            ].filter(Boolean) as Paragraph[],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${member.name.replace(/\s+/g, "_")}_CV.docx`);
      toast.dismiss();
      toast.success("Word document exported");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to export Word document");
    }
  }

  async function handleDelete() {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMember(memberToDelete.id);
      toast.success("Member deleted successfully");
      fetchMembers();
      setMemberToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      fetchMembers();
      return;
    }
    const lower = query.toLowerCase();
    setMembers((prev) => 
      prev.filter(
        (m) =>
          m.name.toLowerCase().includes(lower) ||
          m.email.toLowerCase().includes(lower) ||
          (m.department && m.department.toLowerCase().includes(lower))
      )
    );
  }, [fetchMembers]);

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Members
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-72">
              <SearchBar onSearch={handleSearch} placeholder="Search members..." />
            </div>
            <Link
              href="/admin/members/add"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg active:scale-95 text-center whitespace-nowrap"
            >
              Add New Member
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">S.N</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Info</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Role & Dept</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Order</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <TableSkeleton rows={limit} columns={5} showImage={true} />
              ) : members.length === 0 ? (
                <TableEmptyState 
                  message="No members found. Add some team members to get started." 
                  colSpan={5} 
                />
              ) : (
                members.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="py-3 px-4 text-sm text-gray-500 font-medium">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                            <Image
                              src={member.image}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="object-cover h-full w-full"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{member.position || "-"}</p>
                      <p className="text-xs text-gray-500 font-medium">{member.department || "-"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-400">
                        {member.member_order || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Link
                        href={`/admin/members/${member.id}/view`}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/members/${member.id}/edit`}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => setMemberToDelete(member)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={members.length * totalPages}
          itemsPerPage={limit}
        />

        {/* Member Profile Modal */}
        <Transition show={!!selectedMember} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setSelectedMember(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  {selectedMember && (
                    <div className="relative">
                      {/* Close Button */}
                      <button
                        onClick={() => setSelectedMember(null)}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                      >
                        <X size={24} />
                      </button>

                      {/* Cover/Header area */}
                      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
                      
                      <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-6 -mt-12 items-end md:items-center">
                          <div className="relative">
                            {selectedMember.image ? (
                              <Image
                                src={selectedMember.image}
                                alt={selectedMember.name}
                                width={120}
                                height={120}
                                className="rounded-2xl object-cover h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg"
                              />
                            ) : (
                              <div className="w-32 h-32 rounded-2xl bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                                {selectedMember.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                              {selectedMember.name}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{selectedMember.position || "Professional"}</p>
                          </div>
                          
                          {/* Export Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => exportMemberToPDF(selectedMember)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold border border-red-100 dark:border-red-900/30"
                            >
                              <FileIcon size={16} />
                              PDF CV
                            </button>
                            <button
                              onClick={() => exportMemberToWord(selectedMember)}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold border border-blue-100 dark:border-blue-900/30"
                            >
                              <FileText size={16} />
                              Word CV
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">@</div>
                                  <span className="text-sm">{selectedMember.email}</span>
                                </div>
                                {selectedMember.phone && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">#</div>
                                    <span className="text-sm">{selectedMember.phone}</span>
                                  </div>
                                )}
                                {selectedMember.address && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">L</div>
                                    <span className="text-sm">{selectedMember.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Professional</h4>
                              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Dept:</span> {selectedMember.department || "-"}</p>
                                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Role:</span> {selectedMember.role || "-"}</p>
                                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Education:</span> {selectedMember.education || "-"}</p>
                                <p><span className="font-semibold text-gray-800 dark:text-gray-200">Exp:</span> {selectedMember.experience || "-"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About Me</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                "{selectedMember.about || "No professional summary provided."}"
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Presence</h4>
                              <div className="flex gap-3">
                                {selectedMember.linkedin && (
                                  <a href={selectedMember.linkedin} target="_blank" className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-blue-600 hover:scale-110 transition-transform">
                                    <Linkedin size={20} />
                                  </a>
                                )}
                                {selectedMember.github && (
                                  <a href={selectedMember.github} target="_blank" className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white hover:scale-110 transition-transform">
                                    <Github size={20} />
                                  </a>
                                )}
                                {selectedMember.facebook && (
                                  <a href={selectedMember.facebook} target="_blank" className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-blue-800 hover:scale-110 transition-transform">
                                    <Facebook size={20} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Modal */}
        <Transition show={!!memberToDelete} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setMemberToDelete(null)}>
            <div className="fixed inset-0 bg-black/60" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <Dialog.Title className="text-xl font-bold mb-4">Delete Member?</Dialog.Title>
                <p className="text-gray-500 mb-6">Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{memberToDelete?.name}</span>? This cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setMemberToDelete(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                  <button 
                    onClick={handleDelete} 
                    disabled={isDeleting}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
  );
}