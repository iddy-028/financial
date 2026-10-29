import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard?month=${month}&year=${year}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) return <p className="text-slate-500 dark:text-slate-400">Failed to load data.</p>;

  const { summary, categoryBreakdown, budget, recentTransactions } = data;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];

  const budgetPercent = budget.total_budget > 0
    ? Math.min(Math.round((budget.total_spent / budget.total_budget) * 100), 100)
    : 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your spending summary for {months[month - 1]} {year}</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Income', value: summary.income, color: 'emerald', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
          { label: 'Total Expenses', value: summary.expense, color: 'rose', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Balance', value: summary.balance, color: summary.balance >= 0 ? 'indigo' : 'rose', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
          { label: 'Budget Used', value: `${budgetPercent}%`, color: budgetPercent > 90 ? 'rose' : budgetPercent > 70 ? 'amber' : 'emerald', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
              <div className={`w-10 h-10 bg-${card.color}-50 dark:bg-${card.color}-900/30 rounded-xl flex items-center justify-center`}>
                <svg className={`w-5 h-5 text-${card.color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold text-${card.color}-600`}>
              {typeof card.value === 'number' ? `RWF ${card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Budget Overview</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500 dark:text-slate-400">Spent: <span className="font-semibold text-slate-700 dark:text-slate-300">${budget.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
              <span className="text-slate-500 dark:text-slate-400">Budget: <span className="font-semibold text-slate-700 dark:text-slate-300">${budget.total_budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${budgetPercent > 90 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : budgetPercent > 70 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {budget.remaining >= 0
              ? <>You have <span className="font-semibold text-emerald-600">${budget.remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> remaining</>
              : <>You are <span className="font-semibold text-rose-600">${Math.abs(budget.remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> over budget</>
            }
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Expense by Category</h3>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="name"
                >
                  {categoryBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color || COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400 dark:text-slate-500">No expense data yet</div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {categoryBreakdown.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || COLORS[i % COLORS.length] }}></div>
                <span className="text-slate-600 dark:text-slate-400">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 text-sm text-slate-700 dark:text-slate-300 font-medium">{tx.description || 'No description'}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tx.category_color ? `${tx.category_color}15` : '#f1f5f9', color: tx.category_color || '#64748b' }}>
                        {tx.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                    <td className={`py-3 text-sm font-semibold text-right ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 dark:text-slate-500 text-center py-8">No transactions yet. Start by adding one!</p>
        )}
      </div>
    </div>
  );
}
