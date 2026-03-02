"use client"
import { useState } from 'react'
import Link from 'next/link'

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconWaveform = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <polyline points="2,12 5,6 8,12 11,18 14,12 17,6 20,12 22,12" />
    </svg>
)

const IconArchitecture = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <rect x="2" y="10" width="5" height="4" rx="1" />
        <rect x="17" y="10" width="5" height="4" rx="1" />
        <rect x="9" y="18" width="6" height="4" rx="1" />
        <line x1="12" y1="6" x2="12" y2="10" />
        <line x1="7" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="17" y2="12" />
        <line x1="4.5" y1="14" x2="9" y2="19" />
        <line x1="19.5" y1="14" x2="15" y2="19" />
    </svg>
)

const IconSimulation = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10" />
        <polygon fill="currentColor" stroke="none" points="10,8.5 16,12 10,15.5" />
    </svg>
)

// ─── Dock Items ───────────────────────────────────────────────────────────────
const ITEMS = [
    { id: 'technical', label: 'Control & Stability', path: '/technical', Icon: IconWaveform },
    { id: 'architecture', label: 'System Architecture', path: '/architecture', Icon: IconArchitecture },
    { id: 'simulation', label: 'Simulation', path: '/simulation', Icon: IconSimulation },
]

export default function MacDock({ activePath }) {
    const [hoveredIdx, setHoveredIdx] = useState(null)

    // Wave scale / lift per index
    const getScale = (i) => {
        if (hoveredIdx === null) return 1
        const d = Math.abs(i - hoveredIdx)
        if (d === 0) return 1.28
        if (d === 1) return 1.10
        return 1.0
    }
    const getLift = (i) => {
        if (hoveredIdx === null) return 0
        const d = Math.abs(i - hoveredIdx)
        if (d === 0) return -10
        if (d === 1) return -4
        return 0
    }

    const isActive = (path) =>
        activePath?.startsWith(path) && path !== '/'

    return (
        <div style={{
            position: 'fixed',
            bottom: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 800,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            padding: '12px 18px',
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.22)',
        }}>
            {ITEMS.map(({ id, label, path, Icon }, i) => {
                const active = isActive(path)
                const scale = getScale(i)
                const lift = getLift(i)

                return (
                    <div
                        key={id}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        <div
                            title={label}
                            style={{
                                transform: `scale(${scale}) translateY(${lift}px)`,
                                transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                                transformOrigin: 'bottom center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Link href={path} style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{
                                    width: 54, height: 54,
                                    background: active
                                        ? 'rgba(0,229,100,0.14)'
                                        : hoveredIdx === i
                                            ? 'rgba(255,255,255,0.14)'
                                            : 'rgba(255,255,255,0.08)',
                                    borderRadius: 14,
                                    display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: active ? '#00E564' : 'rgba(255,255,255,0.85)',
                                    border: `1px solid ${active ? 'rgba(0,229,100,0.30)' : 'rgba(255,255,255,0.08)'}`,
                                    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                                    boxShadow: active ? 'inset 0 0 0 1px rgba(0,229,100,0.15)' : 'none',
                                }}>
                                    <Icon />
                                </div>
                            </Link>
                        </div>

                        {/* Active dot */}
                        <div style={{
                            width: 4, height: 4, borderRadius: '50%',
                            background: active ? '#00E564' : 'transparent',
                            transition: 'background 0.25s ease',
                            flexShrink: 0,
                        }} />
                    </div>
                )
            })}
        </div>
    )
}
