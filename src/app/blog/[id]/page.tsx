"use client";
import { Blog } from "@/types/blog";
import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import Image from "next/image";
import blogs from '../../../components/Blog/blogData';

import { Metadata } from "next";
import { useParams } from "next/navigation";


const BlogDetailsPage = () => {
  const { id }:any = useParams();
  const selectedBlog:any = blogs.find((blog) => blog.id === parseInt(id));

  if (!selectedBlog) {
    return (
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center">Blog not found</h2>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {selectedBlog.title}
                </h2>
                <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-5 mr-10 flex items-center">
                      <div className="mr-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={selectedBlog.author.image}
                            alt="author"
                            fill
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <span className="mb-1 text-base font-medium text-body-color">
                          By <span>{selectedBlog.author.name}</span>
                        </span>
                        <span className="text-sm text-body-color">{selectedBlog.author.designation}</span>
                      </div>
                    </div>
                    <div className="mb-5 flex items-center">
                      <p className="mr-5 flex items-center text-base font-medium text-body-color">
                        <span className="mr-3">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            className="fill-current"
                          >
                            <path d="M3.89531 8.67529H3.10666C2.96327 8.67529 2.86768 8.77089 2.86768 8.91428V9.67904C2.86768 9.82243 2.96327 9.91802 3.10666 9.91802H3.89531C4.03871 9.91802 4.1343 9.82243 4.1343 9.67904V8.91428C4.1343 8.77089 4.03871 8.67529 3.89531 8.67529Z" />
                            <path d="M6.429 8.67529H5.64035C5.49696 8.67529 5.40137 8.77089 5.40137 8.91428V9.67904C5.40137 9.82243 5.49696 9.91802 5.64035 9.91802H6.429C6.57239 9.91802 6.66799 9.82243 6.66799 9.67904V8.91428C6.66799 8.77089 6.5485 8.67529 6.429 8.67529Z" />
                            <path d="M8.93828 8.67529H8.14963C8.00624 8.67529 7.91064 8.77089 7.91064 8.91428V9.67904C7.91064 9.82243 8.00624 9.91802 8.14963 9.91802H8.93828C9.08167 9.91802 9.17727 9.82243 9.17727 9.67904V8.91428C9.17727 8.77089 9.08167 8.67529 8.93828 8.67529Z" />
                          </svg>
                        </span>
                        <span>{selectedBlog.publishDate}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-8 text-lg text-body-color dark:text-white">
                  <p>{selectedBlog.paragraph}</p>
                  <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                    1. Professionalism and Respect
                  </h3>
                  <p className="mt-2">{selectedBlog.content}</p>
                  <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                    2. Confidentiality and Data Protection
                  </h3>
                  <p className="mt-2">{selectedBlog.content}</p>
                  <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                    3. Compliance with Agreements
                  </h3>
                  <p className="mt-2">{selectedBlog.content}</p>
                  <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                    4. Feedback and Dispute Resolution
                  </h3>
                  <p className="mt-2">{selectedBlog.content}</p>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsPage;
