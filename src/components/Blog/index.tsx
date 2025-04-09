"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import blogData from "./blogData";

const Blog = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sectionScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const blogScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.section
      ref={ref}
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
      style={{ opacity: sectionOpacity, scale: sectionScale }}
    >
      <div className="container">
        <SectionTitle
          title="Our Latest Blogs"
          paragraph="Stay updated with the latest trends, insights, and best practices in HR management. Our expert articles cover employee engagement, recruitment strategies, and technology innovations that drive modern HR solutions."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              style={{ scale: blogScale }} 
            >
              <SingleBlog blog={blog} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Blog;
