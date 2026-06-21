import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import CartePage from "./pages/CartePage.tsx";
import Events from "./pages/Events.tsx";
import EventsCommander from "./pages/EventsCommander.tsx";
import MentionsLegales from "./pages/MentionsLegales.tsx";
import CGV from "./pages/CGV.tsx";
import Confidentialite from "./pages/Confidentialite.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import VillePage from "./pages/VillePage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import BottomNav from "./components/BottomNav.tsx";
import { cities } from "./data/cities.ts";

const queryClient = new QueryClient();

// Liste des routes de l'app. Rendue une fois sous "/" (FR) et une fois
// sous "/en" (EN) pour avoir des URLs distinctes par langue (SEO).
const routeDefs = [
  { path: "/", element: <Index /> },
  { path: "/connexion", element: <Login /> },
  { path: "/inscription", element: <Register /> },
  { path: "/panier", element: <Cart /> },
  { path: "/commande", element: <PrivateRoute><Checkout /></PrivateRoute> },
  { path: "/mon-compte", element: <PrivateRoute><MyAccount /></PrivateRoute> },
  { path: "/confirmation", element: <PrivateRoute><Confirmation /></PrivateRoute> },
  { path: "/mes-commandes", element: <PrivateRoute><MyOrders /></PrivateRoute> },
  { path: "/carte", element: <CartePage /> },
  { path: "/evenements", element: <Events /> },
  { path: "/evenements/commander", element: <EventsCommander /> },
  { path: "/mentions-legales", element: <MentionsLegales /> },
  { path: "/cgv", element: <CGV /> },
  { path: "/confidentialite", element: <Confidentialite /> },
  { path: "/contact", element: <Contact /> },
  { path: "/produit/:id", element: <ProductPage /> },
  // Pages locales SEO (une par ville) — /livraison-petit-dejeuner-{slug}
  ...cities.map((city) => ({
    path: `/livraison-petit-dejeuner-${city.slug}`,
    element: <VillePage slug={city.slug} />,
  })),
];

// Composant interne pour accéder à useNavigate (doit être dans BrowserRouter)
const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        const redirect = localStorage.getItem("post_auth_redirect");
        if (redirect) {
          localStorage.removeItem("post_auth_redirect");
          navigate(redirect, { replace: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Garde la langue i18n synchronisée avec le préfixe d'URL /en
  useEffect(() => {
    const isEn = location.pathname === "/en" || location.pathname.startsWith("/en/");
    const targetLang = isEn ? "en" : "fr";
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [location.pathname, i18n]);

  return (
    <>
      <BottomNav />
      <Routes>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        {routeDefs.map(({ path, element }) => (
          <Route key={`fr-${path}`} path={path} element={element} />
        ))}
        {routeDefs.map(({ path, element }) => (
          <Route key={`en-${path}`} path={path === "/" ? "/en" : `/en${path}`} element={element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
