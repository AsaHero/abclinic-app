"use client";

// src/components/blog/BlogPageBody.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@/types/blog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

interface BlogPageBodyProps {
  posts: BlogPost[];
  categories: string[];
  activeCategory?: string;
}

const BlogPageBody: React.FC<BlogPageBodyProps> = ({ posts, categories, activeCategory }) => {
  return (
    <div className="min-h-screen bg-[#001d1c] text-white">
      {/* Hero */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#002a27] to-[#001d1c]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <motion.h1
            className="text-5xl md:text-7xl font-arista-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Блог
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Полезное о стоматологии и жизнь клиники изнутри.
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !activeCategory ? "bg-white text-primary-900" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              Все статьи
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat ? "bg-white text-primary-900" : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <section className={`py-12 ${categories.length === 0 ? "border-t border-gray-800" : ""}`}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              {activeCategory ? "В этой категории пока нет статей." : "Первые статьи скоро появятся."}
            </p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="block bg-[#002a27] rounded-xl overflow-hidden hover:bg-[#003932] transition-colors duration-300 h-full flex flex-col"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-gray-800">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#002a27] to-[#003932]" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {post.category && (
                        <span className="mb-2 inline-flex w-fit items-center rounded-full bg-forest-500/15 px-2.5 py-0.5 text-xs font-medium text-forest-300">
                          {post.category}
                        </span>
                      )}
                      <h3 className="text-lg font-medium text-white leading-snug">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                      )}
                      {post.publishedAt && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={12} />
                          {formatDate(post.publishedAt)}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPageBody;
