import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Mail, Phone, Lock, Check, ShoppingBag, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";

const MyAccount = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lp } = useLangPath();
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
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (!u) {
        navigate(lp("/connexion"));
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
      setSuccess(t("myAccount.successInfos"));
    }
  };

  const handleSavePassword = async () => {
    if (!passwords.new || !passwords.confirm) {
      setError(t("myAccount.errorFields"));
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError(t("myAccount.errorPasswordMatch"));
      return;
    }
    if (passwords.new.length < 6) {
      setError(t("myAccount.errorPasswordLength"));
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
      setSuccess(t("myAccount.successPassword"));
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
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">{t("myAccount.personalLabel")}</p>
          <h1 className="font-display text-3xl font-bold">{t("myAccount.title")}</h1>
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

        {/* Mes commandes — accès rapide */}
        <button
          onClick={() => navigate(lp("/mes-commandes"))}
          className="w-full bg-white rounded-2xl p-5 mb-6 flex items-center justify-between hover:shadow-md transition-shadow"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag size={18} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{t("myAccount.ordersTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("myAccount.ordersSubtitle")}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>

        {/* Infos personnelles */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold">{t("myAccount.personalInfoTitle")}</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("myAccount.firstNameLabel")}</label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Marie"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("myAccount.lastNameLabel")}</label>
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
                {t("myAccount.phoneLabel")}
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
                t("myAccount.saveBtn")
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
            <h2 className="font-display text-lg font-semibold">{t("myAccount.passwordTitle")}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("myAccount.newPasswordLabel")}</label>
              <div className="relative">
                <input
                  name="new"
                  type={showNewPwd ? "text" : "password"}
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowNewPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                  <EyeIcon visible={showNewPwd} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("myAccount.confirmPasswordLabel")}</label>
              <div className="relative">
                <input
                  name="confirm"
                  type={showConfirmPwd ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirmPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}>
                  <EyeIcon visible={showConfirmPwd} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                t("myAccount.changePasswordBtn")
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
