"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const TITLEBAR_H = 44

// ─── Traffic Light Button ─────────────────────────────────────────────────────
function TrafficBtn({ color, hoverColor, onClick, symbol }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: 13, height: 13, borderRadius: '50%',
                background: hovered ? hoverColor : color,
                border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s ease, transform 0.1s ease',
                transform: hovered ? 'scale(1.12)' : 'scale(1)',
                flexShrink: 0, color: 'rgba(0,0,0,0.6)', fontSize: 8, fontWeight: 900,
            }}
        >
            {hovered && symbol}
        </button>
    )
}

// ─── Mac Window ───────────────────────────────────────────────────────────────
export default function MacWindow({ children, title, isFullscreen, onFullscreenChange }) {
    const router = useRouter()
    const windowRef = useRef(null)
    const dragOffset = useRef({ x: 0, y: 0 })

    const [dragging, setDragging] = useState(false)
    const [hasDragged, setHasDragged] = useState(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [minimizing, setMinimizing] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    // Reset drag state on route / title change
    useEffect(() => {
        setHasDragged(false)
        setPos({ x: 0, y: 0 })
        setMinimizing(false)
    }, [title])

    // ── Drag Events ───────────────────────────────────────────────────────────
    const handleMove = useCallback((e) => {
        if (!dragging) return
        setPos({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        })
    }, [dragging])

    const handleUp = useCallback(() => setDragging(false), [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleUp)
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleUp)
        }
    }, [handleMove, handleUp])

    const handleDragStart = (e) => {
        if (isFullscreen) return
        // Capture actual rendered position for seamless drag start
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
        setPos({ x: rect.left, y: rect.top })
        setHasDragged(true)
        setDragging(true)
    }

    // ── Traffic Light Handlers ─────────────────────────────────────────────────
    const handleClose = () => router.push('/')

    const handleMinimize = () => {
        setMinimizing(true)
        setTimeout(() => router.push('/'), 340)
    }

    const handleFullscreen = () => {
        onFullscreenChange(!isFullscreen)
        setHasDragged(false)
    }

    // ── Window Geometry ────────────────────────────────────────────────────────
    // Strategy: center without CSS transform so fixed-position children (e.g. Technical hover panel)
    // remain relative to viewport (transforms create stacking contexts that break fixed positions)
    const baseWindow = {
        position: 'fixed',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(16, 16, 26, 0.90)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        overflow: 'hidden',
    }

    let positionStyle = {}
    if (isFullscreen) {
        positionStyle = {
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh',
            borderRadius: 0,
            transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        }
    } else if (hasDragged) {
        positionStyle = {
            top: pos.y, left: pos.x,
            width: 'min(88vw, 1300px)',
            height: 'calc(100vh - 80px)',
            borderRadius: 16,
        }
    } else {
        // Center using left:0/right:0/margin:auto — no transform, no stacking context
        positionStyle = {
            top: 44, left: 0, right: 0,
            margin: '0 auto',
            width: 'min(88vw, 1300px)',
            height: 'calc(100vh - 80px)',
            borderRadius: 16,
            animation: mounted ? 'macWindowOpen 0.3s cubic-bezier(0.34,1.1,0.64,1) both' : 'none',
        }
    }

    const minimizeStyle = minimizing ? {
        transform: 'translateY(60vh) scale(0.15)',
        opacity: 0,
        transition: 'transform 0.32s cubic-bezier(0.4,0,1,1), opacity 0.28s ease',
    } : {}

    const windowStyle = { ...baseWindow, ...positionStyle, ...minimizeStyle }

    return (
        <div ref={windowRef} style={windowStyle}>

            {/* ── Title Bar ──────────────────────────────────────────── */}
            <div
                onMouseDown={handleDragStart}
                style={{
                    height: TITLEBAR_H, minHeight: TITLEBAR_H,
                    display: 'flex', alignItems: 'center',
                    padding: '0 14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    cursor: dragging ? 'grabbing' : 'grab',
                    userSelect: 'none', position: 'relative', flexShrink: 0,
                }}
            >
                {/* Traffic lights */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', zIndex: 1, position: 'relative' }}>
                    <TrafficBtn color="#FF5F57" hoverColor="#e0433c" onClick={handleClose} symbol="✕" />
                    <TrafficBtn color="#FEBC2E" hoverColor="#e0a020" onClick={handleMinimize} symbol="−" />
                    <TrafficBtn color="#28C840" hoverColor="#1fa832" onClick={handleFullscreen} symbol={isFullscreen ? '⊙' : '⊕'} />
                </div>

                {/* Centered window title */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', color: 'rgba(255,255,255,0.50)',
                    letterSpacing: '0.04em', fontWeight: 500,
                    pointerEvents: 'none',
                }}>
                    {title}
                </div>
            </div>

            {/* ── Scrollable Content ──────────────────────────────────── */}
            <div
                className="mac-window-content"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: `calc(100% - ${TITLEBAR_H}px)`,
                    // Custom scrollbar
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,255,255,0.15) transparent',
                }}
            >
                {children}
            </div>

        </div>
    )
}
