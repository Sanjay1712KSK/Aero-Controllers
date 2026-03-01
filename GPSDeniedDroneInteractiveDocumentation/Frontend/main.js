import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Page 1: Cinematic Scenes
  const scenes = gsap.utils.toArray('.scene');
  
  scenes.forEach((scene, i) => {

    const fades = scene.querySelectorAll('.fade-in');
    if (fades.length) {
      gsap.fromTo(fades, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    const slides = scene.querySelectorAll('.slide-up');
    if (slides.length) {
      gsap.fromTo(slides,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }
  });

  // Page 2: Technical Deep Dive Reveal
  const techSections = gsap.utils.toArray('.tech-section');
  techSections.forEach(section => {
    gsap.fromTo(section,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none' // one-time reveal
        }
      }
    );
  });

  // Background Parallax & Unique Visuals
  // Scene 2 visual drift
  if(document.querySelector('.visual-drift')) {
    gsap.to('.visual-drift', {
      backgroundPosition: '100% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Scene 3 divergence visualization
  if(document.querySelector('#scene-3')) {
    gsap.to('.split-screen.actual', {
      x: 100,
      y: 60,
      rotation: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-3',
        start: 'top center',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Scene 4 wind shake
  if(document.querySelector('.particles')) {
    gsap.to('.particles', {
      y: '-200px',
      x: '50px',
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Scene 8 diagram highlights sequence
  if(document.querySelector('.diagram-container')) {
    const boxes = document.querySelectorAll('.diagram-container .box');
    gsap.to(boxes, {
      borderColor: 'var(--accent-cyan)',
      boxShadow: '0 0 20px var(--accent-cyan-dim)',
      color: 'var(--accent-cyan)',
      stagger: 0.5,
      scrollTrigger: {
        trigger: '#scene-8',
        start: 'top 60%',
        toggleActions: 'play reverse play reverse'
      }
    });
  }
});
