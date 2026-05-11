"use client";

import { useEffect, useState } from "react";
import { Search, UserCheck, Filter, Star, ExternalLink, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type ProfessionalProfile = {
  id: string;
  userId: string;
  title: string | null;
  headline: string | null;
  summary: string | null;
  skills: string | null;
  availabilityStatus: string | null;
  score: number | null;
  user: {
    name: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    location: string | null;
  };
};

export default function TalentoPage() {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTalent() {
      setLoading(true);
      try {
        const url = search ? `/api/talent/search?query=${encodeURIComponent(search)}` : "/api/talent/search";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (error) {
        console.error("Error loading talent:", error);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      loadTalent();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-brand-sage" /> Búsqueda de Talento
        </h1>
        <p className="text-gray-500 text-lg">Encuentra profesionales con la experiencia y sabiduría que tu empresa necesita.</p>
      </div>

      <div className="flex gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar por rol, habilidad o título..." 
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-64 animate-pulse" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
             <Search className="w-10 h-10 text-brand-sage" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">No se encontraron perfiles</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">Intenta con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const parsedSkills = profile.skills ? JSON.parse(profile.skills) : [];
            const displaySkills = parsedSkills.slice(0, 3);
            
            return (
              <div key={profile.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-brand-sage transition-all duration-300 flex flex-col items-center text-center group">
                <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg shadow-brand-bg">
                  <AvatarImage src={profile.user.image || ""} />
                  <AvatarFallback className="bg-brand-sage text-white text-xl font-bold">
                    {profile.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-sage transition-colors">
                  {profile.user.firstName} {profile.user.lastName}
                </h3>
                
                <p className="text-brand-sage font-semibold text-sm mb-3">
                  {profile.headline || profile.title || "Profesional en desarrollo"}
                </p>

                {profile.user.location && (
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    {profile.user.location}
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {displaySkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-brand-bg text-brand-olive hover:bg-brand-card rounded-lg">
                      {skill}
                    </Badge>
                  ))}
                  {parsedSkills.length > 3 && (
                    <Badge variant="outline" className="rounded-lg text-gray-500">
                      +{parsedSkills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center">
                      <Star className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-semibold">Score</p>
                      <p className="text-sm font-bold text-gray-900">{profile.score || 0}/100</p>
                    </div>
                  </div>
                  <Link href={`/perfil/${profile.userId}`} target="_blank">
                    <Button className="rounded-xl font-bold bg-gray-900 hover:bg-brand-sage">
                      Ver Perfil <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
