import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SponsorFinder() {
  const [location, setLocation] = useState('')
  const [industries, setIndustries] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    const payload = { location, industries: industries.split(',').map(s=>s.trim()).filter(Boolean), limit: 12 }
    const res = await fetch(`${API}/api/sponsors/find`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  const save = async (s) => {
    await fetch(`${API}/api/sponsors/create`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(s) })
    alert('Saved to pipeline')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Local Sponsor Finder</h2>
        <p className="text-blue-200/80 text-sm">Enter a location and industries to discover relevant local businesses</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="City, State or postcode" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="input" placeholder="Industries (comma separated)" value={industries} onChange={e=>setIndustries(e.target.value)} />
        <button onClick={search} className="btn-primary" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((r, i) => (
          <div key={i} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">{r.name}</p>
              <span className="text-xs text-blue-200/80">{r.industry}</span>
            </div>
            <p className="text-blue-100/90 text-sm">{r.location}</p>
            <div className="text-blue-100/90 text-sm space-y-1">
              {r.email && <p>Email: {r.email}</p>}
              {r.phone && <p>Phone: {r.phone}</p>}
              {r.website && <a href={r.website} target="_blank" className="text-blue-300 underline">Website</a>}
            </div>
            <button onClick={() => save(r)} className="btn-secondary w-full">Add to Pipeline</button>
          </div>
        ))}
      </div>
    </div>
  )
}
