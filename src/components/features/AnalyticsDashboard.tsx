import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { useStore } from '../../lib/store';

const SALES_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 6390 },
  { name: 'Sun', revenue: 3490 },
];

const POPULAR_ITEMS = [
  { name: 'Wagyu Burger', value: 400 },
  { name: 'Truffle Pasta', value: 300 },
  { name: 'Caesar Salad', value: 300 },
  { name: 'Lobster', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard: React.FC = () => {
  const { kitchenOrders } = useStore();

  const totalRevenue = kitchenOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = kitchenOrders.length;
  // Mock active customers based on busy tables or orders
  const activeCustomers = Math.floor(totalOrders * 1.5) + 12; 
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-serif">Analytics Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { label: 'Total Revenue', val: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
            { label: 'Total Orders', val: totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-400' },
            { label: 'Active Customers', val: activeCustomers.toString(), icon: Users, color: 'text-purple-400' },
            { label: 'Avg Order Value', val: `$${avgOrderValue}`, icon: TrendingUp, color: 'text-yellow-400' },
        ].map((stat, i) => (
            <div key={i} className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                    <stat.icon size={100} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white mt-2 tracking-tight">{stat.val}</h3>
                    </div>
                    <div className={`p-3 rounded-full bg-white/5 border border-white/5 ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
              <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`}/>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="revenue" fill="#d94e28" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Items */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-4">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={POPULAR_ITEMS}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {POPULAR_ITEMS.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
