"use client";

import { useEffect, useState, Fragment } from "react";
import { getMembers, deleteMember } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Linkedin, Github, Facebook, Instagram, Loader2, User, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } from "docx";
import { saveAs } from "file-saver";

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
  short_description?: string; 
  training?: string;
  education?: string; 
  reference?: string; 
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Get environment variables
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await getMembers(page, limit);
      setMembers(res.data || []);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [page]);

  function openDeleteConfirmation(member: Member) {
    setMemberToDelete(member);
  }

  function closeDeleteConfirmation() {
    setMemberToDelete(null);
  }

  async function exportMemberToWord(member: Member) {
    // Helper function to create section headings
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

    // Helper function to create contact info paragraph
    const createContactInfo = (label: string, value: string) => {
      if (!value || value === "-") return null;
      return new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true, size: 22 }),
          new TextRun({ text: value, size: 22 }),
        ],
        spacing: { after: 120 },
      });
    };

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
              },
            },
          },
          children: [
            // Header Section
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

            // Position and Department
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

            member.department ? new Paragraph({
              children: [
                new TextRun({
                  text: member.department,
                  italics: true,
                  size: 22,
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }) : new Paragraph({ text: "" }),

            // Contact Information Section
            createSectionHeading("CONTACT INFORMATION"),
            
            // Contact details in a structured format
            new Paragraph({
              children: [
                new TextRun({ text: "Email: ", bold: true, size: 22 }),
                new TextRun({ text: member.email, size: 22 }),
              ],
              spacing: { after: 120 },
            }),

            createContactInfo("Phone", member.phone || ""),
            createContactInfo("Address", member.address || ""),
            
            // Social Media Links
            ...(member.linkedin || member.github || member.facebook || member.instagram ? [
              new Paragraph({
                children: [
                  new TextRun({ text: "Social Media: ", bold: true, size: 22 }),
                  new TextRun({ 
                    text: [
                      member.linkedin ? "LinkedIn" : "",
                      member.github ? "GitHub" : "",
                      member.facebook ? "Facebook" : "",
                      member.instagram ? "Instagram" : ""
                    ].filter(Boolean).join(", "),
                    size: 22 
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Professional Summary/About Section
            ...(member.about ? [
              createSectionHeading("PROFESSIONAL SUMMARY"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.about,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Experience Section
            ...(member.experience ? [
              createSectionHeading("EXPERIENCE"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.experience,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Projects Section
            ...(member.projects_involved ? [
              createSectionHeading("PROJECTS INVOLVED"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.projects_involved,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Education Section
            ...(member.education ? [
              createSectionHeading("EDUCATION"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.education,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Training & Certifications Section
            ...(member.training ? [
              createSectionHeading("TRAINING & CERTIFICATIONS"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.training,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // References Section
            ...(member.reference ? [
              createSectionHeading("REFERENCES"),
              new Paragraph({
                children: [
                  new TextRun({
                    text: member.reference,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Additional Information
            ...(member.role ? [
              createSectionHeading("ADDITIONAL INFORMATION"),
              new Paragraph({
                children: [
                  new TextRun({ text: "Role: ", bold: true, size: 22 }),
                  new TextRun({ text: member.role, size: 22 }),
                ],
                spacing: { after: 400 },
              })
            ] : []),

            // Footer
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
  }

  async function handleDelete() {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMember(memberToDelete.id);
      fetchMembers();
      closeDeleteConfirmation();
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
  }

  function openMemberProfile(member: Member) {
    setSelectedMember(member);
  }

  function closeMemberProfile() {
    setSelectedMember(null);
  }

  function handleImageClick(imageUrl: string) {
    setViewImage(imageUrl);
  }

  function closeImageView() {
    setViewImage(null);
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          <a
            href="/admin/members/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Member
          </a>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No members found.</p>
            <a
              href="/admin/members/add"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Member
            </a>
          </div>
        ) : (
          <>
            {/* Members Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Image</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Department</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Position</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {member.image ? (
                          <Image
                            src={`${storageUrl}members/${member.image}`}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer"
                            loading="lazy"
                            onClick={() => handleImageClick(`${storageUrl}members/${member.image}`)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4">{member.name}</td>
                      <td className="py-2 px-4">{member.email}</td>
                      <td className="py-2 px-4">{member.department || "-"}</td>
                      <td className="py-2 px-4">{member.position || "-"}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <span
                          onClick={() => openMemberProfile(member)}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm cursor-pointer flex items-center"
                          title="Profile"
                        >
                          <User size={16} />
                        </span>
                        <a
                          href={`/admin/members/${member.id}/edit`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </a>
                        <span
                          onClick={() => openDeleteConfirmation(member)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm cursor-pointer flex items-center"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Previous
              </span>
              <span>
                Page {page} of {totalPages}
              </span>
              <span
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className={`px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer ${page === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Next
              </span>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Transition show={!!memberToDelete} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeDeleteConfirmation}>
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
                <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
                  <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">
                    Confirm Deletion
                  </Dialog.Title>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{memberToDelete?.name}</span>? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <span
                      onClick={closeDeleteConfirmation}
                      className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      Cancel
                    </span>
                    <span
                      onClick={handleDelete}
                      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isDeleting ? "Deleting..." : "Delete Member"}
                    </span>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Member Profile Modal */}
        <Transition show={!!selectedMember} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeMemberProfile}>
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
                <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-bold">Member Profile</Dialog.Title>
                    <span
                      onClick={closeMemberProfile}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      &times;
                    </span>
                  </div>

                  {selectedMember && (
                    <>
                      <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex-shrink-0">
                          {selectedMember.image ? (
                            <Image
                              src={`${storageUrl}members/${selectedMember.image}`}
                              alt={selectedMember.name}
                              width={128}
                              height={128}
                              className="rounded-full object-cover mx-auto cursor-pointer"
                              onClick={() => handleImageClick(`${storageUrl}members/${selectedMember.image}`)}
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                              <span className="text-gray-500 text-xl">
                                {selectedMember.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-2xl font-bold mb-2">{selectedMember.name}</h3>
                          <p className="text-gray-600 mb-1">{selectedMember.position || "-"}</p>
                          <p className="text-gray-600 mb-1">{selectedMember.department || "-"}</p>
                          <p className="text-gray-600 mb-3">{selectedMember.role || "-"}</p>
                          <p className="text-gray-600 mb-3">{selectedMember.short_description || "No short description available."}</p>

                          {/* Social Media Icons */}
                          <div className="flex space-x-3 mt-2">
                            {selectedMember.linkedin && (
                              <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <Linkedin size={20} />
                              </a>
                            )}
                            {selectedMember.github && (
                              <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                                <Github size={20} />
                              </a>
                            )}
                            {selectedMember.facebook && (
                              <a href={selectedMember.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <Facebook size={20} />
                              </a>
                            )}
                            {selectedMember.instagram && (
                              <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                                <Instagram size={20} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* About & Professional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                            <div className="space-y-2">
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Email:</span>
                                <span className="text-gray-600">{selectedMember.email}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Phone:</span>
                                <span className="text-gray-600">{selectedMember.phone || "-"}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Address:</span>
                                <span className="text-gray-600">{selectedMember.address || "-"}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Professional Details</h3>
                            <div className="space-y-2">
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Experience:</span>
                                <span className="text-gray-600">{selectedMember.experience || "-"}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Projects:</span>
                                <span className="text-gray-600">{selectedMember.projects_involved || "-"}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Training:</span>
                                <span className="text-gray-600">{selectedMember.training || "-"}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Education:</span>
                                <span className="text-gray-600">{selectedMember.education || "-"}</span>
                              </div>
                              <div className="flex">
                                <span className="w-32 font-medium text-gray-700">Reference:</span>
                                <span className="text-gray-600">{selectedMember.reference || "-"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                            <p className="text-gray-600">{selectedMember.about || "No information available."}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end mt-6 space-x-3">
                    <span
                      onClick={() => exportMemberToWord(selectedMember!)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      Export as CV
                    </span>
                    <span
                      onClick={closeMemberProfile}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
                    >
                      Close
                    </span>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Image Viewer Modal */}
        <Transition show={!!viewImage} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeImageView}>
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
                <Dialog.Panel className="bg-white rounded-lg max-w-2xl max-h-screen p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold">Profile Image</Dialog.Title>
                    <span
                      onClick={closeImageView}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      &times;
                    </span>
                  </div>
                  {viewImage && (
                    <Image
                      src={viewImage}
                      alt="Member"
                      width={800}
                      height={800}
                      className="w-full h-auto rounded-md object-contain"
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}