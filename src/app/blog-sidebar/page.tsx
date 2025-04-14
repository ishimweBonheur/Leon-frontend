"use client";
import { useState, useEffect } from "react";
import Image from "next/image";



const BlogSidebarPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="overflow-hidden pb-[120px] pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              {loading ? (
                // Skeleton loader for the blog title
                <div className="mb-8 h-8 w-1/2 rounded bg-gray-300 animate-pulse" />
              ) : (
                <h1 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  10 amazing sites to download stock photos & digital assets for
                  free
                </h1>
              )}

              <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                <div className="flex flex-wrap items-center">
                  <div className="mb-5 mr-10 flex items-center">
                    {loading ? (
                      // Skeleton loader for author image and name
                      <div className="mr-4 h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
                    ) : (
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src="/images/blog/author-02.png"
                          alt="author"
                          fill
                        />
                      </div>
                    )}
                    <div className="w-full">
                      {loading ? (
                        // Skeleton loader for author name
                        <div className="h-5 w-32 rounded bg-gray-300 animate-pulse" />
                      ) : (
                        <span className="mb-1 text-base font-medium text-body-color">
                          By <span> Musharof Chy</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-5 flex items-center">
                    {loading ? (
                      // Skeleton loader for date and other icons
                      <div className="h-5 w-24 rounded bg-gray-300 animate-pulse" />
                    ) : (
                      <>
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
                              <path d="M11.4715 8.67529H10.6828C10.5394 8.67529 10.4438 8.77089 10.4438 8.91428V9.67904C10.4438 9.82243 10.5394 9.91802 10.6828 9.91802H11.4715C11.6149 9.91802 11.7105 9.82243 11.7105 9.67904V8.91428C11.7105 8.77089 11.591 8.67529 11.4715 8.67529Z" />
                              <path d="M3.89531 11.1606H3.10666C2.96327 11.1606 2.86768 11.2562 2.86768 11.3996V12.1644C2.86768 12.3078 2.96327 12.4034 3.10666 12.4034H3.89531C4.03871 12.4034 4.1343 12.3078 4.1343 12.1644V11.3996C4.1343 11.2562 4.03871 11.1606 3.89531 11.1606Z" />
                            </svg>
                          </span>
                          12 Jan 2024
                        </p>
                        <p className="mr-5 flex items-center text-base font-medium text-body-color">
                          <span className="mr-3">
                            <svg
                              width="18"
                              height="13"
                              viewBox="0 0 18 13"
                              className="fill-current"
                            >
                              <path d="M15.6375 0H1.6875C0.759375 0 0 0.759375 0 1.6875V10.6875C0 11.3062 0.309375 11.8406 0.84375 12.15C1.09687 12.2906 1.40625 12.375 1.6875 12.375C1.96875 12.375 2.25 12.2906 2.53125 12.15L5.00625 10.7156C5.11875 10.6594 5.23125 10.6312 5.34375 10.6312H15.6094C16.5375 10.6312 17.2969 9.87187 17.2969 8.94375V1.6875C17.325 0.759375 16.5656 0 15.6375 0ZM16.3406 8.94375C16.3406 9.3375 16.0312 9.64687 15.6375 9.64687H5.37187C5.09062 9.64687 4.78125 9.73125 4.52812 9.87187L2.05313 11.3063C1.82812 11.4187 1.575 11.4187 1.35 11.3063C1.125 11.1938 1.0125 10.9688 1.0125 10.7156V1.6875C1.0125 1.29375 1.32188 0.984375 1.71563 0.984375H15.6656C16.0594 0.984375 16.3687 1.29375 16.3687 1.6875V8.94375H16.3406Z" />
                            <path d="M12.2342 3.375H4.69668C4.41543 3.375 4.19043 3.6 4.19043 3.88125C4.19043 4.1625 4.41543 4.3875 4.69668 4.3875H12.2342C12.5154 4.3875 12.7404 4.1625 12.7404 3.88125C12.7404 3.6 12.5154 3.375 12.2342 3.375Z" />
                            </svg>
                          </span>
                          5 minutes read
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-12 text-lg font-medium leading-relaxed text-body-color dark:text-white sm:text-xl sm:leading-relaxed">
                {loading ? (
                  // Skeleton loader for blog content
                  <div className="space-y-4">
                    <div className="h-4 w-full rounded bg-gray-300 animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-gray-300 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-gray-300 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-gray-300 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p>
                      Nowadays, high-quality, royalty-free stock photos are a
                      must-have for any type of website, blog, or e-commerce
                      platform. However, not every person or business has the
                      budget to buy expensive stock images. This is why many
                      great platforms offer free stock photos and digital assets
                      for free!
                    </p>
                    {/* More content here */}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full px-4 lg:w-4/12">
            {/* Sidebar Content */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSidebarPage;
