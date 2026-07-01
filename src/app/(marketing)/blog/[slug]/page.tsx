import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/mock-data";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-mist hover:text-violet transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux articles
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-violet/10 text-violet font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-star-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-mist mb-8">
          <span>
            Par <span className="text-star-white">{post.author}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min de lecture
          </span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="font-display text-2xl font-semibold text-star-white mt-10 mb-4">{line.slice(3)}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="font-display text-xl font-semibold text-star-white mt-8 mb-3">{line.slice(4)}</h3>;
            }
            if (line.startsWith("- **")) {
              const match = line.match(/- \*\*(.+?)\*\*(.*)/);
              if (match) {
                return <p key={i} className="text-mist mb-2"><strong className="text-star-white">{match[1]}</strong>{match[2]}</p>;
              }
            }
            if (line.match(/^\d\. /)) {
              return <p key={i} className="text-mist mb-2">{line}</p>;
            }
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-mist leading-relaxed mb-4">{line}</p>;
          })}
        </div>
      </div>
    </article>
  );
}
