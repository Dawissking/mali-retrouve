import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/axios";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Loading } from "../../components/ui/States";
import { useZones } from "../../hooks/useCatalog";
import BackButton from "../../components/ui/BackButton";

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialNature = (searchParams.get("nature") || "LOSS") as "LOSS" | "FIND";
  const [step, setStep] = useState<"otp" | "details">("otp");
  const [phoneE164, setPhoneE164] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [regionId, setRegionId] = useState("");
  const [cercleId, setCercleId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { data: zones } = useZones();

  const regions = zones || [];
  const cercles = regions.find((r) => r.id === regionId)?.cercles || [];
  const communes = cercles.find((c) => c.id === cercleId)?.communes || [];

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await api.post("/auth/otp/request", { phoneE164 });
      setStep("details");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Erreur lors de l'envoi du code OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (!regionId || !cercleId || !communeId) {
      setError("Veuillez sélectionner votre région, cercle et commune");
      return;
    }
    setIsLoading(true);
    try {
      await register({
        phoneE164,
        password,
        otpCode,
        firstName,
        lastName,
        birthDate: new Date(birthDate).toISOString(),
        regionId,
        cercleId,
        communeId,
      });
      navigate("/declarations");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </Link>
          <div className="flex justify-center mb-4">
            <BackButton />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-sm text-gray-600">
            Déjà un compte ? <Link to="/login" className="text-brand-600 hover:text-brand-500 font-medium">Se connecter</Link>
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === "otp" ? (
            <form onSubmit={requestOtp} className="space-y-6">
              <Input
                label="Numéro de téléphone"
                type="tel"
                value={phoneE164}
                onChange={(e) => setPhoneE164(e.target.value)}
                placeholder="+223XXXXXXXX"
                required
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Recevoir le code OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-md mb-4">
                <p className="text-sm text-brand-800">Un code de vérification a été envoyé au {phoneE164}</p>
              </div>
              <Input
                label="Code OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Input
                label="Date de naissance"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              <Select
                label="Région"
                value={regionId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setRegionId(e.target.value);
                  setCercleId("");
                  setCommuneId("");
                }}
                options={regions.map((r) => ({ value: r.id, label: r.labelFr }))}
                required
              />
              {regionId && (
                <Select
                  label="Cercle"
                  value={cercleId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setCercleId(e.target.value);
                    setCommuneId("");
                  }}
                  options={cercles.map((c) => ({ value: c.id, label: c.labelFr }))}
                  required
                />
              )}
              {cercleId && (
                <Select
                  label="Commune"
                  value={communeId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCommuneId(e.target.value)}
                  options={communes.map((c) => ({ value: c.id, label: c.labelFr }))}
                  required
                />
              )}
              <div className="flex items-start space-x-2">
                <input
                  id="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  J'accepte les <a href="/terms" className="text-brand-600 underline">Conditions Générales d'Utilisation</a> et la <a href="/privacy" className="text-brand-600 underline">Politique de Confidentialité</a>.
                </label>
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                S'inscrire
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
