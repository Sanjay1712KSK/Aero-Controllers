"use client"
import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '../components/Navbar'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const T = {
    bgBase: '#050A14', // Product page deep dark
    bgAlt: '#0A1122',
    bgBand: '#02050A', // Dark band for contrast sections
    border: '#1E2D4A',
    textPri: '#FFFFFF',
    textSec: '#A3B8CC',
    textMuted: '#5C7A99',
    cyan: '#00E5FF',
    green: '#00FF66',
    red: '#FF3333',
    yellow: '#FFB800'
}

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

// Fades in elements as they scroll into view
const FadeSection = ({ children, delay = 0, yOffset = 40, className = "" }) => {
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

    return <div ref={sectionRef} className={className}>{children}</div>
}

// Hover-expand Axis Card
const AxisCard = ({ title, desc1, desc2 }) => {
    const cardRef = useRef(null)

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -8, boxShadow: '0 20px 40px rgba(0,229,255,0.1)', borderColor: T.cyan, duration: 0.3, ease: 'power2.out' })
    }
    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', borderColor: T.border, duration: 0.3, ease: 'power2.out' })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                background: T.bgAlt,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                cursor: 'default',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
            }}
        >
            <h3 style={{ fontSize: '1.5rem', color: T.textPri, fontWeight: 300, textAlign: 'center', marginBottom: 8 }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
                <p style={{ color: T.textSec, fontSize: '0.95rem', margin: 0 }}>• {desc1}</p>
                <p style={{ color: T.textSec, fontSize: '0.95rem', margin: 0 }}>• {desc2}</p>
            </div>
        </div>
    )
}

// Counter animation
const StatCounter = ({ label, value, unit = "", highlightColor = T.textPri }) => {
    const counterRef = useRef(null)
    const valObj = { val: 0 }

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.to(valObj, {
                val: value,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: counterRef.current,
                    start: "top 80%"
                },
                onUpdate: () => {
                    if (counterRef.current) {
                        // Check if integer
                        const formatted = Number.isInteger(value)
                            ? Math.round(valObj.val)
                            : valObj.val.toFixed(2)
                        counterRef.current.innerHTML = formatted + unit
                    }
                }
            })
        })
        return () => ctx.revert()
    }, [value, unit])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 300, color: highlightColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                <span ref={counterRef}>0</span>
            </div>
        </div>
    )
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function Phase1Page() {
    const containerRef = useRef(null)

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Initial load animations
            gsap.fromTo('.nav-link',
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
            )
            gsap.fromTo('.hero-text',
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            )
            gsap.fromTo('.hero-visual',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.4 }
            )
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} style={{ background: T.bgBase, color: T.textPri, fontFamily: 'sans-serif', overflowX: 'hidden' }}>

            <Navbar activePath="/simulation" />

            <main style={{ paddingTop: 72 }}>

                {/* 1️⃣ HERO SECTION */}
                <section style={{
                    minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '0 100px',
                    borderBottom: `1px solid ${T.border}`
                }}>
                    <div style={{ display: 'flex', width: '100%', gap: 80, alignItems: 'center' }}>
                        {/* Left Text */}
                        <div style={{ flex: 1 }}>
                            <div className="hero-text" style={{ color: T.red, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.9rem', marginBottom: 16 }}>Phase-1</div>
                            <h1 className="hero-text" style={{ fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 300, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-1px' }}>
                                Baseline Instability Analysis
                            </h1>
                            <p className="hero-text" style={{ fontSize: '1.25rem', color: T.textSec, fontWeight: 300, marginBottom: 48, maxWidth: 600, lineHeight: 1.5 }}>
                                Pre-learning quadrotor behavior under stochastic wind disturbance.
                            </p>

                            {/* Technical Badges */}
                            <div className="hero-text" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {['Control: Static / No Learning', 'Wind: Stochastic + Gust Injection', 'Physics: UE5 + AirSim', 'Metric: ‖ω‖ (rad/s)'].map(badge => (
                                    <div key={badge} style={{
                                        padding: '8px 16px', background: T.bgAlt, border: `1px solid ${T.border}`,
                                        borderRadius: 4, fontSize: '0.85rem', color: T.textSec, letterSpacing: 0.5
                                    }}>
                                        {badge}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="hero-visual" style={{
                            flex: 1, height: '600px', position: 'relative', borderRadius: 16, overflow: 'hidden',
                            border: `1px solid ${T.border}`, boxShadow: `0 30px 60px ${T.red}15`
                        }}>
                            <iframe
                                src="https://www.youtube.com/embed/MDs1X7NSu_I?autoplay=1&loop=1&mute=1&playlist=MDs1X7NSu_I&controls=0&modestbranding=1&playsinline=1"
                                allow="autoplay; encrypted-media"
                                style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
                            />
                            {/* Vignette Overlay */}
                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(5,10,20,0.8) 100%)' }} />
                        </div>
                    </div>
                </section>

                {/* 2️⃣ THE CORE METRIC */}
                <section style={{ padding: '160px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FadeSection>
                        <h2 style={{ fontSize: '2rem', fontWeight: 300, color: T.textPri, marginBottom: 40, textAlign: 'center' }}>
                            Total Rotational Instability
                        </h2>
                    </FadeSection>

                    <FadeSection delay={0.2} style={{ marginBottom: 40 }}>
                        <div style={{
                            fontSize: 'clamp(32px, 4vw, 56px)', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 2,
                            padding: '40px 80px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 12
                        }}>
                            ‖ω‖ = √(ωₓ² + ω_y² + ω_z²)
                        </div>
                    </FadeSection>

                    <FadeSection delay={0.3}>
                        <p style={{ fontSize: '1.1rem', color: T.textSec, textAlign: 'center', maxWidth: 600, marginBottom: 80, lineHeight: 1.6 }}>
                            The magnitude of angular velocity represents total rotational instability. <br />
                            Higher values indicate uncontrolled oscillatory response.
                        </p>
                    </FadeSection>

                    {/* Graph */}
                    <FadeSection delay={0.4} style={{ width: '100%', maxWidth: 1000, marginBottom: 80 }}>
                        <div style={{ width: '100%', height: 'auto', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                            <Image
                                src="/Aero-Controllers/phase-1/magnitude-graph.png"
                                alt="Angular Velocity Magnitude Graph"
                                width={1200} height={600}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </FadeSection>

                    {/* 3-Column Highlights */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, width: '100%', maxWidth: 1000, marginTop: 24 }}>
                        <FadeSection delay={0.5} style={{ display: 'flex', justifyContent: 'center' }}><StatCounter label="Max Spike" value={1.05} unit=" rad/s" highlightColor={T.cyan} /></FadeSection>
                        <FadeSection delay={0.6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Variance</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: 300, color: T.textPri }}>High</div>
                            </div>
                        </FadeSection>
                        <FadeSection delay={0.7} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Stability</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: 300, color: T.red }}>Poor</div>
                            </div>
                        </FadeSection>
                    </div>
                </section>

                {/* 3️⃣ INTERACTIVE AXIS BREAKDOWN */}
                <section style={{ padding: '0 100px 160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FadeSection>
                        <h2 style={{ fontSize: '2rem', fontWeight: 300, color: T.textPri, marginBottom: 60, textAlign: 'center' }}>
                            Axis-Level Instability Dynamics
                        </h2>
                    </FadeSection>

                    <FadeSection delay={0.2} style={{ width: '100%', maxWidth: 1000, marginBottom: 60 }}>
                        <div style={{ width: '100%', height: 'auto', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                            <Image
                                src="/Aero-Controllers/phase-1/axis-graph.png"
                                alt="Angular Velocity Per Axis Graph"
                                width={1200} height={600}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </FadeSection>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, width: '100%', maxWidth: 1000, marginTop: 24 }}>
                        <FadeSection delay={0.3}><AxisCard title="Roll (ωx)" desc1="Large oscillatory swings" desc2="Crosswind sensitivity" /></FadeSection>
                        <FadeSection delay={0.4}><AxisCard title="Pitch (ωy)" desc1="Dominant instability axis" desc2="±1 rad/s excursions" /></FadeSection>
                        <FadeSection delay={0.5}><AxisCard title="Yaw (ωz)" desc1="Relatively stable" desc2="Minor disturbance coupling" /></FadeSection>
                    </div>
                </section>

                {/* 4️⃣ INSTABILITY EVENT DETECTION */}
                <section style={{ padding: '0 100px 160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FadeSection>
                        <h2 style={{ fontSize: '2rem', fontWeight: 300, color: T.textPri, marginBottom: 60, textAlign: 'center' }}>
                            Instability Event Detection
                        </h2>
                    </FadeSection>

                    <FadeSection delay={0.2} style={{ width: '100%', maxWidth: 1000, marginBottom: 60 }}>
                        <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                            <Image
                                src="/Aero-Controllers/phase-1/spikes-graph.png"
                                alt="Angular Velocity Spikes Graph"
                                width={1200} height={600}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </FadeSection>

                    {/* Stats Below Graph */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, width: '100%', maxWidth: 1000, marginBottom: 60, marginTop: 24 }}>
                        <FadeSection delay={0.3} style={{ display: 'flex', justifyContent: 'center' }}><StatCounter label="Total Spike Events" value={54} highlightColor={T.cyan} /></FadeSection>
                        <FadeSection delay={0.4} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Threshold</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 300, color: T.textPri }}>0.17 rad/s</div>
                            </div>
                        </FadeSection>
                        <FadeSection delay={0.5} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Instability Index I</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 300, color: T.red }}>High</div>
                            </div>
                        </FadeSection>
                    </div>

                    <FadeSection delay={0.6} style={{ width: '100%', maxWidth: 800 }}>
                        <div style={{
                            padding: '20px', background: `${T.cyan}10`, border: `1px solid ${T.cyan}30`, borderRadius: 8,
                            color: T.textPri, fontSize: '1.05rem', lineHeight: 1.6, textAlign: 'center'
                        }}>
                            Frequent threshold crossings confirm lack of adaptive disturbance rejection.
                        </div>
                    </FadeSection>
                </section>

                {/* 5️⃣ ENGINEERING INTERPRETATION (Dark Band) */}
                <section style={{
                    background: T.bgBand, padding: '120px 100px', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <FadeSection>
                        <h2 style={{ fontSize: '2rem', fontWeight: 300, color: T.textPri, marginBottom: 80, textAlign: 'center' }}>
                            What Is Physically Happening?
                        </h2>
                    </FadeSection>

                    <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 1000, marginBottom: 80 }}>
                        {['Wind → Tilt', 'Overshoot → Oscillation', 'Underdamped Response'].map((step, i) => (
                            <React.Fragment key={step}>
                                <FadeSection delay={i * 0.1} style={{
                                    flex: 1, background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 8,
                                    padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem', fontWeight: 400, color: T.cyan, textAlign: 'center'
                                }}>
                                    {step}
                                </FadeSection>
                                {i < 2 && (
                                    <FadeSection delay={(i * 0.1) + 0.05} style={{ display: 'flex', alignItems: 'center', color: T.border }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </FadeSection>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <FadeSection delay={0.4}>
                        <p style={{
                            fontSize: '1.4rem', color: T.textPri, fontWeight: 300, textAlign: 'center',
                            maxWidth: 800, lineHeight: 1.5, fontStyle: 'italic'
                        }}>
                            "Behavior resembles a poorly tuned PD controller with no adaptive gain scheduling."
                        </p>
                    </FadeSection>
                </section>



                {/* 7️⃣ THE MATHEMATICAL INSTABILITY METRIC */}
                <section style={{ padding: '0 100px 160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FadeSection>
                        <div style={{
                            fontSize: 'clamp(28px, 3vw, 40px)', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 2,
                            padding: '40px 80px', border: `1px solid ${T.border}`, background: T.bgAlt, borderRadius: 12, marginBottom: 40,
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
                        </div>
                    </FadeSection>

                    <FadeSection delay={0.2}>
                        <p style={{ fontSize: '1.1rem', color: T.textSec, textAlign: 'center' }}>
                            High I indicates sustained rotational energy and poor stabilization.
                        </p>
                    </FadeSection>
                </section>

                {/* 8️⃣ FINAL ENGINEERING SUMMARY PANEL */}
                <section style={{ padding: '0 100px 160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FadeSection style={{ width: '100%', maxWidth: 1000 }}>
                        <div style={{
                            background: `linear-gradient(135deg, ${T.bgAlt}, ${T.bgBase})`,
                            border: `1px solid ${T.border}`, borderRadius: 16, padding: '80px',
                            boxShadow: `0 40px 80px rgba(0,0,0,0.5)`,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Inner Glow */}
                            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${T.red}, transparent)`, opacity: 0.5 }} />

                            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, color: T.textPri, marginBottom: 40 }}>
                                Phase-1 Verdict
                            </h2>

                            <ul style={{
                                listStyle: 'none', padding: 0, margin: '0 0 60px 0', display: 'flex', flexDirection: 'column', gap: 20
                            }}>
                                {['High angular velocity variance', 'Frequent instability spikes', 'No disturbance rejection', 'Underdamped rotational response'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '1.2rem', color: T.textSec }}>
                                        <span style={{ color: T.red }}>✖</span> {item}
                                    </li>
                                ))}
                            </ul>

                            <div style={{
                                paddingTop: 40, borderTop: `1px solid ${T.border}`, fontSize: '1.2rem', lineHeight: 1.6, color: T.textPri, fontWeight: 300
                            }}>
                                These limitations necessitated the development of a nonlinear adaptive learning-based controller <br />
                                <span style={{ color: T.cyan, fontWeight: 400 }}>→ Proceed to Phase-3</span>
                            </div>
                        </div>
                    </FadeSection>
                </section>

                {/* 🔥 Final Phase-1 One-Liner */}
                <section style={{ padding: '0 100px 80px', textAlign: 'center' }}>
                    <FadeSection>
                        <p style={{ fontSize: '0.9rem', color: T.textMuted, maxWidth: 800, margin: '0 auto', letterSpacing: 0.5, lineHeight: 1.5 }}>
                            Phase-1 exposes the uncontrolled nonlinear rotational dynamics of the quadrotor under wind disturbance, establishing a quantitative instability baseline for adaptive reinforcement learning control.
                        </p>
                    </FadeSection>
                </section>

            </main>
        </div>
    )
}
