import { MdMenu } from 'react-icons/md';
import { FaRegCircleUser } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';

interface NavbarMenu {
  id: number;
  title: string;
  link: string;
  ref: string;
}

interface NarbarProps {
  scrollToSection: (ref: string) => void;
}

const Narbar = ({ scrollToSection }: NarbarProps) => {
  const NavbarMenu: NavbarMenu[] = [
    {
      id: 1,
      title: 'Home',
      link: '#',
      ref: 'homeRef',
    },
    {
      id: 2,
      title: 'Categories',
      link: '#',
      ref: 'categoriesRef',
    },
    {
      id: 3,
      title: 'Blog',
      link: '#',
      ref: 'blogRef',
    },
    {
      id: 4,
      title: 'About',
      link: '#',
      ref: 'aboutRef',
    },
    {
      id: 5,
      title: 'Contact',
      link: '#',
      ref: 'contactRef',
    },
  ];

  const handleClick = (ref: string) => {
    scrollToSection(ref);
  };

  return (
    <>
      <div className=" text-white py-8 px-28 bg-black/90 font-sans">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className=" container flex justify-between items-center"
        >
          {/* Logo */}
          <div>
            <a href="#" className="font-bold text-xl uppercase">
              Playing /{' '}
              <span className=" font-extralight text-white/70">Market</span>
            </a>
          </div>

          {/* Menu */}
          <div className=" hidden md:block">
            <ul className="flex items-center justify-center gap-4">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className=" inline-block text-sm py-2 px-3 uppercase"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item.ref);
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
              <button onClick={() => redirect('/auth/login')} className=" text-3xl ps-14 cursor-pointer">
                <FaRegCircleUser />
              </button>
            </ul>
          </div>

          {/* Mobile Menu */}
          <div className=" md:hidden">
            <MdMenu className=" text-4xl" />
          </div>
        </motion.nav>
      </div>
    </>
  );
};

export default Narbar;
