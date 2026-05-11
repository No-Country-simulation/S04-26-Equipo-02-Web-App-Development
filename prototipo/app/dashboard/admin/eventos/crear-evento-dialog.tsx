"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";

interface CrearEventoDialogProps {
  onSuccess: () => void;
}

export function CrearEventoDialog({ onSuccess }: CrearEventoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "WEBINAR",
    date: "",
    startTime: "",
    endTime: "",
    speaker: "",
    zoomLink: "",
    isFree: true,
    maxAttendees: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await Promise.resolve();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al crear evento");
      }

      toast({
        title: "✅ Evento creado",
        description: "El evento se ha publicado correctamente.",
      });

      setOpen(false);
      onSuccess();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "WEBINAR",
        date: "",
        startTime: "",
        endTime: "",
        speaker: "",
        zoomLink: "",
        isFree: true,
        maxAttendees: "",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear el evento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2">
          <Plus className="w-6 h-6" /> Nuevo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900">Crear Nuevo Evento</DialogTitle>
          <DialogDescription>
            Completa los detalles para publicar un nuevo evento en la red.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título del Evento *</Label>
              <Input
                id="title"
                required
                placeholder="Ej. Webinar de Liderazgo 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento *</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBINAR">Webinar</SelectItem>
                  <SelectItem value="WORKSHOP">Taller / Workshop</SelectItem>
                  <SelectItem value="NETWORKING">Networking</SelectItem>
                  <SelectItem value="CURSO">Curso</SelectItem>
                  <SelectItem value="MEETING">Encuentro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Inicio (opcional)</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Fin (opcional)</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker">Facilitador / Speaker (opcional)</Label>
              <Input
                id="speaker"
                placeholder="Nombre del disertante"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Cupo Máximo (opcional)</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Ej. 100"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="zoomLink">Enlace de la reunión (Zoom/Meet)</Label>
              <Input
                id="zoomLink"
                type="url"
                placeholder="https://zoom.us/j/..."
                value={formData.zoomLink}
                onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                required
                placeholder="Describe de qué trata el evento, qué aprenderán, etc."
                className="h-24"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Switch
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
              />
              <Label htmlFor="isFree" className="font-medium">El evento es gratuito</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? "Creando..." : "Crear Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
