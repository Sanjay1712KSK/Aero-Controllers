"use client"
import React, { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'

export const Drone = forwardRef((props, ref) => {
    const rotorRefs = [useRef(), useRef(), useRef(), useRef()]

    useFrame((state, delta) => {
        // Spin the rotors fast
        rotorRefs.forEach(r => {
            if (r.current) {
                r.current.rotation.y += delta * 50
            }
        })
    })

    return (
        <group ref={ref} {...props} dispose={null}>
            {/* Central Body (Box) */}
            <Box args={[1.2, 0.4, 1.2]} castShadow receiveShadow>
                <meshStandardMaterial color="#888888" metalness={0.4} roughness={0.3} />
            </Box>
            <Box args={[1.25, 0.1, 1.25]}>
                <meshStandardMaterial color="#00f0ff" emissive="#0080ff" emissiveIntensity={0.5} />
            </Box>

            {/* Arms & Rotors */}
            {[
                { pos: [-1, 0, -1], rot: -Math.PI / 4, rPos: [-0.65, 0.2, -0.65] },
                { pos: [1, 0, -1], rot: Math.PI / 4, rPos: [0.65, 0.2, -0.65] },
                { pos: [-1, 0, 1], rot: Math.PI / 4, rPos: [-0.65, 0.2, 0.65] },
                { pos: [1, 0, 1], rot: -Math.PI / 4, rPos: [0.65, 0.2, 0.65] },
            ].map((arm, i) => (
                <group key={i} position={arm.pos}>
                    {/* Arm */}
                    <Box args={[1.5, 0.1, 0.1]} rotation={[0, arm.rot, 0]} castShadow>
                        <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.4} />
                    </Box>
                    {/* Motor Mount & Rotor */}
                    <group position={arm.rPos}>
                        <Cylinder args={[0.1, 0.1, 0.3, 16]} castShadow>
                            <meshStandardMaterial color="#555555" />
                        </Cylinder>
                        <group ref={rotorRefs[i]} position={[0, 0.2, 0]}>
                            <Box args={[1.2, 0.05, 0.1]} castShadow>
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
                            </Box>
                            <Cylinder args={[0.05, 0.05, 0.1]}>
                                <meshStandardMaterial color="#ffffff" />
                            </Cylinder>
                        </group>
                    </group>
                </group>
            ))}

            {/* Front indicator light */}
            <pointLight position={[0, 0.2, -0.65]} intensity={10} color="#ff3366" distance={5} />
            <mesh position={[0, 0.2, -0.65]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color="#ff3366" />
            </mesh>
        </group>
    )
})
