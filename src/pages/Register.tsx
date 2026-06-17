import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import logo from "@/assets/logo.png";
import { usePageMeta } from "@/hooks/usePageMeta";

const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const Register = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  usePageMeta("Inscription | Breakfast Time", "Créez votre compte Breakfast Time et commandez vos petits-déjeuners livrés à domicile.", "/inscription", true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || lp("/");
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOAuth = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}${redirectTo}` } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.prenom || !form.nom || !form.email || !form.telephone || !form.password) { setError(t("register.errorFields")); return; }
    if (form.password !== form.confirmPassword) { setError(t("register.errorPasswordMatch")); return; }
    if (form.password.length < 8) { setError(t("register.errorPasswordLength")); return; }
    if (!/[A-Z]/.test(form.password)) { setError(t("register.errorPasswordUpper")); return; }
    if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) { setError(t("register.errorPasswordSpecial")); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { prenom: form.prenom, nom: form.nom, telephone: form.telephone } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      try {
        await fetch("/api/send-welcome-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prenom: form.prenom, email: form.email }) });
      } catch { /* ignore */ }
      setSuccess(true);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <style>{`
          @keyframes bounceIn { 0% { transform:scale(0);opacity:0; } 55% { transform:scale(1.22);opacity:1; } 75% { transform:scale(0.92); } 90% { transform:scale(1.06); } 100% { transform:scale(1); } }
          @keyframes checkDraw { to { stroke-dashoffset:0; } }
          @keyframes confetti1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(-38px,-72px) rotate(-260deg);opacity:0;} }
          @keyframes confetti2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(42px,-80px) rotate(300deg);opacity:0;} }
          @keyframes confetti3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(-60px,-40px) rotate(180deg);opacity:0;} }
          @keyframes confetti4 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(58px,-50px) rotate(-220deg);opacity:0;} }
          @keyframes confetti5 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(-20px,-90px) rotate(400deg);opacity:0;} }
          @keyframes confetti6 { 0%{transform:translate(0,0) rotate(0deg);opacity:1;} 100%{transform:translate(30px,-85px) rotate(-340deg);opacity:0;} }
          .success-circle{animation:bounceIn 0.6s cubic-bezier(0.22,1,0.36,1) both;}
          .success-check{stroke-dasharray:40;stroke-dashoffset:40;animation:checkDraw 0.35s ease-out 0.5s forwards;}
          .cf1{animation:confetti1 0.7s ease-out 0.3s both;} .cf2{animation:confetti2 0.75s ease-out 0.35s both;}
          .cf3{animation:confetti3 0.65s ease-out 0.28s both;} .cf4{animation:confetti4 0.8s ease-out 0.4s both;}
          .cf5{animation:confetti5 0.7s ease-out 0.32s both;} .cf6{animation:confetti6 0.72s ease-out 0.38s both;}
        `}</style>
        <div className="w-full max-w-lg text-center">
          <a href={lp("/")}><img src={logo} alt="Breakfast Time" className="h-20 w-auto mx-auto mb-8" /></a>
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4" style={{ height: '96px' }}>
              <div style={{ position:'relative', width:'80px', height:'80px' }}>
                <div className="cf1" style={{ position:'absolute',top:'50%',left:'50%',width:'10px',height:'10px',borderRadius:'50%',background:'#3a3a0a',marginTop:'-5px',marginLeft:'-5px' }} />
                <div className="cf2" style={{ position:'absolute',top:'50%',left:'50%',width:'8px',height:'8px',borderRadius:'2px',background:'#DFF057',border:'1.5px solid #3a3a0a',marginTop:'-4px',marginLeft:'-4px' }} />
                <div className="cf3" style={{ position:'absolute',top:'50%',left:'50%',width:'9px',height:'9px',borderRadius:'50%',background:'#7a8a10',marginTop:'-4px',marginLeft:'-4px' }} />
                <div className="cf4" style={{ position:'absolute',top:'50%',left:'50%',width:'7px',height:'11px',borderRadius:'3px',background:'#DFF057',marginTop:'-5px',marginLeft:'-3px' }} />
                <div className="cf5" style={{ position:'absolute',top:'50%',left:'50%',width:'8px',height:'8px',borderRadius:'50%',background:'#3a3a0a',marginTop:'-4px',marginLeft:'-4px' }} />
                <div className="cf6" style={{ position:'absolute',top:'50%',left:'50%',width:'10px',height:'7px',borderRadius:'2px',background:'#c8c820',marginTop:'-3px',marginLeft:'-5px' }} />
                <svg className="success-circle" width="80" height="80" viewBox="0 0 80 80" style={{ position:'absolute',top:0,left:0 }}>
                  <circle cx="40" cy="40" r="38" fill="#DFF057" />
                  <polyline className="success-check" points="24,41 35,52 56,28" stroke="#1e1e06" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">{t("register.successTitle")}</h1>
            <p className="text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: t("register.successText", { name: form.prenom }) }} />
            <button onClick={() => navigate(redirectTo)}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              {redirectTo.includes("/commande") ? t("register.ctaOrder") : t("register.ctaContinue")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href={lp("/")}><img src={logo} alt="Breakfast Time" className="h-20 w-auto mx-auto" /></a>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-center mb-2">{t("register.title")}</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">{t("register.subtitle")}</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleOAuth("google")} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-white hover:bg-muted transition font-medium text-sm">
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.6 42.8 14.8 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5V13.6H2.7C1 17 0 20.4 0 24s1 7 2.7 10.4l8.1-5.6z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.4 0 24 0 14.8 0 6.6 5.2 2.7 13.6l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
              {t("register.googleBtn")}
            </button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t("register.or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.firstNameLabel")}</label>
                <input name="prenom" type="text" value={form.prenom} onChange={handleChange} placeholder={t("register.firstNamePlaceholder")} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.lastNameLabel")}</label>
                <input name="nom" type="text" value={form.nom} onChange={handleChange} placeholder={t("register.lastNamePlaceholder")} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.emailLabel")}</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={t("register.emailPlaceholder")} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.phoneLabel")}</label>
              <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} placeholder={t("register.phonePlaceholder")} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.passwordLabel")}</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder={t("register.passwordPlaceholder")} className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}><EyeIcon visible={showPassword} /></button>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className={`flex items-center gap-1 text-xs ${form.password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}><span>{form.password.length >= 8 ? "✓" : "○"}</span> {t("register.passwordRule1")}</span>
                <span className={`flex items-center gap-1 text-xs ${/[A-Z]/.test(form.password) ? "text-green-600" : "text-muted-foreground"}`}><span>{/[A-Z]/.test(form.password) ? "✓" : "○"}</span> {t("register.passwordRule2")}</span>
                <span className={`flex items-center gap-1 text-xs ${/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? "text-green-600" : "text-muted-foreground"}`}><span>{/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? "✓" : "○"}</span> {t("register.passwordRule3")}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("register.confirmLabel")}</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder={t("register.confirmPlaceholder")} className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition" tabIndex={-1}><EyeIcon visible={showConfirm} /></button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5">{t("register.confirmMismatch")}</p>
              )}
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : t("register.submit")}
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("register.alreadyAccount")}{" "}
            <a href={lp(`/connexion?redirect=${encodeURIComponent(redirectTo)}`)} className="text-primary font-semibold hover:underline">{t("register.login")}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
