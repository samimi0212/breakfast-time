import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { count } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [prenom, setPrenom] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setPrenom(session?.user?.user_metadata?.prenom || "");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setPrenom(session?.user?.user_metadata?.prenom || "");
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Breakfast Time" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo("menu")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Menu
          </button>
          <button onClick={() => scrollTo("about")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            À propos
          </button>
          <button onClick={() => scrollTo("how")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Comment ça marche
          </button>
          <button onClick={() => scrollTo("delivery")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Livraison
          </button>
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/panier" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <User size={18} />
                {prenom}
              </button>
              {/* Menu déroulant */}
              <div className="absolute top-8 right-0 bg-card rounded-2xl shadow-lg border border-border py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href="/mon-compte"
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User size={15} className="text-primary" />
                  Mon compte
                </a>
                <a
                  href="/mes-commandes"
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <ShoppingBag size={15} className="text-primary" />
                  Mes commandes
                </a>
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={15} />
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/connexion"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Connexion
              </a>
              <a
                href="/inscription"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                S'inscrire
              </a>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/panier" className="relative text-foreground">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <button onClick={() => scrollTo("menu")} className="block text-foreground text-sm py-2">Menu</button>
          <button onClick={() => scrollTo("about")} className="block text-foreground text-sm py-2">À propos</button>
          <button onClick={() => scrollTo("how")} className="block text-foreground text-sm py-2">Comment ça marche</button>
          <button onClick={() => scrollTo("delivery")} className="block text-foreground text-sm py-2">Livraison</button>
          <div className="border-t border-border pt-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <p className="text-foreground font-medium py-2">Bonjour {prenom} !</p>
                <a href="/mon-compte" className="text-foreground py-2 text-sm">Mon compte</a>
                <a href="/mes-commandes" className="text-foreground py-2 text-sm">Mes commandes</a>
                <button
                  onClick={handleLogout}
                  className="text-destructive font-medium py-2 text-left text-sm"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <a href="/connexion" className="text-foreground text-sm py-2">Connexion</a>
                <a href="/inscription" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full text-center">
                  S'inscrire
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
