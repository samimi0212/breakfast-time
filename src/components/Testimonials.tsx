import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const VISIBLE = 4;

const Testimonials = () => {
  const { t } = useTranslation();
  const [start, setStart] = useState(0);

  const reviews = t("testimonials.reviews", { returnObjects: true }) as { name: string; text: string }[];

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(reviews.length - VISIBLE, s + 1));
  const visible = reviews.slice(start, start + VISIBLE);

  return (
    <section className="section-padding bg-card">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("testimonials.label")}</p>
        <h2 className="section-title mb-4">{t("testimonials.title")}</h2>
        <p className="section-subtitle mx-auto mb-12">{t("testimonials.subtitle")}</p>

        <div className="flex items-stretch gap-4">
          <button
            onClick={prev}
            disabled={start === 0}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed self-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {visible.map((r, i) => (
              <div
                key={start + i}
                className="bg-background rounded-xl p-5 text-left flex flex-col min-h-[180px]"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="font-display font-semibold text-foreground text-sm">{r.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={start >= reviews.length - VISIBLE}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed self-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: reviews.length - VISIBLE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === start ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
