import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function AdminLogin() {
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
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Espace Administrateur</h2>
          <p className="mt-2 text-sm text-gray-600">Accès restreint aux administrateurs</p>
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">Entrez le code TOTP pour continuer</p>
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
