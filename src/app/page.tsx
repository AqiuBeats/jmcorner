'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  ChevronRight,
  Star,
  Menu,
  X,
  BookOpen,
  Calendar,
  Brain,
  Sparkles,
  Gift,
  BadgeCheck,
  Zap,
  Globe,
  // ChevronLeft,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLoginOutMutation } from '@/helpers/request';

import useAuthStore from '@/hooks/useAuthStore'; // 导入 Zustand store

export default function HomePage() {
  const {
    mutate: logout,
    // data,
    // isSuccess,
    // isError,
    // isPending, // 替换 isLoading
    // error,
  } = useLoginOutMutation();

  //判断token是否失效
  const { token, isTokenExpired } = useAuthStore();

  console.log('token', token);
  // if (isTokenExpired()) {
  //   console.log('isTokenExpired', 'token已经过期'); //会短暂的进入过期状态,然后更正
  // } else {
  //   console.log('token', token);
  //   console.log('token过期时间', getTokenExpiration());
  // }

  const handleOut = () => {
    console.log('handleOut');
    logout();
  };

  // Section refs for scrolling
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const worldRef = useRef(null);
  const matchingRef = useRef(null);
  const storiesRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  // Section visibility
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const worldInView = useInView(worldRef, { once: true, amount: 0.3 });
  const matchingInView = useInView(matchingRef, { once: true, amount: 0.3 });
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.3 });
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if device is mobile or tablet
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  // Carousel state
  // const [ setCurrentSlide] = useState(0);//currentSlide

  // const carouselItems = [
  //   {
  //     image: '/placeholder.svg?height=800&width=1600&text=浪漫约会',
  //     title: '找到你的真爱',
  //     description: '在江城缘，每一次相遇都可能是一生的缘分',
  //   },
  //   {
  //     image: '/placeholder.svg?height=800&width=1600&text=智能匹配',
  //     title: 'AI智能匹配',
  //     description: 'DeepSeek技术为你找到最合适的伴侣',
  //   },
  //   {
  //     image: '/placeholder.svg?height=800&width=1600&text=0元相亲',
  //     title: '0元门槛参与',
  //     description: '实名认证即送会员，开启你的寻爱之旅',
  //   },
  //   {
  //     image: '/placeholder.svg?height=800&width=1600&text=我的世界',
  //     title: '展示真实的你',
  //     description: '通过想法和日志，让别人了解真实的你',
  //   },
  // ];

  // Auto-advance carousel
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [carouselItems.length]);

  // Parallax effect for hero image (reduced on mobile)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxStrength = isMobile ? 30 : 100;
  const heroImageY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, parallaxStrength],
  );
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // 定义 Heart 类型
  interface Heart {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
  }

  // 初始化 hearts 状态，并显式指定类型
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (heroInView) {
      const maxHearts = isMobile ? 8 : 15;

      const interval = setInterval(
        () => {
          if (hearts.length < maxHearts) {
            setHearts((prev) => [
              ...prev,
              {
                id: Date.now(),
                x: Math.random() * 100,
                size: Math.random() * (isMobile ? 15 : 20) + 10,
                duration: Math.random() * 10 + 10,
                delay: Math.random() * 5,
              },
            ]);
          }
        },
        isMobile ? 1500 : 1000,
      );

      return () => clearInterval(interval);
    }
  }, [heroInView, hearts.length, isMobile]);

  // Animate header on scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop or tablet (if applicable)
  useEffect(() => {
    if (!isMobile && !isTablet && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, isTablet, mobileMenuOpen]);

  // Scroll to section function
  //   const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
  //     if (ref && ref.current) {
  //       ref.current.scrollIntoView({ behavior: 'smooth' });
  //       setMobileMenuOpen(false);
  //     }
  //   };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close menu after navigation
    } else {
      console.warn('Reference to section is not available.');
    }
  };

  // Navigation items with refs
  const navItems = [
    { name: '首页', ref: heroRef },
    { name: '我的世界', ref: worldRef },
    { name: '智能匹配', ref: matchingRef },
    { name: '成功故事', ref: storiesRef },
    { name: '关于我们', ref: ctaRef },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    hover: {
      y: -10,
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: isMobile ? -15 : -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  // Updated menu animation variants for mobile and tablet
  const menuVariants = {
    closed: {
      opacity: 0,
      x: isTablet ? '50%' : '100%', // Slide less for tablets
      transition: {
        type: 'spring',
        stiffness: isMobile ? 400 : 300, // Softer stiffness for mobile
        damping: isMobile ? 40 : 30, // Smoother damping for mobile
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: isMobile ? 400 : 300,
        damping: isMobile ? 40 : 30,
        duration: isTablet ? 0.3 : 0.4, // Slightly faster for tablets
      },
    },
  };

  // Logo text animation variants
  const logoTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const logoLetterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  };

  // Logo hover animation
  const logoHoverVariants = {
    hover: {
      y: [0, -5, 0],
      color: ['#f43f5e', '#be123c', '#f43f5e'],
      transition: {
        y: {
          duration: 0.5,
          ease: 'easeInOut',
          delay: 0.05 * 1,
        },
        color: {
          duration: 0.8,
          ease: 'easeInOut',
          delay: 0.05 * 1,
        },
      },
    },
  };

  // Carousel variants
  // const carouselVariants = {
  //   enter: (direction: number) => ({
  //     x: direction > 0 ? '100%' : '-100%',
  //     opacity: 0,
  //   }),
  //   center: {
  //     x: 0,
  //     opacity: 1,
  //   },
  //   exit: (direction: number) => ({
  //     x: direction < 0 ? '100%' : '-100%',
  //     opacity: 0,
  //   }),
  // };

  // MBTI types for the matching section
  const mbtiTypes = [
    'INTJ',
    'INTP',
    'ENTJ',
    'ENTP',
    'INFJ',
    'INFP',
    'ENFJ',
    'ENFP',
    'ISTJ',
    'ISFJ',
    'ESTJ',
    'ESFJ',
    'ISTP',
    'ISFP',
    'ESTP',
    'ESFP',
  ];

  // Zodiac signs for the matching section
  const zodiacSigns = [
    '白羊座',
    '金牛座',
    '双子座',
    '巨蟹座',
    '狮子座',
    '处女座',
    '天秤座',
    '天蝎座',
    '射手座',
    '摩羯座',
    '水瓶座',
    '双鱼座',
  ];

  // Interest categories for the matching section
  const interestCategories = [
    '旅行',
    '美食',
    '电影',
    '音乐',
    '阅读',
    '运动',
    '摄影',
    '艺术',
    '游戏',
    '科技',
    '户外',
    '宠物',
  ];

  // Direction for carousel animation
  // const [[page, direction], setPage] = useState([0, 0]);

  // Handle carousel navigation
  // const paginate = (newDirection: number) => {
  //   const newPage = page + newDirection;
  //   if (newPage >= 0 && newPage < carouselItems.length) {
  //     setPage([newPage, newDirection]);
  //     setCurrentSlide(newPage);
  //   } else if (newPage < 0) {
  //     setPage([carouselItems.length - 1, newDirection]);
  //     setCurrentSlide(carouselItems.length - 1);
  //   } else {
  //     setPage([0, newDirection]);
  //     setCurrentSlide(0);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrolled ? 'bg-background/95' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container flex h-16 items-center mx-auto">
          <div className="flex-1 flex justify-start">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover="hover"
              onClick={() => scrollToSection(heroRef)}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                className="text-2xl font-bold relative"
                initial="hidden"
                animate="visible"
                variants={logoTextVariants}
              >
                {['江', '城', '缘'].map((letter, i) => (
                  <motion.span
                    key={i}
                    className="inline-block relative"
                    variants={logoLetterVariants}
                    custom={i}
                    whileHover={logoHoverVariants.hover}
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      fontFamily: 'serif',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {letter}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-rose-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Navigation - Show on tablet and desktop */}
          <nav className="flex-1 hidden md:flex justify-center gap-6">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* <Link href="/square" prefetch> */}
                <button
                  onClick={() => scrollToSection(item.ref)}
                  className="text-sm font-medium hover:text-rose-500 relative group"
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
                {/* </Link> */}
              </motion.div>
            ))}
          </nav>

          {/* Right Section - Menu Button and Login/Register */}
          {isTokenExpired() && (
            <div className="flex-1 flex justify-end items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                <Link
                  href="/auth/login?loginState=0"
                  className="text-sm font-medium hover:text-rose-500 relative group"
                >
                  登录
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login?loginState=1" prefetch>
                  <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                    免费注册
                  </Button>
                </Link>
              </motion.div>
              {/* Menu Toggle Button - Visible on mobile and tablet */}
              <motion.button
                className="md:hidden flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          )}
          {!isTokenExpired() && <div onClick={() => handleOut()}>登出</div>}
        </div>
        {/* Mobile/Tablet Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-background z-40 pt-16"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div
                className={`container px-4 py-6 flex flex-col gap-6 ${
                  isTablet ? 'max-w-md ml-auto' : 'w-full'
                }`}
              >
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className="text-xl font-medium block py-2 border-b border-muted w-full text-left hover:text-rose-500 active:text-rose-600 focus:text-rose-500 transition-colors duration-200"
                      onClick={() => scrollToSection(item.ref)}
                    >
                      {item.name}
                    </button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Link
                    href="#"
                    className="text-xl font-medium block py-2 hover:text-rose-500 active:text-rose-600 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        {/*  Carousel */}
        {/* <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                className="w-full max-w-5xl"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={
                      carouselItems[currentSlide].image || '/placeholder.svg'
                    }
                    alt={carouselItems[currentSlide].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-xl border border-white/20 shadow-2xl max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <motion.h2
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {carouselItems[currentSlide].title}
                      </motion.h2>
                      <motion.p
                        className="text-lg md:text-xl text-white/90 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {carouselItems[currentSlide].description}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <Button
                          size="lg"
                          className="bg-rose-500 hover:bg-rose-600 text-white"
                          onClick={() => scrollToSection(featuresRef)}
                        >
                          了解更多
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {carouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const direction = i > currentSlide ? 1 : -1;
                  setPage([i, direction]);
                  setCurrentSlide(i);
                }}
                className={`w-3 h-3 rounded-full ${
                  i === currentSlide ? 'bg-white' : 'bg-white/50'
                } transition-all duration-300`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => paginate(1)}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </section> */}

        <section
          className="w-full py-8 md:py-16 lg:py-24 bg-gradient-to-b from-rose-50 to-background relative overflow-hidden"
          ref={heroRef}
        >
          {/* Floating hearts background */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute text-rose-200 opacity-40"
                initial={{
                  y: '110vh',
                  x: `${heart.x}vw`,
                  opacity: 0,
                }}
                animate={{
                  y: '-10vh',
                  opacity: 0.4,
                  transition: {
                    duration: heart.duration,
                    delay: heart.delay,
                    ease: 'linear',
                  },
                }}
                exit={{ opacity: 0 }}
                style={{ fontSize: heart.size }}
              >
                ❤
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-4 text-center lg:text-left"
                initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  variants={fadeIn}
                >
                  在大数据的世界
                  <motion.span
                    className="text-rose-500 block mt-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      heroInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.5 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.5,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    每个人都能做自己的红娘
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0"
                  variants={fadeIn}
                >
                  0元门槛，实名认证即送会员，优秀吖认识的门槛不应该那么高!
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  variants={staggerChildren}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto"
                    >
                      免费注册 <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => scrollToSection(featuresRef)}
                    >
                      了解更多
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Free membership badge */}
                <motion.div
                  className="mt-6 inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Gift className="h-5 w-5" />
                  <span className="font-medium">实名认证，即送会员特权</span>
                </motion.div>
              </motion.div>
              <motion.div
                className="mx-auto w-full max-w-[500px] relative mt-8 lg:mt-0"
                initial={{ opacity: 0, x: 50 }}
                animate={
                  heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div
                  className="aspect-[4/3] overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.03 }}
                  style={{
                    y: heroImageY,
                    scale: heroScale,
                  }}
                >
                  <Image
                    src="/homepage/yuan.jpg"
                    alt="幸福的情侣"
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                    priority // 关键！告诉 Next.js 这是首屏重要图片，需优先加载
                  />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white p-3 md:p-4 rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    heroInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-rose-100 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        duration: 2,
                        repeatDelay: 1,
                      }}
                    >
                      <BadgeCheck className="h-4 w-4 md:h-5 md:w-5 text-rose-500" />
                    </motion.div>
                    <div>
                      <p className="text-xs md:text-sm font-medium">已有超过</p>
                      <motion.p
                        className="text-base md:text-lg font-bold"
                        initial={{ opacity: 0 }}
                        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 2, delay: 1.2 }}
                        >
                          10,000+ 对
                        </motion.span>
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-8 md:py-16 lg:py-24" ref={featuresRef}>
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                >
                  为什么选择我们？
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  我们致力于创造一个温馨、真实、无压力的交友环境
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              variants={staggerChildren}
            >
              {[
                {
                  icon: <Gift className="h-6 w-6 text-rose-500" />,
                  title: '0元门槛',
                  desc: '实名认证即送会员，无需支付任何费用，人人都能参与。',
                },
                {
                  icon: <Users className="h-6 w-6 text-rose-500" />,
                  title: '真实用户',
                  desc: '所有用户均经过实名认证，确保交友环境的真实可靠。',
                },
                {
                  icon: <Sparkles className="h-6 w-6 text-rose-500" />,
                  title: '智能匹配',
                  desc: '基于DeepSeek技术，分析兴趣、星座、MBTI等多维度精准匹配。',
                },
                {
                  icon: <Globe className="h-6 w-6 text-rose-500" />,
                  title: '我的世界',
                  desc: '个人空间让你展示真实的自己，通过想法和日志分享生活。',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="bg-rose-50 border-none h-full">
                    <CardContent className="pt-6">
                      <motion.div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* My World Section */}
        <section
          className="w-full py-8 md:py-16 lg:py-24 bg-gradient-to-r from-rose-50 to-background"
          ref={worldRef}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="mx-auto w-full max-w-[500px] order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                animate={
                  worldInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div
                  className="aspect-square overflow-hidden rounded-xl shadow-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <Image
                    src="/homepage/study.jpg"
                    alt="我的世界功能展示"
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-4 order-1 lg:order-2"
                initial="hidden"
                animate={worldInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full"
                  variants={fadeIn}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">专属空间</span>
                </motion.div>
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl"
                  variants={fadeIn}
                >
                  我的世界，展示真实的你
                </motion.h2>
                <motion.p
                  className="text-muted-foreground md:text-lg"
                  variants={fadeIn}
                >
                  在这里，你可以创建属于自己的个人空间，记录生活点滴，分享内心世界。
                </motion.p>

                <motion.ul
                  className="space-y-4 mt-6"
                  variants={staggerChildren}
                >
                  {[
                    {
                      title: '个人想法',
                      desc: '记录每一天的心情与感悟，让潜在伴侣了解真实的你。日志可以设置公开或私密，完全由你掌控。',
                    },
                    {
                      title: '兴趣日志',
                      desc: '分享你的兴趣爱好，无论是美食、旅行、电影还是阅读，展示你的生活态度和价值观。',
                    },
                    {
                      title: '互动空间',
                      desc: '其他会员可以访问你的空间，了解你的生活和想法，留言互动，增进了解。',
                    },
                    {
                      title: '个性装扮',
                      desc: '自定义你的空间风格，展示独特的个人品味，让你的世界与众不同。',
                    },
                  ].map((item, i) => (
                    <motion.li key={i} className="flex gap-3" variants={fadeIn}>
                      <motion.div
                        className="h-6 w-6 mt-1 text-rose-500 flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <ChevronRight />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  className="mt-8"
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    探索更多功能 <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* DeepSeek Matching Section */}
        <section className="w-full py-8 md:py-16 lg:py-24" ref={matchingRef}>
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial="hidden"
              animate={matchingInView ? 'visible' : 'hidden'}
              variants={fadeIn}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full"
                variants={fadeIn}
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">智能匹配</span>
              </motion.div>
              <div className="space-y-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                >
                  DeepSeek 智能匹配系统
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  基于多维度数据分析，为你找到最合适的伴侣
                </motion.p>
              </div>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left side - Matching factors */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                animate={
                  matchingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="space-y-6">
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-md"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-rose-100 p-3 rounded-lg">
                        <Brain className="h-6 w-6 text-rose-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">MBTI 性格匹配</h3>
                        <p className="text-muted-foreground">
                          基于16种MBTI性格类型进行匹配，找到性格互补或相似的伴侣。
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {mbtiTypes.slice(0, 8).map((type, i) => (
                            <motion.span
                              key={type}
                              className="bg-rose-50 text-rose-700 text-xs px-2 py-1 rounded-md"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={
                                matchingInView
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0, scale: 0.8 }
                              }
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {type}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-md"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-rose-100 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-rose-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">星座与生肖分析</h3>
                        <p className="text-muted-foreground">
                          结合传统星座学和中国生肖理论，分析你与潜在伴侣的契合度。
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {zodiacSigns.slice(0, 6).map((sign, i) => (
                            <motion.span
                              key={sign}
                              className="bg-rose-50 text-rose-700 text-xs px-2 py-1 rounded-md"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={
                                matchingInView
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0, scale: 0.8 }
                              }
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {sign}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-md"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-rose-100 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-rose-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">
                          兴趣爱好与日志分析
                        </h3>
                        <p className="text-muted-foreground">
                          通过分析你的兴趣爱好和日志内容，找到志同道合的伴侣。
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {interestCategories.slice(0, 8).map((interest, i) => (
                            <motion.span
                              key={interest}
                              className="bg-rose-50 text-rose-700 text-xs px-2 py-1 rounded-md"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={
                                matchingInView
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0, scale: 0.8 }
                              }
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {interest}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right side - Visualization */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  matchingInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-lg h-full flex flex-col justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">智能匹配流程</h3>
                    <p className="text-muted-foreground">
                      DeepSeek 如何为你找到理想伴侣
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-rose-100"></div>

                    {[
                      {
                        title: '数据收集',
                        desc: '通过详细的个人资料、兴趣爱好、日志内容、MBTI测试等收集多维度数据。',
                        icon: <Users className="h-5 w-5 text-white" />,
                      },
                      {
                        title: '深度分析',
                        desc: 'DeepSeek AI 分析你的性格特点、价值观、生活方式和交友偏好。',
                        icon: <Brain className="h-5 w-5 text-white" />,
                      },
                      {
                        title: '匹配推荐',
                        desc: '基于多维度分析，推荐与你高度匹配的潜在伴侣。',
                        icon: <Sparkles className="h-5 w-5 text-white" />,
                      },
                      {
                        title: '持续优化',
                        desc: '根据你的反馈和互动情况，不断优化匹配算法，提高匹配准确度。',
                        icon: <Zap className="h-5 w-5 text-white" />,
                      },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-6 mb-8 relative"
                        initial={{ opacity: 0, x: 30 }}
                        animate={
                          matchingInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: 30 }
                        }
                        transition={{ delay: 0.2 * i + 0.5, duration: 0.5 }}
                      >
                        <motion.div
                          className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center z-10 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 10,
                          }}
                        >
                          {step.icon}
                          <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-white text-rose-500 flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </div>
                        </motion.div>
                        <div>
                          <h4 className="text-lg font-bold">{step.title}</h4>
                          <p className="text-muted-foreground">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          className="w-full py-8 md:py-16 lg:py-24 bg-rose-50"
          ref={storiesRef}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={storiesInView ? 'visible' : 'hidden'}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                >
                  成功故事
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  听听我们平台上已经找到真爱的用户怎么说
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate={storiesInView ? 'visible' : 'hidden'}
              variants={staggerChildren}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="bg-white h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="h-12 w-12 rounded-full bg-muted overflow-hidden"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Image
                            src={`/homepage/avtar0${i}.jpg`}
                            alt={`用户${i}`}
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                        </motion.div>
                        <div>
                          <h3 className="font-medium">
                            小{String.fromCharCode(64 + i)}
                          </h3>
                          <motion.div
                            className="flex text-amber-400"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.1,
                                },
                              },
                            }}
                          >
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <motion.div
                                  key={j}
                                  variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 },
                                  }}
                                >
                                  <Star className="h-4 w-4 fill-current" />
                                </motion.div>
                              ))}
                          </motion.div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        &quot;在这个平台上，我找到了我的另一半。通过日志和兴趣匹配，我们发现彼此有很多共同点。感谢江城缘让我们相遇！&quot;
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="w-full py-8 md:py-16 lg:py-24" ref={stepsRef}>
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-4 order-2 lg:order-1"
                initial="hidden"
                animate={stepsInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl text-center lg:text-left"
                  variants={fadeIn}
                >
                  如何开始？
                </motion.h2>
                <motion.p
                  className="text-muted-foreground text-center lg:text-left"
                  variants={fadeIn}
                >
                  只需简单几步，开启你的寻爱之旅
                </motion.p>
                <motion.ul className="space-y-4" variants={staggerChildren}>
                  {[
                    {
                      title: '实名认证',
                      desc: '完成简单的实名认证，即可获得会员资格，0元参与',
                    },
                    {
                      title: '完善资料',
                      desc: '填写详细的个人信息，包括兴趣爱好、MBTI、星座等',
                    },
                    {
                      title: '创建我的世界',
                      desc: '通过想法和日志展示真实的自己，吸引志同道合的人',
                    },
                    {
                      title: '智能匹配',
                      desc: 'DeepSeek AI 为你推荐最合适的潜在伴侣',
                    },
                    { title: '线上沟通', desc: '通过消息或视频聊天了解对方' },
                    {
                      title: '线下见面',
                      desc: '准备好后，可以参加我们的线下活动或自行约见',
                    },
                  ].map((step, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-4"
                      custom={i}
                      variants={stepVariants}
                    >
                      <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-medium shrink-0"
                        whileHover={{ scale: 1.1, backgroundColor: '#fda4af' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {i + 1}
                      </motion.div>
                      <div>
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
              <motion.div
                className="mx-auto w-full max-w-[500px] order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                animate={
                  stepsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
                }
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div
                  className="aspect-square overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <Image
                    src="/homepage/organize.jpg"
                    alt="约会场景"
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          className="w-full py-8 md:py-16 lg:py-24 bg-rose-500 text-white"
          ref={ctaRef}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate={ctaInView ? 'visible' : 'hidden'}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6 }}
                >
                  准备好开始了吗？
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-rose-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  加入我们，开启你的寻爱之旅，0元即可参与，实名认证即送会员
                </motion.p>
              </div>
              <motion.div
                className="w-full max-w-sm space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form className="flex flex-col sm:flex-row gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    className="flex-1"
                  >
                    <Input
                      type="email"
                      placeholder="输入你的邮箱"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      className="bg-white text-rose-500 hover:bg-rose-100 w-full sm:w-auto"
                    >
                      立即注册
                    </Button>
                  </motion.div>
                </form>
                <motion.p
                  className="text-xs text-rose-100"
                  initial={{ opacity: 0 }}
                  animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  注册即表示您同意我们的
                  <Link href="#" className="underline underline-offset-2 ml-1">
                    服务条款
                  </Link>
                  和
                  <Link href="#" className="underline underline-offset-2 ml-1">
                    隐私政策
                  </Link>
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        className="w-full border-t py-6 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24 px-4 md:px-6">
          <motion.div className="flex items-center" whileHover="hover">
            <motion.div
              className="text-xl font-bold"
              initial="hidden"
              animate="visible"
              variants={logoTextVariants}
            >
              {['江', '城', '缘'].map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block relative"
                  variants={logoLetterVariants}
                  custom={i}
                  whileHover={logoHoverVariants.hover}
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    fontFamily: 'serif',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          <div className="flex flex-wrap justify-center md:flex-row items-center gap-4 md:gap-6">
            {['关于我们', '联系方式', '隐私政策', '服务条款'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            © {new Date().getFullYear()} 江城缘. 保留所有权利.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
