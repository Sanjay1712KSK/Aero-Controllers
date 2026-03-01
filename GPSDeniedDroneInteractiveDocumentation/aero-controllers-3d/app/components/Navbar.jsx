"use client"
import React, { useState } from 'react'
import Link from 'next/link'

const T = {
    bgBase: '#010308',
    bgAlt: '#030612',
    border: '#1E2D4A',
    textPri: '#FFFFFF',
    textSec: '#A3B8CC',
    cyan: '#00E5FF'
}

export function Navbar({ activePath }) {
    const [simHover, setSimHover] = useState(false)

    const navLinks = [
        { name: 'STORY', path: '/' },
        { name: 'CONTROL & STABILITY FRAMEWORK', path: '/technical' },
        { name: 'SYSTEM ARCHITECTURE', path: '/architecture' },
    ]

    const simPhases = [
        { name: 'Phase-1: Baseline Instability', path: '/simulation' },
        { name: 'Phase-2: Mild Wind Learning', path: '/simulation/phase-2' },
        { name: 'Phase-3: Robust Stabilization', path: '/simulation/phase-3' },
    ]

    // Is current path a simulation path?
    const isSimActive = activePath?.startsWith('/simulation')

    return (
        <nav style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            height: 72,
            background: `${T.bgBase}ee`,
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${T.border}`,
            zIndex: 9999, // Extremely high so nothing overlaps
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5rem',
            fontFamily: 'sans-serif',
            pointerEvents: 'auto'
        }}>
            <div style={{ letterSpacing: '0.14em', fontWeight: 700, color: T.textPri, textTransform: 'uppercase' }}>
                AERO-CONTROLLERS
            </div>

            {/* Equal spacing container */}
            <div style={{ display: 'flex', gap: '3rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px', alignItems: 'center' }}>

                {navLinks.map((link) => {
                    const isActive = activePath === link.path
                    return (
                        <div key={link.name} style={{ position: 'relative' }}>
                            <Link href={link.path} style={{
                                color: isActive ? T.cyan : T.textPri, // Make primary text brighter for unused links too based on user style? 'inherit' or textSec. Let's use textSec as in previous pages.
                                color: isActive ? T.cyan : T.textSec,
                                textDecoration: 'none',
                                fontWeight: isActive ? 500 : 400,
                                transition: 'color 0.2s'
                            }}>
                                {link.name}
                            </Link>
                            {isActive && (
                                <div style={{ position: 'absolute', bottom: -28, left: 0, right: 0, height: 2, background: T.cyan }} />
                            )}
                        </div>
                    )
                })}

                {/* Simulation Dropdown Container */}
                <div
                    onMouseEnter={() => setSimHover(true)}
                    onMouseLeave={() => setSimHover(false)}
                    style={{ position: 'relative', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div style={{
                        color: isSimActive ? T.cyan : T.textSec,
                        fontWeight: isSimActive ? 500 : 400,
                        transition: 'color 0.2s',
                        padding: '26px 0' // Pad vertically so hover doesn't break when moving to dropdown
                    }}>
                        SIMULATION
                    </div>

                    {isSimActive && (
                        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: T.cyan }} />
                    )}

                    {/* Dropdown Menu */}
                    <div style={{
                        position: 'absolute',
                        top: 72,
                        right: 0, // Align right edge
                        width: 300,
                        background: `${T.bgBase}fc`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${T.border}`,
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        opacity: simHover ? 1 : 0,
                        visibility: simHover ? 'visible' : 'hidden',
                        transform: simHover ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        padding: '8px 0'
                    }}>
                        {simPhases.map((phase) => {
                            const isPhaseActive = activePath === phase.path
                            return (
                                <Link key={phase.name} href={phase.path} style={{
                                    padding: '16px 24px',
                                    color: isPhaseActive ? T.cyan : '#fff',
                                    textDecoration: 'none',
                                    fontSize: '0.8rem',
                                    letterSpacing: '1px',
                                    fontWeight: 400,
                                    transition: 'background 0.2s, color 0.2s',
                                    background: isPhaseActive ? `${T.cyan}10` : 'transparent',
                                    borderLeft: `2px solid ${isPhaseActive ? T.cyan : 'transparent'}`
                                }}
                                    onMouseEnter={(e) => {
                                        if (!isPhaseActive) e.currentTarget.style.background = '#101828'
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isPhaseActive) e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    {phase.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>
        </nav>
    )
}
