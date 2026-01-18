
import React, { useState } from 'react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import PreviewSimulator from './components/PreviewSimulator';
import NetworkSimulator from './components/NetworkSimulator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus(AnalysisStatus.LOADING);
    setError(null);

    try {
      const data = await analyzeContent(url);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please check the URL and try again.');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const chartData = result ? [
    { name: 'Engagement', value: result.engagementScore },
    { name: 'Hook Strength', value: result.hookStrength }
  ] : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none">Mobile Farming</h1>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">By Mr Salman</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Analyzer</span>
            <span className="hover:text-white cursor-pointer transition-colors">Content Strategy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ethical Growth</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Harvest Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Digital Reach</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Professional engagement analysis for modern creators. Built by Mr Salman to provide ethical marketing advice for YouTube & Facebook growth.
          </p>
        </div>

        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <form onSubmit={handleAnalyze} className="relative flex flex-col sm:flex-row gap-3 bg-slate-900 p-2 rounded-2xl shadow-2xl">
            <input
              type="text"
              placeholder="Enter YouTube or Facebook content URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder-slate-500"
            />
            <button
              disabled={status === AnalysisStatus.LOADING}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {status === AnalysisStatus.LOADING ? 'Cultivating Data...' : 'Start Analysis'}
            </button>
          </form>
          {error && <p className="mt-2 text-red-400 text-sm text-center">{error}</p>}
        </div>

        {status === AnalysisStatus.SUCCESS && result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Platform</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${result.platform === 'YouTube' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <h3 className="text-2xl font-bold text-white">{result.platform}</h3>
                </div>
                <p className="text-slate-400 text-sm mt-4 line-clamp-2">{result.title}</p>
                <p className="text-emerald-400 text-xs mt-1">By {result.creator}</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Growth Metrics</h4>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#14b8a6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Network Propagation Simulation (Conceptual 200 nodes) */}
            <NetworkSimulator hookStrength={result.hookStrength} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Cultivation Strategy</h3>
                <ul className="space-y-4">
                  {result.improvementSuggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <p className="text-slate-300 leading-relaxed">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-600/10 p-6 rounded-2xl border border-emerald-500/20">
                  <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3">Ethical Policy Framework</h4>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p><strong>Note on Distribution:</strong> This system simulates organic reach across diverse mobile devices. We never facilitate non-organic view inflation.</p>
                    <p>{result.marketingStrategy.ethicalConsiderations}</p>
                  </div>
                </div>
              </div>
            </div>

            <PreviewSimulator previews={result.previewSimulation} />
          </div>
        )}

        {status === AnalysisStatus.IDLE && (
          <div className="mt-20 flex flex-col items-center opacity-50 text-center">
             <div className="w-64 h-64 relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-32 h-32 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
             </div>
             <p className="text-slate-500 font-medium">Mobile Farming by Mr Salman: Ready for analysis.</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-tighter text-slate-500 font-bold">
          <div>© 2025 Mobile Farming • Mr Salman</div>
          <div className="flex gap-4">
            <span className="text-emerald-500/70">SAFE GROWTH VERIFIED</span>
            <span>POLICY ADHERENCE: 100%</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
