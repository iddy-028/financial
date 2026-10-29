import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('monthly');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => { fetchReports(); }, [month, year]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [monthlyRes, yearlyRes] = await Promise.all([
        api.get(`/reports/monthly?month=${month}&year=${year}`),
        api.get(`/reports/yearly?year=${year}`)
      ]);
      setMonthlyData(monthlyRes.data);
      setYearlyData(yearlyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];

  const buildDailyTrend = () => {
    if (!monthlyData?.dailyTrend) return [];
    const days = {};
    monthlyData.dailyTrend.forEach(d => {
      if (!days[d.day]) days[d.day] = { day: d.day, income: 0, expense: 0 };
      days[d.day][d.type] = parseFloat(d.total);
    });
    return Object.values(days).sort((a, b) => a.day - b.day);
  };

  const buildMonthlyTrend = () => {
    if (!yearlyData?.monthlyTrend) return [];
    const m = {};
    yearlyData.monthlyTrend.forEach(d => {
      if (!m[d.month]) m[d.month] = { month: months[d.month], income: 0, expense: 0 };
      m[d.month][d.type] = parseFloat(d.total);
    });
    for (let i = 1; i <= 12; i++) {
      if (!m[i]) m[i] = { month: months[i], income: 0, expense: 0 };
    }
    return Object.values(m).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed insights into your financial patterns</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {months.slice(1).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['monthly', 'yearly'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} Report
          </button>
        ))}
      </div>

      {tab === 'monthly' && monthlyData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Income</p>
              <p className="text-3xl font-bold text-emerald-600">RWF ${monthlyData.summary.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Expenses</p>
              <p className="text-3xl font-bold text-rose-600">RWF ${monthlyData.summary.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Net Savings</p>
              <p className={`text-3xl font-bold ${monthlyData.summary.balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>${monthlyData.summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
              {monthlyData.categoryBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={monthlyData.categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="total" nameKey="name">
                        {monthlyData.categoryBreakdown.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color || COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `$${parseFloat(v).toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {monthlyData.categoryBreakdown.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || COLORS[i % COLORS.length] }}></div>
                          <span className="text-slate-600 dark:text-slate-400">{cat.name}</span>
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">${parseFloat(cat.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-slate-400 dark:text-slate-500">No expense data</div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Daily Trend</h3>
              {buildDailyTrend().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={buildDailyTrend()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#4b5563" />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#4b5563" />
                    <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                    <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-slate-400 dark:text-slate-500">No data for this period</div>
              )}
            </div>
          </div>

          {monthlyData.budgets.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Budget vs Actual</h3>
              <div className="space-y-4">
                {monthlyData.budgets.map((b, i) => {
                  const pct = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{b.category_name || 'Overall'}</span>
                        <span className="text-slate-500 dark:text-slate-400">${parseFloat(b.spent).toFixed(2)} / ${parseFloat(b.amount).toFixed(2)}</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full ${pct > 100 ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'yearly' && yearlyData && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Monthly Trend for {year}</h3>
          {buildMonthlyTrend().some(d => d.income > 0 || d.expense > 0) ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={buildMonthlyTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#4b5563" />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#4b5563" />
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-slate-400 dark:text-slate-500">No data for this year</div>
          )}
        </div>
      )}
    </div>
  );
}
