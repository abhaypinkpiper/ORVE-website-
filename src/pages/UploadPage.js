import React, { useMemo, useState } from 'react';

function uploadWithProgress({ method, url, headers, body, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    Object.entries(headers || {}).forEach(([k, v]) => {
      if (v != null) xhr.setRequestHeader(k, String(v));
    });

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      if (typeof onProgress === 'function') onProgress(evt.loaded / evt.total);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };

    xhr.onerror = () => reject(new Error('Upload failed (network error)'));
    xhr.send(body);
  });
}

async function getPresignedUpload(file) {
  const res = await fetch('/api/s3/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Presign failed (${res.status}) ${text}`.trim());
  }

  const data = await res.json();
  return data;
}

function normalizePresignResponse(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid presign response');

  const url = data.uploadUrl || data.url;
  const fields = data.fields;
  const publicUrl = data.publicUrl || data.fileUrl || data.downloadUrl || null;
  const key = data.key || data.objectKey || null;

  if (!url) throw new Error('Presign response missing upload url');

  if (fields && typeof fields === 'object') {
    return { type: 'post', url, fields, publicUrl, key };
  }

  const method = String(data.method || 'PUT').toUpperCase();
  const headers = data.headers && typeof data.headers === 'object' ? data.headers : {};

  return { type: 'put', url, method, headers, publicUrl, key };
}

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const canUpload = useMemo(() => files.length > 0 && !busy, [files.length, busy]);

  const startUpload = async () => {
    setError(null);
    setBusy(true);
    setUploads(files.map((f) => ({ name: f.name, size: f.size, progress: 0, status: 'queued', publicUrl: null, key: null })));

    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        setUploads((prev) => prev.map((u, idx) => (idx === i ? { ...u, status: 'presigning', progress: 0 } : u)));

        const presignRaw = await getPresignedUpload(file);
        const presign = normalizePresignResponse(presignRaw);

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: 'uploading', progress: 0, key: presign.key || null, publicUrl: presign.publicUrl || null } : u
          )
        );

        if (presign.type === 'post') {
          const form = new FormData();
          Object.entries(presign.fields).forEach(([k, v]) => form.append(k, v));
          form.append('file', file);
          await uploadWithProgress({
            method: 'POST',
            url: presign.url,
            headers: {},
            body: form,
            onProgress: (p) => setUploads((prev) => prev.map((u, idx) => (idx === i ? { ...u, progress: p } : u))),
          });
        } else {
          const headers = { ...presign.headers };
          if (!('Content-Type' in headers) && !('content-type' in headers)) headers['Content-Type'] = file.type || 'application/octet-stream';
          await uploadWithProgress({
            method: presign.method,
            url: presign.url,
            headers,
            body: file,
            onProgress: (p) => setUploads((prev) => prev.map((u, idx) => (idx === i ? { ...u, progress: p } : u))),
          });
        }

        setUploads((prev) => prev.map((u, idx) => (idx === i ? { ...u, status: 'done', progress: 1 } : u)));
      }
    } catch (e) {
      setError(e?.message || 'Upload failed');
      setUploads((prev) => prev.map((u) => (u.status === 'done' ? u : { ...u, status: 'failed' })));
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      setError('Copy failed. Please copy manually.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', background: '#F5EFE0' }}>
      <div style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)', padding: '70px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Media</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          fontWeight: 200,
          letterSpacing: '8px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Upload Images</h1>
        <p style={{ color: '#B8A88A', fontSize: '0.85rem', letterSpacing: '2px', marginTop: '12px' }}>
          Upload directly to S3 using a presigned URL
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '70px 40px' }}>
        <div style={{ background: '#FFFDF7', padding: '40px', borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '18px' }}>
            Select Files
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(e) => {
              const list = Array.from(e.target.files || []);
              setFiles(list);
              setUploads([]);
              setError(null);
            }}
          />

          <div style={{ marginTop: '22px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-gold" disabled={!canUpload} onClick={startUpload} style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: canUpload ? 1 : 0.6 }}>
              {busy ? 'Uploading…' : 'Upload to S3'}
            </button>
            <button
              className="btn-outline"
              disabled={busy}
              onClick={() => {
                setFiles([]);
                setUploads([]);
                setError(null);
              }}
              style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: busy ? 0.6 : 1 }}
            >
              Clear
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '18px', color: '#A07830', fontSize: '0.85rem', letterSpacing: '1px' }}>
              {error}
            </div>
          )}
        </div>

        {uploads.length > 0 && (
          <div style={{ marginTop: '26px', background: '#FFFDF7', padding: '30px' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '18px' }}>
              Uploads
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {uploads.map((u, idx) => (
                <div key={`${u.name}-${idx}`} style={{ paddingBottom: '14px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <div style={{ color: '#2C1A0E', fontSize: '0.9rem', letterSpacing: '1px' }}>{u.name}</div>
                    <div style={{ color: '#6B5540', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{u.status}</div>
                  </div>
                  <div style={{ height: '6px', background: '#E2D5BE', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((u.progress || 0) * 100)}%`, background: 'linear-gradient(135deg, #C9A84C, #A07830)', transition: 'width 150ms linear' }} />
                  </div>

                  {u.publicUrl && (
                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                      <input className="input-luxury" readOnly value={u.publicUrl} />
                      <button className="btn-outline" onClick={() => copyToClipboard(u.publicUrl)} style={{ fontSize: '0.65rem', letterSpacing: '2px', padding: '10px 16px' }}>
                        Copy
                      </button>
                    </div>
                  )}

                  {(u.publicUrl || u.key) && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', letterSpacing: '1px', color: '#4A3020', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {u.publicUrl && (
                        <a href={u.publicUrl} target="_blank" rel="noreferrer" style={{ color: '#A07830', textDecoration: 'none' }}>
                          Open URL →
                        </a>
                      )}
                      {u.key && (
                        <span style={{ color: '#6B5540' }}>
                          Key: <span style={{ color: '#2C1A0E', fontWeight: 600 }}>{u.key}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
