import { TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarGrid } from 'recharts';
import { motion } from 'framer-motion';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';

const chartConfig = {
  value: {
    label: 'Progreso',
  },
  skills: {
    label: 'Habilidades',
    color: '#7B9E6B',
  },
  webinars: {
    label: 'Webinars',
    color: '#D4C36A',
  },
  talleres: {
    label: 'Talleres',
    color: '#D4826A',
  },
  networking: {
    label: 'Networking',
    color: '#8B9A6B',
  },
} satisfies ChartConfig;

interface ProgressChartProps {
  skillsLength: number;
  profilePercent: number;
}

export default function ProgressChart({ skillsLength, profilePercent }: ProgressChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-between"
    >
      <div className="text-center space-y-1 w-full">
        <h3 className="text-base font-bold text-gray-900">Progreso</h3>
        <p className="text-xs text-gray-400 font-medium">Tus actividades en la plataforma</p>
      </div>

      <div className="relative w-full aspect-square max-w-[150px] mx-auto flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-full h-full"
        >
          <RadialBarChart
            data={[
              { category: 'networking', value: 60, fill: 'var(--color-networking)' },
              { category: 'talleres', value: 40, fill: 'var(--color-talleres)' },
              { category: 'webinars', value: 80, fill: 'var(--color-webinars)' },
              { category: 'skills', value: Math.min((skillsLength / 5) * 100, 100) || 20, fill: 'var(--color-skills)' },
            ]}
            innerRadius={15}
            outerRadius={65}
            barSize={5}
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

      <div className="w-full grid grid-cols-2 gap-1.5 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7B9E6B]" />
          <span className="text-[8px] font-bold uppercase text-gray-400">Habilidades ({skillsLength})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C36A]" />
          <span className="text-[8px] font-bold uppercase text-gray-400">Webinars (4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4826A]" />
          <span className="text-[8px] font-bold uppercase text-gray-400">Talleres (2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B9A6B]" />
          <span className="text-[8px] font-bold uppercase text-gray-400">Networking (3)</span>
        </div>
      </div>

      <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5 text-gray-900 font-black text-xl">
          <TrendingUp className="w-4 h-4 text-[#7B9E6B]" />
          <span>{profilePercent}%</span>
        </div>
        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Perfil Completo</span>
      </div>
    </motion.div>
  );
}
