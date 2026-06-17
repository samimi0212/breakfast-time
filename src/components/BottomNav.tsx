import { Home, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useLangPath } from "@/hooks/useLangPath";

const BottomNav = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const path = location.pathname;

  const items = [
    { icon: Home, label: t("bottomNav.home"), href: lp("/") },
    { icon: UtensilsCrossed, label: t("bottomNav.menu"), href: lp("/carte") },
    { icon: ShoppingBag, label: t("bottomNav.cart"), href: lp("/panier") },
    { icon: User, label: t("bottomNav.account"), href: user ? lp("/mon-compte") : lp(`/connexion?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`) },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch">
        {items.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === lp("/") ? path === href : path.startsWith(href.split("?")[0]);
          const isCart = href.startsWith(lp("/panier"));

          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors"
              style={{ color: isActive ? "#DFF057" : "#9ca3af" }}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {isCart && count > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                  >
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: "#DFF057" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
