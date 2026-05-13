import aboutImg from "@/assets/about-lifestyle.jpg";

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="rounded-3xl overflow-hidden">
        <img
          src={aboutImg}
          alt="L'ambiance Breakfast Time"
          className="w-full h-full object-cover aspect-[4/3]"
          loading="lazy"
        />
      </div>
      <div>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Notre histoire</p>
        <h2 className="section-title mb-6">Le plaisir des choses simples</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Breakfast Time est né d'une conviction simple : le petit-déjeuner mérite autant d'attention
            qu'un grand repas. Chaque matin, nous préparons avec soin des produits frais, locaux
            et de saison pour transformer vos matins en moments d'exception.
          </p>
          <p>
            Que ce soit pour un réveil en douceur à la maison, une réunion d'équipe ou l'accueil
            de vos voyageurs, nos menus s'adaptent à chaque moment. Du sucré, du salé, des boissons
            chaudes et fraîches — tout est pensé pour vous simplifier la vie.
          </p>
          <p>
            Basés dans les Alpes-Maritimes, nous livrons 7 jours sur 7 avec une seule promesse :
            que chaque bouchée soit un plaisir.
          </p>
        </div>
        <a
          href="/carte"
          className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Découvrir nos produits
        </a>
      </div>
    </div>
  </section>
);

export default AboutSection;
