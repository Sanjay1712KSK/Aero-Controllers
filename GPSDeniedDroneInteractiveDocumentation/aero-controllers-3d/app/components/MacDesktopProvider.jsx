"use client"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import MacWindow from './MacWindow'
import MacDock from './MacDock'
import MacMenuBar from './MacMenuBar'

// ─── macOS Ventura-inspired wallpaper ────────────────────────────────────────
const WALLPAPER = [
    'radial-gradient(ellipse 75% 55% at 22% 62%, rgba(72,36,108,0.55) 0%, transparent 70%)',
    'radial-gradient(ellipse 55% 65% at 78% 28%, rgba(26,72,130,0.45) 0%, transparent 68%)',
    'radial-gradient(ellipse 45% 42% at 58% 78%, rgba(110,36,72,0.35) 0%, transparent 62%)',
    'radial-gradient(ellipse 60% 38% at 50% 8%, rgba(170,110,50,0.18) 0%, transparent 72%)',
    'radial-gradient(ellipse 80% 30% at 50% 50%, rgba(40,30,80,0.30) 0%, transparent 100%)',
    'linear-gradient(160deg, #0F0F1A 0%, #191630 35%, #10192A 65%, #0C1520 100%)'
].join(', ')

// ─── Window title map ─────────────────────────────────────────────────────────
const TITLES = {
    '/technical': 'Control & Stability Framework',
    '/architecture': 'System Architecture',
    '/simulation': 'Phase-1 · Baseline Instability',
    '/simulation/phase-2': 'Phase-2 · Stability Validation',
    '/simulation/phase-3': 'Phase-3 · Stochastic Robustness',
}

export default function MacDesktopProvider({ children }) {
    const pathname = usePathname()
    const isDesktop = pathname === '/'
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Reset fullscreen when navigating to new page
    useEffect(() => {
        setIsFullscreen(false)
    }, [pathname])

    const title = TITLES[pathname] ?? 'Aero-Controllers'

    return (
        <>
            {/* ── Wallpaper ─────────────────────────────────────────── */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: WALLPAPER,
                pointerEvents: 'none',
            }} />

            {/* ── Menu Bar — hidden in fullscreen ───────────────────── */}
            {!isFullscreen && <MacMenuBar />}

            {/* ── Page Content ──────────────────────────────────────── */}
            {isDesktop ? (
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {children}
                </div>
            ) : (
                <MacWindow
                    title={title}
                    isFullscreen={isFullscreen}
                    onFullscreenChange={setIsFullscreen}
                >
                    {children}
                </MacWindow>
            )}

            {/* ── Dock ──────────────────────────────────────────────── */}
            <MacDock activePath={pathname} />

            {/* ── Team Credit ───────────────────────────────────────── */}
            <div style={{
                position: 'fixed', bottom: 10, right: 20, zIndex: 850,
                color: 'rgba(255,255,255,0.28)', fontSize: '0.7rem',
                letterSpacing: '0.06em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                pointerEvents: 'none', userSelect: 'none',
            }}>
                Made by Team Aero-Controllers
            </div>
        </>
    )
}
