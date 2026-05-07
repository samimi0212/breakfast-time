import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Confidentialite = () => {
  usePageMeta("Politique de confidentialité | Breakfast Time", "Politique de confidentialité et traitement des données personnelles de Breakfast Time.", "/confidentialite");
  return (
  <>
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold mb-10">Politique de confidentialité</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">1. Responsable du traitement</h2>
        <p className="text-muted-foreground leading-relaxed">
          Breakfast Time<br />
          Pont du Lys – 06600 Antibes<br />
          SIREN : 507 940 070<br />
          Contact RGPD : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">2. Données collectées</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Nous collectons les données suivantes dans le cadre de nos services :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Données d'identification : prénom, nom, adresse e-mail</li>
          <li>Données de contact : numéro de téléphone, adresse de livraison</li>
          <li>Données de commande : produits commandés, montant, créneau de livraison</li>
          <li>Données de navigation : cookies techniques nécessaires au bon fonctionnement du site</li>
          <li>Adresse e-mail pour la newsletter (sur inscription volontaire)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">3. Finalités du traitement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Vos données sont utilisées pour :</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Gérer et exécuter vos commandes</li>
          <li>Assurer la livraison à l'adresse indiquée</li>
          <li>Vous envoyer une confirmation de commande</li>
          <li>Vous adresser notre newsletter (si vous y avez consenti)</li>
          <li>Respecter nos obligations légales et comptables</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">4. Base légale</h2>
        <p className="text-muted-foreground leading-relaxed">
          Le traitement de vos données repose sur l'exécution du contrat (commandes), votre consentement (newsletter) et nos obligations légales (comptabilité, fiscalité).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">5. Durée de conservation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vos données de commande sont conservées pendant 5 ans conformément aux obligations comptables légales. Les données de newsletter sont conservées jusqu'à votre désinscription.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">6. Partage des données</h2>
        <p className="text-muted-foreground leading-relaxed">
          Vos données ne sont pas vendues à des tiers. Elles peuvent être transmises à nos prestataires techniques (hébergement, base de données) dans le cadre strict de l'exécution de nos services. Ces prestataires sont tenus de respecter la confidentialité de vos données.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">7. Vos droits</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification en cas de données inexactes</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition au traitement</li>
          <li>Droit à la portabilité de vos données</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">www.cnil.fr</a>).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">8. Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement (session utilisateur, panier). Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre consentement.
        </p>
      </section>
    </main>
    <Footer />
  </>
  );
};

export default Confidentialite;
