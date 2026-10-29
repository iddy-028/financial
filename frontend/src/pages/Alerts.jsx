import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();

    // Set up intervals for periodic updates
    const alertInterval = setInterval(fetchAlerts, 30000);
    const budgetCheckInterval = setInterval(() => {
      api.post('/alerts/check-budgets').catch(() => {
        // Silent fail for budget checks
      });
    }, 300000); // Check budgets every 5 minutes

    return () => {
      clearInterval(alertInterval);
      clearInterval(budgetCheckInterval);
    };
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'read' } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/alerts/read-all');
      setAlerts(alerts.map(a => ({ ...a, status: 'read' })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckBudgets = async () => {
    try {
      await api.post('/alerts/check-budgets');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = alerts.filter(a => a.status === 'unread').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts & Notifications</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCheckBudgets}
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            Check Budgets
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border shadow-sm transition-all ${
                alert.status === 'unread'
                  ? 'border-indigo-200 dark:border-indigo-800 shadow-indigo-100 dark:shadow-indigo-900/20'
                  : 'border-slate-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.status === 'unread'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                    : 'bg-slate-50 dark:bg-slate-700'
                }`}>
                  {alert.message.toLowerCase().includes('exceeded') ? (
                    <svg className={`w-5 h-5 ${alert.status === 'unread' ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : alert.message.toLowerCase().includes('approaching') ? (
                    <svg className={`w-5 h-5 ${alert.status === 'unread' ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className={`w-5 h-5 ${alert.status === 'unread' ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${alert.status === 'unread' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      title="Mark as read"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {alert.status === 'unread' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <p className="text-lg font-medium">No alerts</p>
          <p className="text-sm mt-1">You'll receive alerts when you approach budget limits</p>
        </div>
      )}
    </div>
  );
}
