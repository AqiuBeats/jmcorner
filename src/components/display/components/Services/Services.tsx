import icon1 from '@/assets/icons/obj1.png';
import icon2 from '@/assets/icons/obj2.png';
import icon3 from '@/assets/icons/obj3.png';
import { motion } from 'framer-motion';
import { fadeUp } from '@/components/display/FadeUp';
import Image from 'next/image';

const ServicesData = [
  {
    id: 1,
    title: 'Security',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam perferendis debitis cupiditate officia quaerat eius deleniti animi veritatis quod inventore.',
    icon: icon1,
    dealy: 0.5,
  },
  {
    id: 2,
    title: 'Gurantee',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam perferendis debitis cupiditate officia quaerat eius deleniti animi veritatis quod inventore.',
    icon: icon2,
    dealy: 0.8,
  },
  {
    id: 3,
    title: 'Affordability',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam perferendis debitis cupiditate officia quaerat eius deleniti animi veritatis quod inventore.',
    icon: icon3,
    dealy: 1.1,
  },
];

const Services = () => {
  return (
    <>
      <section className="bg-gray-100 font-poppins py-8 px-28">
        <div className="container py-14">
          <motion.h1
            className="text-center text-3xl font-bold pb-10"
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView={'show'}
          >
            Services
          </motion.h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ServicesData.map((service) => (
                <motion.div key={service.id}
                  className="flex flex-col justify-center items-center p-5 max-w-[300px] mx-auto shadow-lg rounded-xl bg-white"
                  variants={fadeUp(service.dealy)}
                  initial="hidden"
                  whileInView={'show'}
                >
                  <Image src={service.icon.src} alt="" className="w-[100px] mb-4" />
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">{service.title}</h1>
                    <p className="text-center text-sm text-black/75">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
