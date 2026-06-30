"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";

const founders = [
  {
    name: "Karim Bouziane",
    slug: "karim-bouziane",
    role: "Co-fondateur & Formateur IA",
    bio: "Passionné par l'intelligence artificielle et le développement SaaS. Karim a formé plus de 500 entrepreneurs en Algérie. Il croit fermement que l'IA est le levier le plus puissant pour transformer des idées en entreprises.",
    initials: "KB",
    color: "from-violet to-magenta",
  },
  {
    name: "Imad Bahlat",
    slug: "imad-bahlat",
    role: "Co-fondateur & Full-Stack Developer",
    bio: "Développeur full-stack avec 8 ans d'expérience dans le web et les technologies cloud. Imad a lancé plusieurs startups SaaS avant de co-fonder cette académie. Sa mission : démocratiser l'accès aux compétences tech en Algérie.",
    initials: "IB",
    color: "from-magenta to-rose",
  },
];

function FounderAvatar({ person }: { person: (typeof founders)[number] }) {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <Image
        src={`/images/team/${person.slug}.jpg`}
        alt={person.name}
        width={96}
        height={96}
        className="w-full h-full rounded-full object-cover"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-xl font-bold text-star-white">
      {person.initials}
    </div>
  );
}

export function TeamSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Qui sommes-nous"
          title="Deux passionnés, une mission"
          subtitle="Nous avons créé DigitalXSolutions Academy pour rendre l'IA et le développement accessibles à tous les Algériens."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="nebula-card rounded-[0.75rem] p-6 md:p-8 text-center group hover:shadow-nebula transition-all duration-300"
            >
              <div className={`w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br ${person.color} p-[2px]`}>
                <FounderAvatar person={person} />
              </div>
              <h3 className="font-display text-xl font-semibold text-star-white mb-1">{person.name}</h3>
              <p className="text-sm text-violet mb-4">{person.role}</p>
              <p className="text-sm text-mist leading-relaxed">{person.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
