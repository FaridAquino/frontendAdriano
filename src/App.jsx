import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CircularGallery from './CircularGallery';
import './index.css';

import Imagen1 from './assets/images/Imagen1.jpeg';
import Imagen2 from './assets/images/Imagen2.jpeg';
import Imagen3 from './assets/images/Imagen3.jpeg';
import Imagen4 from './assets/images/Imagen4.jpeg';
import Imagen5 from './assets/images/Imagen5.jpeg';
import Imagen6 from './assets/images/Imagen6.jpeg';
import Imagen7 from './assets/images/Imagen7.jpeg';
import Imagen8 from './assets/images/Imagen8.jpeg';
import Imagen9 from './assets/images/Imagen9.jpeg';
import Imagen10 from './assets/images/Imagen10.jpeg';
import MusicaFondo from './assets/music/MusicaFondo.mp3';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GALLERY_ITEMS = [
  { image: Imagen1,  text: 'Mi Mamá'    },
  { image: Imagen2,  text: 'Juntos'     },
  { image: Imagen3,  text: 'Recuerdos'  },
  { image: Imagen4,  text: 'Familia'    },
  { image: Imagen5,  text: 'Amor'       },
  { image: Imagen6,  text: 'Sonrisas'   },
  { image: Imagen7,  text: 'Momentos'   },
  { image: Imagen8,  text: 'Cariño'     },
  { image: Imagen9,  text: 'Abrazo'     },
  { image: Imagen10, text: 'Felicidad'  },
];

const AUDIO_START = 134; // 2:14
const AUDIO_END   = 240; // 4:00
const FADE_START  = 230; // comienza fade 10s antes del fin
const BASE_VOL    = 0.7;

function useBgMusic() {
  const audioRef    = useRef(null);
  const fadingRef   = useRef(false);
  const timerRef    = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(MusicaFondo);
    audio.currentTime = AUDIO_START;
    audio.volume = BASE_VOL;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const t = audio.currentTime;

      // Inicia fade-out 10 s antes del fin
      if (!fadingRef.current && t >= FADE_START && t < AUDIO_END) {
        fadingRef.current = true;
        const startVol = audio.volume;
        let step = 0;
        const steps = 100; // 100 × 100 ms = 10 s
        timerRef.current = setInterval(() => {
          step++;
          audio.volume = Math.max(0, startVol * (1 - step / steps));
          if (step >= steps) clearInterval(timerRef.current);
        }, 100);
      }

      // Reinicia al llegar al fin
      if (t >= AUDIO_END) {
        clearInterval(timerRef.current);
        fadingRef.current = false;
        audio.currentTime = AUDIO_START;
        // Fade-in rápido (2 s)
        audio.volume = 0;
        let stepIn = 0;
        const stepsIn = 20;
        const fadeIn = setInterval(() => {
          stepIn++;
          audio.volume = Math.min(BASE_VOL, BASE_VOL * (stepIn / stepsIn));
          if (stepIn >= stepsIn) clearInterval(fadeIn);
        }, 100);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      clearInterval(timerRef.current);
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true));
    }
  };

  return { playing, toggle };
}

function MusicBtn({ playing, onClick }) {
  return (
    <button className="music-btn" onClick={onClick} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
      {playing ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <rect x="6"  y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  );
}

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
  const { playing, toggle } = useBgMusic();

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
      <MusicBtn playing={playing} onClick={toggle} />

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
            items={GALLERY_ITEMS}
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
