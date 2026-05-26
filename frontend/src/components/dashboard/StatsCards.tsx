import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string;
  change: string;
  color: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          className={cn(
            'rounded-3xl p-6 shadow-sm border',
            i === 3 ? 'bg-brand-card border-brand-accent/30' : 'bg-white border-gray-100'
          )}
        >
          <h3 className={cn('text-3xl font-black', stat.color)}>{stat.value}</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
          <p className="text-[10px] text-brand-sage font-bold mt-2 uppercase tracking-wide">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}
