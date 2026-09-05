import BackButton from "../../components/ui/BackButton";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">À propos</h1>

      <div className="card p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 text-brand-500">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="35" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="65" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mali Retrouvé</h2>
            <p className="text-gray-600">Ensemble, retrouvons l'essentiel.</p>
          </div>
        </div>

        <div className="prose max-w-none text-gray-600">
          <p>
            Mali Retrouvé est la plateforme nationale malienne de déclaration et de recherche de documents et objets
            perdus ou retrouvés. Elle a été conçue pour répondre aux besoins des citoyens, des centres de dépôt et des
            administrations.
          </p>

          <h3>Nos objectifs</h3>
          <ul>
            <li>Réduire le risque d'usurpation d'identité lié à la perte de documents</li>
            <li>Centraliser les procédures de dépôt et de restitution</li>
            <li>Fournir une traçabilité complète des opérations</li>
          </ul>

          <h3>Pilote</h3>
          <p>
            Le service est actuellement déployé en pilote sur les régions de <strong>Bamako</strong> et <strong>Ségou</strong>.
          </p>

          <h3>Contact</h3>
          <p>
            Pour toute question : <a href="mailto:contact@maliretrouve.ml" className="text-brand-600">contact@maliretrouve.ml</a>
          </p>
        </div>
      </div>
    </div>
  );
}
