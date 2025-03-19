import React from 'react';
import Blogs1 from '@/assets/blogs/blog1.jpg';
import Blogs2 from '@/assets/blogs/blog2.jpg';
import Blogs3 from '@/assets/blogs/blog3.jpg';
import Blogs4 from '@/assets/blogs/blog4.jpg';

import { StaticImageData } from 'next/image'; // 导入 StaticImageData 类型

// 定义博客数据的类型
interface Blog {
  id: number;
  title: string;
  description: string;
  link: string;
  image: StaticImageData;
}

// 博客数据
const BlogsData: Blog[] = [
  {
    id: 1,
    title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi eveniet reprehenderit nulla nobis, placeat deserunt.',
    link: '#',
    image: Blogs1,
  },
  {
    id: 2,
    title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi eveniet reprehenderit nulla nobis, placeat deserunt.',
    link: '#',
    image: Blogs2,
  },
  {
    id: 3,
    title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi eveniet reprehenderit nulla nobis, placeat deserunt.',
    link: '#',
    image: Blogs3,
  },
  {
    id: 4,
    title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi eveniet reprehenderit nulla nobis, placeat deserunt.',
    link: '#',
    image: Blogs4,
  },
];

const Blogs: React.FC = () => {
  return (
    <>
      <section className="bg-gray-50 px-28">
        <div className="container py-14">
          <h1 className="text-3xl font-bold text-center font-poppins pb-8">
            Blogs
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {BlogsData.map((blog) => {
              return (
                  <div key={blog.id} className="flex flex-col items-center justify-center gap-6 p-5 max-w-[300px] mx-auto shadow-lg rounded-md bg-white hover:-translate-y-2 duration-300">
                    <img src={blog.image.src} alt={blog.title} />
                    <div className="space-y-2">
                      <h1 className="text-xl font-bold line-clamp-2">
                        {blog.title}
                      </h1>
                      <p className="line-clamp-2">{blog.description}</p>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
