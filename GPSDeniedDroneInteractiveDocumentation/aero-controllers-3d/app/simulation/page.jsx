"use client"
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { Navbar } from '../components/Navbar' // Adjusted relative path as Navbar is in app/components
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
export default function Phase1Page() {
    return (
        <div className="sim-page" style={{ background: T.bgBase, color: T.textPri, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
            <Navbar activePath="/simulation" />

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
                            <div style={{ color: T.redText, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.85rem', marginBottom: 16 }}>Phase-1</div>
                            <h1 style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', fontWeight: 300, marginBottom: 16, lineHeight: 1.1 }}>Phase-1 Baseline Instability Study</h1>
                            <p style={{ fontSize: 'clamp(1rem, 4.6vw, 1.2rem)', color: T.textSec, marginBottom: 32, lineHeight: 1.5, maxWidth: 600 }}>
                                Quantitative evaluation of uncontrolled quadrotor rotational behavior under wind disturbance injection.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec }}>
                                {['High angular velocity variance', 'Frequent instability spikes', 'Underdamped roll and pitch', 'No disturbance rejection'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.redText }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* RIGHT (40%) Framed Summary */}
                        <div style={{ flex: '4', border: `1px solid ${T.border}`, borderRadius: 8, padding: 32, background: T.bgBase }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { v: "High", l: "E[||ω||]" },
                                    { v: "High", l: "Var(||ω||)" },
                                    { v: "≫ 0", l: "N_spikes" },
                                    { v: "None", l: "Convergence" }
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
                            { l: "Mean ||ω||", v: "High" }, { l: "Var ||ω||", v: "High" }, { l: "Max Spike", v: "> 1.0 rad/s" },
                            { l: "Spike Count", v: "Frequent" }, { l: "Damping", v: "Poor" }, { l: "Convergence", v: "None" }
                        ].map((m, i) => (
                            <div key={i} className="metric-block" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: i < 5 ? `1px solid ${T.border}` : 'none' }}>
                                <div className="metric-number" style={{ fontSize: '26px', fontWeight: 300, color: T.textPri }}>{m.v}</div>
                                <div style={{ fontSize: '12px', color: T.textSec, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{m.l}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3️⃣ OVERALL ANGULAR VELOCITY MAGNITUDE */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={48}>
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph src="/Aero-Controllers/phase-1/magnitude-graph.png" alt="Overall Angular Velocity Magnitude" />
                                <div className="graph-caption">Total Rotational Instability Over Time</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingRight: 40 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Uncontrolled Rotational Response</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                <li>• Multiple bursts &gt; 1.0 rad/s</li>
                                <li>• Large corrective oscillations</li>
                                <li>• No smooth stabilization behavior</li>
                            </ul>
                            <div className="eq-box" style={{ padding: '16px 24px', background: T.redBox, border: `1px solid ${T.redText}`, borderRadius: 8, color: T.redText, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                Var(||ω||) is high<br />E[||ω||] is large
                                <span className="eq-tooltip" style={{ background: T.redText }}>System reacts to wind but does not damp oscillations.</span>
                            </div>
                        </div>
                    </LandscapeRow>
                </FadeSection>

                {/* 4️⃣ PER-AXIS ANGULAR VELOCITY */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={48} reverse>
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph src="/Aero-Controllers/phase-1/axis-graph.png" alt="Per-Axis Angular Velocity" />
                                <div className="graph-caption">Per-Axis Rotational Breakdown</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingLeft: 40 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Axis-Level Instability Characteristics</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                <li>• Wind induces tilt</li>
                                <li>• Roll & pitch overshoot significantly</li>
                                <li>• Corrective torques amplify oscillation</li>
                            </ul>
                            <div className="eq-box" style={{ padding: '12px 20px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 8, color: T.textPri, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', display: 'inline-block' }}>
                                Underdamped rotational response
                                <span className="eq-tooltip">Behavior resembles a poorly tuned PD controller.</span>
                            </div>
                        </div>
                    </LandscapeRow>
                </FadeSection>

                {/* 5️⃣ INSTABILITY SPIKE DETECTION */}
                <FadeSection style={{ padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center' }}>
                    <LandscapeRow gap={48}>
                        <div style={{ flex: 1, maxWidth: 600 }}>
                            <div className="graph-card">
                                <ExpandableGraph src="/Aero-Controllers/phase-1/spikes-graph.png" alt="Instability Spike Detection" />
                                <div className="graph-caption">Frequent Threshold Crossings Over Time</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingRight: 40 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>Instability Event Frequency</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 32 }}>
                                <li>• Frequent threshold violations</li>
                                <li>• Dense spike regions</li>
                                <li>• System cannot remain within safe angular envelope</li>
                            </ul>
                            <div className="eq-box" style={{ padding: '16px 24px', border: `1px solid ${T.border}`, borderRadius: 8, color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', display: 'inline-block' }}>
                                N_spikes ≫ 0
                                <span className="eq-tooltip">Where N_spikes = count(||ω|| &gt; ω_threshold)</span>
                            </div>
                        </div>
                    </LandscapeRow>
                </FadeSection>

                {/* 6️⃣ ENERGY INSTABILITY METRIC */}
                <FadeSection style={{ background: T.secStrip, padding: '96px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div className="eq-box" style={{
                        fontSize: 'clamp(28px, 3vw, 40px)', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 2,
                        padding: '40px 80px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 12, marginBottom: 32,
                        display: 'flex', alignItems: 'center', gap: 16
                    }}>
                        <span>I =</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '1.5rem', lineHeight: 1 }}>
                            <span>1</span>
                            <span style={{ width: '100%', height: 1, background: T.textPri, margin: '4px 0' }} />
                            <span>T</span>
                        </div>
                        <span style={{ fontSize: '3rem', fontWeight: 300 }}>∫</span>
                        <span>‖ω(t)‖² dt</span>
                        <span className="eq-tooltip">High instability integral represents high rotational energy and no convergence.</span>
                    </div>

                    <div style={{ fontSize: '1.2rem', color: T.redText, background: T.redBox, padding: '12px 24px', borderRadius: 8, border: `1px solid ${T.redText}` }}>
                        I_Phase1 is large
                    </div>

                </FadeSection>

                {/* 7️⃣ ENGINEERING CONCLUSION */}
                <FadeSection style={{ padding: '120px 40px 80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: 32 }}>Phase-1 Engineering Verdict</h2>
                    <p style={{ fontSize: '1.2rem', color: T.textSec, maxWidth: 800, lineHeight: 1.6, marginBottom: 48 }}>
                        Phase-1 demonstrates uncontrolled nonlinear rotational dynamics under wind disturbance, characterized by high angular velocity variance, frequent spike events, and absence of convergence behavior.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, color: T.textPri, fontSize: '1.1rem', marginBottom: 64 }}>
                        <li>✖ Cannot suppress rotational spikes</li>
                        <li>✖ Exhibits high oscillatory behavior</li>
                        <li>♦ Requires nonlinear disturbance rejection control</li>
                    </ul>

                    {/* 🎥 OPTIONAL VIDEO SECTION */}
                    <div style={{ width: '100%', maxWidth: 800, marginBottom: 80 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: T.bgBase, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                <iframe
                                    src="https://www.youtube.com/embed/MDs1X7NSu_I"
                                    allowFullScreen
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                ></iframe>
                            </div>
                            <div style={{ color: T.textSec, fontSize: '1.1rem', letterSpacing: 1 }}>Wind Injection Uncontrolled Response</div>
                        </div>
                    </div>

                    {/* 8️⃣ TRANSITION TO PHASE-2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 48px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.bgAlt, width: '100%', maxWidth: 800 }}>
                        <div style={{ display: 'flex', gap: 24, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                            <div style={{ color: T.textMuted }}>Phase-1 <br /><span style={{ color: T.textPri }}>Baseline Instability</span></div>
                            <div style={{ color: T.textMuted }}>➔</div>
                            <div style={{ color: T.textPri }}>Phase-2 <br /><span style={{ color: T.cyan }}>Quantified Improvement</span></div>
                            <div style={{ color: T.textMuted }}>➔</div>
                            <div style={{ color: T.textMuted }}>Phase-3 <br /><span style={{ color: T.textSec }}>Multi-Wind Robustness</span></div>
                        </div>
                        <div style={{ color: T.textSec, fontSize: '1rem', borderTop: `1px solid ${T.border}`, paddingTop: 24, textAlign: 'center' }}>
                            Phase-2 introduces quantitative validation of stabilization improvement across repeated disturbance injection trials.
                        </div>
                    </div>
                </FadeSection>

            </main>
        </div >
    )
}

