import Headphone from '@/assets/headphone4.png';
import { motion } from 'framer-motion';
import { fadeUp } from '@/components/display/FadeUp';

const Banner = () => {
  return (
    <>
      <section>
        <div className="container py-14 grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 gap-12 px-28">
          {/* Image */}
          <div>
            <motion.img
              src={Headphone.src}
              alt=""
              className="w-[300px] md:w-[400px] mx-auto"
              initial={{ opacity: 0, x: -100, rotate: -180 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: 'easeInOut',
              }}
            />
          </div>
          {/* Text */}
          <div className="flex flex-col justify-center">
            <div className="text-center md:text-left space-y-4 lg:max-w-[450px]">
              <motion.h1
                className="text-3xl lg:text-4xl font-semibold font-poppins"
                variants={fadeUp(0.7)}
                initial="hidden"
                whileInView={'show'}
              >
                The Latest Headphones With The Latest Technology
              </motion.h1>
              <motion.p
                variants={fadeUp(0.9)}
                initial="hidden"
                whileInView={'show'}
              >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Corporis officia atque molestiae doloribus quidem sed hic nulla,
                temporibus asperiores ut?
              </motion.p>

              <motion.button
                className="border-2 border-[#e33343] text-[#e33343]
              px-6 py-2 rounded-md hover:bg-[#e33343] hover:text-white"
                variants={fadeUp(1.3)}
                initial="hidden"
                whileInView={'show'}
              >
                Shop Now
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
