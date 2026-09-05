import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Loading } from "../../components/ui/States";

export default function AgentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpToken, setTotpToken] = useState("");
  const [step, setStep] = useState<"credentials" | "totp">("credentials");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { agentLogin, agentTotpVerify } = useAuth();
  const navigate = useNavigate();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await agentLogin({ email, password });
      if (!result.requiresTotp) {
        navigate("/dashboard");
      } else {
        setStep("totp");
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Identifiants invalides");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await agentTotpVerify({ email, token: totpToken });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Code TOTP invalide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Espace Agent</h2>
          <p className="mt-2 text-sm text-gray-600">Connectez-vous pour accéder à votre espace de travail</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-6">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Continuer
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTotp} className="space-y-6">
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-md">
                <p className="text-sm text-brand-800">Entrez le code à 6 chiffres de votre application d'authentification</p>
              </div>
              <Input
                label="Code TOTP"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Se connecter
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
