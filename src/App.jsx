import Dashboard from './components/Dashboard'
import ProposalBuilder from './components/ProposalBuilder'
import SponsorFinder from './components/SponsorFinder'
import Pipeline from './components/Pipeline'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Sponsorship Manager</h1>
            <p className="text-blue-200/80">Build proposals, find local sponsors, and track your pipeline</p>
          </div>
        </header>

        <main className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <ProposalBuilder />
            <SponsorFinder />
          </section>
          <aside className="space-y-6">
            <Dashboard />
            <Pipeline />
          </aside>
        </main>
      </div>

      {/* Simple utility styles */}
      <style>{`
        .input { @apply bg-slate-900/60 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40; }
        .textarea { @apply bg-slate-900/60 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[100px]; }
        .btn-primary { @apply bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition; }
        .btn-secondary { @apply bg-slate-700 hover:bg-slate-600 text-blue-50 font-medium px-4 py-2 rounded-lg transition border border-blue-500/20; }
      `}</style>
    </div>
  )
}

export default App
