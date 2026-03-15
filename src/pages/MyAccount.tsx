import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (!u) {
        navigate("/connexion");
        return;
      }
      setUser(u);
      setForm({
        prenom: u.user_metadata?.prenom || "",
        nom: u.user_metadata?.nom || "",
        email: u.email || "",
        telephone: u.user_metadata?.telephone || "",
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSaveInfos = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      email: form.email,
      data: {
        prenom: form.prenom,
        nom: form.nom,
        telephone: form.telephone,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Informations mises à jour !");
    }
  };

  const handleSavePassword = async () => {
    if (!passwords.new || !passwords.confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (passwords.new.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Mot de passe mis à jour !");
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-6 max-w-2xl mx-auto">

        {/* Titre */}
        <div className="mb-8">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Espace personnel</p>
          <h1 className="font-display text-3xl font-bold">Mon compte</h1>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            <Check size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Infos personnelles */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold">Informations personnelles</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Prénom</label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Marie"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nom</label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                <Mail size={14} className="inline mr-1" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                <Phone size={14} className="inline mr-1" />
                Téléphone
              </label>
              <input
                name="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+33 6 00 00 00 00"
                className={inputClass}
              />
            </div>

            <button
              onClick={handleSaveInfos}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Sauvegarder les modifications"
              )}
            </button>
          </div>
        </div>

        {/* Mot de passe */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold">Changer le mot de passe</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
              <input
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirmer le nouveau mot de passe</label>
              <input
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Changer le mot de passe"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
