"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface Publication {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  publishedAt: string | null;
  author: {
    name: string;
    image: string | null;
  } | null;
}

export default function RecursosPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications?status=published");
        if (res.ok) {
          setPublications(await res.json());
        }
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const filteredData = publications.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          < BookOpen className="w-8 h-8 text-blue-600" /> Recursos y Novedades
        </h1>
        <p className="text-gray-500 text-lg">Artículos, guías y noticias exclusivas de la comunidad.</p>
      </div>

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar recursos..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-20 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No hay publicaciones</h3>
          <p className="text-gray-500">Aún no se han subido artículos a la red.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map(pub => (
            <div key={pub.id} className="group bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                  {pub.type}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {format(new Date(pub.publishedAt || pub.createdAt), "d MMM yyyy", { locale: es })}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {pub.title}
              </h3>
              
              <div className="text-gray-500 line-clamp-4 prose prose-sm max-w-none flex-grow mb-6">
                <ReactMarkdown>{pub.content}</ReactMarkdown>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  {pub.author?.image ? (
                    <div className="relative w-8 h-8 shrink-0">
                      <Image src={pub.author.image} alt={pub.author.name} fill className="rounded-full object-cover ring-2 ring-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white">
                      {pub.author?.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-bold text-gray-900">{pub.author?.name}</span>
                </div>
                
                <button className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
                  Leer completo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
