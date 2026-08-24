"use client";

// src/components/blog/BlogPostPageBody.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ArrowLeft, Calendar } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import BookingButton from "@/components/common/BookingButton";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

interface BlogPostPageBodyProps {
  post: BlogPost;
  related: BlogPost[];
}

const BlogPostPageBody: React.FC<BlogPostPageBodyProps> = ({ post, related }) => {
  return (
    <div className="min-h-screen pt-33 bg-[#001d1c] text-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white transition-colors">
            Блог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="pb-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-8 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wider">Ко всем статьям</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {post.category && (
              <span className="mb-4 inline-flex w-fit items-center rounded-full bg-forest-500/15 px-3 py-1 text-sm font-medium text-forest-300">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-arista-light mb-4 leading-tight max-w-3xl">{post.title}</h1>
            {post.publishedAt && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={14} />
                {formatDate(post.publishedAt)}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {post.coverImage && (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-16">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            {post.content ? (
              <div
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:font-arista-light prose-headings:text-white
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300
                  prose-strong:text-white prose-a:text-forest-400 hover:prose-a:text-forest-300
                  prose-blockquote:border-l-forest-500 prose-blockquote:text-gray-400
                  prose-img:rounded-xl"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Текст статьи скоро появится.</p>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-[#001d1c] to-[#002a27]">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-3xl font-arista-light mb-10">Похожие статьи</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.id}`}
                  className="block bg-[#002a27] rounded-xl overflow-hidden hover:bg-[#003932] transition-colors duration-300"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-gray-800">
                    {r.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt={r.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#002a27] to-[#003932]" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-white leading-snug">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[#002a27]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            className="bg-gradient-to-br from-[#002a27]/80 to-[#003932]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-forest-500/10 filter blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 filter blur-3xl" />

            <div className="relative z-10 md:flex justify-between items-center">
              <div className="md:max-w-lg mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-arista-light mb-4">Остались вопросы?</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Разберём ваш случай на консультации и подберём подходящее решение.
                </p>
              </div>
              <BookingButton className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-all w-fit">
                Разобрать случай
              </BookingButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPageBody;
