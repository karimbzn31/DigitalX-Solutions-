"use client";

import { useState } from "react";
import { NebulaButton } from "@/components/shared/NebulaButton";

const questions = [
  {
    id: "q1",
    question: "Qu'est-ce que le Vibe Coding ?",
    options: [
      "Écrire du code en écoutant de la musique",
      "Développer avec l'assistance de l'IA générative",
      "Un framework JavaScript",
      "Une méthode de debugging",
    ],
    correct: 1,
  },
  {
    id: "q2",
    question: "Quel outil permet de créer des agents IA sans code ?",
    options: ["React", "n8n", "Node.js", "Tailwind"],
    correct: 1,
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const selected = answers[q.id];

  const handleSelect = (index: number) => {
    setAnswers({ ...answers, [q.id]: index });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const correct = questions.filter((q) => answers[q.id] === q.correct).length;
    return (
      <div className="space-y-8">
        <h1 className="font-display text-2xl font-bold text-star-white">Résultats</h1>
        <div className="nebula-card p-8 rounded-[0.75rem] text-center">
          <p className="font-display text-5xl font-bold text-gradient mb-4">{correct}/{questions.length}</p>
          <p className="text-sm text-mist">Quiz terminé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Quiz</h1>
        <p className="text-sm text-mist">Testez vos connaissances</p>
      </div>

      <div className="nebula-card p-6 rounded-[0.75rem]">
        <div className="flex items-center gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= current ? "bg-violet" : "bg-white/10"}`}
            />
          ))}
        </div>

        <p className="text-xs text-mist mb-1">Question {current + 1}/{questions.length}</p>
        <h2 className="font-display text-base font-semibold text-star-white mb-4">{q.question}</h2>

        <div className="space-y-2 mb-6">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                selected === i
                  ? "border-violet bg-violet/10 text-violet"
                  : "border-white/10 bg-void text-mist hover:border-violet/30"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <NebulaButton onClick={handleNext} disabled={selected === undefined} className="w-full py-2.5">
          {current < questions.length - 1 ? "Question suivante" : "Voir les résultats"}
        </NebulaButton>
      </div>
    </div>
  );
}
