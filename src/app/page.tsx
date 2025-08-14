'use client';

import React, { useRef, useState, useEffect } from 'react';
import { animate } from 'animejs';
import Image from 'next/image';
import './globals.css';

export default function Page() {
  const main = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Loading animation
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

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Carousel animation
  useEffect(() => {
    if (!isLoading) {
      const images = document.querySelectorAll('.carousel-image');
      const carousel = document.querySelector('.carousel') as HTMLElement;
      const radius = 242;
      let progress = 0;
      let isMouseDown = false;
      let startX = 0;
      let currentRotation = 0;

      const updateCarousel = () => {
        images.forEach((image, index) => {
          const theta = index / images.length + progress;
          const x = -Math.sin(theta * Math.PI * 2) * radius;
          const y = Math.cos(theta * Math.PI * 2) * radius;
          const rotation = 360 * theta;
          
          (image as HTMLElement).style.transform = 
            `translate3d(${x}px, 0px, ${y}px) rotateY(${rotation}deg)`;
          
          const hue = Math.floor(index / images.length * 360);
          (image as HTMLElement).style.background = 
            `hsla(${hue}, 90%, 50%, .5)`;
        });
      };

      // Mouse/touch interactions
      const handleStart = (e: MouseEvent | TouchEvent) => {
        isMouseDown = true;
        startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        carousel.style.cursor = 'grabbing';
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isMouseDown) return;
        
        const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const deltaX = (currentX - startX) * 0.01;
        progress += deltaX;
        startX = currentX;
        updateCarousel();
      };

      const handleEnd = () => {
        isMouseDown = false;
        carousel.style.cursor = 'grab';
      };

      // Wheel interaction
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        
        animate({
          targets: { value: progress },
          value: progress + delta,
          duration: 1000,
          easing: 'easeOutQuart',
          update: (anim) => {
            progress = anim.animatables[0].target.value;
            updateCarousel();
          }
        });
      };

      // Event listeners
      carousel.addEventListener('mousedown', handleStart);
      carousel.addEventListener('mousemove', handleMove);
      carousel.addEventListener('mouseup', handleEnd);
      carousel.addEventListener('mouseleave', handleEnd);
      carousel.addEventListener('touchstart', handleStart);
      carousel.addEventListener('touchmove', handleMove);
      carousel.addEventListener('touchend', handleEnd);
      carousel.addEventListener('wheel', handleWheel, { passive: false });

      updateCarousel();

      return () => {
        carousel.removeEventListener('mousedown', handleStart);
        carousel.removeEventListener('mousemove', handleMove);
        carousel.removeEventListener('mouseup', handleEnd);
        carousel.removeEventListener('mouseleave', handleEnd);
        carousel.removeEventListener('touchstart', handleStart);
        carousel.removeEventListener('touchmove', handleMove);
        carousel.removeEventListener('touchend', handleEnd);
        carousel.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isLoading]);

  // Main animations when loading completes
  useEffect(() => {
    if (!isLoading) {
      // Typewriter effect for name
      const nameText = "Hello, I'm Ishan Rai";
      const titleText = "AI ML Engineer";
      
      if (nameRef.current) {
        (nameRef.current as HTMLElement).textContent = '';
        
        animate({
          targets: nameRef.current,
          innerHTML: [0, nameText.length],
          duration: 1300,
          easing: 'linear',
          round: 1,
          update: (anim) => {
            const progress = Math.round(anim.progress * nameText.length / 100);
            (nameRef.current as HTMLElement).textContent = nameText.slice(0, progress);
          },
          complete: () => {
            // Start title animation
            if (titleRef.current) {
              (titleRef.current as HTMLElement).textContent = '';
              
              animate({
                targets: titleRef.current,
                innerHTML: [0, titleText.length],
                duration: 1000,
                easing: 'linear',
                round: 1,
                update: (anim) => {
                  const progress = Math.round(anim.progress * titleText.length / 100);
                  (titleRef.current as HTMLElement).textContent = titleText.slice(0, progress);
                },
                complete: () => {
                  // Start caret blinking
                  animate({
                    targets: '.caret',
                    opacity: [0, 1],
                    duration: 500,
                    direction: 'alternate',
                    loop: true
                  });
                }
              });
            }
          }
        });
      }

      // Fade in intro section
      if (introRef.current) {
        anime({
          targets: introRef.current,
          opacity: [0, 1],
          translateY: [100, 0],
          duration: 1000,
          easing: 'easeOutQuart',
          delay: 500
        });
      }

      // Animate sections on scroll
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              easing: 'easeOutQuart'
            });
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });

      // Observe all sections except intro
      const sections = document.querySelectorAll('section:not(#intro)');
      sections.forEach(section => {
        (section as HTMLElement).style.opacity = '0';
        observer.observe(section);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [isLoading]);

  // Parallax effect for intro
  useEffect(() => {
    if (!isLoading && introRef.current) {
      const parallaxOffset = scrollY * -0.1;
      (introRef.current as HTMLElement).style.transform = 
        `translateY(${parallaxOffset}px)`;
    }
  }, [scrollY, isLoading]);

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
    <div ref={main} className="bg-glossy-black">
      <div id="noise-wrapper"></div>
      <main className="font-sans scroll-smooth text-white">
        {/* Intro Section */}
        <section 
          id="intro" 
          ref={introRef}
          className="bg-glossy-black min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 lg:px-40 text-white"
          style={{ opacity: 0 }}
        >
          <div> 
            <p className="text-5xl mb-4">
              <span ref={nameRef}></span>
              <span className="caret" style={{ opacity: 0 }}>|</span>
            </p>
            <div className='animation'>
              <div className="first text-2xl text-white">
                <span className='first' ref={titleRef}></span>
              </div>
              <div className="second">
                <div>Web Developer</div>
              </div>
            </div>
            <p className="flex flex-row flex-wrap gap-2 items-center mt-2">
              <a href="https://www.github.com/ishanrai9">
                <Image 
                  src="https://skillicons.dev/icons?i=github&theme=dark" 
                  alt="GitHub" 
                  width={50} 
                  height={40} 
                  unoptimized 
                  className="grayscale"
                />
              </a>
              <a href="https://www.linkedin.com/in/ishan-s-rai/">
                <Image 
                  src="https://skillicons.dev/icons?i=linkedin&theme=dark" 
                  alt="LinkedIn" 
                  width={50} 
                  height={40} 
                  unoptimized 
                  className="grayscale"
                />
              </a>
              <a href="https://x.com/iamishanrai/">
                <Image 
                  src="https://skillicons.dev/icons?i=twitter&theme=dark" 
                  alt="Twitter" 
                  width={50} 
                  height={40} 
                  unoptimized 
                  className="grayscale"
                />
              </a>
            </p>
          </div>
          <div>
            <Image 
              src="/img/profile.png" 
              alt="Profile" 
              width={400} 
              height={400} 
              className="rounded-full" 
            />
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about" 
          className="min-h-screen flex flex-col items-start justify-center px-16 bg-amber-300 text-white text-center"
        >
          <h2 className="text-6xl mx-auto mb-6">About Me</h2>
          <p className="max-w-8xl text-2xl mx-auto leading-relaxed text-white">
            Results-driven AI/ML and Software Engineer with professional experience in designing, building, and deploying intelligent web applications. Adept at developing machine learning models, optimizing deep learning pipelines, and integrating AI into production systems.
          </p>
          <p className="max-w-8xl text-2xl mx-auto leading-relaxed text-white">
            Proven success in leading cross-functional projects, collaborating with product teams, and delivering scalable, high-performance software solutions. Passionate about solving real-world problems through AI, automation, and data-driven innovation.
          </p>
        </section>

        {/* Experience Section */}
        <section 
          id="experience" 
          className="min-h-screen flex items-center justify-center px-16 bg-glossy-black text-white"
        >
          <h2 className="text-6xl mx-auto mb-6">Experience</h2>
        </section>

        {/* Skills Section */}
        <section 
          id="skills" 
          className="min-h-screen flex items-center justify-center px-16 bg-amber-300 text-white text-center"
        >
          <div>
            <h2 className="text-6xl mx-auto mb-6">My Skills</h2>
            <p className="mt-4">
              <Image 
                src="https://skillicons.dev/icons?i=python,java,c,cpp,html,css,js,react,nextjs,nodejs,express,git,github,aws,azure,tailwind,flask,tensorflow,pytorch,sklearn,opencv,anaconda,docker,postman,vscode,bash,figma,selenium&perline=9&theme=dark" 
                alt="Skill icons" 
                width={700} 
                height={40} 
                unoptimized
              />
            </p>
          </div>
        </section>
      
        {/* Projects Section */}
        <section 
          id="projects" 
          className="min-h-screen flex items-center justify-center px-16 bg-glossy-black text-white"
        >
          <h2 className="text-4xl mb-10">Projects</h2>
        </section>

        {/* Education Section */}
        <section 
          id="education" 
          className="min-h-screen flex items-center justify-center px-16 bg-white text-black"
        >
          <h2 className="text-4xl">Education</h2>
        </section>

        {/* Certifications Section */}
        <section 
          id="certifications" 
          className="min-h-screen flex flex-col items-center justify-center px-16 bg-zinc-100 text-black"
        >
          <h2 className="text-4xl mb-8">Certifications</h2>
          <div className="carousel">
            <div className="carousel-image">
              <Image 
                src="/img/TED.jpg" 
                alt="Certificate" 
                width={200} 
                height={150} 
                unoptimized 
              />
            </div>
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
        <section 
          id="contact" 
          className="min-h-screen flex items-center justify-center px-16 bg-zinc-900 text-white"
        >
          <h2 className="text-4xl font-bold">Contact Me</h2>
        </section>
      </main>
    </div>
  );
}