import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CircularGallery from './CircularGallery';
import './index.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PETAL_COLORS = ['#f9a8d4', '#f472b6', '#fda4af', '#fecdd3', '#fbcfe8', '#e879a0', '#fbb6ce'];

function createPetal(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    size: 8 + Math.random() * 18,
    speedY: 1.2 + Math.random() * 2.2,
    speedX: (Math.random() - 0.5) * 1.2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.06,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.03,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    opacity: 0.45 + Math.random() * 0.5,
    type: Math.floor(Math.random() * 3),
  };
}

function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  const s = p.size;

  if (p.type === 0) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.38, s, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 1) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 0.6, -s * 0.5, 0, -s * 0.3);
    ctx.bezierCurveTo(s * 0.6, -s * 0.5, s * 0.5, -s * 0.1, 0, s * 0.3);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.15, s * 0.32, s * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = p.opacity * 0.18;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.6, s * 0.08, s * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function PetalsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId;
    let petals = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      petals = Array.from({ length: 60 }, () => {
        const p = createPetal(canvas);
        p.y = Math.random() * canvas.height;
        return p;
      });
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.7;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height + 30) {
          petals[i] = createPetal(canvas);
        }
        drawPetal(ctx, p);
      }
      rafId = requestAnimationFrame(tick);
    }

    init();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="petals-canvas" />;
}

export default function App() {
  const landingRef = useRef(null);
  const galleryTitleRef = useRef(null);
  const galleryWrapperRef = useRef(null);
  const footerRef = useRef(null);

  useGSAP(() => {
    // Hero entrance
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.hero-tag',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.3 }
      )
      .fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1 },
        0.5
      )
      .fromTo('.hero-divider',
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.8 },
        0.9
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        1.1
      );

    // Gallery title on scroll
    gsap.fromTo(
      galleryTitleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: galleryTitleRef.current, start: 'top 85%' }
      }
    );

    // Gallery wrapper fade-in
    gsap.fromTo(
      galleryWrapperRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: galleryWrapperRef.current, start: 'top 90%' }
      }
    );

    // Footer fade-in
    gsap.fromTo(
      footerRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' }
      }
    );
  }, { scope: landingRef });

  return (
    <div className="landing" ref={landingRef}>
      <PetalsCanvas />

      <section className="hero">
        <p className="hero-tag">10 de Mayo &mdash; Día de la Madre</p>
        <h1 className="hero-title">
          Con todo el amor<br />
          del mundo, <span>Mamá</span>
        </h1>
        <div className="hero-divider" />
        <p className="hero-subtitle">
          Gracias por cada abrazo, cada palabra y cada momento.
          Tu amor es la flor más bella que existe.
        </p>
      </section>

      <section className="gallery-section">
        <h2 ref={galleryTitleRef}>Momentos que atesoramos</h2>
        <div className="gallery-wrapper" ref={galleryWrapperRef}>
          <CircularGallery
            bend={1}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      </section>

      <footer className="footer" ref={footerRef}>
        Hecho con <span>amor</span> &mdash; Feliz Día de la Madre
      </footer>
    </div>
  );
}
