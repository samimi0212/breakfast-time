import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useLangPath } from "@/hooks/useLangPath";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(lp("/"));
  };

  const { count } = useCart();
  const prenom = user?.user_metadata?.prenom || "";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm border-b border-border" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-0">
        {/* Left spacer */}
        <div className="flex-1" />

        {/* Center — Logo */}
        <a href={lp("/")} className="flex-1 flex justify-center">
          <img src={logo} alt="Breakfast Time" className="h-20 w-auto" />
        </a>

        {/* Right */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <LanguageSwitcher className="hidden md:flex" />
          {/* Déconnexion — mobile uniquement, quand connecté */}
          {user && (
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-gray-300"
              title={t("navbar.logout")}
            >
              <LogOut size={20} />
            </button>
          )}
          {user ? (
            <div className="hidden md:flex items-center gap-3 relative group">
              <button className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                <User size={16} className="text-primary" />
                {t("navbar.greeting", { name: prenom })}
              </button>
              <div className="absolute top-8 right-0 bg-white rounded-2xl shadow-lg border border-border py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href={lp("/mon-compte")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User size={15} className="text-primary" />
                  {t("navbar.myAccount")}
                </a>
                <a
                  href={lp("/mes-commandes")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <ShoppingBag size={15} className="text-primary" />
                  {t("navbar.myOrders")}
                </a>
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  {t("navbar.logout")}
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <a
                href={lp("/connexion")}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {t("navbar.login")}
              </a>
              <a
                href={lp("/inscription")}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t("navbar.register")}
              </a>
            </div>
          )}

          {/* Panier — desktop uniquement */}
          <button
            onClick={() => navigate(lp("/panier"))}
            className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingBag size={20} className="text-foreground/80" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
                style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex flex-col gap-2">
                <p className="text-foreground font-medium py-2">{t("navbar.greeting", { name: prenom })}</p>
                <a href={lp("/mon-compte")} className="text-foreground py-2 text-sm">
                  {t("navbar.myAccount")}
                </a>
                <button onClick={handleLogout} className="text-red-500 font-medium py-2 text-left text-sm">
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <a href={lp("/connexion")} className="text-foreground font-medium py-2">
                  {t("navbar.login")}
                </a>
                <a
                  href={lp("/inscription")}
                  className="bg-primary text-primary-foreground text-center px-5 py-3 rounded-full font-semibold"
                >
                  {t("navbar.register")}
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
