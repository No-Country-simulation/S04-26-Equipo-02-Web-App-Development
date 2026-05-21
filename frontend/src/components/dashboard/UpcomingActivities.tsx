import { motion } from 'framer-motion';
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  speaker: string;
}

interface UpcomingActivitiesProps {
  events: Event[];
  formatDate: (dateStr: string) => string;
}

export default function UpcomingActivities({ events, formatDate }: UpcomingActivitiesProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Próximas Actividades</h2>
        <Link to="/dashboard/events" className="text-[#7B9E6B] font-bold text-sm hover:underline flex items-center gap-1">
          Ver todas <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {events.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4 cursor-pointer group transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full text-[9px] font-bold uppercase bg-gray-100 text-gray-500 px-3 py-1">
                {item.type}
              </span>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(item.date)}
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <h3 className="font-black text-gray-900 leading-tight group-hover:text-[#7B9E6B] transition-colors">{item.title}</h3>
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                {item.speaker}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">{item.startTime} hs</span>
              </div>
              <button className="text-[10px] font-bold uppercase text-[#7B9E6B] hover:text-[#5E7A52] flex items-center gap-1">
                Inscribirme <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
