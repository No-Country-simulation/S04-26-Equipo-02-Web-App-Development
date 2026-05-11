"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  TrendingUp,
  Star,
  Loader2,
  Circle,
  ArrowRight,
  Calendar,
  Users,
  Camera,
  Clock,
} from "lucide-react";
import { 
  RadialBarChart, 
  RadialBar, 
  PolarGrid
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Progreso",
  },
  skills: {
    label: "Habilidades",
    color: "#7B9E6B",
  },
  webinars: {
    label: "Webinars",
    color: "#D4C36A",
  },
  talleres: {
    label: "Talleres",
    color: "#D4826A",
  },
  networking: {
    label: "Networking",
    color: "#8B9A6B",
  },
} satisfies ChartConfig;

interface Profile {
  diagnosticResults?: string;
  progress?: number;
  stats?: {
    networking?: number;
    workshops?: number;
    webinars?: number;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  speaker?: string;
}

interface Task {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export default function ProfessionalDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/professional/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchProfile();
    
    // Fetch upcoming events
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events?status=active");
        if (res.ok) {
          const data = await res.json();
          setUpcomingEvents(data.slice(0, 3)); // Only show top 3
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();

    // Fetch dynamic weekly tasks
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setWeeklyTasks(data.tasks || []);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [user]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // Parse diagnostic results
  const diagnostic = profile?.diagnosticResults ? JSON.parse(profile.diagnosticResults) : null;
  const selectedSkills = (diagnostic?.skills as string[]) || [];

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    setTogglingTask(taskId);
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: !currentCompleted }),
      });
      if (res.ok) {
        setWeeklyTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !currentCompleted } : t
          )
        );
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    } finally {
      setTogglingTask(null);
    }
  };

  // Determine user title from diagnostic
  const areaMap: Record<string, string> = {
    RRHH: "Especialista en RRHH",
    COM: "Profesional Comercial",
    FIN: "Especialista en Finanzas",
    OPS: "Profesional de Operaciones",
    IT: "Profesional de Tecnología",
    OTRO: "Profesional Senior",
  };
  const userTitle = areaMap[diagnostic?.area] || "Profesional Senior";

  if (loading) {
    return (
      <div className="h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#2C2C2C] animate-spin" />
          <p className="text-sm text-[#6B6B6B] font-medium animate-pulse">Preparando tu espacio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-4 md:p-8 space-y-8 animate-in fade-in duration-1000">
      
      {/* Header — Hello, Name */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight">
             Hola, {user?.firstName?.split(' ')[0]} 
           </h1>
           <p className="text-[#9B9B9B] font-medium text-sm uppercase tracking-widest">
             Tu espacio de crecimiento profesional
           </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#EDE8DB] p-2.5 rounded-2xl px-5 border border-[#D4C9A8]/30">
             <Star className="w-5 h-5 text-[#C4A962] fill-[#C4A962]" />
             <span className="font-bold text-[#1A1A1A]">1,000</span>
             <span className="text-[#9B9B9B] text-xs font-medium uppercase tracking-wider">XP</span>
          </div>
        </div>
      </div>

      {/* Row 1: Photo Card + Progress Chart + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* USER PHOTO CARD — Reduced size to avoid pixelation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer min-h-[340px] max-h-[340px] min-w-[200px] max-w-[200px]"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src={user?.image || "/default-professional.png"}
              alt={user?.name || "Profesional"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Camera overlay for changing photo */}
          {!user?.image && (
            <Link href="/dashboard/profesional/perfil" className="absolute top-4 right-4 z-20 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-white/30 transition-all">
              <Camera className="w-5 h-5" />
            </Link>
          )}

          {/* Name & Title Overlay */}
          <div className="absolute bottom-5 left-0 right-0 px-4 py-1 m-4 z-10 text-left rounded-2xl bg-white/30 backdrop-blur-xl border border-white/10">
            <h2 className="text-sm font-black text-black/80 tracking-tight leading-tight">
              {user?.name?.split(' ')[0]} {user?.lastName}
            </h2>
            <p className="text-black/70 font-semibold text-[8px] uppercase tracking-wider mt-1">
              {userTitle}
            </p>
          </div>
        </motion.div>

        {/* PROGRESS CHART CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-[#EDE8DB] flex flex-col items-center justify-between"
        >
          <div className="text-center space-y-1 w-full">
             <h3 className="text-base font-bold text-[#1A1A1A]">Progreso</h3>
             <p className="text-xs text-[#9B9B9B] font-medium">Tu avance en la plataforma</p>
          </div>

          <div className="relative w-full aspect-square max-w-[160px] mx-auto">
             <ChartContainer
                config={chartConfig}
                className="w-full h-full"
              >
                <RadialBarChart
                  data={[
                    { category: "networking", value: Math.min((profile?.stats?.networking || 0) * 20, 100), fill: "var(--color-networking)" },
                    { category: "talleres", value: Math.min((profile?.stats?.workshops || 0) * 20, 100), fill: "var(--color-talleres)" },
                    { category: "webinars", value: Math.min((profile?.stats?.webinars || 0) * 10, 100), fill: "var(--color-webinars)" },
                    { category: "skills", value: (selectedSkills.length / 18) * 100, fill: "var(--color-skills)" },
                  ]}
                  innerRadius={20}
                  outerRadius={70}
                  barSize={6}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="category" />}
                  />
                  <PolarGrid gridType="circle" />
                  <RadialBar
                    dataKey="value"
                    background
                    cornerRadius={10}
                  />
                </RadialBarChart>
             </ChartContainer>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-1 mt-2">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7B9E6B]" />
                <span className="text-[8px] font-bold uppercase text-[#9B9B9B]">Skills ({selectedSkills.length})</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4C36A]" />
                <span className="text-[8px] font-bold uppercase text-[#9B9B9B]">Webinars ({profile?.stats?.webinars || 0})</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4826A]" />
                <span className="text-[8px] font-bold uppercase text-[#9B9B9B]">Talleres ({profile?.stats?.workshops || 0})</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8B9A6B]" />
                <span className="text-[8px] font-bold uppercase text-[#9B9B9B]">Networking ({profile?.stats?.networking || 0})</span>
             </div>
          </div>
          
          <div className="w-full pt-4 border-t border-[#EDE8DB] flex items-center justify-between mt-2">
             <div className="flex items-center gap-2 text-[#1A1A1A] font-black text-xl">
                <TrendingUp className="w-4 h-4 text-[#7B9E6B]" />
                <span>{profile?.progress || 10}%</span>
             </div>
             <span className="text-[9px] font-bold uppercase text-[#9B9B9B] tracking-wider">Avance total</span>
          </div>
        </motion.div>

        {/* TASKS CARD — Onboarding Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-[#EDE8DB] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-base font-bold text-[#1A1A1A]">Tareas de la Semana</h3>
             <span className="text-2xl font-black text-[#7B9E6B]">
               {weeklyTasks.length > 0 ? Math.round((weeklyTasks.filter(t => t.isCompleted).length / weeklyTasks.length) * 100) : 0}%
             </span>
           </div>

           {/* Progress bar */}
           <div className="h-2 w-full bg-[#EDE8DB] rounded-full overflow-hidden mb-6">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${weeklyTasks.length > 0 ? (weeklyTasks.filter(t => t.isCompleted).length / weeklyTasks.length) * 100 : 0}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full rounded-full bg-gradient-to-r from-[#7B9E6B] via-[#8B9A6B] to-[#D4C36A]"
             />
           </div>

           <div className="space-y-2 flex-1">
             {weeklyTasks.length > 0 ? weeklyTasks.map((task) => (
               <button 
                 key={task.id} 
                 onClick={() => toggleTask(task.id, task.isCompleted)}
                 disabled={togglingTask === task.id}
                 className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F5F0E8] transition-all group text-left"
               >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0",
                    task.isCompleted ? "bg-[#7B9E6B]/15 text-[#7B9E6B]" : "bg-[#EDE8DB] text-[#9B9B9B] group-hover:text-[#1A1A1A]"
                  )}>
                    {togglingTask === task.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className={cn("font-semibold text-sm truncate", task.isCompleted ? "text-[#9B9B9B] line-through" : "text-[#1A1A1A]")}>{task.title}</h4>
                     <span className="text-[9px] font-bold uppercase text-[#9B9B9B] tracking-wider">{task.category}</span>
                  </div>
                  {task.isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-[#7B9E6B] shrink-0" />
                  )}
               </button>
             )) : (
               <div className="flex items-center justify-center py-6 text-[#9B9B9B] text-sm">
                 <Loader2 className="w-4 h-4 animate-spin mr-2" /> Cargando tareas...
               </div>
             )}
           </div>
        </motion.div>
      </div>

      {/* Row 2: Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Días en la Red", value: "30", change: "+100%", color: "text-[#1A1A1A]" },
          { label: "Módulos Completados", value: String(selectedSkills.length), change: `+${selectedSkills.length} skills`, color: "text-[#1A1A1A]" },
          { label: "Eventos Asistidos", value: String((profile?.stats?.webinars || 0) + (profile?.stats?.workshops || 0)), change: "talleres + webinars", color: "text-[#1A1A1A]" },
          { label: "Nivel de Perfil", value: `${profile?.progress || 10}%`, change: "completado", color: "text-[#C4A962]" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            className={cn(
              "rounded-3xl p-6 shadow-sm border",
              i === 3 ? "bg-[#EDE8DB] border-[#D4C9A8]/30" : "bg-white border-[#EDE8DB]"
            )}
          >
            <h3 className={cn("text-3xl md:text-4xl font-black", stat.color)}>{stat.value}</h3>
            <p className="text-xs font-bold text-[#9B9B9B] uppercase tracking-wider mt-1">{stat.label}</p>
            <p className="text-[10px] text-[#7B9E6B] font-semibold mt-2">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 3: Featured Activities */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Próximas Actividades</h2>
           <Link href="/dashboard/profesional/eventos" className="text-[#7B9E6B] font-bold text-sm hover:underline flex items-center gap-1">
             Ver todas <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.length > 0 ? upcomingEvents.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-[#EDE8DB] space-y-4 cursor-pointer group transition-all hover:shadow-md"
              >
                 <div className="flex items-center justify-between">
                    <Badge className="rounded-lg text-[10px] font-bold uppercase bg-[#EDE8DB] text-[#6B6B6B] border-0">
                      {item.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#9B9B9B] uppercase bg-[#EDE8DB]/50 px-2 py-1 rounded-lg">
                       <Calendar className="w-3 h-3" />
                       {formatDate(item.date)}
                    </div>
                 </div>
                 
                 <div className="space-y-1.5">
                    <h3 className="font-black text-[#1A1A1A] leading-tight group-hover:text-[#7B9E6B] transition-colors">{item.title}</h3>
                    <p className="text-xs text-[#6B6B6B] font-medium flex items-center gap-1.5">
                       <Users className="w-3.5 h-3.5" />
                       {item.speaker || "Equipo Red"}
                    </p>
                 </div>

                 <div className="flex items-center justify-between pt-2 border-t border-[#EDE8DB]/50">
                    <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold">{item.startTime}h</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase text-[#7B9E6B] hover:text-[#7B9E6B] hover:bg-[#7B9E6B]/10 rounded-xl px-3 gap-1.5">
                       Inscribirme <ArrowRight className="w-3 h-3" />
                    </Button>
                 </div>
              </motion.div>
            )) : (
              [1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-[#EDE8DB] space-y-4 animate-pulse">
                   <div className="h-5 w-20 bg-gray-100 rounded-lg" />
                   <div className="space-y-2">
                      <div className="h-6 w-full bg-gray-100 rounded-lg" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
                   </div>
                   <div className="h-8 w-full bg-gray-100 rounded-lg mt-4" />
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}
