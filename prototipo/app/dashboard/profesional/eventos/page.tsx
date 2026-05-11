"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, Sparkles, MapPin, Clock, Users, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  maxAttendees: number | null;
  attendeesCount: number;
}

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    await Promise.resolve();
    try {
      const [eventsRes, regRes] = await Promise.all([
        fetch("/api/events?status=active"),
        fetch("/api/events/registrations")
      ]);

      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }
      if (regRes.ok) {
        setRegisteredIds(await regRes.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST"
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Inscripción exitosa", {
          description: "Te has registrado correctamente al evento.",
        });
        setRegisteredIds(prev => [...prev, eventId]);
      } else {
        throw new Error(data.message || "Error al inscribirse");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudo completar la inscripción";
      toast.error(message);
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-600" /> Próximos Eventos
        </h1>
        <p className="text-gray-500 text-lg">Webinars, talleres y encuentros para potenciar tu red.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No hay eventos próximos</h3>
          <p className="text-gray-500">Vuelve pronto para descubrir nuevas actividades y oportunidades.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = registeredIds.includes(event.id);
            const isFull = event.maxAttendees && event.attendeesCount >= event.maxAttendees;

            return (
              <div key={event.id} className="saas-card overflow-hidden group flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-50 relative p-6 flex flex-col justify-end">
                  <Badge className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-orange-700 hover:bg-white/90 border-0">
                    {event.type}
                  </Badge>
                  {isRegistered && (
                    <Badge className="absolute top-4 left-4 bg-emerald-500 text-white border-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Inscrito
                    </Badge>
                  )}
                  <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-2">
                    {event.title}
                  </h3>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 pt-4 border-t border-gray-50 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(event.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {event.startTime && `${event.startTime} hs`} 
                          {event.endTime && ` - ${event.endTime} hs`}
                        </div>
                      )}
                      {event.speaker && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          Por: {event.speaker}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {event.zoomLink ? "En línea (Zoom/Meet)" : "Por confirmar"}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-auto">
                    <div className="text-sm font-bold text-gray-900">
                      {event.isFree ? "Gratis" : "De pago"}
                    </div>
                    {isRegistered ? (
                      <Button variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" disabled>
                        Ya inscrito
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleRegister(event.id)}
                        disabled={registering === event.id || !!isFull}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/20"
                      >
                        {registering === event.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {isFull ? "Cupo Lleno" : "Inscribirme"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center py-12">
        <p className="text-gray-400 font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" /> ¡Nuevas actividades se publican cada semana!
        </p>
      </div>
    </div>
  );
}
