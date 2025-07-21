'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import './globals.css'; // Import your global styles
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin, Observer, SplitText);

export default function Page() {
  const main = useRef(null);
  const smoother = useRef<ScrollSmoother | null>(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  useEffect(() => {
    let percent = 0;
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        percent += 1;
        setLoadingPercent(percent);
        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 50);
      timer = setTimeout(() => setIsLoading(false), 5000);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      smoother.current?.kill();
    };
  }, []);
  
 useEffect(() => {
    if (!isLoading) {
      const images = document.querySelectorAll('.carousel-image');
      const carousel = document.querySelector('.carousel') as HTMLElement;
      const radius = 242;
      const progress = { value: 0 };
  
      const animate = () => {
        images.forEach((image, index) => {
          const theta = index / images.length - progress.value;
          const x = -Math.sin(theta * Math.PI * 2) * radius;
          const y = Math.cos(theta * Math.PI * 2) * radius;
          (image as HTMLElement).style.transform = `translate3d(${x}px, 0px, ${y}px) rotateY(${360 * -theta}deg)`;
          const c = Math.floor(index / images.length * 360);
          (image as HTMLElement).style.background = `hsla(${c}, 90%, 50%, .5)`;
        });
      };
  
      gsap.ticker.add(animate);
  
      Observer.create({
        target: carousel,
        type: 'wheel,pointer',
        onPress: () => { carousel.style.cursor = 'grabbing'; },
        onRelease: () => { carousel.style.cursor = 'grab'; },
        onChange: (self) => {
          gsap.killTweensOf(progress);
          const p = self.event.type === 'wheel' ? self.deltaY * -.0005 : self.deltaX * .05;
          gsap.to(progress, {
            duration: 2,
            ease: 'power4.out',
            value: `+=${p}`,
          });
        },
      });
    }
  }, [isLoading]);
  
  useGSAP(() => {
    if (!isLoading && !smoother.current) {
      smoother.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
      });
  
      // Animate text
      gsap.to(nameRef.current, {
        text: "Hello, I'm Ishan Rai",
        duration: 1.3,
        ease: 'none',
        onComplete: () => {
          gsap.to(titleRef.current, {
            text: 'AI ML Engineer || Full Stack Developer',
            duration: 1,
            ease: 'none',
            onComplete: () => {
              gsap.to('.caret', {
                opacity: 1,
                repeat: -1,
                yoyo: true,
                duration: 0.5,
              });
            },
          });
        },
      });
  
      // ✅ Animate sections when they enter view
      ScrollTrigger.batch(['#intro', '#about', '#experience'], {
        onEnter: batch => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.2,
              ease: 'power2.out',
            }
          );
        },
        once: true,
        start: 'top 80%',
      });
  
      // ✅ Parallax effect for intro
      gsap.to('#intro', {
        yPercent: -10,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#intro',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, [isLoading]);

    if (isLoading) {
      return (
        <div className="loader-wrapper" role="status" aria-label="Loading content">
          <div className="loader">
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="loader-percent">{loadingPercent}%</div>
          </div>
        </div>
      );
    }

  return (
    <div id="smooth-wrapper" ref={main} className="bg-glossy-black">
      <div id="noise-wrapper"></div>
      <div id="smooth-content">
        <main className="font-sans scroll-smooth text-white">

          {/* Intro Section */}
          <section id="intro" className="bg-glossy-black min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 lg:px-40 text-white">
            <div>
              <h1 className="text-5xl mb-4">
                <span ref={nameRef}></span>
              </h1>
              <h2 className="text-2xl text-white">
                <span ref={titleRef}></span>
                <span className="caret opacity-0">|</span>
              </h2>
              <p className="flex flex-row flex-wrap gap-2 items-center mt-2">
                <a href="https://www.github.com/ishanrai9"><Image src="https://skillicons.dev/icons?i=github&theme=dark" alt="Skill icons" width={50} height={40} unoptimized className="grayscale"/></a>
                <a href="https://www.linkedin.com/in/ishan-s-rai/"><Image src="https://skillicons.dev/icons?i=linkedin&theme=dark" alt="LinkedIn" width={50} height={40} unoptimized className="grayscale"/></a>
                <a href="https://x.com/iamishanrai/"><Image src="https://skillicons.dev/icons?i=twitter&theme=dark" alt="Twitter" width={50} height={40} unoptimized className="grayscale"/></a>
              </p>
            </div>
            <div>
              <Image src="/img/profile.png" alt="Profile" width={400} height={400} className="rounded-full" />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="min-h-screen flex flex-col items-start justify-center px-16 bg-amber-300 text-white text-center">
            <h2 className="text-6xl mx-auto mb-6">About Me</h2>
            <p className="max-w-7xl text-2xl mx-auto leading-relaxed text-white">
              Results-driven AI/ML and Software Engineer with professional experience in designing, building, and deploying intelligent web applications. Adept at developing machine learning models, optimizing deep learning pipelines, and integrating AI into production systems.
            </p>
            <p className="max-w-7xl text-2xl mx-auto leading-relaxed text-white">
              Proven success in leading cross-functional projects,collaborating with product teams, and delivering scalable, high-performance software solutions Passionate about solving real-world problems through AI, automation, and data-driven innovation.
            </p>
          </section>

          {/* Experience Section */}
          <section id="experience" className="min-h-screen flex items-center justify-center px-16 bg-glossy-black text-white">
            <h2 className="text-6xl mx-auto mb-6">Experience</h2>
          </section>

          {/* Skills Section */}
          <section id="skills" className="min-h-screen flex items-center justify-center px-16 bg-amber-300 text-white text-center">
            <h2 className="text-6xl mx-auto mb-6">My Skills</h2>
            <p className="mt-4">
              <Image src="https://skillicons.dev/icons?i=python,java,c,cpp,html,css,js,react,nextjs,nodejs,express,git,github,aws,azure,tailwind,flask,tensorflow,pytorch,sklearn,opencv,anaconda,docker,postman,vscode,bash,figma,selenium&perline=9&theme=dark" alt="Skill icons" width={700} height={40} unoptimized/>
            </p>
          </section>
        
          {/* Projects Section */}
          <section id="projects" className="min-h-screen flex items-center justify-center px-16 bg-glossy-black text-white">
            <h2 className="text-4xl mb-10">Projects</h2>
              
          </section>


          {/* Education Section */}
          <section id="education" className="min-h-screen flex items-center justify-center px-16 bg-white text-black">
            <h2 className="text-4xl ">Education</h2>
          </section>

          {/* Certifications Section */}
          <section id="certifications" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl ">Certifications</h2>
              <div className="carousel">
                <div className="carousel-image">1</div>
                <div className="carousel-image">2</div>
                <div className="carousel-image">3</div>
                <div className="carousel-image">4</div>
                <div className="carousel-image">5</div>
                <div className="carousel-image">6</div>
                <div className="carousel-image">7</div>
                <div className="carousel-image">8</div>
              </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="min-h-screen flex items-center justify-center px-16 bg-zinc-900 text-white">
            <h2 className="text-4xl font-bold">Contact Me</h2>
          </section>

        </main>
      </div>
    </div>
  );
}