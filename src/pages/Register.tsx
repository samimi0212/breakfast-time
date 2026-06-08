import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";
import { usePageMeta } from "@/hooks/usePageMeta";

const Register = () => {
  usePageMeta("Inscription | Breakfast Time", "Créez votre compte Breakfast Time et commandez vos petits-déjeuners livrés à domicile.", "/inscription", true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  const handleOAuth = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.prenom || !form.nom || !form.email || !form.telephone || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("Le mot de passe doit contenir au moins une majuscule.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          prenom: form.prenom,
          nom: form.nom,
          telephone: form.telephone,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Envoyer l'email de bienvenue
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prenom: form.prenom, email: form.email }),
        });
      } catch { /* ignore */ }
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <a href="/">
            <img src={logo} alt="Breakfast Time" className="h-20 w-auto mx-auto mb-8" />
          </a>
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Compte créé !</h1>
            <p className="text-muted-foreground mb-6">
              Bienvenue chez Breakfast Time, <strong>{form.prenom}</strong> ! Votre compte a bien été créé.
            </p>
            <button
              onClick={() => navigate(redirectTo)}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {redirectTo.includes("/commande") ? "Poursuivre votre commande" : "Continuer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/">
            <img src={logo} alt="Breakfast Time" className="h-20 w-auto mx-auto" />
          </a>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Créer un compte</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Rejoignez Breakfast Time et commandez dès ce matin
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Boutons OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-white hover:bg-muted transition font-medium text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.6 42.8 14.8 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5V13.6H2.7C1 17 0 20.4 0 24s1 7 2.7 10.4l8.1-5.6z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.4 0 24 0 14.8 0 6.6 5.2 2.7 13.6l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
              Continuer avec Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Prénom</label>
                <input
                  name="prenom"
                  type="text"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Marie"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nom</label>
                <input
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone</label>
              <input
                name="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+33 6 00 00 00 00"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <div className="flex gap-4 mt-2">
                <span className={`flex items-center gap-1 text-xs ${form.password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}>
                  <span>{form.password.length >= 8 ? "✓" : "○"}</span> 8 caractères minimum
                </span>
                <span className={`flex items-center gap-1 text-xs ${/[A-Z]/.test(form.password) ? "text-green-600" : "text-muted-foreground"}`}>
                  <span>{/[A-Z]/.test(form.password) ? "✓" : "○"}</span> Une majuscule
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Créer mon compte"
              )}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà un compte ?{" "}
            <a href={`/connexion?redirect=${encodeURIComponent(redirectTo)}`} className="text-primary font-semibold hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
