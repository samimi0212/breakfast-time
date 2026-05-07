import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CGV = () => {
  usePageMeta("Conditions Générales de Vente | Breakfast Time", "Conditions générales de vente de Breakfast Time, service de livraison de petits-déjeuners dans les Alpes-Maritimes.", "/cgv");
  return (
  <>
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold mb-10">Conditions Générales de Vente</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">1. Identification du vendeur</h2>
        <p className="text-muted-foreground leading-relaxed">
          Breakfast Time<br />
          Pont du Lys – 06600 Antibes<br />
          SIREN : 507 940 070<br />
          Contact : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">2. Champ d'application</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les présentes Conditions Générales de Vente (CGV) s'appliquent à toute commande de produits alimentaires et de prestations de livraison passée auprès de Breakfast Time, que ce soit directement via notre site ou via nos plateformes partenaires.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">3. Produits et disponibilité</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nos produits sont des denrées alimentaires fraîches préparées le matin même. Ils sont disponibles du lundi au dimanche de 7h à 15h, dans la limite des stocks disponibles. Breakfast Time se réserve le droit de modifier sa carte à tout moment.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">4. Commandes et confirmation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Toute commande passée sur notre site ou via nos plateformes partenaires vaut acceptation des présentes CGV. La commande est confirmée dès réception d'un e-mail ou d'une notification de confirmation.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">5. Prix et paiement</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les prix affichés sont en euros toutes taxes comprises (TTC). Breakfast Time se réserve le droit de modifier ses prix à tout moment. Le paiement est exigible au moment de la commande.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">6. Livraison</h2>
        <p className="text-muted-foreground leading-relaxed">
          La livraison est assurée dans les Alpes-Maritimes. Les délais de livraison sont donnés à titre indicatif et ne sauraient engager la responsabilité de Breakfast Time en cas de retard dû à des circonstances extérieures (trafic, météo, etc.).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">7. Droit de rétractation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les commandes de produits alimentaires périssables et pour les prestations de services exécutées à une date ou selon une périodicité déterminée.<br /><br />
          En conséquence, toute commande validée est ferme et définitive.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">8. Commandes via plateformes partenaires</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les commandes passées via des plateformes partenaires telles que Uber Eats ou Deliveroo sont soumises aux conditions générales d'utilisation de ces plateformes.<br /><br />
          En conséquence, les modalités d'annulation, de modification et de remboursement sont définies exclusivement par celles-ci.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">9. Réclamations</h2>
        <p className="text-muted-foreground leading-relaxed">
          Toute réclamation relative à une commande doit être adressée dans les 24 heures suivant la livraison à l'adresse : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>. Nous nous engageons à vous répondre dans les meilleurs délais.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">10. Droit applicable</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents du ressort d'Antibes seront seuls habilités.
        </p>
      </section>
    </main>
    <Footer />
  </>
  );
};

export default CGV;
