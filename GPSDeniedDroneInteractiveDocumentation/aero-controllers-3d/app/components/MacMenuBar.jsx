"use client"
import { useState, useEffect } from 'react'

export default function MacMenuBar() {
    const [time, setTime] = useState('')

    useEffect(() => {
        const update = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }
        update()
        const id = setInterval(update, 30000)
        return () => clearInterval(id)
    }, [])

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            height: 32,
            background: 'rgba(10,10,18,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            userSelect: 'none',
            pointerEvents: 'none',
        }}>
            <span style={{
                fontWeight: 600, letterSpacing: '0.12em',
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.88)',
                textTransform: 'uppercase',
            }}>
                Aero-Controllers
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                {time}
            </span>
        </div>
    )
}
