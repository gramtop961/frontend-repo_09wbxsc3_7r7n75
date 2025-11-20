import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProposalBuilder() {
  const [form, setForm] = useState({
    title: '', description: '', date: '', location: '', audience_size: '', demographics: '',
    engagement_channels: ['email','social','on-site'], objectives: ['Brand awareness','Community impact'], industries_target: []
  })
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  const generate = async () => {
    setLoading(true)
    const payload = { ...form, audience_size: form.audience_size ? Number(form.audience_size) : null }
    const res = await fetch(`${API}/api/proposals/generate`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const data = await res.json()
    setProposal(data)
    setLoading(false)
  }

  const exportPdf = async () => {
    const payload = { ...form, audience_size: form.audience_size ? Number(form.audience_size) : null }
    const res = await fetch(`${API}/api/proposals/export/pdf`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proposal_${form.title || 'export'}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Proposal Builder</h2>
        <p className="text-blue-200/80 text-sm">Enter your event details and generate a tailored proposal with suggested tiers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input className="input" placeholder="Title" name="title" value={form.title} onChange={onChange} />
        <input className="input" placeholder="Date" name="date" value={form.date} onChange={onChange} />
        <input className="input" placeholder="Location" name="location" value={form.location} onChange={onChange} />
        <input className="input" placeholder="Audience size" name="audience_size" value={form.audience_size} onChange={onChange} />
        <input className="input" placeholder="Demographics" name="demographics" value={form.demographics} onChange={onChange} />
        <input className="input" placeholder="Industries (comma separated)" name="industries_target" value={form.industries_target} onChange={e => setForm(prev => ({...prev, industries_target: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))} />
        <textarea className="textarea md:col-span-2" placeholder="Description" name="description" value={form.description} onChange={onChange} />
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Proposal'}</button>
        <button onClick={exportPdf} className="btn-secondary">Export PDF</button>
      </div>

      {proposal && (
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-white text-xl font-semibold">{proposal.title}</h3>
          <p className="text-blue-100/90">{proposal.description}</p>
          <p className="text-blue-100/90 text-sm">Date: {proposal.date || 'TBD'} • Location: {proposal.location || 'TBD'}</p>
          <div>
            <p className="text-white font-medium">Audience</p>
            <p className="text-blue-100/90 text-sm">{proposal.audience_summary}</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Value Points</p>
            <ul className="list-disc list-inside text-blue-100/90 text-sm">
              {proposal.value_proposition.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Tiers</p>
            <div className="grid md:grid-cols-3 gap-3">
              {proposal.tiers.map((t, i) => (
                <div key={i} className="bg-slate-900/60 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-white font-semibold">{t.name} - ${'{'}t.price.toLocaleString(){'}'}</p>
                  <ul className="list-disc list-inside text-blue-100/90 text-sm">
                    {t.benefits.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
