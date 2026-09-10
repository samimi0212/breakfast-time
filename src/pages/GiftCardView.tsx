import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiftCardPreview from "@/components/GiftCardPreview";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const GiftCardView = () => {
  usePageMeta("Votre carte cadeau | Breakfast Time", "Découvrez votre carte cadeau Breakfast Time.", undefined, true);

  const navigate = useNavigate();
  const { lp } = useLangPath();
  const [params] = useSearchParams();
  const [previewTab, setPreviewTab] = useState<"recto" | "verso">("recto");
  const [downloading, setDownloading] = useState(false);
  const rectoRef = useRef<HTMLDivElement>(null);
  const versoRef = useRef<HTMLDivElement>(null);

  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const message = params.get("message") ?? "";
  const code = params.get("code") ?? "";
  const expiresAt = params.get("expiresAt") ?? "";
  const amount = params.get("amount") ?? undefined;

  const capture = async (el: HTMLDivElement) =>
    Promise.race([
      toPng(el, { pixelRatio: 2, skipFonts: true, cacheBust: true }),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error("capture timeout")), 15000)),
    ]);

  const handleDownloadPdf = async () => {
    if (!rectoRef.current || !versoRef.current || downloading) return;
    setDownloading(true);
    const originalTab = previewTab;
    try {
      setPreviewTab("recto");
      await new Promise((resolve) => setTimeout(resolve, 50));
      const rectoDataUrl = await capture(rectoRef.current);

      setPreviewTab("verso");
      await new Promise((resolve) => setTimeout(resolve, 50));
      const versoDataUrl = await capture(versoRef.current);

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1748, 1240] });
      pdf.addImage(rectoDataUrl, "PNG", 0, 0, 1748, 1240);
      pdf.addPage([1748, 1240], "landscape");
      pdf.addImage(versoDataUrl, "PNG", 0, 0, 1748, 1240);
      pdf.save("carte-cadeau-breakfast-time.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setPreviewTab(originalTab);
      setDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Carte Cadeau</p>
            <h1 className="font-display text-3xl font-bold mb-3">Votre cadeau Breakfast Time</h1>
          </div>

          <div className="flex justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setPreviewTab("recto")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                previewTab === "recto" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
              }`}
            >
              Recto
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("verso")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                previewTab === "verso" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
              }`}
            >
              Verso
            </button>
          </div>

          <div className={previewTab === "recto" ? "" : "hidden"} ref={rectoRef}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1748 / 1240", boxShadow: "var(--card-shadow)" }}>
              <img src="/carte-cadeau-recto.webp" alt="Recto de la carte cadeau" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>

          <div className={previewTab === "verso" ? "" : "hidden"} ref={versoRef}>
            <GiftCardPreview from={from} to={to} message={message} code={code} expiresAt={expiresAt} amount={amount} />
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {downloading ? "Génération du PDF..." : "Télécharger en PDF"}
            </button>
            <button
              type="button"
              onClick={() => navigate(lp("/"))}
              className="px-5 py-2 border-2 border-primary text-primary text-sm rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Commander maintenant
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GiftCardView;
