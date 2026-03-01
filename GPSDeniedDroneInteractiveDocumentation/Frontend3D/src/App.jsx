import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Drone } from './components/Drone'
import { WarehouseEnv } from './components/WarehouseEnv'
import { WindParticles } from './components/WindParticles'

gsap.registerPlugin(ScrollTrigger)

// --- 3D Scene Composition ---
function DroneScene({ scrollProgress }) {
    const { camera } = useThree()
    const droneRef = useRef()
    const [windActive, setWindActive] = useState(false)

    useFrame((state) => {
        if (!droneRef.current) return

        const t = scrollProgress.current

        // Base Floating Animation
        const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.1
        let targetX = 0
        let targetY = 5 + floatY
        let targetZ = 0
        let rotX = 0
        let rotY = 0
        let rotZ = 0

        // Scene Choreography based on Scroll Progress (0 to 1)
        if (t < 0.16) {
            // Scene 1: Smooth Flying
            setWindActive(false)
            camera.position.set(0, 6, 8)
            camera.lookAt(0, 5, 0)
        }
        else if (t >= 0.16 && t < 0.33) {
            // Scene 2: Invisible Drift begins
            setWindActive(false)
            const p = (t - 0.16) / 0.17 // local progress 0 to 1
            targetX = p * 2 // Drifts right
            targetZ = p * 1 // Drifts back
            rotY = p * 0.2 // Slight yaw error
            camera.position.set(p * 5, 6, 8 - p * 2) // Camera pushes in slightly and pans right
            camera.lookAt(targetX, targetY, targetZ)
        }
        else if (t >= 0.33 && t < 0.5) {
            // Scene 3: Wind Disturbance
            setWindActive(true)
            const p = (t - 0.33) / 0.17
            targetX = 2 + p * 3 // Drifts further right
            targetY = 5 + floatY - p * 1 // Loses altitude

            // Erratic shaking
            rotZ = Math.sin(state.clock.elapsedTime * 20) * 0.3 * p
            rotX = Math.cos(state.clock.elapsedTime * 15) * 0.2 * p

            // Camera shake
            camera.position.set(
                5 + Math.sin(state.clock.elapsedTime * 10) * 0.1 * p,
                6 + Math.cos(state.clock.elapsedTime * 12) * 0.1 * p,
                6
            )
            camera.lookAt(targetX, targetY, targetZ)
        }
        else if (t >= 0.5 && t < 0.66) {
            // Scene 4: Collapse
            setWindActive(true)
            const p = (t - 0.5) / 0.16
            targetX = 5 + p * 4
            targetY = 4 - p * 3 // Drops hard
            rotZ = 0.5 + p * 1 // Flips over
            camera.position.set(5, 6 - p * 2, 6)
            camera.lookAt(targetX, targetY, targetZ)
        }
        else if (t >= 0.66 && t < 0.83) {
            // Scene 5: Rewind / Learning Injection
            setWindActive(false)
            const p = (t - 0.66) / 0.17
            // Interpolate quickly back to center
            targetX = gsap.utils.interpolate(9, 0, p)
            targetY = gsap.utils.interpolate(1, 5, p)
            rotZ = gsap.utils.interpolate(1.5, 0, p)

            // Camera dramatic swing around
            camera.position.set(
                Math.cos(p * Math.PI) * 8,
                6 + Math.sin(p * Math.PI) * 2,
                Math.sin(p * Math.PI) * 8
            )
            camera.lookAt(targetX, targetY, targetZ)
        }
        else {
            // Scene 6: Stable under wind
            setWindActive(true)
            targetX = 0
            targetY = 5 + floatY // Stable height
            // Drone leans INTO the wind to stabilize
            rotZ = -0.2
            camera.position.set(-8, 6, 8)
            camera.lookAt(0, 5, 0)
        }

        // Apply computed transformations with slight easing for smoothness
        droneRef.current.position.lerp({ x: targetX, y: targetY, z: targetZ }, 0.1)
        droneRef.current.rotation.set(rotX, rotY, rotZ)
    })

    return (
        <>
            <PerspectiveCamera makeDefault fov={50} position={[0, 6, 8]} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
            <Environment preset="city" />
            <WarehouseEnv />
            <Drone ref={droneRef} />
            <group position={[0, 0, 0]}>
                <WindParticles active={windActive} count={500} />
            </group>
            <fog attach="fog" args={['#05050a', 10, 40]} />
        </>
    )
}

// --- Main App Component (UI + Canvas) ---
export default function App() {
    const scrollProgress = useRef(0)
    const containerRef = useRef()

    useEffect(() => {
        // ScrollTrigger to drive the global progress and text reveals
        const texts = gsap.utils.toArray('.scene-text')

        // Create a master ScrollTrigger that maps the 600vh scroll space 0 -> 1
        ScrollTrigger.create({
            trigger: '.scroll-proxy',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
                scrollProgress.current = self.progress
            }
        })

        // Setup text fade-ins for each scene
        texts.forEach((text, i) => {
            // Each scene takes up 1/6th of the scroll
            const startProg = (i / 6) * 100
            const endProg = ((i + 1) / 6) * 100

            gsap.to(text, {
                opacity: 1,
                y: -20,
                scrollTrigger: {
                    trigger: '.scroll-proxy',
                    start: `${startProg}% top`,
                    end: `${endProg}% bottom`,
                    scrub: true,
                    onEnter: () => gsap.to(text, { opacity: 1, duration: 0.5 }),
                    onLeave: () => gsap.to(text, { opacity: 0, duration: 0.5 }),
                    onEnterBack: () => gsap.to(text, { opacity: 1, duration: 0.5 }),
                    onLeaveBack: () => gsap.to(text, { opacity: 0, duration: 0.5 })
                }
            })
        })

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>

            {/* 3D Canvas fixed in background */}
            <div className="canvas-container">
                <Canvas shadows>
                    <DroneScene scrollProgress={scrollProgress} />
                </Canvas>
            </div>

            {/* Invisible Div sized to 600vh to enable scrolling */}
            <div className="scroll-proxy"></div>

            {/* HTML UI Overlay */}
            <div className="ui-overlay">

                {/* Navigation Bar */}
                <header className="top-bar">
                    <div className="brand">Aero-Controllers</div>
                    <div className="nav-links">
                        <span style={{ color: '#fff' }}>Story</span>
                        <span>Technical</span>
                        <span>Simulation</span>
                    </div>
                </header>

                {/* Scene 1 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1>GPS Signal Lost.</h1>
                    <p className="subtitle">The drone continues flying.</p>
                </div>

                {/* Scene 2 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1>Invisible Drift.</h1>
                    <p className="subtitle">Tiny sensor errors slowly accumulate.</p>
                </div>

                {/* Scene 3 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1 className="highlight-red">Wind amplifies instability.</h1>
                    <p className="subtitle">Controllers reach their limit.</p>
                </div>

                {/* Scene 4 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1 className="highlight-red">Navigation collapses.</h1>
                </div>

                {/* Scene 5 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1>What if it could learn?</h1>
                    <p className="subtitle">Not just react. But correct itself.</p>
                </div>

                {/* Scene 6 Text */}
                <div className="scene-text" style={{ transform: 'translate(-50%, -30%)' }}>
                    <h1 className="highlight">When GPS disappears...</h1>
                    <h1 className="highlight">our drone adapts.</h1>
                </div>

            </div>
        </div>
    )
}
