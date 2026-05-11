"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Mail, MapPin, Star, UserCheck, Users, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { use } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type EnrichedApplication = {
  id: string;
  professionalUserId: string;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  user: {
    name: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    email: string;
    location: string | null;
  };
  profile: {
    headline: string | null;
    title: string | null;
    score: number | null;
    skills: string | null;
  };
};

export default function PostulantesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/applications?jobPostId=${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Error loading applicants:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/empresa/publicaciones" className="text-gray-500 hover:text-brand-sage flex items-center gap-2 w-fit mb-4 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a publicaciones
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-brand-sage" /> Candidatos Postulados
        </h1>
        <p className="text-gray-500 text-lg">Revisa y evalúa el talento +45 que se ha interesado en esta vacante.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
             <UserCheck className="w-10 h-10 text-brand-sage" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Aún no hay postulaciones</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">Los profesionales Senior verán tu vacante en su Marketplace. ¡Pronto recibirás talento de alto nivel!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const parsedSkills = app.profile?.skills ? JSON.parse(app.profile.skills) : [];
            const displaySkills = parsedSkills.slice(0, 4);

            return (
              <Card key={app.id} className="border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* AVATAR Y SCORE */}
                    <div className="flex flex-col items-center gap-4 md:w-48 shrink-0">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-md shadow-brand-bg">
                        <AvatarImage src={app.user?.image || ""} />
                        <AvatarFallback className="bg-brand-sage text-white text-2xl font-bold">
                          {app.user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 flex items-center gap-3 w-full justify-center">
                        <Star className="w-5 h-5 text-orange-500" />
                        <div className="text-left leading-tight">
                          <p className="text-[10px] uppercase font-bold text-gray-400">Score</p>
                          <p className="text-lg font-black text-gray-900">{app.profile?.score || 0}</p>
                        </div>
                      </div>
                      
                      <Link href={`/perfil/${app.professionalUserId}`} target="_blank" className="w-full">
                        <Button className="w-full rounded-xl font-bold bg-gray-900 hover:bg-brand-sage transition-colors">
                          Ver Perfil Completo
                        </Button>
                      </Link>
                    </div>

                    {/* DATOS DEL CANDIDATO */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">
                            {app.user?.firstName} {app.user?.lastName}
                          </h3>
                          <p className="text-brand-sage font-bold text-sm">
                            {app.profile?.headline || app.profile?.title || "Profesional Senior"}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 rounded-md">
                          {app.createdAt && format(new Date(app.createdAt), "d MMM, yyyy", { locale: es })}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {app.user?.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400" /> {app.user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-gray-400" /> {app.user?.email}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {displaySkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-gray-200 text-gray-600 bg-gray-50 rounded-lg font-medium">
                            {skill}
                          </Badge>
                        ))}
                        {parsedSkills.length > 4 && (
                          <Badge variant="outline" className="border-transparent text-brand-sage font-bold">
                            +{parsedSkills.length - 4} más
                          </Badge>
                        )}
                      </div>

                      {/* COVER LETTER / PRESENTACIÓN */}
                      {app.coverLetter && (
                        <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 relative">
                          <FileBadge className="absolute -top-3 -left-3 w-8 h-8 text-brand-sage bg-white rounded-full p-1 border border-gray-100 shadow-sm" />
                          <h4 className="text-sm font-bold text-gray-900 mb-2 ml-4">Carta de Presentación</h4>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line italic">
                            &quot;{app.coverLetter}&quot;
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
