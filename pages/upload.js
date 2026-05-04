import React, { useMemo, useState } from "react";
import axios from "axios";

async function uploadWithProgress({ url, body, headers, onProgress }) {
  const res = await axios.put(url, body, {
    headers,
    onUploadProgress: (evt) => {
      const total = evt?.total;
      const loaded = evt?.loaded;
      if (!total || !loaded) return;
      if (typeof onProgress === "function") onProgress(loaded / total);
    },
  });
  return res.data;
}

async function getPresignedUpload(file) {
  try {
    const res = await axios.post("/api/s3/presign", {
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    const raw = err?.response?.data;
    const text = typeof raw === "string" ? raw : raw ? JSON.stringify(raw) : "";
    throw new Error(`Presign failed (${status ?? "unknown"}) ${text}`.trim());
  }
}
const status = {
  queued: "queued",
  presigning: "presigning",
  uploading: "uploading",
  success: "success",
  error: "error",
};
export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const canUpload = useMemo(
    () => files.length > 0 && !busy,
    [files.length, busy],
  );

  const startUpload = async () => {
    setError(null);
    setBusy(true);
    setUploads(
      files.map((f) => ({
        name: f.name,
        size: f.size,
        progress: 0,
        status: status.queued,
        publicUrl: "",
        key: "",
      })),
    );

    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: status.presigning, progress: 0 } : u,
          ),
        );

        const presign = await getPresignedUpload(file);
        const uploadUrl = presign?.uploadUrl;
        const headers =
          presign?.headers && typeof presign.headers === "object"
            ? presign.headers
            : {};
        const key = String(presign?.key || "");

        if (!uploadUrl) throw new Error("Presign response missing uploadUrl");

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i
              ? {
                  ...u,
                  status: status.uploading,
                  progress: 0,
                  key,
                  publicUrl: presign?.publicUrl || "",
                }
              : u,
          ),
        );

        const uploadHeaders = { ...headers };
        if (
          !("Content-Type" in uploadHeaders) &&
          !("content-type" in uploadHeaders)
        )
          uploadHeaders["Content-Type"] =
            file.type || "application/octet-stream";

        const res = await uploadWithProgress({
          url: uploadUrl,
          body: file,
          headers: uploadHeaders,
          onProgress: (p) =>
            setUploads((prev) =>
              prev.map((u, idx) => (idx === i ? { ...u, progress: p } : u)),
            ),
        });
        console.log(res.data);

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: status.success, progress: 1 } : u,
          ),
        );
      }
    } catch (e) {
      setError(e?.message || "Upload failed");
      setUploads((prev) =>
        prev.map((u) =>
          u.status === status.success ? u : { ...u, status: status.error },
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      setError("Copy failed. Please copy manually.");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", paddingTop: "90px", background: "#F5EFE0" }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)",
          padding: "70px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "6px",
            color: "#C9A84C",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Media
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 200,
            letterSpacing: "8px",
            background:
              "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Upload Media
        </h1>
        <p
          style={{
            color: "#B8A88A",
            fontSize: "0.85rem",
            letterSpacing: "2px",
            marginTop: "12px",
          }}
        >
          Upload images or videos directly to S3 using a presigned URL
        </p>
      </div>

      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "70px 40px" }}
      >
        <div
          style={{
            background: "#FFFDF7",
            padding: "40px",
            borderTop: "3px solid",
            borderImage: "linear-gradient(135deg, #C9A84C, #A07830) 1",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "3px",
              color: "#C9A84C",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Select Files
          </p>

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            disabled={busy}
            onChange={(e) => {
              const list = Array.from(e.target.files || []);
              setFiles(list);
              setUploads([]);
              setError(null);
            }}
          />

          <div
            style={{
              marginTop: "22px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-gold"
              disabled={!canUpload}
              onClick={startUpload}
              style={{
                fontSize: "0.7rem",
                letterSpacing: "3px",
                opacity: canUpload ? 1 : 0.6,
              }}
            >
              {busy ? "Uploading…" : "Upload to S3"}
            </button>
            <button
              className="btn-outline"
              disabled={busy}
              onClick={() => {
                setFiles([]);
                setUploads([]);
                setError(null);
              }}
              style={{
                fontSize: "0.7rem",
                letterSpacing: "3px",
                opacity: busy ? 0.6 : 1,
              }}
            >
              Clear
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "18px",
                color: "#A07830",
                fontSize: "0.85rem",
                letterSpacing: "1px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {uploads.length > 0 && (
          <div
            style={{
              marginTop: "26px",
              background: "#FFFDF7",
              padding: "30px",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "3px",
                color: "#C9A84C",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              Uploads
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {uploads.map((u, idx) => (
                <div
                  key={`${u.name}-${idx}`}
                  style={{
                    paddingBottom: "14px",
                    borderBottom: "1px solid rgba(201,168,76,0.2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "14px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "#2C1A0E",
                        fontSize: "0.9rem",
                        letterSpacing: "1px",
                      }}
                    >
                      {u.name}
                    </div>
                    <div
                      style={{
                        color: "#6B5540",
                        fontSize: "0.75rem",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {u.status}
                    </div>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#E2D5BE",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((u.progress || 0) * 100)}%`,
                        background: "linear-gradient(135deg, #C9A84C, #A07830)",
                        transition: "width 150ms linear",
                      }}
                    />
                  </div>

                  {u.publicUrl && (
                    <div
                      style={{
                        marginTop: "12px",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className="input-luxury"
                        readOnly
                        value={u.publicUrl}
                      />
                      <button
                        className="btn-outline"
                        onClick={() => copyToClipboard(u.publicUrl)}
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "2px",
                          padding: "10px 16px",
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {(u.publicUrl || u.key) && (
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "0.8rem",
                        letterSpacing: "1px",
                        color: "#4A3020",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      {u.publicUrl && (
                        <a
                          href={u.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#A07830", textDecoration: "none" }}
                        >
                          Open URL →
                        </a>
                      )}
                      {u.key && (
                        <span style={{ color: "#6B5540" }}>
                          Key:{" "}
                          <span style={{ color: "#2C1A0E", fontWeight: 600 }}>
                            {u.key}
                          </span>
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
