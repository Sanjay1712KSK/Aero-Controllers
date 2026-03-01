import React from 'react'

export function WarehouseEnv() {
    return (
        <group>
            {/* Dark concrete floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#050505" roughness={0.8} />
            </mesh>

            {/* Abstract pillars for warehouse feel */}
            {[...Array(40)].map((_, i) => {
                const x = (i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 5);
                const z = -60 + i * 4;
                return (
                    <mesh key={i} position={[x, 5, z]} castShadow receiveShadow>
                        <boxGeometry args={[2, 14, 2]} />
                        <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
                    </mesh>
                )
            })}

            {/* Volumetric Spotlights */}
            <spotLight
                position={[0, 15, -10]}
                angle={0.6}
                penumbra={1}
                intensity={200}
                color="#00f0ff"
                castShadow
            />
            <spotLight
                position={[-15, 15, 10]}
                angle={0.6}
                penumbra={1}
                intensity={150}
                color="#ffffff"
                castShadow
            />
            <spotLight
                position={[15, 15, 10]}
                angle={0.6}
                penumbra={1}
                intensity={150}
                color="#ff3366"
                castShadow
            />
        </group>
    )
}
