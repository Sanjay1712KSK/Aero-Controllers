"use client"
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '../components/Navbar'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── THEME TOKENS (EXTREME HIGH CONTRAST) ────────────────────────────────────
const T = {
    bgBase: '#010308',     // Near pure black with a 1% blue tint
    bgAlt: '#030612',      // Deepest midnight blue
    bgEq: '#080E1C',       // Card surfaces
    bgExpl: '#0B132B',     // Interactive/Hover surfaces
    border: '#1E2D4A',     // Sharper bounding borders for contrast
    textPri: '#FFFFFF',    // Absolute white primary text
    textSec: '#A3B8CC',    // Brighter legible secondary text
    cyan: '#00E5FF',       // High-saturation neon cyan
    green: '#00FF66',      // High-saturation neon green
    red: '#FF3333'         // High-saturation penalty red
}

const ABOUT_BG_GRADE = 'radial-gradient(circle at 30% 20%, #1b2946 0%, #141426 42%, #101018 100%)'

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────
const SectionWrapper = ({ id, title, subtitle, children, altBg = false }) => {
    return (
        <section
            id={id}
            className="arch-section"
            style={{
                minHeight: '85vh',
                backgroundColor: 'transparent',
                borderTop: 'none',
                padding: '96px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Grid for Depth */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `radial-gradient(circle, ${T.border}80 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
                opacity: 0.06,
                pointerEvents: 'none',
                zIndex: 0
            }} />
            <div style={{
                width: '100%',
                maxWidth: 'var(--mac-page-max-width, 1200px)',
                padding: '0 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32, width: '100%', maxWidth: 800 }}>
                    <div style={{
                        color: T.cyan,
                        fontSize: '0.85rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginBottom: 16
                    }}>
                        {id}
                    </div>
                    <h2 style={{
                        color: T.textPri,
                        fontSize: '2.5rem',
                        fontWeight: 300,
                        letterSpacing: '-0.5px',
                        marginBottom: 24,
                        lineHeight: 1.2
                    }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{
                            color: T.textSec,
                            fontSize: '1.25rem',
                            lineHeight: 1.6,
                            fontWeight: 300
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </section>
    )
}

const FlowBox = ({ children, logo, title, desc, tooltip, color = T.textPri, borderColor = T.border, width = 240, height = 130, glow = false }) => {
    const [hover, setHover] = useState(false)
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                padding: '20px',
                border: `1px solid ${hover ? T.cyan : borderColor}`,
                background: T.bgEq,
                color: color,
                textAlign: 'center',
                width: `min(${width}px, 100%)`,
                height: height,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'sans-serif',
                transform: `perspective(1000px) rotateX(${hover ? '0deg' : '2deg'}) translateY(${hover ? '-8px' : '0px'}) scale(${hover ? 1.02 : 1})`,
                boxShadow: hover ? `0 20px 40px rgba(0,0,0,0.6)` : '0 10px 30px rgba(0,0,0,0.4)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.25s ease',
                position: 'relative',
                zIndex: hover ? 10 : 1
            }}
        >
            {logo && (
                <div style={{ height: 40, marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {logo}
                </div>
            )}
            {title && (
                <div style={{ fontSize: '1.2rem', fontWeight: 500, color: T.textPri, marginBottom: desc ? 8 : 0 }}>
                    {title}
                </div>
            )}
            {desc && (
                <div style={{ fontSize: '0.9rem', color: T.textSec, letterSpacing: 0.5 }}>
                    {desc}
                </div>
            )}
            {children}

            {/* Tooltip Popup */}
            {tooltip && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    marginTop: 16,
                    background: T.bgExpl,
                    border: `1px solid ${T.border}`,
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    color: T.textPri,
                    whiteSpace: 'nowrap',
                    opacity: hover ? 1 : 0,
                    transform: `translateY(${hover ? 0 : 8}px) scale(${hover ? 1 : 0.95})`,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    borderRadius: 4
                }}>
                    {tooltip}
                </div>
            )}
        </div>
    )
}

const ArrowDown = ({ color = T.textSec, height = 64 }) => (
    <div style={{
        width: 1.5,
        height: height,
        background: color,
        margin: '0 auto',
        position: 'relative',
        opacity: 0.5
    }}>
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `6px solid ${color}`
        }} />
    </div>
)

const ArrowSide = ({ color = T.textSec, width = 64 }) => (
    <div style={{
        height: 1.5,
        width: width,
        background: color,
        margin: 'auto 0',
        position: 'relative',
        opacity: 0.5
    }}>
        <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: `6px solid ${color}`
        }} />
    </div>
)

const TagChip = ({ children, color = T.textSec, borderColor = T.border }) => {
    const [hover, setHover] = useState(false)
    return (
        <span
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: T.bgExpl,
                border: `1px solid ${hover ? T.cyan : borderColor}`,
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: '0.8rem',
                color: hover ? T.textPri : color,
                whiteSpace: 'nowrap',
                display: 'inline-block',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hover ? 'translateY(-2px)' : 'none',
                boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                cursor: 'default'
            }}>
            {children}
        </span>
    )
}

// ─── SVG LOGOS ───────────────────────────────────────────────────────────────
const SvgWindows = () => <svg viewBox="0 0 88 88" width="100%" height="100%" fill="currentColor"><path d="M0,12.4L35.7,7.5v34.4H0V12.4z M39.3,6.9L88,0v41.8H39.3V6.9z M39.3,46h48.7v42l-48.7-7.1V46z M0,46h35.7v34.6L0,75.7V46z" /></svg>
const SvgUnreal = () => <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-12.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5h2v5c0 1.93-1.57 3.5-3.5 3.5S8 14.43 8 12.5v-5h2z" /></svg>
const SvgAirSim = () => <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
const SvgPython = () => <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12.04 2c-5.11 0-4.99 2.2-4.99 2.2l.02 2.29h5.11v.68H7.32C3.12 7.17 3 10.3 3 10.3c0 3.2.39 5.37 4.16 5.37h1.61v-2.31c0-2.61 2.15-2.65 2.15-2.65h3.69c1.9 0 1.88-1.85 1.88-1.85V5.59S16.5 2 12.04 2zm-1.4 1.52c.4 0 .73.32.73.72s-.33.72-.73.72-.72-.32-.72-.72.32-.72.72-.72zm6.2 4.19c-1.9 0-1.88 1.85-1.88 1.85v3.29s0 1.85-1.88 1.85H9.39s-1.9 0-1.9 1.88v3.25s-.1 3.51 4.7 3.51c5.11 0 5-2.2 5-2.2l-.02-2.34H12.1v-.68h4.86c4.2 0 4.31-3.13 4.31-3.13 0-3.2-.39-5.37-4.16-5.37h-1.61v2.32c0 2.61-2.15 2.64-2.15 2.64h-3.69c-1.9 0-1.88-1.85-1.88-1.85V9.58s-.01-1.88 1.88-1.88h3.04zM13.4 20.48c-.4 0-.73-.32-.73-.72s.33-.72.73-.72.72.32.72.72-.32.72-.72.72z" /></svg>
const SvgNvidia = () => <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M4 14.5A7.5 7.5 0 0 1 11.5 7 7.5 7.5 0 0 1 19 14.5M6 14.5A5.5 5.5 0 0 1 11.5 9 5.5 5.5 0 0 1 17 14.5M8 14.5A3.5 3.5 0 0 1 11.5 11 3.5 3.5 0 0 1 15 14.5M11.5 13A1.5 1.5 0 1 1 11.5 16 1.5 1.5 0 0 1 11.5 13Z" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
const SvgPytorch = () => <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ArchitecturePage() {
    const containerRef = useRef(null)
    const [activeStep, setActiveStep] = useState(0)
    const [activeHw, setActiveHw] = useState('gpu')
    const [viewportWidth, setViewportWidth] = useState(1440)
    const isNarrow = viewportWidth < 980
    const isPhone = viewportWidth < 760
    const loopSize = isPhone ? Math.max(320, Math.min(viewportWidth - 32, 520)) : 660
    const loopCenter = loopSize / 2
    const loopRadius = loopSize * 0.39
    const loopNodeW = isPhone ? 120 : 180
    const loopNodeH = isPhone ? 68 : 90

    const executionSteps = [
        { title: 'Launch Engine', desc: 'Initialize Unreal Engine 5.5.4 in headless or editor mode.', code: 'UnrealEditor.exe "AeroProject.uproject" -game' },
        { title: 'Load plugin', desc: 'Cosys-AirSim initializes physics hooks and RPC bridges.', code: 'LogAirSim: Active Drone Controller: simple_flight' },
        { title: 'Start Environment', desc: 'Load the domain-randomized wind regime.', code: 'simEnableApiControl(True)' },
        { title: 'Run Python Agent', desc: 'Initialize PyTorch and connect to RPC port.', code: 'python train_ppo.py --env AirSim-v0' },
        { title: 'Optimize Policy', desc: '600k gradient ascent steps tracking advantage.', code: 'logger.record("rollout/ep_rew_mean", reward)' },
        { title: 'Evaluate Robustness', desc: 'Deploy frozen weights into extreme turbulence.', code: 'python eval.py --weights best_model.zip' }
    ]

    const hwSpecs = {
        gpu: {
            title: 'NVIDIA GPU Compute',
            desc: 'Massively parallel hardware acceleration for matrix operations and policy optimization.',
            specs: [
                { label: 'Compute API', val: 'CUDA 11.8' },
                { label: 'Backend Map', val: 'cu118' },
                { label: 'VRAM Req.', val: '12 GB minimum' },
                { label: 'Workload', val: 'PPO Backprop, Env Vectorization' }
            ],
            color: T.green
        },
        cpu: {
            title: 'Host CPU Worker',
            desc: 'Linear sequential execution handling OS events, Python GIL, and Unreal Engine threading.',
            specs: [
                { label: 'Cores Req.', val: '8 Cores / 16 Threads' },
                { label: 'Base Clock', val: '3.6 GHz' },
                { label: 'Instruction Set', val: 'x64 Architecture' },
                { label: 'Workload', val: 'RPC Bridge, OS IO' }
            ],
            color: T.cyan
        },
        ram: {
            title: 'System Memory',
            desc: 'High-speed volatile storage bridging the gap between disk buffers and GPU VRAM.',
            specs: [
                { label: 'Capacity', val: '32 GB minimum' },
                { label: 'Type', val: 'DDR4 / DDR5' },
                { label: 'Buffer Role', val: 'Experience Replay Queue' },
                { label: 'UE5 Role', val: 'Asset caching, Physics mesh' }
            ],
            color: T.textPri
        }
    }

    useLayoutEffect(() => {
        const scrollerEl = containerRef.current?.closest('.mac-window-content') || undefined

        let ctx = gsap.context(() => {
            gsap.utils.toArray('.arch-section').forEach((sec) => {
                const elements = Array.from(sec.querySelectorAll('.arch-step')).filter(Boolean)
                if (elements.length > 0) {
                    gsap.fromTo(elements,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1, y: 0,
                            duration: 0.8,
                            stagger: 0.15,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: sec,
                                start: 'top 75%',
                                scroller: scrollerEl,
                            }
                        }
                    )
                }
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth)
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return (
        <div ref={containerRef} style={{ background: ABOUT_BG_GRADE, backgroundAttachment: 'fixed', backgroundSize: 'cover', minHeight: '100vh', color: T.textPri, fontFamily: 'sans-serif', paddingTop: 72 }}>

            <Navbar activePath="/architecture" />

            {/* --- HEADER --- */}
            <header style={{
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: isPhone ? '0 18px' : '0 40px'
            }} className="arch-section">
                <div className="arch-step" style={{ maxWidth: 800 }}>
                    <h1 style={{
                        fontSize: isPhone ? 'clamp(34px, 12vw, 48px)' : 'clamp(40px, 5vw, 64px)',
                        fontWeight: 300,
                        letterSpacing: '-1px',
                        marginBottom: 24,
                        lineHeight: 1.1
                    }}>
                        Technical Stack &<br />System Architecture
                    </h1>
                    <p style={{
                        fontSize: isPhone ? '1.15rem' : '1.5rem',
                        color: T.textSec,
                        fontWeight: 300,
                        lineHeight: 1.6
                    }}>
                        Closed-loop reinforcement learning stabilization system built on Unreal Engine 5 and Cosys-AirSim.
                    </p>
                </div>
            </header>

            {/* --- SECTION 1: HIGH-LEVEL ARCHITECTURE --- */}
            <SectionWrapper
                id="01 — High-Level System Architecture"
                title="Layered Simulation Stack"
                subtitle="This architecture forms a real-time cyber-physical simulation and learning loop."
                altBg
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 0 }}>
                    <FlowBox logo={<SvgWindows />} title="Windows 11 OS" desc="Host Environment" />
                    <ArrowDown />
                    <FlowBox logo={<SvgUnreal />} title="Unreal Engine" desc="5.5.4" color={T.cyan} borderColor={T.cyan} />
                    <ArrowDown />
                    <FlowBox logo={<SvgAirSim />} title="Cosys-AirSim Plugin" desc="Physics Extension" />
                    <ArrowDown />
                    <FlowBox title="RPC Bridge" desc="msgpack API" color={T.green} borderColor={T.green} />
                    <ArrowDown />

                    {/* PYTHON PPO ENGINE WITH STACK */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        background: T.bgEq, border: `1px solid ${T.border}`, padding: '40px',
                        width: '100%', maxWidth: 800,
                        transform: 'perspective(1000px) rotateX(2deg)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                        transition: 'transform 0.25s ease',
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(-6px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) translateY(0)'}
                    >
                        <div style={{ height: 40, marginBottom: 16, color: T.textPri }}>
                            <SvgPython />
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 500, color: T.textPri, marginBottom: 8 }}>Python PPO Engine</div>
                        <div style={{ fontSize: '0.9rem', color: T.textSec, marginBottom: 32 }}>Policy Optimization Backend</div>

                        <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'repeat(3, 1fr)', gap: isPhone ? 22 : 32, width: '100%', textAlign: 'left' }}>
                            <div>
                                <div style={{ color: T.textPri, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Core RL</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <TagChip>stable-baselines3 2.7.1</TagChip>
                                    <TagChip>gym 0.26.2</TagChip>
                                    <TagChip>gymnasium 1.2.3</TagChip>
                                    <TagChip>Shimmy 2.0.0</TagChip>
                                </div>
                            </div>
                            <div>
                                <div style={{ color: T.cyan, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Deep Learning</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <TagChip>torch 2.7.1+cu118</TagChip>
                                    <TagChip>torchvision 0.22.1+cu118</TagChip>
                                    <TagChip>torchaudio 2.7.1+cu118</TagChip>
                                    <TagChip>CUDA 11.8</TagChip>
                                </div>
                            </div>
                            <div>
                                <div style={{ color: T.green, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Simulation Interface</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <TagChip>cosysairsim 3.3.0</TagChip>
                                    <TagChip>rpc-msgpack 0.6</TagChip>
                                    <TagChip>msgpack 1.1.2</TagChip>
                                </div>
                            </div>
                            <div>
                                <div style={{ color: T.textSec, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Data & Analysis</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <TagChip>numpy 2.2.6</TagChip>
                                    <TagChip>pandas 2.3.3</TagChip>
                                    <TagChip>matplotlib 3.10.8</TagChip>
                                    <TagChip>opencv-python 4.12.0.88</TagChip>
                                </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <div style={{ color: T.textSec, fontSize: '0.9rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>System Monitoring</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <TagChip>pynvml 13.0.1</TagChip>
                                    <TagChip>nvidia-ml-py 13.590.48</TagChip>
                                    <TagChip>psutil 7.2.2</TagChip>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 32, fontSize: '0.95rem', color: T.textSec, fontStyle: 'italic', borderTop: `1px solid ${T.border}`, paddingTop: 16, width: '100%', textAlign: 'center' }}>
                            CUDA-enabled PyTorch backend with Stable-Baselines3 PPO implementation.
                        </div>
                    </div>

                    <ArrowDown />
                    <FlowBox color={T.textSec}>Logging + Evaluation</FlowBox>
                </div>
            </SectionWrapper>

            {/* --- SECTION 2: CLOSED-LOOP CONTROL FLOW --- */}
            <SectionWrapper
                id="02 — Closed-Loop Control Flow"
                title="Policy Optimization Cycle"
                subtitle="This is the heart of the system."
            >
                <div className="arch-step" style={{
                    position: 'relative',
                    background: T.bgEq, border: `1px solid ${T.border}`,
                    borderRadius: '50%', width: loopSize, height: loopSize,
                    transform: 'perspective(1000px) rotateX(2deg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                }}>
                    {/* SVG Flow Trace */}
                    <svg viewBox={`0 0 ${loopSize} ${loopSize}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <circle cx={loopCenter} cy={loopCenter} r={loopRadius} fill="none" stroke={T.border} strokeWidth="1.5" strokeDasharray="4 8" />
                        <circle cx={loopCenter} cy={loopCenter - loopRadius} r="6" fill={T.cyan}>
                            <animateTransform attributeName="transform" type="rotate" from={`0 ${loopCenter} ${loopCenter}`} to={`360 ${loopCenter} ${loopCenter}`} dur="12s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Nodes Array */}
                    {[
                        { title: 'Sensor Data', sub: 'IMU, Vision, Odometry', angle: -90, color: T.textPri },
                        { title: 'State Vector', sub: 'Network Inputs', angle: -30, color: T.cyan },
                        { title: 'PPO Policy', sub: 'Forward Pass', angle: 30, color: T.green },
                        { title: 'Motor Commands', sub: 'Thrust PWM', angle: 90, color: T.red },
                        { title: 'AirSim Physics', sub: 'Rigid Body Sim', angle: 150, color: T.textSec },
                        { title: 'Updated State', sub: 'Next Iteration', angle: 210, color: T.cyan }
                    ].map((node, i) => {
                        const left = loopCenter + loopRadius * Math.cos(node.angle * Math.PI / 180) - (loopNodeW / 2);
                        const top = loopCenter + loopRadius * Math.sin(node.angle * Math.PI / 180) - (loopNodeH / 2);

                        return (
                            <div key={i} className="hover-lift-node" style={{
                                position: 'absolute', left, top,
                                width: loopNodeW, height: loopNodeH, background: T.bgExpl, border: `1px solid ${T.border}`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease', cursor: 'default'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.borderColor = T.cyan
                                    e.currentTarget.children[1].style.opacity = '1'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.borderColor = T.border
                                    e.currentTarget.children[1].style.opacity = '0'
                                }}>
                                <div style={{ fontSize: isPhone ? '0.98rem' : '1.2rem', color: node.color, fontWeight: 500, textAlign: 'center', padding: '0 6px' }}>{node.title}</div>
                                <div style={{
                                    position: 'absolute', bottom: isPhone ? -22 : -28, fontSize: isPhone ? '0.74rem' : '0.9rem', color: T.textSec,
                                    opacity: 0, transition: 'opacity 0.2s ease', whiteSpace: 'nowrap'
                                }}>
                                    {node.sub}
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
                        <div style={{ fontSize: isPhone ? '1rem' : '1.8rem', color: T.textPri, marginBottom: 8, fontWeight: 300, lineHeight: 1.3 }}>Real-Time<br />Cyber-Physical<br />Learning Loop</div>
                        <div style={{ fontSize: isPhone ? '0.72rem' : '0.9rem', color: T.cyan, textTransform: 'uppercase', letterSpacing: 1 }}>600,000 Iterative Updates</div>
                    </div>
                </div>
            </SectionWrapper>

            {/* --- SECTION 3: RPC PIPELINE --- */}
            <SectionWrapper
                id="03 — RPC Communication Pipeline"
                title="Bidirectional Data Flow"
                altBg
            >
                <div className="arch-step" style={{ width: '100%', maxWidth: 1000, textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 64 }}>

                        <FlowBox title="Python Agent" desc="PyTorch Policy" tooltip="Receives sensor data, outputs actions." />

                        <div style={{ position: 'relative', width: isNarrow ? 2 : 120, height: isNarrow ? 70 : 2, background: T.border, margin: isNarrow ? '14px 0' : '0 16px' }}>
                            <div style={{ fontSize: '0.8rem', position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', color: T.textPri, letterSpacing: 1 }}>RPC</div>
                            <div style={{ width: 6, height: 6, background: T.cyan, borderRadius: '50%', position: 'absolute', top: isNarrow ? 0 : -2, left: isNarrow ? -2 : 0, animation: `dataFlow${isNarrow ? 'Vertical' : ''} 3s infinite linear` }} />
                        </div>

                        <FlowBox title="AirSim API" desc="C++ Wrapper" color={T.green} borderColor={T.green} tooltip="Bridges Python RPC to Unreal physics layer." />

                        <div style={{ position: 'relative', width: isNarrow ? 2 : 120, height: isNarrow ? 70 : 2, background: T.border, margin: isNarrow ? '14px 0' : '0 16px' }}>
                            <div style={{ fontSize: '0.8rem', position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', color: T.textPri, letterSpacing: 1 }}>NATIVE</div>
                            <div style={{ width: 6, height: 6, background: T.cyan, borderRadius: '50%', position: 'absolute', top: isNarrow ? 0 : -2, left: isNarrow ? -2 : 0, animation: `dataFlow${isNarrow ? 'Vertical' : ''} 3s infinite linear 1s` }} />
                        </div>

                        <FlowBox title="UE5 Physics" desc="Rigid Body Env" tooltip="Computes collisions, aerodynamics, constraints." />

                    </div>

                    <div style={{
                        background: T.bgEq, border: `1px solid ${T.border}`, padding: isPhone ? '24px 20px' : '40px 60px',
                        textAlign: 'left', lineHeight: 2, fontSize: isPhone ? '1.05rem' : '1.25rem', color: T.textSec
                    }}>
                        <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <li><span style={{ color: T.textPri }}>Python</span> sends motor command</li>
                            <li><span style={{ color: T.textPri }}>AirSim</span> converts to thrust/torque</li>
                            <li><span style={{ color: T.textPri }}>UE5</span> updates physics frame</li>
                            <li><span style={{ color: T.cyan }}>Sensor state</span> returned via API</li>
                            <li><span style={{ color: T.green }}>PPO</span> computes next optimal action</li>
                        </ul>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes dataFlow {
                        0% { transform: translateX(0); opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { transform: translateX(114px); opacity: 0; }
                    }
                    @keyframes dataFlowVertical {
                        0% { transform: translateY(0); opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { transform: translateY(64px); opacity: 0; }
                    }
                `}} />
            </SectionWrapper>

            {/* --- SECTION 4: QUADROTOR PHYSICS PIPELINE --- */}
            <SectionWrapper
                id="04 — Quadrotor Physics Pipeline"
                title="Force-to-State Integration Flow"
                subtitle="Full nonlinear rigid body simulation with aerodynamic disturbance injection."
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isNarrow ? 28 : 64, width: '100%', maxWidth: 1000 }}>

                    {/* Left Flow - Mechanical */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '1rem', color: T.textSec, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Control Inputs</div>
                        <FlowBox title="Rotor Speeds" desc="PWM Signals" color={T.red} borderColor={T.red} tooltip="Quadratic thrust curves mapping RPM to Force." />
                        <ArrowDown />
                        <FlowBox title="Thrust Forces" />
                        <ArrowDown />
                        <FlowBox title="Torque Generation" />
                        <ArrowDown />
                        <FlowBox title="Rigid Body Dynamics" desc="(6-DOF)" />
                    </div>

                    {/* Middle Merging */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: isNarrow ? 0 : 180 }}>
                        <div style={{ display: 'flex', width: 200, justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ width: '50%', borderTop: `1.5px solid ${T.textSec}`, borderRight: `1.5px solid ${T.textSec}` }} />
                            <div style={{ width: '50%', borderTop: `1.5px solid ${T.textSec}`, borderLeft: `1.5px solid ${T.textSec}` }} />
                        </div>
                        <ArrowDown height={32} />
                        <FlowBox title="Updated Pose" desc="Quaternion Integration" color={T.cyan} borderColor={T.cyan} tooltip="Orientation representation avoiding gimbal lock." />
                        <ArrowDown />
                        <FlowBox title="Sensor Output" desc="IMU & Vision" color={T.cyan} borderColor={T.cyan} />
                    </div>

                    {/* Right Flow - Disturbance */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '1rem', color: T.textSec, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Environment</div>
                        <FlowBox title="Wind Model" desc="Disturbance" color={T.textSec} tooltip="Stochastic Dryden wind turbulence and steady gusts." />
                        <ArrowDown />
                        <FlowBox title="Aerodynamic Force" color={T.textSec} />
                        <ArrowDown />
                        <div style={{ height: 130 }} /> {/* Spacer to align with Rigid Body */}
                        <FlowBox title="Physics Engine" desc="Unreal Engine Layer" color={T.textSec} />
                    </div>

                </div>
            </SectionWrapper>

            {/* --- SECTION 5: WIND & DOMAIN RANDOMIZATION --- */}
            <SectionWrapper
                id="05 — Wind & Domain Randomization"
                title="Disturbance-Robust Learning"
                subtitle="Domain randomization ensures stability across extreme operational envelopes."
                altBg
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 1000 }}>

                    <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : isNarrow ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 24, width: '100%', marginBottom: 32 }}>
                        {['Calm', 'Stochastic Smooth', 'Strong Gust', 'Mixed'].map((type, i) => (
                            <div key={i} style={{
                                background: T.bgEq,
                                border: `1px solid ${i === 2 ? T.red : T.border}`,
                                padding: '32px 24px',
                                textAlign: 'center',
                                borderRadius: 8,
                                color: i === 2 ? T.red : T.textPri,
                                fontSize: '1.1rem',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                {type}
                            </div>
                        ))}
                    </div>

                    <div style={{ width: '100%', height: 1, background: T.border, marginBottom: 40 }} />

                    <ArrowDown />
                    <FlowBox title="Training Distribution" color={T.cyan} borderColor={T.cyan} />
                    <ArrowDown />
                    <FlowBox title="Policy Optimization" color={T.green} borderColor={T.green} />

                </div>
            </SectionWrapper>

            {/* --- SECTION 6: TRAINING EVOLUTION --- */}
            <SectionWrapper
                id="06 — Training Evolution"
                title="Monotonic Stabilization Improvement"
                subtitle="Tracking performance gains across discrete training phases."
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 800, gap: 32 }}>

                    {[
                        { step: '0 Steps', val: '100%', color: T.red },
                        { step: '50k Steps', val: '65%', color: T.textPri },
                        { step: '200k Steps', val: '25%', color: T.cyan },
                        { step: '600k Steps', val: '5%', color: T.green }
                    ].map((phase, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <div style={{ width: 120, fontSize: '1.2rem', color: T.textPri }}>{phase.step}</div>
                            <div style={{ flexGrow: 1, height: 16, background: T.bgEq, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, bottom: 0,
                                    width: phase.val, background: phase.color,
                                    transition: 'width 2s cubic-bezier(0.22, 1, 0.36, 1)'
                                }} />
                            </div>
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: 32, fontSize: '1.4rem', color: T.textSec, letterSpacing: 2 }}>
                        M₀ &gt; M₅₀ₖ &gt; M₂₀₀ₖ &gt; M₆₀₀ₖ
                    </div>

                </div>
            </SectionWrapper>

            {/* --- SECTION 7: FINAL EVALUATION PIPELINE --- */}
            <SectionWrapper
                id="07 — Final Evaluation Pipeline"
                title="System Rollout Assessment"
                subtitle="Worst-case wind regime minimized through robust policy evaluation."
                altBg
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <FlowBox title="Trained Policy" color={T.green} borderColor={T.green} />
                    <ArrowDown />
                    <FlowBox title="Wind Regime i" />
                    <ArrowDown />
                    <FlowBox title="Physics Rollout" />
                    <ArrowDown />
                    <FlowBox title="Stability Score S_i" color={T.cyan} borderColor={T.cyan} />
                    <ArrowDown />
                    <FlowBox title="Comparison Across Regimes" />
                </div>
            </SectionWrapper>

            {/* --- SECTION 8: TOOLCHAIN & VERSION TABLE --- */}
            <SectionWrapper
                id="08 — Toolchain & Version Table"
                title="Software Stack"
            >
                <div className="arch-step" style={{ width: '100%', maxWidth: 800, overflowX: 'auto' }}>
                    <div style={{ minWidth: isNarrow ? 560 : 'auto', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', borderBottom: `1px solid ${T.border}`, paddingBottom: 16, marginBottom: 16, color: T.textSec, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.9rem' }}>
                        <div>Component</div>
                        <div>Version</div>
                    </div>
                    {[
                        ['Python', '3.10', T.textPri],
                        ['Unreal Engine', '5.5.4', T.cyan],
                        ['Cosys-AirSim', 'April 2025', T.textPri],
                        ['Visual Studio', '2022 v17.13.6', T.textSec],
                        ['MSVC', '14.43', T.textSec],
                        ['Windows SDK', '10.0.22621.0', T.textSec]
                    ].map((row, i) => (
                        <div key={i} style={{ minWidth: isNarrow ? 560 : 'auto', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', padding: '16px 0', borderBottom: `1px solid ${T.border}`, color: row[2], fontSize: '1.2rem', alignItems: 'center' }}>
                            <div>{row[0]}</div>
                            <div style={{ fontFamily: 'monospace' }}>{row[1]}</div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* --- SECTION 9: HARDWARE SPECIFICATIONS --- */}
            <SectionWrapper
                id="09 — Hardware Specifications"
                title="Compute Infrastructure"
                altBg
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', width: '100%', maxWidth: 1000, gap: isNarrow ? 24 : 40, alignItems: 'stretch' }}>

                    {/* Interactive Node Graph */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, justifyContent: 'center' }}>
                        <div
                            onClick={() => setActiveHw('gpu')}
                            style={{
                                background: T.bgEq, border: `1px solid ${activeHw === 'gpu' ? T.green : T.border}`,
                                padding: '32px 24px', borderRadius: 8, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 20,
                                transform: !isNarrow && activeHw === 'gpu' ? 'translateX(12px)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: activeHw === 'gpu' ? 1 : 0.6
                            }}>
                            <div style={{ width: 48, height: 48, color: T.green }}><SvgNvidia /></div>
                            <div>
                                <div style={{ fontSize: '1.4rem', color: T.textPri, fontWeight: 500 }}>NVIDIA GPU</div>
                                <div style={{ fontSize: '0.9rem', color: T.textSec, marginTop: 4 }}>CUDA Acceleration</div>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveHw('cpu')}
                            style={{
                                background: T.bgEq, border: `1px solid ${activeHw === 'cpu' ? T.cyan : T.border}`,
                                padding: '32px 24px', borderRadius: 8, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 20,
                                transform: !isNarrow && activeHw === 'cpu' ? 'translateX(12px)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: activeHw === 'cpu' ? 1 : 0.6
                            }}>
                            <div style={{ width: 48, height: 48, color: T.cyan }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', color: T.textPri, fontWeight: 500 }}>Host CPU</div>
                                <div style={{ fontSize: '0.9rem', color: T.textSec, marginTop: 4 }}>Workstation Node</div>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveHw('ram')}
                            style={{
                                background: T.bgEq, border: `1px solid ${activeHw === 'ram' ? T.textPri : T.border}`,
                                padding: '32px 24px', borderRadius: 8, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 20,
                                transform: !isNarrow && activeHw === 'ram' ? 'translateX(12px)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: activeHw === 'ram' ? 1 : 0.6
                            }}>
                            <div style={{ width: 48, height: 48, color: T.textPri }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" /><path d="M5 8V16M9 8V16M13 8V16M17 8V16" /></svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', color: T.textPri, fontWeight: 500 }}>System RAM</div>
                                <div style={{ fontSize: '0.9rem', color: T.textSec, marginTop: 4 }}>Allocated Memory</div>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Display Panel */}
                    <div style={{ flex: 1.5, background: T.bgExpl, border: `1px solid ${hwSpecs[activeHw].color}`, borderRadius: 8, padding: '48px', transition: 'border-color 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                        {/* Decorative background grid line */}
                        <div style={{ position: 'absolute', top: 0, right: 40, width: 1, height: '100%', background: `linear-gradient(180deg, transparent, ${hwSpecs[activeHw].color}40, transparent)` }} />
                        <div style={{ position: 'absolute', top: 40, left: 0, width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${hwSpecs[activeHw].color}40, transparent)` }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '0.85rem', color: hwSpecs[activeHw].color, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                                Selected Node Telemetry
                            </div>
                            <h3 style={{ fontSize: '2.4rem', color: T.textPri, fontWeight: 300, marginBottom: 24, letterSpacing: '-0.5px' }}>
                                {hwSpecs[activeHw].title}
                            </h3>
                            <p style={{ fontSize: '1.1rem', color: T.textSec, lineHeight: 1.7, marginBottom: 48 }}>
                                {hwSpecs[activeHw].desc}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {hwSpecs[activeHw].specs.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px solid ${T.border}`, paddingBottom: 12 }}>
                                        <div style={{ fontSize: '0.95rem', color: T.textSec, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                                        <div style={{ fontSize: '1.2rem', color: T.textPri, fontFamily: 'monospace' }}>{s.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </SectionWrapper>

            {/* --- SECTION 10: SYSTEM CHARACTERISTICS --- */}
            <SectionWrapper
                id="10 — System Characteristics"
                title="Engineering Summary"
            >
                <div className="arch-step" style={{ width: '100%', maxWidth: 800, background: T.bgExpl, border: `1px solid ${T.border}`, padding: '64px 80px', borderRadius: 8 }}>
                    <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 24, color: T.textPri, fontSize: '1.4rem', lineHeight: 1.6 }}>
                        <li><span style={{ color: T.cyan }}>6-DOF</span> rigid body physics</li>
                        <li><span style={{ color: T.cyan }}>Quaternion</span> orientation dynamics</li>
                        <li><span style={{ color: T.red }}>Stochastic</span> aerodynamic disturbance</li>
                        <li><span style={{ color: T.green }}>Policy gradient</span> optimization</li>
                        <li><span style={{ color: T.cyan }}>Domain-randomized</span> robustness</li>
                    </ul>
                </div>
            </SectionWrapper>

            {/* --- SECTION 11: REPRODUCIBILITY WORKFLOW --- */}
            <SectionWrapper
                id="11 — Reproducibility Workflow"
                title="Execution Sequence"
                altBg
            >
                <div className="arch-step" style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', width: '100%', maxWidth: 1000, gap: isNarrow ? 28 : 64 }}>

                    {/* Left Timeline */}
                    <div style={{ flex: 1, position: 'relative', paddingLeft: 32 }}>
                        {/* Connecting Vertical Line */}
                        <div style={{ position: 'absolute', left: 45, top: 40, bottom: 40, width: 2, background: T.border, zIndex: 0 }} />

                        {executionSteps.map((step, i) => {
                            const isActive = activeStep === i;
                            const isPast = activeStep > i;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 24,
                                        marginBottom: 32,
                                        cursor: 'pointer',
                                        opacity: isActive ? 1 : 0.6,
                                        transition: 'opacity 0.2s',
                                        zIndex: 1
                                    }}
                                >
                                    {/* Timeline Dot */}
                                    <div style={{
                                        width: 28, height: 28,
                                        borderRadius: '50%',
                                        background: isActive ? T.cyan : (isPast ? T.green : T.bgEq),
                                        border: `2px solid ${isActive ? T.cyan : T.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isActive || isPast ? '#000' : T.textSec,
                                        fontWeight: 'bold', fontSize: '0.9rem',
                                        transition: 'all 0.3s'
                                    }}>
                                        {isPast ? '✓' : i + 1}
                                    </div>

                                    {/* Step Label */}
                                    <div style={{ fontSize: '1.4rem', color: isActive ? T.textPri : T.textSec, transition: 'color 0.2s' }}>
                                        {step.title}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Right Details Panel */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            position: isNarrow ? 'relative' : 'sticky', top: isNarrow ? 'auto' : 120,
                            background: T.bgEq, border: `1px solid ${T.cyan}`,
                            padding: '40px', borderRadius: 8,
                            boxShadow: '0 10px 30px rgba(0,229,255,0.05)'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: T.cyan, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                                STEP 0{activeStep + 1}
                            </div>
                            <div style={{ fontSize: '2rem', color: T.textPri, marginBottom: 16 }}>
                                {executionSteps[activeStep].title}
                            </div>
                            <div style={{ fontSize: '1.1rem', color: T.textSec, marginBottom: 32, lineHeight: 1.6 }}>
                                {executionSteps[activeStep].desc}
                            </div>
                            <div style={{
                                background: T.bgBase, border: `1px solid ${T.border}`, padding: '16px 20px',
                                fontFamily: 'monospace', color: T.textPri, fontSize: '0.95rem',
                                borderRadius: 4, overflowX: 'auto', whiteSpace: 'nowrap'
                            }}>
                                <span style={{ color: T.green, marginRight: 16 }}>$</span>
                                {executionSteps[activeStep].code}
                            </div>
                        </div>
                    </div>

                </div>
            </SectionWrapper>


        </div>
    )
}

