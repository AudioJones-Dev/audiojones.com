"use client";

import { useState } from "react";

export type FAQItem = { question: string; answer: string };

type Props = {
  items: FAQItem[];
};

export default function FAQ({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-[#0B1020]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-white transition hover:bg-white/5"
            >
              <span className="text-base font-semibold sm:text-lg">
                {item.question}
              </span>
              <span aria-hidden className="text-xl text-[#C8A96A]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-slate-300">{item.answer}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
