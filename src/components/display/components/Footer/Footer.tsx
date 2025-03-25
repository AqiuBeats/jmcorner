import React from "react";
import {
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaGoogle,
} from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import Cards from "@/assets/credit-cards.webp";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-[#aa6d6b] pt-12 pb-8 text-white px-28">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Company Details */}
            <motion.div
              className="space-y-6"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold uppercase">Playing</h1>
              <p className="text-sm amx-w-[300px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                reiciendis a modi alias dolorum soluta.
              </p>
              <div>
                <p className="flex items-center gap-2">
                  <FaPhone />
                  +86 123 4567 8901
                </p>
                <p className="flex items-center gap-2">
                  <FaMapLocation />
                  Jinan, Shandong, China
                </p>
              </div>
            </motion.div>
            {/* Links */}
            <motion.div
              className="space-y-6"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold">Quick Links</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <ul className=" space-y-2">
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                  </ul>
                </div>
                <div>
                  <ul className=" space-y-2">
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            {/* Social Media */}
            <motion.div
              className="space-y-6"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-3xl font-bold">Follow Us</h1>
              <div className="flex gap-3 items-center">
                <FaFacebook className="text-3xl hover:scale-105 duration-300" />
                <FaInstagram className="text-3xl hover:scale-105 duration-300" />
                <FaTelegram className="text-3xl hover:scale-105 duration-300" />
                <FaGoogle className="text-3xl hover:scale-105 duration-300" />
              </div>
              <div className="space-y-2">
                <p>Payment Methods</p>
                <Image src={Cards.src} alt="Payment Methods" className="w-[80%]" />
              </div>
            </motion.div>
          </div>
          {/* Copyright */}
          <p className="text-white text-center mt-8 border-t-2 pt-8">
            &copy; 2024 Playing. All rights reserved. || Powered by React
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;