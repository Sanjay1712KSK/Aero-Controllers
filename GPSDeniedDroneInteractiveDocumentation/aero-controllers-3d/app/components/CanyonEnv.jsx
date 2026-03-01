"use client"
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Custom Sky Shader for Twilight Gradient
const SkyMaterial = {
    uniforms: {
        colorTop: { value: new THREE.Color("#02040a") }, // Deep navy
        colorMid: { value: new THREE.Color("#160a22") }, // Purple
        colorBottom: { value: new THREE.Color("#36181b") }, // Subtle orange/brown horizon
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 colorTop;
    uniform vec3 colorMid;
    uniform vec3 colorBottom;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(colorBottom, colorMid, smoothstep(0.0, 0.4, vUv.y));
      color = mix(color, colorTop, smoothstep(0.4, 1.0, vUv.y));
      gl_FragColor = vec4(color, 1.0);
    }
  `
}

// Low-poly jagged mountain generator
function buildMountains(xOffset, zStart, count, scaleRange, zStep, randomizeX) {
    const shapes = []
    let currentZ = zStart
    for (let i = 0; i < count; i++) {
        const scaleX = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0])
        const scaleY = scaleX * (0.8 + Math.random() * 0.8) // Varied height
        const scaleZ = scaleX * 0.8
        shapes.push({
            x: xOffset + (Math.random() - 0.5) * randomizeX,
            y: -5,
            z: currentZ,
            scale: [scaleX, scaleY, scaleZ],
            rotY: Math.random() * Math.PI,
            rotZ: (Math.random() - 0.5) * 0.2 // Jagged tilt
        })
        currentZ -= zStep
    }
    return shapes
}

export function CanyonEnv() {
    // Layer 1 (Foreground) - Dark, jagged walls (using large scale values)
    const fgLeft = useMemo(() => buildMountains(-45, 0, 12, [25, 40], 15, 15), [])
    const fgRight = useMemo(() => buildMountains(45, 0, 12, [25, 40], 15, 15), [])

    // Layer 2 (Mid-ground) - Softer silhouettes, lighter color, further back
    const mgLeft = useMemo(() => buildMountains(-75, -80, 8, [45, 65], 25, 20), [])
    const mgRight = useMemo(() => buildMountains(75, -80, 8, [45, 65], 25, 20), [])

    // Layer 3 (Background) - Faded ridge, low opacity, blended
    const bgRidge = useMemo(() => buildMountains(0, -220, 15, [60, 100], 25, 120), [])

    // Mist layer
    const mistRef = useRef()
    useFrame((state) => {
        if (mistRef.current) {
            mistRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5
        }
    })

    // We use DodecahedronGeometry for a deeply jagged/irregular look at low poly count
    const geoClass = useMemo(() => new THREE.DodecahedronGeometry(1, 0), [])

    return (
        <group>
            {/* Sky Gradient */}
            <mesh position={[0, 40, -320]} scale={[800, 400, 1]}>
                <planeGeometry />
                <shaderMaterial attach="material" args={[SkyMaterial]} depthWrite={false} fog={false} />
            </mesh>

            {/* Ground plane - Wide valley floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[200, 400, 1, 1]} />
                <meshBasicMaterial color="#020308" />
            </mesh>

            {/* Layer 1: Foreground */}
            {[...fgLeft, ...fgRight].map((w, i) => (
                <mesh key={`FG-${i}`} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, w.rotZ]} scale={w.scale} geometry={geoClass}>
                    <meshBasicMaterial color="#05070e" />
                </mesh>
            ))}

            {/* Layer 2: Mid-ground */}
            {[...mgLeft, ...mgRight].map((w, i) => (
                <mesh key={`MG-${i}`} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, w.rotZ]} scale={w.scale} geometry={geoClass}>
                    <meshBasicMaterial color="#0a0e1c" />
                </mesh>
            ))}

            {/* Layer 3: Background */}
            {bgRidge.map((w, i) => (
                <mesh key={`BG-${i}`} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, w.rotZ]} scale={w.scale} geometry={geoClass}>
                    <meshBasicMaterial color="#11142a" transparent opacity={0.5} />
                </mesh>
            ))}

            {/* Subtle Ground Mist */}
            <mesh ref={mistRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -40]}>
                <planeGeometry args={[140, 200]} />
                <meshBasicMaterial color="#2d3752" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Twilight Fill Light */}
            <pointLight position={[0, 40, -100]} intensity={3} color="#5e4875" distance={250} />
            <pointLight position={[0, 20, 0]} intensity={1.5} color="#4466aa" distance={100} />
        </group>
    )
}
