import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
}

interface WeeklyTasksProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  tasksPercent: number;
}

export default function WeeklyTasks({ tasks, onToggle, tasksPercent }: WeeklyTasksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Tareas de la Semana</h3>
        <span className="text-2xl font-black text-brand-sage">
          {tasksPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${tasksPercent}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full bg-gradient-to-r from-brand-sage via-brand-olive to-brand-gold"
        />
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px]">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onToggle(task.id)}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-bg hover:shadow-sm transition-all duration-200 group text-left active:scale-[0.99]"
          >
            <div className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0',
              task.isCompleted ? 'bg-brand-sage/15 text-brand-sage' : 'bg-gray-100 text-gray-400 group-hover:text-gray-900'
            )}>
              {task.isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn('font-semibold text-sm truncate', task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800')}>{task.title}</h4>
              <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">{task.category}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
