import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WindParticles({ count = 1000, active = false }) {
    const meshRef = useRef()
    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Initialize particles
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40
            const y = (Math.random() - 0.5) * 20 + 10 // Height
            const z = (Math.random() - 0.5) * 40
            const speed = Math.random() * 0.5 + 0.1
            temp.push({ x, y, z, speed })
        }
        return temp
    }, [count])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        // Animate particles based on active wind state
        particles.forEach((particle, i) => {
            if (active) {
                particle.x -= particle.speed * 80 * delta // Fast wind to the left
                if (particle.x < -20) particle.x = 20
                particle.y += (Math.random() - 0.5) * delta * 5
            } else {
                // Subtle ambient floating
                particle.y += Math.sin(state.clock.elapsedTime * particle.speed) * 0.01
            }

            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.scale.set(active ? 3 : 1, 0.1, 0.1) // Stretch during high wind
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.3 : 0.05} />
        </instancedMesh>
    )
}
