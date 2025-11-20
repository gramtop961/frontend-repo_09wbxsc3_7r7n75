import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [counts, setCounts] = useState(null)
  const [followups, setFollowups] = useState([])

  const load = async () => {
    const res = await fetch(`${API}/api/dashboard`)
    const data = await res.json()
    setCounts(data.counts)
    setFollowups(data.upcoming_followups || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Overview</h2>
        <p className="text-blue-200/80 text-sm">Proposal progress, pipeline and upcoming follow-ups</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {counts && Object.entries(counts).map(([k,v]) => (
          <div key={k} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-300 text-sm capitalize">{k.replace('_',' ')}</p>
            <p className="text-3xl font-bold text-white">{v}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Upcoming follow-ups</h3>
        <div className="space-y-2">
          {followups.length === 0 && (
            <p className="text-blue-200/70 text-sm">No follow-ups scheduled.</p>
          )}
          {followups.map(f => (
            <div key={f._id} className="flex items-center justify-between text-sm text-blue-100/90">
              <span>{f.note || 'Follow up'}</span>
              <span>{f.due_date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
