import { useState } from 'react'
import './App.css'

function App() {
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('http://localhost:5000/api/validate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unknown error')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Startup Idea Validator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value)}
          rows={3}
          placeholder="Describe your startup idea (1-3 sentences)"
          style={{ width: '100%', padding: 8 }}
          required
        />
        <button type="submit" disabled={loading || !idea.trim()} style={{ marginTop: 8 }}>
          {loading ? 'Validating...' : 'Submit'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 20, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 24 }}>
            {result.verdict === 'Promising' ? '✅' : result.verdict === 'Needs Work' ? '❌' : ''} {result.verdict}
          </div>
          {result.explanation && (
            <ul>
              {Array.isArray(result.explanation)
                ? result.explanation.map((ex, i) => <li key={i}>{ex}</li>)
                : <li>{result.explanation}</li>}
            </ul>
          )}
          {result.suggestion && (
            <div style={{ marginTop: 8 }}><b>Suggestion:</b> {result.suggestion}</div>
          )}
          {result.raw && (
            <pre style={{ marginTop: 8 }}>{result.raw}</pre>
          )}
        </div>
      )}
    </div>
  )
}

export default App
