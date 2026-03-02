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
    bgAlt: '#050A14', // Hero bg
    secStrip: '#0B1220', // Metrics / Math block bg
    graphBg: '#111827',
    border: '#1E2D4A',
    graphBorder: '#1F2937',
    textPri: '#FFFFFF',
    textSec: '#A3B8CC',
    textMuted: '#5C7A99',
    cyan: '#00E5FF',
    green: '#00FF66',
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
            {/* Thumbnail */}
            <div
                style={{ cursor: 'pointer', ...style }}
                onClick={openModal}
            >
                <Image src={src} alt={alt} width={width} height={height} style={{ width: '100%', height: 'auto', borderRadius: 4, display: 'block' }} />
            </div>

            {/* Fullscreen Modal Form */}
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
export default function Phase2Page() {
    return (
        <div className="sim-page" style={{ background: T.bgBase, color: T.textPri, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <Navbar activePath="/simulation/phase-2" />

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
                .graph-card:hover { border-color: ${T.cyan}; transform: translateY(-3px); }
                .graph-caption { opacity: 0; transition: opacity 0.3s ease; text-align: center; color: ${T.textSec}; margin-top: 12px; font-size: 0.9rem; }
                .graph-card:hover .graph-caption { opacity: 1; }
                
                .metric-number { transition: color 0.3s ease; }
                .metric-block:hover .metric-number { color: ${T.green}; }
                
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
            `}} />

            <main style={{ paddingTop: 72 }}>

                {/* 1️⃣ HERO SECTION */}
                <section style={{ height: '65vh', minHeight: 600, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)', gap: 40, alignItems: 'center' }}>

                        {/* LEFT (60%) */}
                        <div style={{ flex: '6' }}>
                            <h1 style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', fontWeight: 300, marginBottom: 16, lineHeight: 1.1 }}>Phase-2 Stability Validation</h1>
                            <p style={{ fontSize: 'clamp(1rem, 4.6vw, 1.2rem)', color: T.textSec, marginBottom: 32, lineHeight: 1.5, maxWidth: 600 }}>
                                Quantitative validation of rotational damping and trajectory repeatability under controlled disturbance injection.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec }}>
                                {['Reduced rotational variance', 'Bounded angular magnitude', 'High trajectory overlap', 'Low RMSE across runs'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.cyan }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* RIGHT (40%) Framed Summary */}
                        <div style={{ flex: '4', border: `1px solid ${T.border}`, borderRadius: 8, padding: 32, background: T.bgBase }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { v: "0.1203", l: "RMSE Ω,mag" },
                                    { v: "0.00677", l: "Var(ωx)" },
                                    { v: "0.00769", l: "Var(ωy)" },
                                    { v: "0.3661", l: "RMSE Pos,Z" }
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 3 ? `1px solid ${T.border}` : 'none', paddingBottom: i < 3 ? 16 : 0 }}>
                                        <span style={{ fontSize: '12px', color: T.textMuted }}>{stat.l}</span>
                                        <span style={{ fontSize: '28px', fontWeight: 300, color: T.textPri }}>{stat.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* 2️⃣ METRICS STRIP */}
                <section style={{ height: 120, background: T.secStrip, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)', height: '100%' }}>
                        {[
                            { l: "RMSE X", v: "3.0076" }, { l: "RMSE Y", v: "3.8208" }, { l: "RMSE Z", v: "0.3661" },
                            { l: "RMSE Ω", v: "0.1203" }, { l: "Var ωx", v: "0.00677" }, { l: "Var ωy", v: "0.00769" }
                        ].map((m, i) => (
                            <div key={i} className="metric-block" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: i < 5 ? `1px solid ${T.border}` : 'none' }}>
                                <div className="metric-number" style={{ fontSize: '26px', fontWeight: 300, color: T.textPri }}>{m.v}</div>
                                <div style={{ fontSize: '12px', color: T.textSec, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{m.l}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3️⃣ TRAJECTORY CONSISTENCY */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={48}>
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph src="/Aero-Controllers/phase-2/trajectory_comparison.png" alt="Trajectory Consistency" />
                                <div className="graph-caption">Run-1 vs Run-2 Lateral Path Overlap</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingRight: 40 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Bounded Translational Deviation</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                <li>• Runs nearly overlap</li>
                                <li>• No lateral divergence</li>
                                <li>• No exponential growth</li>
                            </ul>
                            <div className="eq-box" style={{ padding: '16px 24px', border: `1px solid ${T.border}`, borderRadius: 8, color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                ||Δp(t)|| &lt; ε
                                <span className="eq-tooltip">Translational error is strictly bounded over time.</span>
                            </div>
                        </div>
                    </LandscapeRow>
                </FadeSection>

                {/* 4️⃣ ANGULAR VELOCITY STABILITY */}
                <section style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 96 }}>

                    {/* A) Magnitude */}
                    <FadeSection>
                        <LandscapeRow gap={48}>
                            <div style={{ flex: 1, maxWidth: 600 }}>
                                <div className="graph-card">
                                    <ExpandableGraph src="/Aero-Controllers/phase-2/angular_velocity_magnitude.png" alt="Angular Magnitude" />
                                    <div className="graph-caption">Angular Velocity Magnitude Over Time</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, paddingRight: 40 }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Bounded Rotational Energy</h2>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                    <li>• Both runs tightly bounded</li>
                                    <li>• Transient spikes decay rapidly</li>
                                    <li>• No runaway instability</li>
                                </ul>
                                <div className="eq-box" style={{ padding: '16px 24px', background: T.redBox, border: `1px solid ${T.redText}`, borderRadius: 8, color: T.redText, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                    sup<sub>t</sub> ||ω(t)|| &lt; ω_max
                                    <span className="eq-tooltip" style={{ background: T.redText }}>Maximum angular velocity remains within safe operational limits.</span>
                                </div>
                            </div>
                        </LandscapeRow>
                    </FadeSection>

                    {/* B) Per-Axis */}
                    <FadeSection>
                        <LandscapeRow gap={48} reverse>
                            <div style={{ flex: 1, maxWidth: 600 }}>
                                <div className="graph-card">
                                    <ExpandableGraph src="/Aero-Controllers/phase-2/angular_velocity_per_axis.png" alt="Angular Per Axis" />
                                    <div className="graph-caption">Per-Axis Velocity Breakdown</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, paddingLeft: 40 }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Axis-Specific Damping</h2>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                    <li>• Roll & pitch heavily damped</li>
                                    <li>• Yaw structurally stable</li>
                                    <li>• No cross-axis amplification</li>
                                </ul>
                                <div className="eq-box" style={{ padding: '12px 20px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 8, color: T.textPri, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', display: 'inline-block' }}>
                                    Var(ωx), Var(ωy) ↓
                                    <span className="eq-tooltip">Variance indicates significantly reduced oscillation.</span>
                                </div>
                            </div>
                        </LandscapeRow>
                    </FadeSection>

                </section>

                {/* 5️⃣ ENERGY & DIFFERENCE RESPONSE */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={48}>
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph src="/Aero-Controllers/phase-2/angular_velocity_difference.png" alt="Velocity Difference" />
                                <div className="graph-caption">Velocity Deviation Magnitude Between Runs</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingRight: 40 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Bounded Disturbance Energy</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                <li>• Low deviation baseline</li>
                                <li>• Disturbance spikes recover rapidly</li>
                                <li>• Controlled oscillatory behavior</li>
                            </ul>
                            <div className="eq-box" style={{ padding: '16px 24px', border: `1px solid ${T.border}`, borderRadius: 8, color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                ∫ ||ω(t)||² dt &lt; ∞
                                <span className="eq-tooltip">Total accumulated discrepancy energy is bounded and finite.</span>
                            </div>
                        </div>
                    </LandscapeRow>
                </FadeSection>

                {/* 6️⃣ SENSOR VALIDATION SECTION */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 64, textAlign: 'center' }}>Sensor Flow Consistency</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
                            {/* A) Barometer */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div className="graph-card">
                                    <ExpandableGraph src="/Aero-Controllers/phase-2/barometer_altitude.png" alt="Barometer Altitude" width={600} height={400} />
                                    <div className="graph-caption">Barometer Altitude Output</div>
                                </div>
                                <div>
                                    <div style={{ color: T.cyan, fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>RMSE Pos,Z = 0.3661</div>
                                    <p style={{ color: T.textSec, margin: 0, lineHeight: 1.6 }}>Vertical axis highly stable.<br />Minimal sensor drift.</p>
                                </div>
                            </div>

                            {/* B) IMU */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div className="graph-card">
                                    <ExpandableGraph src="/Aero-Controllers/phase-2/imu_linear_acceleration_x.png" alt="IMU Acceleration" width={600} height={400} />
                                    <div className="graph-caption">IMU Linear Acceleration (X)</div>
                                </div>
                                <div>
                                    <div style={{ color: T.cyan, fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>Smooth acceleration transitions</div>
                                    <p style={{ color: T.textSec, margin: 0, lineHeight: 1.6 }}>No chaotic spikes.<br />Controlled torque response.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeSection>

                {/* 7️⃣ OPTIONAL VIDEO SECTION */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 1000, marginBottom: 32 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24, textAlign: 'center' }}>Mid-Evolution Evaluation Run</h2>
                        <p style={{ fontSize: '1.2rem', color: T.textSec, marginBottom: 48, textAlign: 'center', lineHeight: 1.5 }}>
                            Simulation log generating the above deterministic and non-deterministic wind training metrics.
                        </p>

                        <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: T.bgBase, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.youtube.com/embed/Vugx3RBhP7Q"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            ></iframe>
                        </div>
                    </div>
                </FadeSection>

                {/* 8️⃣ MATHEMATICAL INTERPRETATION BLOCK */}
                <FadeSection style={{ background: T.secStrip, padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)', justifyContent: 'center' }}>
                        {[
                            { title: "Variance Reduction", eq: "Var(ω) ↓", desc: "Stabilizes oscillation" },
                            { title: "Bounded State", eq: "||x(t)|| ≤ C", desc: "Prevent divergence" },
                            { title: "Energy Finite", eq: "∫ ||ω(t)||² dt < ∞", desc: "Decaying transients" },
                            { title: "Low RMSE", eq: "Low RMSE_IMU", desc: "Repeatable dynamics" }
                        ].map((card, i) => (
                            <div key={i} style={{ flex: '1 1 250px', maxWidth: 300, padding: 32, background: T.bgBase, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ fontSize: '1.8rem', color: T.cyan, fontFamily: 'serif', fontStyle: 'italic' }}>{card.eq}</div>
                                <div>
                                    <div style={{ fontWeight: 500, color: T.textPri, marginBottom: 4 }}>{card.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: T.textSec }}>{card.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeSection>

                {/* 9️⃣ ENGINEERING VERDICT */}
                <FadeSection style={{ padding: '120px 40px 160px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: 32 }}>Phase-2 Engineering Validation</h2>
                    <p style={{ fontSize: '1.2rem', color: T.textSec, maxWidth: 800, lineHeight: 1.6, marginBottom: 64 }}>
                        Phase-2 confirms reduced rotational instability, improved damping behavior, and high repeatability across controlled disturbance injections, establishing quantitative stability improvement prior to stochastic robustness testing.
                    </p>

                    {/* Transition Box */}
                    <div style={{ display: 'flex', gap: 24, border: `1px solid ${T.border}`, padding: '32px 48px', borderRadius: 8, background: T.bgAlt, alignItems: 'center' }}>
                        <div style={{ color: T.textMuted }}>Phase-1 <br /><span style={{ color: T.textSec }}>Baseline Instability</span></div>
                        <div style={{ color: T.textMuted }}>➔</div>
                        <div style={{ color: T.textPri }}>Phase-2 <br /><span style={{ color: T.cyan }}>Quantified Improvement</span></div>
                        <div style={{ color: T.textMuted }}>➔</div>
                        <div style={{ color: T.textMuted }}>Phase-3 <br /><span style={{ color: T.textSec }}>Multi-Wind Robustness</span></div>
                    </div>
                </FadeSection>

            </main>
        </div>
    )
}


