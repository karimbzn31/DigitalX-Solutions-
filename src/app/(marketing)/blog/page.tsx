import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { blogPosts } from "@/lib/mock-data";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, tutoriels et actualités sur l'IA, le Vibe Coding et le développement SaaS.",
};

export default function BlogPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Blog"
          title="Articles et Tutoriels"
          subtitle="Tout pour maîtriser l'IA, le développement et l'entrepreneuriat tech."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group nebula-card rounded-[0.75rem] p-6 md:p-8 hover:shadow-nebula transition-all duration-300"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-violet/10 text-violet font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-display text-xl font-semibold text-star-white mb-3 group-hover:text-violet transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-mist leading-relaxed mb-5 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-mist">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-mist opacity-0 group-hover:opacity-100 group-hover:text-violet transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
