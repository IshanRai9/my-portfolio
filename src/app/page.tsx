'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin);

export default function Home() {
  const main = useRef(null);
  const smoother = useRef<ScrollSmoother | null>(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); //sec loading
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!isLoading) {
      smoother.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
      });

      document.querySelectorAll('section').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          pin: true,
          pinSpacing: false,
        });
      });

      gsap.to(nameRef.current, {
        text: "Hello, I'm Ishan Rai",
        duration: 1.3,
        ease: 'none',
        onComplete: () => {
          gsap.to(titleRef.current, {
            text: 'AI/ML Full Stack Engineer',
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
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="logo">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 94" className="svg">
              
            </svg>
          </div>
        </div>

        <div className="🤚">
          <div className="🌴"></div>
          <div className="👍"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
          <div className="👉"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="smooth-wrapper" ref={main}>
      <div id="smooth-content">
        <main className="font-sans scroll-smooth">
          {/* Intro */}
          <section id="intro" className="container min-h-screen flex items-center justify-between px-40 text-white">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                <span ref={nameRef}></span>
              </h1>
              <h2 className="text-2xl text-gray-400">
                <span ref={titleRef}></span>
                <span className="caret opacity-0">|</span>
              </h2>
            </div>
            <div>
              <Image src="/img/profile.jpg" alt="Profile" width={300} height={300} className="rounded-full" />
            </div>
          </section>

          {/* Other Sections */}
          <section id="about" className="min-h-screen flex items-center justify-center px-16 bg-zinc-800 text-white">
            <h2 className="text-4xl font-bold">About Me</h2>
          </section>

          <section id="skills" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl font-bold">My Skills</h2>
          </section>

          <section id="education" className="min-h-screen flex items-center justify-center px-16 bg-white text-black">
            <h2 className="text-4xl font-bold">Education</h2>
          </section>

          <section id="projects" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl font-bold">Projects</h2>
          </section>

          <section id="experience" className="min-h-screen flex items-center justify-center px-16 bg-white text-black">
            <h2 className="text-4xl font-bold">Experience</h2>
          </section>

          <section id="certifications" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl font-bold">Certifications</h2>
          </section>

          <section id="contact" className="min-h-screen flex items-center justify-center px-16 bg-zinc-900 text-white">
            <h2 className="text-4xl font-bold">Contact Me</h2>
          </section>
        </main>
      </div>
    </div>
  );
}
