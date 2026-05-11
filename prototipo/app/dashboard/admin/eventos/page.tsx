"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, CheckCircle2, Loader2, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CrearEventoDialog } from "./crear-evento-dialog";
import { EditarEventoDialog } from "./editar-evento-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: string;
  speaker: string | null;
  zoomLink: string | null;
  isFree: boolean;
  status: string;
  maxAttendees: number | null;
  attendeesCount: number;
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    await Promise.resolve();
    try {
      const res = await fetch("/api/events?status=active");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de archivar este evento?")) return;
    
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ title: "Evento archivado" });
        handleRefresh();
      } else {
        throw new Error("Error");
      }
    } catch {
      toast({ title: "Error", description: "No se pudo archivar el evento", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" /> Gestión de Eventos
          </h1>
          <p className="text-gray-500 text-lg">Crea y administra webinars, talleres y encuentros.</p>
        </div>
        <CrearEventoDialog onSuccess={handleRefresh} />
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Evento</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  Cargando eventos...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                  No hay eventos activos. ¡Crea el primero!
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{event.title}</div>
                    {event.speaker && (
                      <div className="text-xs text-gray-400 font-medium">Por: {event.speaker}</div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase text-[10px]">
                      {event.type}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">
                    {format(new Date(event.date), "d MMM yyyy", { locale: es })}
                    {event.startTime && `, ${event.startTime}h`}
                  </td>
                  <td className="px-8 py-6">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> {event.status === "active" ? "Activo" : "Archivado"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <EditarEventoDialog event={event} onSuccess={handleRefresh} />
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Archivar"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
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
