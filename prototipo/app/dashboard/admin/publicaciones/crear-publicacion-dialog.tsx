"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function CrearPublicacionDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "ARTICULO",
    status: "published",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al crear publicación");
      }

      toast({ title: "Publicación creada exitosamente" });
      setFormData({ title: "", content: "", type: "ARTICULO", status: "published" });
      setOpen(false);
      onCreated();
    } catch {
      toast({ title: "Error", description: "No se pudo crear la publicación", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-blue-200">
          <PlusCircle className="w-5 h-5 mr-2" /> Nueva Publicación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" /> Crear Publicación
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Título</label>
              <Input 
                required 
                placeholder="Ej. Las 10 tendencias en RRHH para 2026" 
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Tipo de Contenido</label>
                <Select value={formData.type} onValueChange={(val) => handleChange("type", val)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARTICULO">Artículo</SelectItem>
                    <SelectItem value="GUIA">Guía Práctica</SelectItem>
                    <SelectItem value="RECURSO">Recurso / Plantilla</SelectItem>
                    <SelectItem value="NOTICIA">Noticia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Estado Inicial</label>
                <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Contenido (Markdown soportado)</label>
              <Textarea 
                required
                placeholder="Escribe el contenido de la publicación aquí..."
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="min-h-[200px] rounded-xl resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-bold">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Creando..." : "Publicar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
