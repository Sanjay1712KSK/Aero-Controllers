"use client"
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Navbar } from '../../components/Navbar'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const T = {
    bgBase: '#02050A',
    bgAlt: '#050A14',
    secStrip: '#0B1220',
    graphBg: '#111827',
    border: '#1E2D4A',
    graphBorder: '#1F2937',
    textPri: '#FFFFFF',
    textSec: '#A3B8CC',
    textMuted: '#5C7A99',
    cyan: '#00E5FF',
    green: '#00FF66',
    greenDark: '#003318',
    greenBorder: '#00AA44',
    redBox: '#3A0A0A',
    redText: '#FF4D4D'
}

// ─── REUSABLE ROW COMPONENT ──────────────────────────────────────────────────
const LandscapeRow = ({ children, reverse = false, align = 'center', gap = 48, marginTop = 0 }) => (
    <div style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        flexWrap: 'wrap',
        alignItems: align,
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 'var(--mac-page-max-width, 1200px)',
        margin: `${marginTop}px auto 0 auto`,
        gap: `${gap}px`
    }}>
        {children}
    </div>
)

const FadeSection = ({ children, delay = 0, yOffset = 40, className = "", style = {} }) => {
    const sectionRef = useRef(null)
    useLayoutEffect(() => {
        if (!sectionRef.current) return
        const scrollerEl = sectionRef.current.closest('.mac-window-content') || undefined

        let ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay,
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', scroller: scrollerEl }
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [yOffset, delay])
    return <section ref={sectionRef} className={className} style={{ width: '100%', ...style }}>{children}</section>
}

// ─── EXPANDABLE GRAPH COMPONENT ──────────────────────────────────────────────
const ExpandableGraph = ({ src, alt, width = 800, height = 500, style = {} }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const openModal = () => {
        setZoom(1)
        setIsExpanded(true)
    }

    const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
    const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 1))
    const resetZoom = () => setZoom(1)

    return (
        <>
            <div style={{ cursor: 'pointer', ...style }} onClick={openModal}>
                <Image src={src} alt={alt} width={width} height={height}
                    style={{ width: '100%', height: 'auto', borderRadius: 4, display: 'block' }} />
            </div>

            {isExpanded && isClient && createPortal(
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(2, 5, 10, 0.97)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '12px'
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsExpanded(false)
                    }}
                >
                    <div style={{ width: '98vw', height: '96vh', display: 'flex', flexDirection: 'column', background: T.bgBase, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: `0 20px 40px rgba(0,0,0,0.5)`, overflow: 'hidden' }}>
                        <div style={{ height: 56, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: T.bgAlt }}>
                            <div style={{ color: T.textSec, fontSize: '0.9rem', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {alt}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button type="button" onClick={zoomOut} style={{ padding: '6px 10px', border: `1px solid ${T.border}`, background: T.bgBase, color: T.textPri, borderRadius: 6, cursor: 'pointer' }}>-</button>
                                <button type="button" onClick={resetZoom} style={{ padding: '6px 10px', border: `1px solid ${T.border}`, background: T.bgBase, color: T.textPri, borderRadius: 6, cursor: 'pointer' }}>{Math.round(zoom * 100)}%</button>
                                <button type="button" onClick={zoomIn} style={{ padding: '6px 10px', border: `1px solid ${T.border}`, background: T.bgBase, color: T.textPri, borderRadius: 6, cursor: 'pointer' }}>+</button>
                                <button type="button" onClick={() => setIsExpanded(false)} style={{ padding: '6px 10px', border: `1px solid ${T.border}`, background: T.redBox, color: T.redText, borderRadius: 6, cursor: 'pointer' }}>Close</button>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            <img
                                src={src}
                                alt={alt}
                                style={{
                                    width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
                                    maxWidth: zoom === 1 ? '100%' : 'none',
                                    maxHeight: zoom === 1 ? '100%' : 'none',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Phase3Page() {
    return (
        <div className="sim-page" style={{ background: T.bgBase, color: T.textPri, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <Navbar activePath="/simulation/phase-3" />

            {/* INTERACTIVE STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .graph-card {
                    background: ${T.graphBg};
                    border: 1px solid ${T.graphBorder};
                    padding: 24px;
                    border-radius: 8px;
                    transition: border-color 0.3s ease, transform 0.3s ease;
                    position: relative;
                }
                .graph-card:hover { border-color: ${T.green}; transform: translateY(-3px); }
                .graph-caption { opacity: 0; transition: opacity 0.3s ease; text-align: center; color: ${T.textSec}; margin-top: 12px; font-size: 0.9rem; }
                .graph-card:hover .graph-caption { opacity: 1; }

                .metric-number { transition: color 0.3s ease; }
                .metric-block:hover .metric-number { color: ${T.green}; }

                .crash-frame {
                    border: 1px solid ${T.border};
                    border-radius: 8px;
                    overflow: hidden;
                    transition: border-color 0.3s ease, transform 0.3s ease;
                    cursor: pointer;
                }
                .crash-frame:hover { border-color: ${T.redText}; transform: translateY(-4px); }

                .eq-box { position: relative; display: inline-block; cursor: pointer; transition: text-decoration 0.2s; }
                .eq-box:hover { text-decoration: underline; }
                .eq-tooltip {
                    visibility: hidden; opacity: 0; width: max-content;
                    background-color: ${T.border}; color: #fff; text-align: center;
                    border-radius: 4px; padding: 6px 12px; position: absolute;
                    z-index: 10; bottom: 125%; left: 50%; transform: translateX(-50%);
                    transition: opacity 0.3s; font-size: 0.85rem; font-family: sans-serif;
                }
                .eq-box:hover .eq-tooltip { visibility: visible; opacity: 1; }

                .verdict-bullet { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${T.border}; }
                .verdict-bullet:last-child { border-bottom: none; }
            `}} />

            <main style={{ paddingTop: 72 }}>

                {/* ─── 1️⃣ HERO SECTION ────────────────────────────────────── */}
                <section style={{ height: '65vh', minHeight: 620, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)', gap: 40, alignItems: 'center' }}>

                        {/* LEFT 60% */}
                        <div style={{ flex: '6' }}>
                            <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.85rem', marginBottom: 16 }}>Phase-3</div>
                            <h1 style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', fontWeight: 300, marginBottom: 16, lineHeight: 1.1 }}>
                                Stochastic Multi-Wind Robustness
                            </h1>
                            <p style={{ fontSize: 'clamp(1rem, 4.6vw, 1.2rem)', color: T.textSec, marginBottom: 32, lineHeight: 1.5, maxWidth: 600 }}>
                                Policy trained under aggressive wind randomization to achieve disturbance-invariant stabilization.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec }}>
                                {[
                                    'Trained for 600k timesteps',
                                    'Stochastic wind injection',
                                    'Aggressive disturbance curriculum',
                                    'PPO-based nonlinear stabilizer'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* RIGHT 40% — Robustness Metrics Card */}
                        <div style={{ flex: '4', border: `1px solid ${T.greenBorder}`, borderRadius: 8, padding: 32, background: T.bgBase }}>
                            <div style={{ color: T.green, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>
                                Robustness Metrics
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {[
                                    { l: 'Stability Score (Calm)', v: '≈ 91+' },
                                    { l: 'Stability Score (Mixed)', v: '≈ 89+' },
                                    { l: 'Stability Score (Strong)', v: '≈ 86+' },
                                    { l: 'Convergence', v: '✓', color: T.green },
                                    { l: 'Policy Collapse', v: '✗', color: T.redText },
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 4 ? `1px solid ${T.border}` : 'none', paddingBottom: i < 4 ? 16 : 0 }}>
                                        <span style={{ fontSize: '12px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.l}</span>
                                        <span style={{ fontSize: '22px', fontWeight: 300, color: stat.color || T.textPri }}>{stat.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* ─── 2️⃣ EARLY FAILURE — DRONE CRASH ──────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center', background: '#080A0F' }}>
                    <LandscapeRow gap={56}>

                        {/* LEFT — Crash Image */}
                        <div style={{ flex: 1, maxWidth: 580 }}>
                            <div className="crash-frame" style={{ background: T.redBox }}>
                                <Image
                                    src="/Aero-Controllers/phase-3/early_crash.png"
                                    alt="Phase 3 Early Crash - Drone Crashed"
                                    width={800}
                                    height={500}
                                    style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.92 }}
                                />
                                <div style={{ padding: '12px 20px', background: 'rgba(58,10,10,0.8)', borderTop: `1px solid ${T.border}` }}>
                                    <div style={{ color: T.redText, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Early Strong Wind Evaluation — Policy Failure
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Explanation */}
                        <div style={{ flex: 1 }}>
                            <div style={{ color: T.redText, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                Critical Failure Event
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                Initial Strong Wind Instability
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, color: T.textSec, fontSize: '1.05rem', marginBottom: 36 }}>
                                <li>• Strong stochastic wind exceeded control envelope</li>
                                <li>• Angular velocity spikes grew uncontrollably</li>
                                <li>• Rotational instability led to crash</li>
                            </ul>

                            <div className="eq-box" style={{ padding: '16px 28px', background: T.redBox, border: `1px solid ${T.redText}`, borderRadius: 8, color: T.redText, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.3rem', display: 'inline-block', marginBottom: 36 }}>
                                sup<sub>t</sub> ||ω(t)|| → Unbounded
                                <span className="eq-tooltip" style={{ background: T.redText }}>Angular velocity diverges — policy fails to contain rotational dynamics.</span>
                            </div>

                            <div style={{ padding: '20px 24px', background: T.secStrip, border: `1px solid ${T.border}`, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
                                <div style={{ color: T.green, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                                    Consequence
                                </div>
                                <p style={{ color: T.textSec, margin: 0, lineHeight: 1.6, fontSize: '1rem' }}>
                                    This failure triggered aggressive retraining under randomized wind regimes — the foundation of Phase-3.
                                </p>
                            </div>
                        </div>

                    </LandscapeRow>
                </FadeSection>

                {/* ─── 3️⃣ TRAINING EVOLUTION (BTS) ─────────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={56} reverse>

                        {/* RIGHT — Training Image */}
                        <div style={{ flex: 1, maxWidth: 560 }}>
                            <div className="graph-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <Image
                                    src="/Aero-Controllers/phase-3/pc_training.jpeg"
                                    alt="PC under training - BTS"
                                    width={800}
                                    height={520}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                                <div className="graph-caption" style={{ padding: '12px 0' }}>600k Timestep PPO Training Session</div>
                            </div>
                        </div>

                        {/* LEFT — Training Details */}
                        <div style={{ flex: 1 }}>
                            <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                Behind the Training
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                Aggressive PPO Training Curriculum
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, color: T.textSec, fontSize: '1.05rem', marginBottom: 36 }}>
                                <li>• Randomized wind magnitude &amp; direction</li>
                                <li>• Stochastic episode sampling</li>
                                <li>• Reward shaping for angular damping</li>
                                <li>• Penalized rotational variance</li>
                                <li>• Penalized energy spikes</li>
                            </ul>

                            <div className="eq-box" style={{ padding: '20px 28px', border: `1px solid ${T.greenBorder}`, background: T.greenDark, borderRadius: 8, color: T.green, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.15rem', display: 'inline-block' }}>
                                Reward ∝ − (||ω||² + Var(ω) + |Δp|)
                                <span className="eq-tooltip">Reward penalizes rotational energy, variance, and positional deviation simultaneously.</span>
                            </div>
                        </div>

                    </LandscapeRow>
                </FadeSection>

                {/* ─── 4️⃣ STABILITY SCORE ACROSS REGIMES ────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={56}>

                        {/* LEFT — Graph */}
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph
                                    src="/Aero-Controllers/phase-3/score_plot.png"
                                    alt="Stability Score per Episode across Calm, Mixed, Strong wind regimes"
                                />
                                <div className="graph-caption">Stability Score per Episode — Calm / Mixed / Strong</div>
                            </div>
                        </div>

                        {/* RIGHT — Interpretation */}
                        <div style={{ flex: 1 }}>
                            <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                Core Evidence
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                Cross-Regime Generalization
                            </h2>

                            {/* Score breakdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                                {[
                                    { regime: 'Calm', score: '≈ 91–92', bar: 0.92 },
                                    { regime: 'Mixed', score: '≈ 89–90', bar: 0.89 },
                                    { regime: 'Strong', score: '≈ 86–87', bar: 0.86 },
                                ].map((r, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ color: T.textSec, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>{r.regime}</span>
                                            <span style={{ color: T.green, fontWeight: 500 }}>{r.score}</span>
                                        </div>
                                        <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${r.bar * 100}%`, background: T.green, borderRadius: 3, transition: 'width 1s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '16px 20px', background: T.secStrip, border: `1px solid ${T.greenBorder}`, borderRadius: 8 }}>
                                <div style={{ color: T.green, fontWeight: 500, marginBottom: 6, fontSize: '0.9rem' }}>Key Observation</div>
                                <p style={{ margin: 0, color: T.textSec, lineHeight: 1.6 }}>
                                    No degradation trend across wind intensities. The policy maintains <strong style={{ color: T.textPri }}>&gt;85 stability</strong> across all regimes. That is robustness.
                                </p>
                            </div>
                        </div>

                    </LandscapeRow>
                </FadeSection>

                {/* ─── 5️⃣ ROTATIONAL STABILITY ────────────────────────────── */}
                <section style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 96 }}>

                    {/* A) Angular Velocity Magnitude */}
                    <FadeSection>
                        <LandscapeRow gap={56}>
                            <div style={{ flex: 1, maxWidth: 600 }}>
                                <div className="graph-card">
                                    <ExpandableGraph
                                        src="/Aero-Controllers/phase-3/angular_velocity_magnitude.png"
                                        alt="Angular Velocity Magnitude — Rotational Stability"
                                    />
                                    <div className="graph-caption">Angular Velocity Magnitude Over Time</div>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                    Rotational Stability — Magnitude
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                    Bounded Angular Energy
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.05rem', marginBottom: 32 }}>
                                    <li>• Spikes bounded — no runaway amplification</li>
                                    <li>• No exponential growth in rotational energy</li>
                                    <li>• Energy dissipates after disturbance events</li>
                                </ul>
                                <div className="eq-box" style={{ padding: '16px 24px', border: `1px solid ${T.greenBorder}`, background: T.greenDark, borderRadius: 8, color: T.green, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                    sup<sub>t</sub> ||ω(t)|| &lt; ω_max
                                    <span className="eq-tooltip">Angular velocity remains strictly within the safe operational envelope at all times.</span>
                                </div>
                            </div>
                        </LandscapeRow>
                    </FadeSection>

                    {/* B) Roll & Pitch Stability */}
                    <FadeSection>
                        <LandscapeRow gap={56} reverse>
                            <div style={{ flex: 1, maxWidth: 600 }}>
                                <div className="graph-card">
                                    <ExpandableGraph
                                        src="/Aero-Controllers/phase-3/roll_pitch_stability.png"
                                        alt="Roll and Pitch Stability"
                                    />
                                    <div className="graph-caption">Roll &amp; Pitch Per-Axis Stability</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, paddingLeft: 8 }}>
                                <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                    Rotational Stability — Per Axis
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                    Axis Damping Analysis
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.05rem', marginBottom: 32 }}>
                                    <li>• Roll &amp; pitch oscillations rapidly damped</li>
                                    <li>• Yaw axis structurally stable</li>
                                    <li>• No cross-axis amplification</li>
                                </ul>
                                <div className="eq-box" style={{ padding: '12px 20px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 8, color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', display: 'inline-block' }}>
                                    Var(ωx), Var(ωy) ↓ &nbsp;|&nbsp; Yaw stable
                                    <span className="eq-tooltip">Reduced per-axis variance confirms successful damping of roll and pitch dynamics.</span>
                                </div>
                            </div>
                        </LandscapeRow>
                    </FadeSection>

                </section>

                {/* ─── 6️⃣ WIND vs RESPONSE COUPLING ────────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={56}>

                        {/* LEFT — Graph */}
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph
                                    src="/Aero-Controllers/phase-3/wind_vs_response.png"
                                    alt="Wind vs Response coupling graph"
                                />
                                <div className="graph-caption">Wind Intensity vs Angular Velocity Response</div>
                            </div>
                        </div>

                        {/* RIGHT — Interpretation */}
                        <div style={{ flex: 1 }}>
                            <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                Disturbance Coupling
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                Controlled Wind–Response Coupling
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.05rem', marginBottom: 32 }}>
                                <li>• Wind increases → angular velocity increases proportionally</li>
                                <li>• No chaotic divergence at high wind intensities</li>
                                <li>• Fast recovery after disturbance spikes</li>
                            </ul>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="eq-box" style={{ padding: '14px 22px', border: `1px solid ${T.greenBorder}`, background: T.greenDark, borderRadius: 8, color: T.green, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', display: 'inline-block' }}>
                                    ||ω(t)|| ∝ Disturbance magnitude
                                    <span className="eq-tooltip">Response scales proportionally with input — no nonlinear amplification.</span>
                                </div>
                                <div className="eq-box" style={{ padding: '14px 22px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 8, color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', display: 'inline-block' }}>
                                    Bounded proportional response
                                    <span className="eq-tooltip">System exhibits linear gain characteristic — evidence of learned disturbance rejection.</span>
                                </div>
                            </div>
                        </div>

                    </LandscapeRow>
                </FadeSection>

                {/* ─── 7️⃣ CHECKPOINT CONVERGENCE ────────────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={56} reverse>

                        {/* RIGHT — Bar chart */}
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph
                                    src="/Aero-Controllers/phase-3/mean_angular_velocity.png"
                                    alt="Mean Angular Velocity per Checkpoint"
                                />
                                <div className="graph-caption">Mean Angular Velocity per Training Checkpoint</div>
                            </div>
                        </div>

                        {/* LEFT — Learning Trend */}
                        <div style={{ flex: 1 }}>
                            <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                                Training Convergence
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
                                Stable Learning Horizon
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.05rem', marginBottom: 32 }}>
                                <li>• No instability explosion across checkpoints</li>
                                <li>• Angular velocity remains controlled throughout training</li>
                                <li>• No policy collapse during long-horizon training</li>
                            </ul>

                            <div style={{ padding: '20px 24px', background: T.secStrip, border: `1px solid ${T.border}`, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
                                <div style={{ color: T.green, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                                    Interpretation
                                </div>
                                <p style={{ margin: 0, color: T.textSec, lineHeight: 1.6 }}>
                                    Consistent mean angular velocity across all checkpoints proves stability across the <strong style={{ color: T.textPri }}>entire 600k timestep learning horizon</strong>. No catastrophic forgetting.
                                </p>
                            </div>
                        </div>

                    </LandscapeRow>
                </FadeSection>

                {/* ─── 8️⃣ SIMULATION VIDEO ────────────────────────────────────── */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', background: T.bgAlt }}>
                    <div style={{ width: '100%', maxWidth: 1000 }}>
                        <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16, textAlign: 'center' }}>
                            PPO Policy Learning
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 40, textAlign: 'center' }}>
                            Calm &amp; Mixed Wind Training Session
                        </h2>

                        <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: T.bgBase, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.youtube.com/embed/5MEbBffcv7E"
                                title="Phase 3 Robustness Test — Stochastic Wind Stabilization"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            />
                        </div>

                        <div style={{ marginTop: 20, textAlign: 'center', color: T.textMuted, fontSize: '0.95rem', letterSpacing: 1 }}>
                            PPO policy learning stabilization under calm &amp; mixed wind environments
                        </div>
                    </div>
                </FadeSection>

                {/* ─── 9️⃣ ENGINEERING CONCLUSION ─────────────────────────────── */}
                <FadeSection style={{ padding: '120px 40px 160px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 16 }}>
                        Engineering Verdict
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: 32 }}>Phase-3 Engineering Verdict</h2>
                    <p style={{ fontSize: '1.2rem', color: T.textSec, maxWidth: 860, lineHeight: 1.7, marginBottom: 64 }}>
                        Phase-3 demonstrates learned nonlinear disturbance rejection under stochastic wind injection. The PPO policy achieves bounded angular velocity behavior, consistent stability scores above 85/100 across regimes, and controlled wind-response coupling without collapse.
                    </p>

                    {/* Bullet Summary */}
                    <div style={{ width: '100%', maxWidth: 640, marginBottom: 80, textAlign: 'left' }}>
                        {[
                            { icon: '✓', text: 'Learned disturbance rejection' },
                            { icon: '✓', text: 'Generalized across wind regimes' },
                            { icon: '✓', text: 'Stabilized rotational dynamics' },
                            { icon: '✓', text: 'Survived strong wind injection' },
                            { icon: '✓', text: 'No policy degradation' },
                        ].map((b, i) => (
                            <div key={i} className="verdict-bullet">
                                <span style={{ color: T.green, fontSize: '1.2rem', fontWeight: 700 }}>{b.icon}</span>
                                <span style={{ color: T.textSec, fontSize: '1.05rem' }}>{b.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Phase Timeline */}
                    <div style={{ display: 'flex', gap: 24, border: `1px solid ${T.border}`, padding: '32px 48px', borderRadius: 8, background: T.bgAlt, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ color: T.textMuted }}>Phase-1 <br /><span style={{ color: T.textSec }}>Baseline Instability</span></div>
                        <div style={{ color: T.textMuted }}>➔</div>
                        <div><span style={{ color: T.textMuted }}>Phase-2</span><br /><span style={{ color: T.cyan }}>Quantified Improvement</span></div>
                        <div style={{ color: T.textMuted }}>➔</div>
                        <div><span style={{ color: T.green }}>Phase-3</span><br /><span style={{ color: T.green }}>Multi-Wind Robustness ✓</span></div>
                    </div>
                </FadeSection>

            </main>
        </div>
    )
}

