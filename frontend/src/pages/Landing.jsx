import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const features = [
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Track Expenses', desc: 'Log every transaction with categories, dates, and descriptions. Stay on top of where your money goes.' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Smart Budgets', desc: 'Set monthly budgets by category. Get alerts when you are approaching your limits.' },
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Visual Reports', desc: 'Beautiful charts and analytics that help you understand your spending patterns at a glance.' },
    { icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', title: 'Categories', desc: 'Organize transactions with custom categories. Color-coded for easy visual identification.' },
    { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Trend Analysis', desc: 'Track daily and monthly trends. See if your spending is increasing or decreasing over time.' },
    { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Secure & Private', desc: 'Your data is yours. JWT authentication ensures only you can access your financial information.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SpendWise</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {user ? (
              <Link to="/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all duration-300">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all duration-300">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-full text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free forever. No credit card required.
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              Take Control of Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Finances</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track expenses, set budgets, and gain powerful insights into your spending habits. The simple way to build better financial discipline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 hover:-translate-y-0.5 transition-all duration-300">
                Start Tracking Free
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-2xl hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                Sign In
              </Link>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Total Income</p>
                  <p className="text-3xl font-bold text-emerald-400">$4,250</p>
                  <div className="mt-3 h-1 bg-slate-700 rounded-full"><div className="h-1 bg-emerald-400 rounded-full w-3/4"></div></div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-rose-400">$2,180</p>
                  <div className="mt-3 h-1 bg-slate-700 rounded-full"><div className="h-1 bg-rose-400 rounded-full w-1/2"></div></div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Balance</p>
                  <p className="text-3xl font-bold text-indigo-400">$2,070</p>
                  <div className="mt-3 h-1 bg-slate-700 rounded-full"><div className="h-1 bg-indigo-400 rounded-full w-2/3"></div></div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-4">Budget Progress</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Food</span><span className="text-slate-400">$180 / $300</span></div>
                      <div className="h-2 bg-slate-700 rounded-full"><div className="h-2 bg-amber-400 rounded-full" style={{width:'60%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Transport</span><span className="text-slate-400">$95 / $100</span></div>
                      <div className="h-2 bg-slate-700 rounded-full"><div className="h-2 bg-rose-400 rounded-full" style={{width:'95%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">Entertainment</span><span className="text-slate-400">$45 / $150</span></div>
                      <div className="h-2 bg-slate-700 rounded-full"><div className="h-2 bg-emerald-400 rounded-full" style={{width:'30%'}}></div></div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-4">Recent Transactions</p>
                  <div className="space-y-3">
                    {[
                      { name: 'Grocery Store', amount: '-$45.00', color: 'rose' },
                      { name: 'Salary', amount: '+$2,500', color: 'emerald' },
                      { name: 'Coffee Shop', amount: '-$5.50', color: 'rose' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                        <span className="text-slate-300 text-sm">{t.name}</span>
                        <span className={`text-${t.color}-400 font-medium text-sm`}>{t.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need to Manage Money</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Powerful features wrapped in a beautiful, intuitive interface.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-12 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to take control?</h2>
              <p className="text-xl text-white/80 mb-8">Join thousands of users who have transformed their financial habits.</p>
              <Link to="/register" className="inline-block px-8 py-4 bg-white text-indigo-600 text-lg font-bold rounded-2xl hover:shadow-xl transition-all duration-300">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">SpendWise</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">&copy; 2026 SpendWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
