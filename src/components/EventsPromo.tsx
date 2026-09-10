import { useState } from "react";
import { Sparkles, ArrowRight, X, FileText, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import EventBookingForm from "@/components/EventBookingForm";
import PhoneAppointmentForm from "@/components/PhoneAppointmentForm";
import brunchMariage from "@/assets/brunch-mariage.webp";
import brunchEntreprise from "@/assets/brunch-entreprise.webp";
import brunchGroupe from "@/assets/brunch-groupe.webp";

type EventType = "mariage" | "entreprise" | "groupe";

const EventsPromo = () => {
  const { t } = useTranslation();
  const [activeEventType, setActiveEventType] = useState<EventType | null>(null);
  const [modalTab, setModalTab] = useState<"devis" | "rdv">("devis");

  const formules: { label: string; tag: string; price: string; image: string; eventType: EventType }[] = [
    { label: t("events.f1Label"), tag: t("events.f1Tag"), price: t("events.f1Price"), image: brunchMariage, eventType: "mariage" },
    { label: t("events.f2Label"), tag: t("events.f2Tag"), price: t("events.f2Price"), image: brunchEntreprise, eventType: "entreprise" },
    { label: t("events.f3Label"), tag: t("events.f3Tag"), price: t("events.f3Price"), image: brunchGroupe, eventType: "groupe" },
  ];

  const openModal = (eventType: EventType) => {
    setActiveEventType(eventType);
    setModalTab("devis");
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: "#f4f1ea" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
            >
              <Sparkles size={11} />
              {t("events.badge")}
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "#2a2a08" }}
            >
              {t("events.title")}{" "}
              <span className="italic" style={{ color: "#7a7020" }}>
                {t("events.titleHighlight")}
              </span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {formules.map(({ label, tag, price, image, eventType }) => (
            <div
              key={label}
              onClick={() => openModal(eventType)}
              className="group cursor-pointer rounded-2xl overflow-hidden"
              style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}
            >
              {/* Desktop */}
              <div className="hidden md:block relative" style={{ aspectRatio: "3/2" }}>
                <img src={image} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>{tag}</p>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">{label}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "#DFF057" }}>
                    {t("events.discover")} <ArrowRight size={12} />
                  </span>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex md:hidden items-center">
                <div className="w-24 h-24 flex-shrink-0">
                  <img src={image} alt={label} className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-3 flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#8a8a60" }}>{tag}</p>
                  <h3 className="font-display text-base font-bold mb-1" style={{ color: "#2a2a08" }}>{label}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm" style={{ color: "#8a8a60" }}>
          {t("events.footnote")}
        </p>
      </div>

      {/* Modale devis / rappel */}
      {activeEventType && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setActiveEventType(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full my-8 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveEventType(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setModalTab("devis")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  modalTab === "devis"
                    ? { backgroundColor: "#3a3a0a", color: "white" }
                    : { backgroundColor: "rgba(58,58,10,0.08)", color: "#3a3a0a" }
                }
              >
                <FileText size={15} /> Devis en ligne
              </button>
              <button
                onClick={() => setModalTab("rdv")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  modalTab === "rdv"
                    ? { backgroundColor: "#3a3a0a", color: "white" }
                    : { backgroundColor: "rgba(58,58,10,0.08)", color: "#3a3a0a" }
                }
              >
                <Phone size={15} /> Être rappelé
              </button>
            </div>

            {modalTab === "devis" ? (
              <EventBookingForm defaultEventType={activeEventType} />
            ) : (
              <PhoneAppointmentForm onClose={() => setActiveEventType(null)} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsPromo;
