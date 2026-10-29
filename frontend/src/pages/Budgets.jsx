import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [overall, setOverall] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoryId: '', amount: '' });
  const [error, setError] = useState('');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetRes, overallRes, catRes] = await Promise.all([
        api.get(`/budgets?month=${month}&year=${year}`),
        api.get(`/budgets/overall?month=${month}&year=${year}`),
        api.get('/categories')
      ]);
      setBudgets(budgetRes.data);
      setOverall(overallRes.data);
      setCategories(catRes.data.filter(c => c.type === 'expense'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ categoryId: '', amount: '' });
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budgets', { ...form, month, year });
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Set and monitor your spending limits</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {months.slice(1).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Set Budget
          </button>
        </div>
      </div>

      {overall && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Overall Budget for {months[month]} {year}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${overall.total_budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-rose-600">${overall.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${overall.percentage > 90 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : overall.percentage > 70 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
              style={{ width: `${Math.min(overall.percentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className={`font-medium ${overall.percentage > 100 ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400'}`}>
              {overall.percentage}% used
            </span>
            <span className={overall.remaining >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
              {overall.remaining >= 0 ? `$${overall.remaining.toFixed(2)} remaining` : `$${Math.abs(overall.remaining).toFixed(2)} over budget`}
            </span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Set Budget for {months[month]} {year}</h3>
            {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category (optional)</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Overall Budget</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = b.amount > 0 ? Math.min(Math.round((b.spent / b.amount) * 100), 100) : 0;
            const over = b.spent > b.amount;
            return (
              <div key={b.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: b.category_color ? `${b.category_color}15` : '#f1f5f9' }}>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: b.category_color || '#94a3b8' }}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">{b.category_name || 'Overall'}</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{months[b.month]} {b.year}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">${parseFloat(b.spent).toFixed(2)}</span>
                    <span className="text-slate-400 dark:text-slate-500">${parseFloat(b.amount).toFixed(2)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${over ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`text-xs font-medium ${over ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400'}`}>
                  {over ? `$${(b.spent - b.amount).toFixed(2)} over budget` : `${pct}% used`}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-lg font-medium">No budgets set</p>
          <p className="text-sm mt-1">Set budgets to track your spending limits</p>
        </div>
      )}
    </div>
  );
}
