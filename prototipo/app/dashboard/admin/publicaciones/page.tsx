"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Search, MoreVertical, Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CrearPublicacionDialog } from "./crear-publicacion-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Publication {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: string;
  author: {
    name: string;
    image: string | null;
  } | null;
}

export default function AdminPublicacionesPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchPublications = useCallback(async () => {
    await Promise.resolve();
    try {
      const res = await fetch("/api/publications");
      if (res.ok) {
        setPublications(await res.json());
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPublications();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchPublications]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchPublications();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return;

    try {
      const res = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Publicación eliminada" });
        handleRefresh();
      } else {
        throw new Error("Error al eliminar");
      }
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la publicación", variant: "destructive" });
    }
  };

  const filteredData = publications.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" /> Contenido de la Red
          </h1>
          <p className="text-gray-500 text-lg">Administra artículos, guías y recursos para la comunidad.</p>
        </div>
        <CrearPublicacionDialog onCreated={handleRefresh} />
      </div>

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar publicaciones..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Publicación</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Autor</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  Cargando publicaciones...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-medium">
                  No hay publicaciones disponibles.
                </td>
              </tr>
            ) : (
              filteredData.map(pub => (
                <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{pub.title}</div>
                    <div className="text-xs text-gray-400 font-medium mt-1">
                      Creado el {format(new Date(pub.createdAt), "d MMM yyyy", { locale: es })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                      {pub.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {pub.author?.image ? (
                        <div className="relative w-6 h-6 shrink-0">
                          <Image src={pub.author.image} alt={pub.author.name} fill className="rounded-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-[10px]">
                          {pub.author?.name?.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-600">{pub.author?.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {pub.status === "published" ? (
                      <span className="text-xs font-bold text-emerald-600">Publicado</span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600">Borrador</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all h-auto">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600" /> Ver Publicación
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Pencil className="w-4 h-4 text-amber-600" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer flex items-center gap-2"
                          onClick={() => handleDelete(pub.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
