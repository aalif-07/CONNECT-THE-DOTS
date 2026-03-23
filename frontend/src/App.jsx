import { useState, useEffect, useRef } from "react";

const API = "";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #181818;
    --border: #252525;
    --border2: #333;
    --accent: #e8ff3c;
    --accent-dim: rgba(232,255,60,0.08);
    --accent-dim2: rgba(232,255,60,0.15);
    --text: #e8e8e0;
    --text-dim: #666;
    --text-mid: #999;
    --success: #3cff8a;
    --error: #ff5c5c;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* Header */
  .header {
    border-bottom: 1px solid var(--border);
    padding: 28px 0 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  .header-left { display: flex; flex-direction: column; gap: 4px; }

  .header-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  .header-title {
    font-family: var(--mono);
    font-size: 22px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: -0.02em;
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-dim);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 5px 12px;
    white-space: nowrap;
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--text-dim);
    transition: background 0.3s;
  }
  .status-dot.ok { background: var(--success); box-shadow: 0 0 6px var(--success); }
  .status-dot.err { background: var(--error); }

  /* Nav tabs */
  .tabs {
    display: flex;
    gap: 2px;
    margin: 32px 0 0;
    border-bottom: 1px solid var(--border);
  }

  .tab {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    padding: 10px 18px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-dim);
    cursor: pointer;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
  }

  .tab:hover { color: var(--text-mid); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* Panels */
  .panel { padding: 32px 0; }

  /* Section label */
  .section-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  /* Form */
  .form-grid { display: flex; flex-direction: column; gap: 14px; }

  .field { display: flex; flex-direction: column; gap: 6px; }

  .field label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.08em;
  }

  .field input,
  .field textarea {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
    width: 100%;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: var(--accent);
    background: var(--surface2);
  }

  .field textarea { resize: vertical; min-height: 72px; }

  /* Buttons */
  .btn {
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--accent);
    color: #0a0a0a;
  }
  .btn-primary:hover { filter: brightness(1.08); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-ghost {
    background: var(--surface2);
    color: var(--text-mid);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { color: var(--text); border-color: #555; }

  .btn-row { display: flex; gap: 10px; align-items: center; margin-top: 4px; }

  /* Toast */
  .toast-wrap {
    position: fixed;
    bottom: 28px; right: 28px;
    display: flex; flex-direction: column; gap: 10px;
    z-index: 999;
  }

  .toast {
    font-family: var(--mono);
    font-size: 12px;
    padding: 10px 16px;
    border-radius: 4px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    color: var(--text);
    animation: slideIn 0.2s ease;
    max-width: 320px;
  }
  .toast.ok { border-color: var(--success); color: var(--success); }
  .toast.err { border-color: var(--error); color: var(--error); }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Metadata list */
  .meta-list { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }

  .meta-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 12px;
    transition: border-color 0.15s;
  }
  .meta-card:hover { border-color: var(--border2); }

  .meta-title {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  .meta-desc {
    font-family: var(--sans);
    font-size: 13px;
    color: var(--text-mid);
    grid-column: 1;
    line-height: 1.5;
    margin-top: 3px;
  }

  .meta-path {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--accent);
    opacity: 0.7;
    grid-column: 1;
    margin-top: 8px;
  }

  .meta-idx {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-dim);
    grid-row: 1;
    grid-column: 2;
    align-self: start;
  }

  .empty-state {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-dim);
    padding: 32px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    text-align: center;
    margin-top: 24px;
  }

  /* File upload */
  .dropzone {
    border: 1px dashed var(--border2);
    border-radius: 6px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--surface);
  }
  .dropzone:hover, .dropzone.drag { border-color: var(--accent); background: var(--accent-dim); }

  .dropzone-icon {
    font-size: 28px;
    margin-bottom: 10px;
    opacity: 0.5;
  }

  .dropzone-text {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.6;
  }

  .dropzone-text span { color: var(--accent); }

  .file-selected {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text);
    background: var(--accent-dim2);
    border: 1px solid rgba(232,255,60,0.25);
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 28px 0;
  }

  .retrieve-row { display: flex; gap: 10px; align-items: flex-end; }
  .retrieve-row .field { flex: 1; }

  .file-result {
    margin-top: 16px;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 6px;
    overflow: hidden;
  }

  .file-result img { display: block; max-width: 100%; max-height: 320px; object-fit: contain; margin: 0 auto; }

  .file-result-link {
    font-family: var(--mono);
    font-size: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--accent);
    text-decoration: none;
  }
  .file-result-link:hover { text-decoration: underline; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

let toastId = 0;

export default function App() {
  const [tab, setTab] = useState("metadata");
  const [health, setHealth] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then(r => r.json())
      .then(d => setHealth(d.status === "ok" ? "ok" : "err"))
      .catch(() => setHealth("err"));
  }, []);

  const toast = (msg, type = "ok") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <span className="header-label">Infrastructure Challenge</span>
            <span className="header-title">connect_the_dots</span>
          </div>
          <div className="status-pill">
            <span className={`status-dot ${health || ""}`} />
            {health === "ok" ? "system online" : health === "err" ? "unreachable" : "checking…"}
          </div>
        </header>

        <nav className="tabs">
          {["metadata", "files"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "metadata" ? "01 / metadata" : "02 / file storage"}
            </button>
          ))}
        </nav>

        {tab === "metadata" && <MetadataPanel toast={toast} />}
        {tab === "files" && <FilesPanel toast={toast} />}
      </div>

      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}

function MetadataPanel({ toast }) {
  const [form, setForm] = useState({ title: "", description: "", filePath: "" });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const load = () => {
    setFetching(true);
    fetch(`${API}/api/metadata`)
      .then(r => r.json())
      .then(d => setRecords(d))
      .catch(() => toast("Failed to fetch metadata", "err"))
      .finally(() => setFetching(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title.trim()) return toast("Title is required", "err");
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      toast("Metadata stored");
      setForm({ title: "", description: "", filePath: "" });
      load();
    } catch {
      toast("Failed to store metadata", "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <p className="section-label">Store metadata</p>
      <div className="form-grid">
        <div className="field">
          <label>title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Project Alpha" />
        </div>
        <div className="field">
          <label>description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description…" />
        </div>
        <div className="field">
          <label>filePath</label>
          <input value={form.filePath} onChange={e => setForm(f => ({ ...f, filePath: e.target.value }))} placeholder="/storage/uploads/filename.pdf" />
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : "POST /api/metadata"}
          </button>
          <button className="btn btn-ghost" onClick={load}>
            {fetching ? <span className="spinner" /> : "GET /api/metadata"}
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">no records yet — submit your first entry above</div>
      ) : (
        <div className="meta-list">
          {records.map((r, i) => (
            <div key={r._id || i} className="meta-card">
              <span className="meta-idx">#{String(i + 1).padStart(2, "0")}</span>
              <span className="meta-title">{r.title}</span>
              {r.description && <span className="meta-desc">{r.description}</span>}
              {r.filePath && <span className="meta-path">{r.filePath}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilesPanel({ toast }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [retrieveName, setRetrieveName] = useState("");
  const [retrieving, setRetrieving] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const onDrop = e => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`${API}/api/upload-file`, { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error();
      toast(`Uploaded → ${d.filePath}`);
      setRetrieveName(file.name);
      setFile(null);
    } catch {
      toast("Upload failed", "err");
    } finally {
      setUploading(false);
    }
  };

  const retrieve = async () => {
    if (!retrieveName.trim()) return toast("Enter a filename", "err");
    setRetrieving(true);
    setResult(null);
    try {
      const r = await fetch(`${API}/api/get-file?name=${encodeURIComponent(retrieveName)}`);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, type: blob.type, name: retrieveName });
      toast("File retrieved");
    } catch {
      toast("File not found", "err");
    } finally {
      setRetrieving(false);
    }
  };

  return (
    <div className="panel">
      <p className="section-label">Upload file</p>

      <div
        className={`dropzone ${drag ? "drag" : ""}`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <div className="dropzone-icon">⌃</div>
        <div className="dropzone-text">
          drop file here or <span>click to browse</span>
        </div>
        <input ref={inputRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
      </div>

      {file && (
        <div className="file-selected">
          <span>▸</span>
          <span>{file.name}</span>
          <span style={{ color: "var(--text-dim)", marginLeft: "auto" }}>{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" onClick={upload} disabled={!file || uploading}>
          {uploading ? <span className="spinner" /> : "POST /api/upload-file"}
        </button>
        {file && (
          <button className="btn btn-ghost" onClick={() => setFile(null)}>clear</button>
        )}
      </div>

      <hr className="divider" />

      <p className="section-label">Retrieve file</p>
      <div className="retrieve-row">
        <div className="field">
          <label>filename</label>
          <input value={retrieveName} onChange={e => setRetrieveName(e.target.value)} placeholder="e.g. report.pdf" onKeyDown={e => e.key === "Enter" && retrieve()} />
        </div>
        <button className="btn btn-primary" onClick={retrieve} disabled={retrieving}>
          {retrieving ? <span className="spinner" /> : "GET /api/get-file"}
        </button>
      </div>

      {result && (
        <div className="file-result">
          {result.type.startsWith("image/") ? (
            <img src={result.url} alt={result.name} />
          ) : (
            <a className="file-result-link" href={result.url} download={result.name} target="_blank" rel="noreferrer">
              ↓ {result.name}
            </a>
          )}
        </div>
      )}
    </div>
  );
}