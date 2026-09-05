import { Link } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Conditions Générales d'Utilisation</h1>

      <div className="card p-8 prose max-w-none">
        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme
          <strong>Mali Retrouvé</strong>, service public national de déclaration et de recherche de documents et objets
          perdus ou retrouvés.
        </p>

        <h2>2. Acceptation</h2>
        <p>
          L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez
          pas ces conditions, veuillez ne pas utiliser le service.
        </p>

        <h2>3. Services proposés</h2>
        <p>Mali Retrouvé permet :</p>
        <ul>
          <li>Déclarer une perte de document ou d'objet personnel</li>
          <li>Déclarer un objet ou document trouvé</li>
          <li>Consulter les correspondances potentielles</li>
          <li>Accepter ou refuser une correspondance proposée</li>
          <li>Suivre le statut de ses déclarations</li>
        </ul>

        <h2>4. Obligations de l'utilisateur</h2>
        <p>L'utilisateur s'engage à :</p>
        <ul>
          <li>Fournir des informations exactes et à jour</li>
          <li>Ne pas utiliser le service à des fins illégales</li>
          <li>Ne pas tenter de contourner les mesures de sécurité</li>
          <li>Respecter la confidentialité des autres utilisateurs</li>
        </ul>

        <h2>5. Données personnelles</h2>
        <p>
          Les données personnelles collectées sont traitées conformément à la Loi malienne n° 2013-015 relative à la
          protection des données à caractère personnel et au Règlement Général sur la Protection des Données (RGPD).
          Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
        </p>

        <h2>6. Responsabilité</h2>
        <p>
          Mali Retrouvé met en œuvre tous les moyens raisonnables pour assurer la fiabilité du service. Cependant,
          nous ne garantissons pas l'exactitude des correspondances proposées. Toute restitution reste soumise à
          validation humaine par un agent habilité.
        </p>

        <h2>7. Contact</h2>
        <p>
          Pour toute question, veuillez nous contacter via la page <Link to="/contact" className="text-brand-600 underline">Contact</Link>.
        </p>

        <p className="text-sm text-gray-500 mt-8">Dernière mise à jour : septembre 2026</p>
      </div>
    </div>
  );
}
