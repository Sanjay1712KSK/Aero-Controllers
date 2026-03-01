"use client"
import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '../../components/Navbar'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const T = {
    bgBase: '#02050A',
    bgAlt: '#080C16',
    border: '#1E2D4A',
    textPri: '#FFFFFF',
    textSec: '#A3B8CC',
    textMuted: '#5C7A99',
    cyan: '#00E5FF',
    green: '#00FF66',
    red: '#FF3333',
}

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

const FadeSection = ({ children, delay = 0, yOffset = 40, className = "", style = {} }) => {
    const sectionRef = useRef(null)

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [yOffset, delay])

    return <div ref={sectionRef} className={className} style={style}>{children}</div>
}

const MetricCell = ({ label, value }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', padding: '16px 24px',
        borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
        alignItems: 'center', justifyContent: 'center'
    }}>
        <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: '2rem', fontWeight: 300, color: T.textPri, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
)

const MathCell = ({ title, mathDesc }) => (
    <div style={{
        background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16
    }}>
        <div style={{ fontSize: '1.2rem', color: T.textPri, fontWeight: 300 }}>{title}</div>
        <div style={{ fontSize: '1.5rem', color: T.cyan, fontFamily: 'serif', fontStyle: 'italic' }}>{mathDesc}</div>
    </div>
)

const GraphImage = ({ src, alt, maxWidth = 1100 }) => (
    <div style={{ width: '100%', maxWidth: maxWidth, margin: '60px auto 40px auto', position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.bgBase }}>
        <Image src={src} alt={alt} width={1200} height={600} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
)

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function Phase2Page() {
    const containerRef = useRef(null)

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Initial load animations
            gsap.fromTo('.hero-text',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            )
            gsap.fromTo('.hero-videos fade-in',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.6 }
            )

            // Fade out hero on scroll
            gsap.to('.hero-wrapper', {
                opacity: 0,
                y: -50,
                scrollTrigger: {
                    trigger: '.hero-wrapper',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} style={{ background: T.bgBase, color: T.textPri, fontFamily: 'sans-serif', overflowX: 'hidden' }}>

            <Navbar activePath="/simulation/phase-2" />

            <main style={{ paddingTop: 72 }}>

                {/* 🧩 SECTION 1 — Hero Introduction */}
                <section className="hero-wrapper" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px', borderBottom: `1px solid ${T.border}`, position: 'relative' }}>

                    <div className="hero-text" style={{ color: T.cyan, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
                        Phase-2: Quantitative Stability Validation
                    </div>
                    <h1 className="hero-text" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 300, letterSpacing: '-1px', marginBottom: 24, lineHeight: 1.1, maxWidth: 900 }}>
                        From Visual Improvement to Measured Performance
                    </h1>
                    <p className="hero-text" style={{ fontSize: '1.25rem', color: T.textSec, fontWeight: 300, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 64px auto' }}>
                        Phase-2 introduces numerical evaluation metrics across repeated runs under identical wind conditions to validate stabilization consistency.
                    </p>

                    {/* Minimal side-by-side preview */}
                    <div className="hero-text hero-videos" style={{ display: 'flex', gap: 24, justifyContent: 'center', width: '100%', maxWidth: 800 }}>
                        <div style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: '#000', position: 'relative', aspectRatio: '16/9' }}>
                            <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 10, fontSize: '0.75rem', color: T.textPri, letterSpacing: 1, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4 }}>RUN 1</div>
                            <iframe src="https://www.youtube.com/embed/Vugx3RBhP7Q?autoplay=1&loop=1&mute=1&playlist=Vugx3RBhP7Q&controls=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media" style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover', opacity: 0.8, pointerEvents: 'none' }} />
                        </div>
                        <div style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: '#000', position: 'relative', aspectRatio: '16/9' }}>
                            <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 10, fontSize: '0.75rem', color: T.textPri, letterSpacing: 1, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4 }}>RUN 2</div>
                            <iframe src="https://www.youtube.com/embed/Vugx3RBhP7Q?autoplay=1&loop=1&mute=1&playlist=Vugx3RBhP7Q&controls=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media" style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover', opacity: 0.8, pointerEvents: 'none' }} />
                        </div>
                    </div>
                </section>

                {/* 🧩 SECTION 2 — Stability Metrics Dashboard */}
                <FadeSection style={{ padding: '120px 40px', background: T.bgAlt, borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: 64, textAlign: 'center' }}>Extracted Stability Metrics</h2>

                    <div style={{ width: '100%', maxWidth: 1000, background: T.bgBase, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}`, borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>

                        {/* Row 1: Position RMSE */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                            <MetricCell label="RMSE Pos,X" value="3.0076" />
                            <MetricCell label="RMSE Pos,Y" value="3.8208" />
                            <MetricCell label="RMSE Pos,Z" value="0.3661" />
                        </div>
                    </div>

                    <div style={{ color: T.textSec, fontSize: '1.1rem', marginTop: 24, marginBottom: 64, textAlign: 'center', maxWidth: 600 }}>
                        Low RMSE indicates consistent spatial behavior across repeated runs.
                    </div>

                    <div style={{ width: '100%', maxWidth: 1000, background: T.bgBase, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}`, borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>

                        {/* Row 2: Rotational Stability */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            <MetricCell label="RMSE Ω magnitude" value="0.1203" />
                            <MetricCell label="Var(ωx)" value="0.00677" />
                            <MetricCell label="Var(ωy)" value="0.00769" />
                            <MetricCell label="Var(ωz)" value="≈ 10⁻⁶" />
                        </div>
                    </div>

                    <div style={{ color: T.textSec, fontSize: '1.1rem', marginTop: 24, textAlign: 'center', maxWidth: 600 }}>
                        Lower angular variance → smoother dynamics → reduced oscillatory energy.
                    </div>
                </FadeSection>

                {/* 🧩 SECTION 3 — Trajectory Repeatability (XY Plane) */}
                <FadeSection style={{ padding: '120px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `1px solid ${T.border}` }}>

                    <GraphImage src="/Aero-Controllers/phase-2/Trajectory Comparision (x & y).png" alt="Trajectory Comparison" />

                    <div style={{ width: '100%', maxWidth: 600 }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 24, textAlign: 'center' }}>Nearly Overlapping Trajectories</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem', marginBottom: 24 }}>
                            <p style={{ margin: 0 }}>• Run-1 and Run-2 show minimal divergence</p>
                            <p style={{ margin: 0 }}>• Lateral deviation remains bounded</p>
                            <p style={{ margin: 0 }}>• No spatial drift amplification</p>
                        </div>

                        <div style={{ padding: '16px 24px', background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8, display: 'inline-block', color: T.cyan, fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem' }}>
                            ‖Δp‖ remains bounded.
                        </div>
                    </div>
                </FadeSection>

                {/* 🧩 SECTION 4 — Angular Velocity Behavior (Split) */}
                <FadeSection style={{ padding: '120px 40px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', gap: 60, alignItems: 'center', width: '100%', maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ flex: '1.5' }}>
                            {/* Max width here handled by flex layout, margins reset for split view */}
                            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.bgBase }}>
                                <Image src="/Aero-Controllers/phase-2/Angular Velocity Magnitude Comparision.png" alt="Angular Velocity Magnitude Comparison" width={800} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        </div>

                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 32 }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 300, margin: 0 }}>Angular Velocity Behavior</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: T.textSec, fontSize: '1.1rem' }}>
                                <p style={{ margin: 0 }}>• Similar peak magnitudes</p>
                                <p style={{ margin: 0 }}>• No exponential growth</p>
                                <p style={{ margin: 0 }}>• Transient spikes decay rapidly</p>
                                <p style={{ margin: 0 }}>• Controlled energy envelope</p>
                            </div>

                            <div style={{ padding: '16px 24px', borderLeft: `2px solid ${T.cyan}`, color: T.textPri, fontSize: '1.2rem', fontFamily: 'serif', fontStyle: 'italic' }}>
                                sup<sub style={{ fontSize: '0.7em', fontStyle: 'normal' }}>t</sub> ‖ω(t)‖ &lt; ω_max
                            </div>

                            <div style={{ color: T.textMuted, fontSize: '1rem' }}>
                                Interpretation: No runaway instability.
                            </div>
                        </div>
                    </div>
                </FadeSection>

                {/* 🧩 SECTION 5 — Per-Axis Control Behavior */}
                <FadeSection style={{ padding: '120px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `1px solid ${T.border}` }}>
                    <GraphImage src="/Aero-Controllers/phase-2/Angular Velocity Per Axis.png" alt="Angular Velocity Per Axis" />

                    <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 1100, marginTop: '24px' }}>
                        <div style={{ flex: 1, padding: '24px', background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: T.textPri, fontSize: '1.2rem', fontWeight: 500, marginBottom: 8 }}>Roll</div>
                            <div style={{ color: T.textSec }}>controlled correction</div>
                        </div>
                        <div style={{ flex: 1, padding: '24px', background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: T.textPri, fontSize: '1.2rem', fontWeight: 500, marginBottom: 8 }}>Pitch</div>
                            <div style={{ color: T.textSec }}>damped oscillation</div>
                        </div>
                        <div style={{ flex: 1, padding: '24px', background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: T.textPri, fontSize: '1.2rem', fontWeight: 500, marginBottom: 8 }}>Yaw</div>
                            <div style={{ color: T.textSec }}>stable axis</div>
                        </div>
                    </div>
                </FadeSection>

                {/* 🧩 SECTION 6 — Sensor-Level Consistency */}
                <FadeSection style={{ padding: '120px 40px', background: T.bgAlt, borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: '100%', maxWidth: 1100, marginBottom: 40 }}>
                        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.bgBase }}>
                            <Image src="/Aero-Controllers/phase-2/Barometer Altitude Comaparision.png" alt="Barometer Altitude Comparison" width={600} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.bgBase }}>
                            <Image src="/Aero-Controllers/phase-2/IMU Linear Acceleration X Comparision.png" alt="IMU Linear Acceleration Comparison" width={600} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    </div>

                    <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: T.textSec, fontSize: '1.1rem' }}>
                            <div style={{ color: T.textPri, fontWeight: 500, marginBottom: 4 }}>Key takeaway:</div>
                            <p style={{ margin: 0 }}>• Minimal vertical drift</p>
                            <p style={{ margin: 0 }}>• Smooth acceleration transitions</p>
                            <p style={{ margin: 0 }}>• No chaotic spikes</p>
                        </div>
                        <div style={{ padding: '20px 24px', background: T.bgBase, border: `1px solid ${T.cyan}`, borderRadius: 8, color: T.textPri, fontSize: '1.1rem' }}>
                            <span style={{ color: T.cyan, fontWeight: 500 }}>RMSE Pos,Z = 0.3661</span> → strong vertical stabilization.
                        </div>
                    </div>
                </FadeSection>

                {/* 🧩 SECTION 7 — Mathematical Interpretation */}
                <FadeSection style={{ padding: '120px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 1000, marginBottom: 48 }}>
                        <MathCell title="1️⃣ Reduced rotational variance" mathDesc="Var(ω) ↓" />
                        <MathCell title="2️⃣ Bounded state deviation" mathDesc="‖x(t)‖ ≤ C" />
                        <MathCell title="3️⃣ Finite rotational energy" mathDesc="∫ ‖ω(t)‖² dt < ∞" />
                        <MathCell title="4️⃣ Repeatable sensor response" mathDesc="Low RMSE_IMU" />
                    </div>

                    <p style={{ fontSize: '1.25rem', color: T.textSec, fontWeight: 300, lineHeight: 1.6, maxWidth: 600, textAlign: 'center', margin: 0 }}>
                        Phase-2 demonstrates measurable stabilization improvement and controlled dynamic response under identical wind conditions.
                    </p>
                </FadeSection>

                {/* 🧩 SECTION 8 — Engineering Conclusion */}
                <FadeSection style={{ padding: '160px 40px', background: T.bgAlt, borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: 48 }}>Stabilization is Now Measurable</h2>

                    <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16, color: T.textSec, fontSize: '1.2rem', textAlign: 'left', marginBottom: 64 }}>
                        <p style={{ margin: '0 0 16px 0', color: T.textPri }}>Phase-2 confirms:</p>
                        <p style={{ margin: 0 }}>• Reduced rotational instability</p>
                        <p style={{ margin: 0 }}>• Damped oscillatory behavior</p>
                        <p style={{ margin: 0 }}>• Bounded trajectory deviation</p>
                        <p style={{ margin: 0 }}>• Sensor-level repeatability</p>
                        <p style={{ margin: 0 }}>• Improved disturbance rejection</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 80, fontSize: '1.5rem', color: T.textPri }}>
                        <div style={{ opacity: 0.6 }}>Phase-2 validates improvement.</div>
                        <div style={{ color: T.cyan }}>Phase-3 tests robustness.</div>
                    </div>

                    <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.2, maxWidth: 1100, color: T.textPri, borderTop: `1px solid ${T.border}`, paddingTop: 64 }}>
                        Phase-2 quantitatively validates improved rotational stability and trajectory repeatability through RMSE reduction, variance control, and bounded angular velocity behavior under controlled disturbances.
                    </h1>

                    {/* Final Video Placement at Bottom as specified */}
                    <div style={{ width: '100%', maxWidth: 1100, margin: '80px auto 0 auto', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', background: '#000', position: 'relative', aspectRatio: '21/9' }}>
                        <iframe src="https://www.youtube.com/embed/Vugx3RBhP7Q?autoplay=1&loop=1&mute=1&playlist=Vugx3RBhP7Q&controls=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; fullscreen" style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }} allowFullScreen />
                    </div>
                </FadeSection>

            </main>
        </div>
    )
}
