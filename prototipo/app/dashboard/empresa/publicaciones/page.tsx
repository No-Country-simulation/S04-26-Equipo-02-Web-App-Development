"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Rocket, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";


interface Job {
  id: string;
  title: string;
  location: string;
  modality: string;
  createdAt: string;
  status: string;
  description: string;
}

interface Application {
  id: string;
  jobPostId: string;
}

export default function EmpresaPublicacionesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsCount, setApplicationsCount] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs?companyOnly=true"),
          fetch("/api/applications")
        ]);

        if (jobsRes.ok && appsRes.ok) {
          const jobsData: Job[] = await jobsRes.json();
          const appsData: Application[] = await appsRes.json();

          setJobs(jobsData);

          // Count applications per job
          const counts: Record<string, number> = {};
          appsData.forEach((app) => {
            counts[app.jobPostId] = (counts[app.jobPostId] || 0) + 1;
          });
          setApplicationsCount(counts);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-sage" /> Mis Publicaciones
          </h1>
          <p className="text-gray-500 text-lg">Gestiona tus vacantes y procesos de selección.</p>
        </div>
        <Link href="/dashboard/empresa/publicaciones/nueva">
          <Button className="bg-brand-sage hover:bg-brand-olive rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-brand-sage/20 transition-all flex items-center gap-2">
            <Plus className="w-6 h-6" /> Nueva Vacante
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-32 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
             <Rocket className="w-10 h-10 text-brand-sage" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Aún no tienes publicaciones</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium italic">¡Comienza publicando tu primera oportunidad para el talento +45!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => {
            const count = applicationsCount[job.id] || 0;

            return (
              <div key={job.id} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-sage transition-colors">{job.title}</h3>
                    <Badge variant={job.status === "active" ? "default" : "secondary"} className={job.status === "active" ? "bg-brand-bg text-brand-olive hover:bg-brand-card" : ""}>
                      {job.status === "active" ? "Activa" : "Cerrada"}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-1 mb-4">{job.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> 
                      {job.createdAt && format(new Date(job.createdAt), "d MMM, yyyy", { locale: es })}
                    </span>
                    {job.modality && (
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        {job.modality}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 md:border-l md:pl-6 border-gray-100">
                  <div className="text-center px-4">
                    <p className="text-3xl font-black text-brand-sage mb-1">{count}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <Users className="w-3 h-3" /> Postulantes
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/empresa/publicaciones/${job.id}/postulantes`} className="w-full">
                      <Button className="w-full justify-start border-gray-200 bg-brand-bg text-brand-olive hover:bg-brand-card font-bold rounded-xl">
                        <Users className="w-4 h-4 mr-2" /> Ver Postulantes
                      </Button>
                    </Link>
                    <Link href={`/dashboard/empresa/publicaciones/${job.id}/editar`} className="w-full">
                      <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50 hover:text-brand-sage font-semibold rounded-xl">
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold rounded-xl">
                      <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

