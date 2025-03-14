'use client';
import { useRef } from 'react';
import Hero from '@/components/display/components/Hero/Hero';
import Narbar from '@/components/display/components/Navbar/Narbar';
import Services from '@/components/display/components/Services/Services';
import Banner from '@/components/display/components/Banner/Banner';
import BannerText from '@/components/display/components/Banner/BannerText';
import Blogs from '@/components/display/components/Blogs/Blogs';
import Footer from '@/components/display/components/Footer/Footer';

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: string) => {
    switch (ref) {
      case 'homeRef':
        homeRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'categoriesRef':
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'blogRef':
        blogRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'aboutRef':
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contactRef':
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <main className="overflow-x-hidden">
      <Narbar scrollToSection={scrollToSection} />
      <div ref={homeRef}>
        <Hero /> {/* 对应 Home 菜单 */}
      </div>
      <div ref={categoriesRef}>
        <Services /> {/* 对应 Categories 菜单 */}
      </div>
      <Banner />
      <div ref={aboutRef}>
        <BannerText /> {/* 可调整为 About 对应的ID */}
      </div>
      <div ref={blogRef}>
        <Blogs /> {/* 对应 Blog 菜单 */}
      </div>
      <div ref={contactRef}>
        <Footer /> {/* 对应 Contact 菜单 */}
      </div>
    </main>
  );
};

export default Home;