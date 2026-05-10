"use client";

import { useEffect, useState } from "react";
import { Briefcase, Search, Filter, MapPin, Clock, DollarSign, Building, CheckCircle, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type JobPost = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  skillsRequired: string | null;
  modality: string | null;
  location: string | null;
  salaryRange: string | null;
  experienceRequired: string | null;
  applicationDeadline: string | null;
  createdAt: string;
};

export default function EmpleosPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/applications")
        ]);

        if (jobsRes.ok && appsRes.ok) {
          const jobsData = await jobsRes.json();
          const appsData: { jobPostId: string }[] = await appsRes.json();
          
          setJobs(jobsData);
          
          // Map applications to know which jobs the user has applied to
          const appsMap: Record<string, boolean> = {};
          appsData.forEach((app) => {
            appsMap[app.jobPostId] = true;
          });
          setApplications(appsMap);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostId: jobId, coverLetter: "Postulación rápida desde la plataforma." }),
      });

      if (res.ok) {
        setApplications(prev => ({ ...prev, [jobId]: true }));
        toast.success("Postulación enviada correctamente 🎉");
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al postularse");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    (job.description && job.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-600" /> Marketplace de Oportunidades
        </h1>
        <p className="text-gray-500 text-lg">Descubre vacantes en empresas que valoran la experiencia Senior.</p>
      </div>

      <div className="flex gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar por cargo o palabras clave..." 
            className="pl-10 h-12 rounded-xl" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-2 flex items-center gap-2 font-bold text-gray-600">
          <Filter className="w-4 h-4" /> Filtros
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Briefcase className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">No se encontraron vacantes</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">No hay empleos que coincidan con tu búsqueda en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => {
            const hasApplied = applications[job.id];
            
            return (
              <div key={job.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <Building className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  {job.createdAt && (
                    <span className="text-xs font-semibold text-gray-400">
                      {format(new Date(job.createdAt), "d MMM", { locale: es })}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.modality && (
                    <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                      <Clock className="w-3 h-3 mr-1" /> {job.modality}
                    </Badge>
                  )}
                  {job.location && (
                    <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                      <MapPin className="w-3 h-3 mr-1" /> {job.location}
                    </Badge>
                  )}
                  {job.salaryRange && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium">
                      <DollarSign className="w-3 h-3 mr-1" /> {job.salaryRange}
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm mb-8 line-clamp-3 flex-1 leading-relaxed">
                  {job.description}
                </p>
                
                <div className="mt-auto">
                  {hasApplied ? (
                    <Button disabled className="w-full h-12 rounded-xl bg-green-50 text-green-700 border-none opacity-100 flex items-center justify-center gap-2 font-bold text-base">
                      <CheckCircle className="w-5 h-5" /> Postulado
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleApply(job.id)}
                      className="w-full h-12 rounded-xl font-bold text-base bg-gray-900 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-xl hover:shadow-blue-200"
                    >
                      Postularme Ahora <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

