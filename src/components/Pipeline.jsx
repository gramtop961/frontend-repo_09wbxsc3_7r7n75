import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const statuses = ['new','contacted','in_discussion','pending','confirmed','declined']

export default function Pipeline() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')

  const load = async () => {
    const url = `${API}/api/sponsors${filter ? `?status=${filter}`: ''}`
    const res = await fetch(url)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/sponsors/status`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sponsor_id: id, status }) })
    load()
  }

  const addNote = async (id) => {
    const note = prompt('Add a note:')
    if (!note) return
    await fetch(`${API}/api/sponsors/note`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sponsor_id: id, note }) })
    load()
  }

  const generateEmail = async (id) => {
    const res = await fetch(`${API}/api/outreach/email`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sponsor_id: id, tone: 'professional' }) })
    const data = await res.json()
    navigator.clipboard.writeText(`Subject: ${data.subject}\n\n${data.body}`)
    alert('Draft copied to clipboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sponsor Pipeline</h2>
          <p className="text-blue-200/80 text-sm">Track outreach, conversations and agreements</p>
        </div>
        <select className="input w-48" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(i => (
          <div key={i._id} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">{i.name}</p>
              <span className="text-xs text-blue-200/80">{i.industry}</span>
            </div>
            <p className="text-blue-100/90 text-sm">{i.location}</p>
            <p className="text-blue-100/90 text-xs">Status: {i.status}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {statuses.map(s => (
                <button key={s} onClick={() => updateStatus(i._id, s)} className={`px-2 py-1 rounded text-xs border ${i.status===s?'bg-blue-600 text-white border-blue-400':'text-blue-200 border-blue-500/30'}`}>{s.replace('_',' ')}</button>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={() => addNote(i._id)} className="btn-secondary flex-1">Add Note</button>
              <button onClick={() => generateEmail(i._id)} className="btn-primary flex-1">Email Draft</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
