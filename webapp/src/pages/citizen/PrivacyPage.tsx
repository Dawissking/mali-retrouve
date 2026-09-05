import { Link } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h1>

      <div className="card p-8 prose max-w-none">
        <h2>1. Responsable du traitement</h2>
        <p>
          Le traitement des données est assuré par <strong>Mali Retrouvé</strong>, dans le respect de la Loi malienne
          n° 2013-015 et du RGPD.
        </p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons :</p>
        <ul>
          <li>Numéro de téléphone (vérifié par OTP)</li>
          <li>Nom, prénom, date de naissance</li>
          <li>Localisation (région, cercle, commune)</li>
          <li>Description des déclarations et photos</li>
          <li>Données de connexion (adresse IP, user-agent)</li>
        </ul>

        <h2>3. Finalités</h2>
        <p>Les données sont utilisées pour :</p>
        <ul>
          <li>Permettre la déclaration et le suivi de pertes/trouvailles</li>
          <li>Effectuer le rapprochement automatique entre déclarations</li>
          <li>Notifier les utilisateurs des correspondances</li>
          <li>Assurer la sécurité et la traçabilité des opérations</li>
        </ul>

        <h2>4. Conservation</h2>
        <p>
          Les déclarations sont conservées pendant 12 mois (hypothèse à valider par l'APDP). Les photos sont
          supprimées 3 mois après la restitution. Les logs d'audit sont conservés 36 mois.
        </p>

        <h2>5. Vos droits</h2>
        <p>
          Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces
          droits, rendez-vous sur la page <Link to="/rights" className="text-brand-600 underline">Mes droits</Link>.
        </p>

        <h2>6. Sécurité</h2>
        <p>
          Les données sensibles sont chiffrées. L'accès est restreint par rôle (RBAC). Toutes les opérations sont
          journalisées.
        </p>

        <p className="text-sm text-gray-500 mt-8">Dernière mise à jour : septembre 2026</p>
      </div>
    </div>
  );
}
