'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin);

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
      }, 50); // 5000ms / 100 = 50ms per percent
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

  useGSAP(() => {
    if (!isLoading && !smoother.current) {
      smoother.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
      });

      gsap.to(nameRef.current, {
        text: "Hello, I'm Ishan Rai",
        duration: 1.3,
        ease: 'none',
        onComplete: () => {
          gsap.to(titleRef.current, {
            text: 'AI ML Engineer | Full Stack Developer',
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
      <div className="loader-wrapper" role="status" aria-label="Loading content">
        <div className="loader">
          <div className="box">
          </div>
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
    <div id="smooth-wrapper" ref={main} className="bg-white">
      <div id="smooth-content">
        <main className="font-sans scroll-smooth text-white">
          {/* Intro Section */}
          <section id="intro" className="container min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 lg:px-40">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                <span ref={nameRef}></span>
              </h1>
              <h2 className="text-2xl text-white">
                <span ref={titleRef}></span>
                <span className="caret opacity-0">|</span>
              </h2>
            </div>
            <div>
              <Image
                src="/img/profile.png"
                alt="Profile"
                width={500}
                height={500}
                className="rounded-full"
              />
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="min-h-screen flex flex-col items-start justify-center px-16 bg-zinc-800 text-white text-center">
            <h2 className="text-6xl mx-auto font-bold mb-6">About Me</h2>
            <p className="max-w-7xl text-2xl mx-auto leading-relaxed text-gray-300">
              Results-driven AI/ML and Software Engineer with professional experience in designing, building, 
              and deploying intelligent web applications. Adept at developing machine learning models, optimizing deep learning 
              pipelines, and integrating AI into production systems. Proven success in leading cross-functional projects, 
              collaborating with product teams, and delivering scalable, high-performance software solutions. Passionate 
              about solving real-world problems through AI, automation, and data-driven innovation.
            </p>
          </section>

          {/* Skills Section */}
          <section id="skills" className="min-h-screen flex flex-col items-start justify-center px-16 bg-amber-50 text-black text-center">
            <h2 className="text-6xl font-bold">My Skills</h2>
            <p className="mt-4">
                <Image src="https://skillicons.dev/icons?i=github,aws,python,java,c,cpp,html,css,js,react,nextjs"
                  alt="Skill icons"
                  width={1000} // or your preferred width
                  height={40} // or your preferred height
                  unoptimized // since it's an external image and not local
                  />
            </p>
            <p className="mt-4">
                  <Image src="https://skillicons.dev/icons?i=git,tailwind,tensorflow,flask,dotnet,opencv,"
                  alt="Skill icons"
                  width={500} // or your preferred width
                  height={40} // or your preferred height
                  unoptimized // since it's an external image and not local
                  />
            </p>
          </section>

          {/* Experience Section */}
          <section id="education" className="min-h-screen flex items-center justify-center px-16 bg-white text-black">
            <h2 className="text-4xl font-bold">Experience</h2>
          </section>

          {/* Projects Section */}
          <section id="projects" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl font-bold">Projects</h2>
          </section>

          {/* Education Section */}
          <section id="experience" className="min-h-screen flex items-center justify-center px-16 bg-white text-black">
            <h2 className="text-4xl font-bold">Education</h2>
          </section>

          {/* Certifications Section */}
          <section id="certifications" className="min-h-screen flex items-center justify-center px-16 bg-zinc-100 text-black">
            <h2 className="text-4xl font-bold">Certifications</h2>
          </section>

          {/* About Section */}
          <section id="contact" className="min-h-screen flex items-center justify-center px-16 bg-zinc-900 text-white">
            <h2 className="text-4xl font-bold">Contact Me</h2>
          </section>
        </main>
      </div>
    </div>
  );
}
