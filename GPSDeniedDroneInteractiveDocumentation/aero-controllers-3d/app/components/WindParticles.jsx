"use client"
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WindParticles({ count = 100, intensity = 0 }) {
    const meshRef = useRef()
    const matRef = useRef()
    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Cap particles strictly under 100
    const particles = useMemo(() => {
        const temp = []
        const actualCount = Math.min(count, 100)
        for (let i = 0; i < actualCount; i++) {
            // Wind moving right to left
            const x = 30 + Math.random() * 60 // Start far right
            const y = Math.random() * 20 // Height
            // Narrower z space so wind hits closer to the drone
            const z = (Math.random() - 0.5) * 20
            const speed = Math.random() * 0.8 + 0.6
            const length = Math.random() * 6 + 4
            const curveOffset = Math.random() * Math.PI * 2 // random phase for sine wave
            temp.push({ x, baseY: y, z, speed, length, curveOffset })
        }
        return temp
    }, [count])

    // Optimize geometry recalculation: only animate position
    useFrame((state, delta) => {
        if (!meshRef.current) return

        // Scale opacity and active state cleanly by the `intensity` proxy (0 to 1)
        if (intensity < 0.05) {
            if (meshRef.current.visible) meshRef.current.visible = false
            return
        }

        meshRef.current.visible = true
        if (matRef.current) {
            matRef.current.opacity = 0.5 * intensity
        }

        // Wind streaks move right to left. Speed scales by intensity.
        const speedMult = 80 * (0.5 + intensity * 0.5)

        particles.forEach((particle, i) => {
            particle.x -= particle.speed * speedMult * delta
            if (particle.x < -40) {
                particle.x = 40 + Math.random() * 20
                particle.baseY = Math.random() * 20
            }

            // Slight curve motion
            const yStr = particle.baseY + Math.sin(particle.x * 0.2 + particle.curveOffset) * 0.5

            dummy.position.set(particle.x, yStr, particle.z)
            dummy.scale.set(particle.length, 0.04, 0.04)
            // Slight angle to match the drone tilt visually hitting the drone
            dummy.rotation.set(0, 0, Math.sin(particle.x * 0.1) * 0.1)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, Math.min(count, 100)]} visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            {/* Light blue/white gradient simulation */}
            <meshBasicMaterial ref={matRef} color="#ffffff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    )
}
