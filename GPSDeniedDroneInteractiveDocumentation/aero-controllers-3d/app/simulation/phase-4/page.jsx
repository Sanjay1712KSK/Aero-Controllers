"use client"
import React, { useLayoutEffect, useRef } from 'react'
import { Navbar } from '../../components/Navbar'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const T = {
  bgBase: '#02050A',
  bgAlt: '#050A14',
  secStrip: '#0B1220',
  border: '#1E2D4A',
  textPri: '#FFFFFF',
  textSec: '#A3B8CC',
  textMuted: '#5C7A99',
  cyan: '#00E5FF',
  green: '#00FF66',
  greenDark: '#003318',
  greenBorder: '#00AA44'
}

const FadeSection = ({ children, delay = 0, yOffset = 36, style = {} }) => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    const scrollerEl = sectionRef.current.closest('.mac-window-content') || undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 86%',
            scroller: scrollerEl
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [delay, yOffset])

  return (
    <section ref={sectionRef} style={{ width: '100%', ...style }}>
      {children}
    </section>
  )
}

export default function Phase4Page() {
  const featureCards = [
    {
      title: 'Neural Bias Estimation Layer',
      description:
        'A lightweight learning module monitors IMU behavior and predicts dynamic bias corrections. Instead of assuming constant bias, the system adaptively learns drift patterns during flight.'
    },
    {
      title: 'Sensor Fusion Integration',
      description:
        'Predicted corrections are injected into the EKF pipeline, improving state estimation accuracy and reducing cumulative position and orientation error growth.'
    },
    {
      title: 'Long-Duration Validation',
      description:
        'The system will be tested across extended flight time, multiple wind regimes, altitude variations, and checkpoint transitions to measure sustained drift suppression.'
    }
  ]

  const evaluationItems = [
    'Drift reduction percentage',
    'Error growth rate comparison',
    'Stability retention over time',
    'Classical INS+EKF vs Learning-Aided EKF benchmark'
  ]

  const achievements = [
    'Transitions from stabilization to navigation reliability',
    'Enables longer autonomous missions without GPS',
    'Builds a deployable GPS-denied autonomy stack',
    'Makes the system mission-ready'
  ]

  return (
    <div
      style={{
        background: T.bgBase,
        color: T.textPri,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        overflowX: 'hidden'
      }}
    >
      <Navbar activePath="/simulation/phase-4" />

      <main style={{ paddingTop: 72 }}>
        <section
          style={{
            height: '65vh',
            minHeight: 620,
            background: T.bgAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
            borderBottom: `1px solid ${T.border}`
          }}
        >
          <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)' }}>
            <div style={{ color: T.cyan, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.85rem', marginBottom: 16 }}>
              Phase-4
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 300, lineHeight: 1.1, margin: '0 0 16px' }}>
              Learning-Aided INS Drift Suppression Layer
            </h1>
            <p style={{ fontSize: '1.2rem', color: T.textSec, lineHeight: 1.55, margin: '0 0 24px', maxWidth: 760 }}>
              Extending stabilization into full GPS-denied navigation reliability.
            </p>
            <p style={{ color: T.textSec, lineHeight: 1.75, fontSize: '1.06rem', margin: 0, maxWidth: 920 }}>
              Phase 4 extends the stabilization framework into a long-duration navigation support system. While Phase 3 ensured robust disturbance rejection, this phase introduces an intelligence layer that actively suppresses cumulative inertial drift over time.
            </p>
          </div>
        </section>

        <FadeSection
          style={{
            padding: '96px 40px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)' }}>
            <div style={{ color: T.cyan, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 14 }}>
              01 - What Is Being Added
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2, margin: '0 0 36px' }}>
              New Intelligence Layer Components
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24
              }}
            >
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: 28,
                    background: T.secStrip,
                    minHeight: 220
                  }}
                >
                  <h3 style={{ margin: '0 0 14px', fontSize: '1.28rem', fontWeight: 400, lineHeight: 1.35 }}>{card.title}</h3>
                  <p style={{ margin: 0, color: T.textSec, lineHeight: 1.7, fontSize: '1rem' }}>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection
          style={{
            padding: '96px 40px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)' }}>
            <div style={{ color: T.cyan, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', marginBottom: 14 }}>
              02 - Evaluation Focus
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2, margin: '0 0 32px' }}>Evaluation Focus</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
                alignItems: 'stretch'
              }}
            >
              {evaluationItems.map((item) => (
                <div
                  key={item}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '18px 20px',
                    background: T.bgAlt,
                    color: T.textSec,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <span style={{ color: T.green, fontWeight: 700, fontSize: '1rem' }}>-</span>
                  <span style={{ lineHeight: 1.55, fontSize: '1rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection
          style={{
            padding: '96px 40px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)' }}>
            <div
              style={{
                border: `1px solid ${T.greenBorder}`,
                borderLeft: `3px solid ${T.green}`,
                borderRadius: 8,
                padding: 32,
                background: T.greenDark
              }}
            >
              <div style={{ color: T.green, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.75rem', marginBottom: 12 }}>
                03 - What Phase 4 Achieves
              </div>
              <h2 style={{ margin: '0 0 20px', fontSize: '2.2rem', fontWeight: 300, lineHeight: 1.2 }}>
                Navigation Reliability Layer
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {achievements.map((item) => (
                  <div key={item} style={{ color: T.textPri, lineHeight: 1.6, fontSize: '1.05rem' }}>
                    - {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeSection>

        <FadeSection
          style={{
            padding: '72px 40px 0',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: 'var(--mac-page-max-width, 1200px)', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 999,
                border: `1px solid ${T.border}`,
                background: T.bgAlt,
                color: T.textSec,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontSize: '0.75rem'
              }}
            >
              Upcoming Development Phase
            </div>
          </div>
        </FadeSection>

        <FadeSection
          style={{
            padding: '80px 40px 160px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: 960, textAlign: 'center' }}>
            <p style={{ margin: 0, color: T.textSec, fontSize: '1.25rem', lineHeight: 1.8 }}>
              Phase 4 introduces a learning-based bias correction layer integrated with sensor fusion to suppress cumulative INS drift, enabling stable and reliable long-duration GPS-denied autonomous flight.
            </p>
          </div>
        </FadeSection>
      </main>
    </div>
  )
}
