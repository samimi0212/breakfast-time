import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
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
import PrivateRoute from "./components/PrivateRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/commande" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/mon-compte" element={<PrivateRoute><MyAccount /></PrivateRoute>} />
            <Route path="/confirmation" element={<PrivateRoute><Confirmation /></PrivateRoute>} />
            <Route path="/mes-commandes" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
            <Route path="/carte" element={<CartePage />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="/evenements/commander" element={<EventsCommander />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/produit/:id" element={<ProductPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
