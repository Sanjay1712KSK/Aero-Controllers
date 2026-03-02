"use client";

export default function DocumentationPage() {
  const pdfPath = "/Aero-Controllers/hackathon-doc.pdf";

  return (
    <main
      style={{
        minHeight: "100%",
        background: "#070c18",
        color: "#f8fafc",
        padding: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <div style={{ maxWidth: "var(--mac-page-max-width, 1200px)", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <header
          style={{
            background: "#0b1324",
            border: "1px solid #23314d",
            borderRadius: 14,
            padding: "16px 20px",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Hackathon Documentation</h1>
          <p style={{ color: "#b8c6dd", lineHeight: 1.5, marginBottom: 10 }}>
            Aero-Controllers - AMD SLINGSHOT HACKATHON PDF
          </p>
          <a href={pdfPath} target="_blank" rel="noreferrer" style={{ color: "#7dd3fc", textDecoration: "none", fontWeight: 600 }}>
            Open PDF in new tab
          </a>
        </header>

        <section
          style={{
            background: "#0b1324",
            border: "1px solid #23314d",
            borderRadius: 14,
            overflow: "hidden",
            height: "calc(100vh - 220px)",
            minHeight: 560,
          }}
        >
          <iframe
            title="Aero Controllers AMD Slingshot Hackathon PDF"
            src={pdfPath}
            style={{ width: "100%", height: "100%", border: "none", background: "#111827" }}
          />
        </section>
      </div>
    </main>
  );
}


