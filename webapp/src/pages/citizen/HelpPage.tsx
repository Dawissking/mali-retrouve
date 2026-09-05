import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import BackButton from "../../components/ui/BackButton";

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const faqs = [
    { q: "Comment déclarer une perte ?", a: "Connectez-vous, cliquez sur 'Nouvelle déclaration', remplissez le formulaire et soumettez." },
    { q: "Comment signaler une trouvaille ?", a: "Depuis l'accueil, cliquez sur 'J'ai trouvé', puis remplissez le formulaire." },
    { q: "Qu'est-ce qu'un code OTP ?", a: "C'est un code de vérification à 6 chiffres envoyé par SMS pour confirmer votre identité." },
    { q: "Comment accepter une correspondance ?", a: "Dans 'Mes correspondances', consultez le détail et cliquez sur 'Accepter'." },
    { q: "Où se fait la restitution ?", a: "Au centre de dépôt désigné après validation par un agent." },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui, elles sont chiffrées et accessibles uniquement aux personnes habilitées." },
  ];

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Aide & FAQ</h1>

      <Card className="p-6 mb-6">
        <Input
          placeholder="Rechercher une question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <div className="space-y-4">
        {filtered.map((faq, i) => (
          <Card key={i} className="p-6">
            <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-gray-600 text-sm">{faq.a}</p>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-6 text-center text-gray-500">
            Aucun résultat pour "{search}"
          </Card>
        )}
      </div>
    </div>
  );
}
