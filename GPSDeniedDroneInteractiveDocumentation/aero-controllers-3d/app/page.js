"use client"
import React, { useEffect, useLayoutEffect, useRef, useState, forwardRef } from 'react'
import Link from 'next/link'
import { Navbar } from './components/Navbar'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Line } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

import { Drone } from './components/Drone'
import { CanyonEnv } from './components/CanyonEnv'
import { WindParticles } from './components/WindParticles'

gsap.registerPlugin(ScrollTrigger)

// --- 3D Scene Composition ---
const DroneScene = forwardRef(({ proxy, isMobile = false }, ref) => {
  const droneRef = useRef()
  const cameraRef = useRef()
  const dirLightRef = useRef()
  const ambLightRef = useRef()
  const fogRef = useRef()

  // Expose refs to parent
  useLayoutEffect(() => {
    if (ref) {
      ref.current = {
        drone: droneRef.current,
        camera: cameraRef.current,
        dirLight: dirLightRef.current,
        ambLight: ambLightRef.current,
        fog: fogRef.current
      }
    }
  }, [ref])


  // Continuous background animation
  useFrame((state) => {
    if (!droneRef.current || !cameraRef.current) return

    // Slight floating ambient motion
    const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.1

    // Add camera shake based on the proxy value
    let shakeX = 0
    let shakeY = 0
    if (proxy.cameraShake > 0) {
      shakeX = Math.sin(state.clock.elapsedTime * 20) * proxy.cameraShake
      shakeY = Math.cos(state.clock.elapsedTime * 15) * proxy.cameraShake
    }

    // Minimal frame updates. Stop mutating unchanging geometry attributes.
    droneRef.current.position.set(proxy.droneX, 5 + floatY, 0)
    droneRef.current.rotation.set(0, 0, proxy.droneRotZ)

    // Only moving X and Z with optional shake.
    cameraRef.current.position.set(proxy.camX + shakeX, 8 + shakeY, proxy.camZ)
    cameraRef.current.lookAt(0, 5, 0) // Look at drone roughly

    if (dirLightRef.current) dirLightRef.current.intensity = proxy.lightIntensity
    if (ambLightRef.current) ambLightRef.current.intensity = proxy.ambientIntensity
    if (fogRef.current) fogRef.current.far = proxy.fogDensity
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[0, 8, 12]} />

      {/* Cinematic Lighting - No Shadows for Performance */}
      <ambientLight ref={ambLightRef} intensity={1.5} color="#222233" />
      <directionalLight ref={dirLightRef} position={[5, 10, 5]} intensity={3} color="#ffffff" />
      {/* Rim Light for Drone silhouette */}
      <spotLight position={[0, 5, -10]} intensity={250} color="#00f0ff" penumbra={1} />

      <CanyonEnv />
      <Drone ref={droneRef} />


      {/* Trajectory Lines - Render optionally for performance */}
      {proxy.showLines > 0 && (
        <group>
          {/* Expected Path (Red) */}
          <Line
            points={[[0, 5, 2], [0, 5, -40]]}
            color="#ff3366"
            lineWidth={3}
            opacity={0.3 * proxy.showLines}
            transparent
          />
          {/* Actual Drift Path (Cyan) */}
          <Line
            points={[[0, 5, 2], [1, 5, -5], [3.5, 5, -15], [8, 5, -30], [12, 5, -50]]}
            color="#00f0ff"
            lineWidth={3}
            opacity={0.4 * proxy.showLines}
            transparent
          />
        </group>
      )}

      {/* High-perf 100-particle wind streaks matching intensity */}
      <group position={[0, 0, 0]}>
        <WindParticles intensity={proxy.windIntensity} count={isMobile ? 60 : 100} />
      </group>

      <fog ref={fogRef} attach="fog" args={['#020308', 20, 150]} />
    </>
  )
})
DroneScene.displayName = 'DroneScene'

// --- Main App Component ---
export default function Page() {
  const containerRef = useRef()
  const sceneRefs = useRef({})
  const [isMobile, setIsMobile] = useState(false)

  // 14 scenes -> 1400vh
  const [proxy] = useState(() => ({
    droneX: 0,
    droneRotZ: 0,
    camX: 0,
    camZ: 12,
    showLines: 0,
    windIntensity: 0,
    lightIntensity: 3,
    ambientIntensity: 1.5,
    cameraShake: 0,
    fogDensity: 150 // default far away
  }))

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [isMobile])

  useLayoutEffect(() => {
    // Enable GSAP global lag smoothing
    gsap.ticker.lagSmoothing(1000, 16)

    let ctx = gsap.context(() => {
      // Hide all text elements initially except scene 1
      gsap.set('.text-scene', { autoAlpha: 0, y: 30 })
      gsap.set('.text-scene-1', { autoAlpha: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".story-wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Smooth scrubbing
          fastScrollEnd: true,
          anticipatePin: 1
        }
      })

      // Duration chunks = 10 units each

      // --- ACT 1: TRUST ---
      // Scene 1: Silence (0 - 10) 
      tl.to(proxy, { lightIntensity: 1.5, ambientIntensity: 0.8, fogDensity: 80, duration: 8, ease: "power2.out" }, 0)
      tl.to('.text-scene-1', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 8)

      // Scene 2: Confidence (10 - 20)
      tl.to('.text-scene-2', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 10)
      tl.to('.text-scene-2', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 18)

      // Scene 3: The Hidden Flaw (20 - 30)
      tl.to('.text-scene-3', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 20)
      tl.to(proxy, { droneX: 1.5, droneRotZ: -0.05, duration: 8, ease: "power2.out" }, 20)
      tl.to('.text-scene-3', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 28)

      // Scene 4: Illusion (30 - 40)
      tl.to('.text-scene-4', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 30)
      tl.to(proxy, { droneX: 4, droneRotZ: -0.15, showLines: 1, camX: 1, duration: 8, ease: "power2.out" }, 30)
      tl.to('.text-scene-4', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 38)

      // --- ACT 2: CHAOS ---
      // Scene 5: External Force (40 - 50)
      // Wave 1: Light wind — slight tilt
      tl.to('.text-scene-5', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 40)
      tl.to(proxy, { windIntensity: 0.3, droneRotZ: 0.25, droneX: 3, camX: 3, cameraShake: 0.05, fogDensity: 70, duration: 8, ease: "power2.out" }, 40)
      tl.to('.text-scene-5', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 48)

      // Scene 6: Amplification (50 - 60)
      // Wave 2: Stronger gust — larger tilt
      tl.to('.text-scene-6', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 50)
      tl.to(proxy, { droneRotZ: 0.5, camX: 5, windIntensity: 0.6, cameraShake: 0.1, duration: 8, ease: "power2.inOut" }, 50)
      tl.to('.text-scene-6', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 58)

      // Scene 7: Collapse (60 - 70)
      // Wave 3: Peak instability — maximum tilt and camera shake
      tl.to('.text-scene-7', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 60)
      tl.to(proxy, { droneRotZ: 0.75, lightIntensity: 0.5, ambientIntensity: 0.3, cameraShake: 0.25, windIntensity: 1.0, showLines: 0, duration: 8, ease: "power2.out" }, 60)
      tl.to('.text-scene-7', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 68)

      // --- ACT 3: THE QUESTION ---
      // Scene 8: Curiosity (70 - 80)
      tl.to('.text-scene-8', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 70)
      tl.to(proxy, { droneX: 0, droneRotZ: 0, windIntensity: 0, cameraShake: 0, lightIntensity: 1.5, ambientIntensity: 0.8, camX: 0, fogDensity: 100, duration: 8, ease: "power2.out" }, 70)
      tl.to('.text-scene-8', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 78)

      // Scene 9: Shift (80 - 90)
      tl.to('.text-scene-9', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 80)
      tl.to(proxy, { windIntensity: 0.4, droneRotZ: 0.1, duration: 8, ease: "power2.out" }, 80)
      tl.to('.text-scene-9', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 88)

      // --- ACT 4: BREAKTHROUGH ---
      // Scene 10: Training (90 - 100)
      tl.to('.text-scene-10', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 90)
      tl.to(proxy, { droneRotZ: 0.15, windIntensity: 0.6, duration: 8, ease: "none" }, 90)
      tl.to('.text-scene-10', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 98)

      // Scene 11: Mastery (100 - 110)
      tl.to('.text-scene-11', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 100)
      tl.to(proxy, { droneRotZ: 0.1, windIntensity: 0.3, duration: 8, ease: "none" }, 100)
      tl.to('.text-scene-11', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 108)

      // Scene 12: Beyond Stability (110 - 120)
      tl.to('.text-scene-12', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 110)
      tl.to(proxy, { droneX: 0, droneRotZ: 0, windIntensity: 0, duration: 8, ease: "power2.out" }, 110)
      tl.to('.text-scene-12', { autoAlpha: 0, y: -30, duration: 2, ease: "power2.out" }, 118)

      // Final Scene: Resolution (120 - 130)
      tl.to('.text-scene-13', { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 120)
      tl.to(proxy, { camX: -6, camZ: 10, duration: 10, ease: "none" }, 120)

    }, containerRef)

    return () => ctx.revert()
  }, [proxy])

  return (
    <div ref={containerRef} style={{ backgroundColor: "#02040a" }}>

      {/* Scroll container (14 scenes * 100vh = 1400vh) */}
      <div className={`story-wrapper${isMobile ? ' story-wrapper-mobile' : ''}`} style={{ height: isMobile ? '980vh' : '1400vh' }}>

        {/* Sticky viewport section */}
        <section className="story-section">

          {/* Canvas fixed behind UI */}
          <div className="canvas-container">
            {/* Disabled shadows, explicitly capped pixel ratio for performance */}
            <Canvas gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} dpr={[1, 1.5]}
              onCreated={({ gl }) => {
                gl.shadowMap.enabled = false
                gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5))
              }}>
              <DroneScene ref={sceneRefs} proxy={proxy} isMobile={isMobile} />
            </Canvas>
          </div>

          {/* HTML UI Overlay */}
          <div className="ui-overlay">

            <Navbar activePath="/" />

            {/* ACT 1: TRUST */}
            {/* SCENE 1 */}
            <div className="scene-text-container text-scene text-scene-1 active">
              <div className="scene-line">GPS Signal Lost.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>The drone continues flying.</div>
              <div className="scene-smallcap" style={{ marginTop: '3rem' }}>No satellite guidance.</div>
            </div>

            {/* SCENE 2 */}
            <div className="scene-text-container text-scene text-scene-2">
              <div className="scene-line">It trusts its internal sensors.</div>
              <div className="scene-smallcap" style={{ marginTop: '3rem' }}>Tiny motion sensors measure movement.<br />They estimate position.</div>
            </div>

            {/* SCENE 3 */}
            <div className="scene-text-container text-scene text-scene-3">
              <div className="scene-subline">But those sensors are not perfect.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>They slowly accumulate <span style={{ color: "#8B0000", textShadow: "0 0 14px rgba(139,0,0,0.6)" }}>error</span>.</div>
            </div>

            {/* SCENE 4 */}
            <div className="scene-text-container text-scene text-scene-4">
              <div className="scene-subline">A tiny bias...</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>becomes meters of <span style={{ color: "#D32F2F", textShadow: "0 0 12px rgba(211,47,47,0.6)" }}>drift</span>.</div>
              <div className="scene-smallcap" style={{ marginTop: '3rem' }}>The drone thinks it is here —<br />but it is somewhere else.</div>
            </div>

            {/* ACT 2: CHAOS */}
            {/* SCENE 5 */}
            <div className="scene-text-container text-scene text-scene-5">
              <div className="scene-subline">Now add wind.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}><span style={{ color: "#FFA000", textShadow: "0 0 12px rgba(255,160,0,0.6)" }}>Instability</span> grows.</div>
            </div>

            {/* SCENE 6 */}
            <div className="scene-text-container text-scene text-scene-6">
              <div className="scene-line">Small mistakes<br />become big problems.</div>
            </div>

            {/* SCENE 7 */}
            <div className="scene-text-container text-scene text-scene-7">
              <div className="scene-line" style={{ fontSize: 'clamp(64px, 5vw, 84px)', color: "#C62828", textShadow: "0 0 18px rgba(198,40,40,0.7)", fontWeight: 700 }}>Navigation collapses.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>The mission fails.</div>
            </div>

            {/* ACT 3: THE QUESTION */}
            {/* SCENE 8 */}
            <div className="scene-text-container text-scene text-scene-8">
              <div className="scene-line">What if the drone could <span style={{ color: "#00E5FF", textShadow: "0 0 14px rgba(0,229,255,0.6)" }}>learn</span>?</div>
              <div className="scene-subline" style={{ marginTop: '3rem' }}>Not just follow rules...</div>
            </div>

            {/* SCENE 9 */}
            <div className="scene-text-container text-scene text-scene-9">
              <div className="scene-line">...but <span style={{ color: "#00C853", textShadow: "0 0 18px rgba(0,200,83,0.8)", fontWeight: 600 }}>adapt</span>.</div>
            </div>

            {/* ACT 4: BREAKTHROUGH */}
            {/* SCENE 10 */}
            <div className="scene-text-container text-scene text-scene-10">
              <div className="scene-subline">Trained under chaos.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>600,000 learning steps.</div>
            </div>

            {/* SCENE 11 */}
            <div className="scene-text-container text-scene text-scene-11">
              <div className="scene-line">It learned to stay <span style={{ color: "#00E5FF", textShadow: "0 0 14px rgba(0,229,255,0.6)" }}>stable</span>.</div>
            </div>

            {/* SCENE 12 */}
            <div className="scene-text-container text-scene text-scene-12">
              <div className="scene-subline">Stability is only the beginning.</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>Now it learns to<br /><span style={{ color: "#00C853", textShadow: "0 0 18px rgba(0,200,83,0.8)" }}>correct its own drift</span>.</div>
            </div>

            {/* SCENE 13 */}
            <div className="scene-text-container text-scene text-scene-13">
              <div className="scene-line">When GPS disappears...</div>
              <div className="scene-line" style={{ marginTop: '2rem' }}>our drone <span style={{ color: "#00C853", textShadow: "0 0 20px rgba(0,200,83,0.9)", fontWeight: 700 }}>adapts</span>.</div>
              <div className="scene-smallcap" style={{ marginTop: '3rem' }}>Aero-Controllers<br />Learning-Aided INS Drift Suppression</div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
