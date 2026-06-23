import { Play, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

import croissantImg from "@/assets/croissant.png";
import briocheImg from "@/assets/brioche.png";
import brunchImg from "@/assets/menu-brunch.png";
import granolaBowlImg from "@/assets/granola-bowl.png";
import avocadoToastImg from "@/assets/avocado-toast.png";
import breakfastBowlImg from "@/assets/breakfast-bowl.png";

const VIDEOS = [
  {
    thumbnail: avocadoToastImg,
    handle: "@marie.cotedazur",
    caption: "L'avocado toast le plus frais des Alpes-Maritimes 🥑✨ #BreakfastTime",
    href: "https://www.instagram.com/breakfasttimefr",
  },
  {
    thumbnail: brunchImg,
    handle: "@lifestyle.cannes",
    caption: "Brunch dominical livré à la maison ☀️ On adore @breakfasttimefr 🤍",
    href: "https://www.instagram.com/breakfasttimefr",
  },
  {
    thumbnail: croissantImg,
    handle: "@foodie.nice",
    caption: "Encore chaud à la livraison 😍 Le meilleur croissant de ma vie 🥐",
    href: "https://www.instagram.com/breakfasttimefr",
  },
  {
    thumbnail: granolaBowlImg,
    handle: "@wellness.riviera",
    caption: "Mon bowl granola healthy du matin 🌿 Trop bon et si sain !",
    href: "https://www.instagram.com/breakfasttimefr",
  },
  {
    thumbnail: breakfastBowlImg,
    handle: "@antibes.vibes",
    caption: "Petit-déjeuner livré en 30 min, qualité incroyable 🙌 #CoconutBowl",
    href: "https://www.instagram.com/breakfasttimefr",
  },
  {
    thumbnail: briocheImg,
    handle: "@monamour.sophia",
    caption: "La brioche du dimanche matin, c'est sacré 🥰 Merci @breakfasttimefr",
    href: "https://www.instagram.com/breakfasttimefr",
  },
];

const UGCVideos = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            {t("ugc.label")}
          </p>
          <h2 className="section-title mb-4">{t("ugc.title")}</h2>
          <p className="section-subtitle mx-auto">{t("ugc.subtitle")}</p>
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {VIDEOS.map((v, i) => (
            <a
              key={i}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-44 sm:w-auto snap-start"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: "9/16" }}
              >
                {/* Thumbnail */}
                <img
                  src={v.thumbnail}
                  alt={v.handle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(6px)",
                      border: "1.5px solid rgba(255,255,255,0.5)",
                    }}
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
                {/* Instagram badge */}
                <div className="absolute top-3 right-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)",
                    }}
                  >
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold mb-1 truncate">{v.handle}</p>
                  <p
                    className="text-xs leading-tight"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {v.caption}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Instagram */}
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/breakfasttimefr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white text-sm transition-opacity hover:opacity-90 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)",
            }}
          >
            <Instagram className="w-4 h-4" />
            {t("ugc.cta")}
          </a>
          <p className="text-muted-foreground text-xs mt-3">{t("ugc.ctaSub")}</p>
        </div>
      </div>
    </section>
  );
};

export default UGCVideos;
