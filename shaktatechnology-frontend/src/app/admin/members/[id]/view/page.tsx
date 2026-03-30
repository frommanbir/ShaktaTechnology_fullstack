"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMembers } from "@/lib/api";
import { 
  Loader2, ArrowLeft, Edit, Linkedin, Github, Facebook, 
  Mail, Phone, MapPin, GraduationCap, Briefcase, Award,
  Download, FileText, User, Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

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

export default function ViewMemberPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMember = useCallback(async () => {
    try {
      const id = Number(params.id);
      const res = await getMembers(1, 1000); // Fetch enough to find the member
      const found = (res.data || []).find((m: Member) => m.id === id);
      if (found) {
        setMember(found);
      } else {
        setError("Professional profile not found.");
      }
    } catch (err) {
      setError("Error accessing professional records.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  async function exportToPDF() {
    if (!member) return;
    try {
      const doc = new jsPDF() as any;
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(22);
      doc.setTextColor(46, 91, 255);
      doc.text(member.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(member.position || "Professional", pageWidth / 2, 28, { align: "center" });
      doc.save(`${member.name.replace(/\s+/g, "_")}_CV.pdf`);
      toast.success("PDF Generated");
    } catch (err) {
      toast.error("Generation Failed");
    }
  }

  async function exportToWord() {
    if (!member) return;
    try {
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [new TextRun({ text: member.name.toUpperCase(), bold: true, size: 36 })],
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ text: member.position || "Professional", alignment: AlignmentType.CENTER })
          ]
        }]
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${member.name.replace(/\s+/g, "_")}_CV.docx`);
      toast.success("Word Generated");
    } catch (err) {
      toast.error("Generation Failed");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Accessing Personnel Metadata...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-10 rounded-[3rem] border border-red-100 dark:border-red-900/30">
           <h2 className="text-2xl font-black text-red-700 dark:text-red-400 mb-4 tracking-tight">Profile Isolated</h2>
           <p className="text-red-600 dark:text-red-300 mb-10 leading-relaxed font-medium">{error || "The requested profile is no longer active in our systems."}</p>
           <button 
             onClick={() => router.back()}
             className="px-10 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-xl shadow-red-500/20 active:scale-95"
           >
             Return to Roster
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold hover:shadow-xl shadow-gray-200/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-6">
             <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-700/50">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-3xl font-black">
                     {member.name.charAt(0)}
                  </div>
                )}
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{member.name}</h1>
                   <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 dark:border-blue-900/50 shadow-sm shadow-blue-500/10">ID: #{member.id}</div>
                </div>
                <div className="flex items-center gap-3 text-lg font-bold text-gray-400 lg:text-gray-500 transition-colors">
                   <span className="text-blue-600 dark:text-blue-400">{member.position}</span>
                   <span className="text-gray-300 font-light pr-2">/</span>
                   <span className="opacity-60">{member.department}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <button onClick={exportToPDF} className="p-3 text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm hover:shadow-md" title="PDF CV"><Download className="w-5 h-5" /></button>
              <button onClick={exportToWord} className="p-3 text-blue-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm hover:shadow-md" title="Word CV"><FileText className="w-5 h-5" /></button>
           </div>
           
           <Link
             href={`/admin/members/${member.id}/edit`}
             className="px-8 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-[1.25rem] hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-bold shadow-2xl active:scale-95 flex items-center gap-3"
           >
             <Edit className="w-4 h-4" />
             Edit Profile
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Bio & Details Column */}
        <div className="lg:col-span-8 space-y-16">
           {/* Professional Summary */}
           <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 mb-8 border-l-4 border-blue-600 pl-6 leading-none">Professional Narrative</h3>
              <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic opacity-90 max-w-none">
                 "{member.about || "This professional has not yet specialized their narrative within the ecosystem. Standard background checks and professional accreditation apply as per company protocols."}"
              </div>
           </section>

           {/* Core Metadata Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm group hover:shadow-2xl transition-all duration-700">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl transition-transform group-hover:rotate-12 duration-500"><GraduationCap className="w-5 h-5" /></div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Education Track</label>
                 </div>
                 <p className="text-gray-800 dark:text-gray-200 font-bold leading-relaxed">{member.education || "Standard Academic Background"}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm group hover:shadow-2xl transition-all duration-700">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl transition-transform group-hover:rotate-12 duration-500"><Award className="w-5 h-5" /></div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experience Years</label>
                 </div>
                 <p className="text-gray-800 dark:text-gray-200 font-bold leading-relaxed">{member.experience || "Industry Vet"}</p>
              </div>
           </div>

           {/* Projects Involved */}
           <section className="bg-gray-900 p-12 rounded-[3.5rem] border border-gray-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-8 border-b border-gray-800 pb-6">Case History & Contributions</h3>
                 <div className="prose prose-invert max-w-none text-gray-400 leading-[1.8] font-medium transition-all group-hover:text-gray-300">
                    {member.projects_involved || "Contributions currently under indexation. Involvement typically spans enterprise-level architecture and strategic implementation within the respective department domain."}
                 </div>
              </div>
           </section>
        </div>

        {/* Contact/Sidebar Column */}
        <div className="lg:col-span-4 space-y-10">
           {/* Direct Access Block */}
           <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Access Verification</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><Mail className="w-5 h-5" /></div>
                    <div>
                       <p className="text-[10px] font-black text-gray-300 uppercase m-0 leading-none mb-1">Email Host</p>
                       <p className="text-sm font-bold text-gray-700 dark:text-gray-300 m-0 leading-none">{member.email}</p>
                    </div>
                 </div>
                 {member.phone && (
                   <div className="flex items-center gap-5 group pt-2">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><Phone className="w-5 h-5" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase m-0 leading-none mb-1">Verified Phone</p>
                         <p className="text-sm font-bold text-gray-700 dark:text-gray-300 m-0 leading-none">{member.phone}</p>
                      </div>
                   </div>
                 )}
                 {member.address && (
                   <div className="flex items-center gap-5 group pt-2 border-t border-gray-100 dark:border-gray-700/50 pt-6">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400"><MapPin className="w-5 h-5" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase m-0 leading-none mb-1">Operational Base</p>
                         <p className="text-sm font-medium text-gray-700 dark:text-gray-300 m-0">{member.address}</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Professional Links */}
           <div className="p-8 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center mb-6">Digital Presence</h3>
              <div className="flex justify-center gap-6">
                 {member.linkedin && <a href={member.linkedin} target="_blank" className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-blue-600 rounded-2xl hover:scale-110 hover:-rotate-6 hover:shadow-2xl transition-all shadow-lg active:scale-95"><Linkedin className="w-6 h-6" /></a>}
                 {member.github && <a href={member.github} target="_blank" className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-900 dark:text-white rounded-2xl hover:scale-110 hover:-rotate-6 hover:shadow-2xl transition-all shadow-lg active:scale-95"><Github className="w-6 h-6" /></a>}
                 {member.facebook && <a href={member.facebook} target="_blank" className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-blue-800 rounded-2xl hover:scale-110 hover:-rotate-6 hover:shadow-2xl transition-all shadow-lg active:scale-95"><Facebook className="w-6 h-6" /></a>}
              </div>
           </div>

           {/* Archive Status */}
           <div className="p-10 bg-blue-50/50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100/50 dark:border-blue-900/30 text-center group transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <User className="w-8 h-8 text-blue-300 mx-auto mb-6 opacity-40 group-hover:scale-110 duration-700 transition-transform" />
              <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest mb-2">Team Priority Ranking</p>
              <h4 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">LEVEL_0{member.member_order || 0}</h4>
           </div>
        </div>
      </div>
    </div>
  );
}
