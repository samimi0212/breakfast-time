import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MentionsLegales = () => (
  <>
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold mb-10">Mentions légales</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Éditeur du site</h2>
        <p className="text-muted-foreground leading-relaxed">
          Breakfast Time<br />
          Pont du Lys – 06600 Antibes<br />
          SIREN : 507 940 070<br />
          Contact : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Hébergement</h2>
        <p className="text-muted-foreground leading-relaxed">
          Ce site est hébergé par Vercel Inc.<br />
          440 N Barranca Ave #4133 – Covina, CA 91723, États-Unis<br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">vercel.com</a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Propriété intellectuelle</h2>
        <p className="text-muted-foreground leading-relaxed">
          L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes) est la propriété exclusive de Breakfast Time ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable écrite est strictement interdite.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Limitation de responsabilité</h2>
        <p className="text-muted-foreground leading-relaxed">
          Breakfast Time s'efforce de maintenir les informations publiées sur ce site aussi précises et à jour que possible. Toutefois, la responsabilité de Breakfast Time ne saurait être engagée en cas d'erreur, d'omission ou d'indisponibilité temporaire du site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Droit applicable</h2>
        <p className="text-muted-foreground leading-relaxed">
          Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux compétents du ressort d'Antibes seront seuls habilités.
        </p>
      </section>
    </main>
    <Footer />
  </>
);

export default MentionsLegales;
