import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCareer } from '../../context/CareerContext';

export interface StatusChartDatum {
  status: string;
  count: number;
}

export interface AnalyticsChartProps {
  data: StatusChartDatum[];
  height?: number;
}

const BAR_COLORS = ['#64748b', '#2563eb', '#4f46e5', '#d97706', '#16a34a', '#dc2626'];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, height = 260 }) => {
  const { isDark } = useCareer();

  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="status"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)' }}
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderRadius: '0.625rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" name="Applications" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
