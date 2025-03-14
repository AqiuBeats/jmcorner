'use client';
import { useState } from 'react';

import Headphone1 from '@/assets/headphone1.png';
import Headphone2 from '@/assets/headphone2.png';
import Headphone3 from '@/assets/headphone3.png';
import { FaWhatsapp } from 'react-icons/fa';

import { easeInOut, motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // 使用 Next.js 的 Image 组件

const fadeUp = (dealy: number) => {
  return {
    hidden: { opacity: 0, y: 100, scale: 0.5 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: dealy, duration: 0.5, ease: easeInOut },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      transition: { duration: 0.5, ease: easeInOut },
    },
  };
};

const headphoneData = [
  {
    id: 1,
    image: Headphone1,
    title: 'Headphones Wireless 1',
    subtitle:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus praesentium consequatur tempore iusto nam. Accusantium.',
    price: '￥1,399',
    modal: 'Modal Brown',
    bgColor: '#8b5958',
  },
  {
    id: 2,
    image: Headphone2,
    title: 'Headphones Wireless 2',
    subtitle:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus praesentium consequatur tempore iusto nam. Accusantium.',
    price: '￥1,399',
    modal: 'Lime Green',
    bgColor: '#638153',
  },
  {
    id: 3,
    image: Headphone3,
    title: 'Headphones Wireless 3',
    subtitle:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus praesentium consequatur tempore iusto nam. Accusantium.',
    price: '￥1,399',
    modal: 'Ocean Blue',
    bgColor: '#5d818c',
  },
];

const Hero = () => {
  const [activeHeadphone, setActiveHeadphone] = useState(headphoneData[0]);

  const handleActiveHeadphone = (headphone: any) => {
    setActiveHeadphone(headphone);
  };

  return (
    <>
      <section className=" text-white bg-black/90 px-28">
        <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[700px]">
          {/* Brand */}
          <div className="flex flex-col justify-center py-14 md:py-0 xl:max-w-[500px]">
            <div className="space-y-5 text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.h1
                  className="texl-3xl lg:text-6xl font-bold font-varela"
                  key={activeHeadphone.id}
                  variants={fadeUp(0.2)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {activeHeadphone.title}
                </motion.h1>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  className="text-sm leading-loose text-white/80"
                  key={activeHeadphone.id}
                  variants={fadeUp(0.3)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {activeHeadphone.subtitle}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.button
                  className="px-4 py-2 inline-block font-normal rounded-sm"
                  style={{ backgroundColor: activeHeadphone.bgColor }}
                  key={activeHeadphone.id}
                  variants={fadeUp(0.3)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  Buy and Listen
                </motion.button>
              </AnimatePresence>

              {/* line */}
              <div className="flex items-center justify-between md:justify-start gap-4 !mt-24">
                <div className="w-20 h-[1px] bg-white"></div>
                <p className="uppercase text-sm">Top Headphones for you</p>
                <div className="w-20 h-[1px] bg-white"></div>
              </div>

              {/* Headphone list swticher */}
              <div className="grid grid-cols-3 gap-10">
                {headphoneData.map((headphone) => {
                  return (
                    <div
                      onClick={() => handleActiveHeadphone(headphone)}
                      className="grid grid-cols-2 place-items-center cursor-pointer"
                    >
                      <div>
                        <Image
                          src={headphone.image}
                          alt=""
                          width={300}
                          height={200}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-base font-bold">{headphone.price}</p>
                        <p className="text-xs font-normal text-nowrap">
                          {headphone.modal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="flex flex-col justify-end items-center">
            <AnimatePresence mode="wait">
              <motion.img
                src={activeHeadphone.image.src}
                alt=""
                className="w-[300px] md:w-[400px] xl:w-[550px]"
                key={activeHeadphone.id}
                initial={{ opacity: 0, scale: 0.9, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: easeInOut }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: 100,
                  transition: { duration: 0.2 },
                }}
              />
            </AnimatePresence>
          </div>
          {/* icons */}
          <div
            className="text-3xl text-white fixed bottom-10 right-10
          cursor-pointer hover:rotate-[360deg] duration-500 z-[99999]
          mix-blend-difference"
          >
            <a href="#">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
