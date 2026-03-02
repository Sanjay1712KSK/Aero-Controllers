"use client";

export default function HowToUsePage() {
  return (
    <main className="apple-doc-theme howto-page">
      <section className="doc-container">
        <div className="doc-header">
          <p className="doc-breadcrumb">Documentation / How To Use</p>
          <h1>How To Navigate This Application</h1>
          <p className="doc-subtitle">
            A guide to navigating the macOS-style interface and accessing simulations,
            architecture, and control framework modules.
          </p>
        </div>

        <hr className="doc-divider" />

        <div className="doc-section">
          <h2>Desktop Interface Overview</h2>
          <p>This application mimics a macOS desktop environment.</p>
          <ul>
            <li>The Story page functions as the desktop background.</li>
            <li>All other sections open as floating application windows.</li>
            <li>Windows can be moved, minimized, closed, or expanded.</li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Open Apps from the Dock</h2>
          <p>Use the bottom-center Dock to launch modules.</p>
          <p>Available modules:</p>
          <ul>
            <li>Story</li>
            <li>Control &amp; Stability Framework</li>
            <li>System Architecture</li>
            <li>Simulation</li>
          </ul>
          <p>Hover to preview. Click to open.</p>
        </div>

        <div className="doc-section">
          <h2>Window Controls</h2>
          <p>Each application window includes macOS-style controls:</p>
          <ul>
            <li><strong>Red</strong> - Close and return to desktop</li>
            <li><strong>Yellow</strong> - Minimize window</li>
            <li><strong>Green</strong> - Toggle fullscreen mode</li>
          </ul>
          <p>Windows are scrollable internally when content exceeds height.</p>
        </div>

        <div className="doc-section">
          <h2>Simulation Phases</h2>
          <p>Inside Simulation:</p>
          <ul>
            <li>Use the internal phase selector to switch between Phase 1, Phase 2, and Phase 3</li>
            <li>Each phase contains independent graphs, metrics, and evaluation videos</li>
            <li>Content loads within the active window</li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Graphs &amp; Media</h2>
          <ul>
            <li>Graphs may be interactive or expandable</li>
            <li>Videos load inline within the phase view</li>
            <li>Scroll inside the window to access full datasets</li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Recommended Exploration Path</h2>
          <ol>
            <li>Begin with Story for conceptual overview</li>
            <li>Open Control &amp; Stability Framework for system logic</li>
            <li>Review System Architecture for implementation structure</li>
            <li>Analyze Simulation Phases sequentially</li>
          </ol>
        </div>

        <div className="doc-section">
          <h2>Keyboard &amp; Interaction Notes</h2>
          <ul>
            <li>Use scroll gestures within windows</li>
            <li>Fullscreen mode adapts layout</li>
            <li>Navigation state persists until closed</li>
          </ul>
        </div>
      </section>

      <style jsx>{`
        .howto-page {
          min-height: 100%;
          width: 100%;
          color: rgba(255, 255, 255, 0.92);
          background: var(--app-bg-grade);
          overflow: visible;
        }

        .doc-container {
          width: 100%;
          max-width: min(1240px, var(--mac-page-max-width, 1240px));
          margin: 0 auto;
          padding: 56px clamp(20px, 3.2vw, 36px) 132px;
        }

        .doc-breadcrumb {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 12px;
        }

        .doc-header h1 {
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.98);
          line-height: 1.14;
        }

        .doc-subtitle {
          font-size: 20px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
        }

        .doc-divider {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 40px 0;
        }

        .doc-section {
          margin-bottom: 56px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .doc-section:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .doc-section h2 {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
        }

        .doc-section p {
          font-size: 18px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 16px;
          max-width: 78ch;
        }

        .doc-section ul,
        .doc-section ol {
          padding-left: 20px;
          margin: 0 0 14px;
        }

        .doc-section ul {
          list-style: disc;
        }

        .doc-section ol {
          list-style: decimal;
        }

        .doc-section li::marker {
          color: rgba(255, 255, 255, 0.55);
        }

        .doc-section li {
          margin-bottom: 10px;
          font-size: 17px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          max-width: 76ch;
        }

        @media (min-width: 1180px) {
          .doc-section {
            display: grid;
            grid-template-columns: 300px minmax(0, 1fr);
            column-gap: 46px;
            align-items: start;
          }

          .doc-section h2 {
            margin-bottom: 0;
            position: sticky;
            top: 0;
          }

          .doc-section p,
          .doc-section ul,
          .doc-section ol {
            grid-column: 2;
          }
        }

        @media (max-width: 760px) {
          .doc-container {
            padding: 40px 18px 96px;
          }

          .doc-header h1 {
            font-size: 34px;
          }

          .doc-subtitle {
            font-size: 18px;
          }

          .doc-section h2 {
            font-size: 23px;
          }

          .doc-section p {
            font-size: 16px;
          }

          .doc-section li {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
