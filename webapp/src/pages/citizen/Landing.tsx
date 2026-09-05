import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const categories = [
  { name: "CNI", desc: "Carte Nationale d'Identité", to: "/declarations/new?nature=DOCUMENT", icon: "M10 6H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2", color: "from-brand-500 to-brand-600" },
  { name: "Passeport", desc: "Passeport malien", to: "/declarations/new?nature=DOCUMENT", icon: "M3 10h18M3 14h18m-9-4v8m-6 0h18a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "from-blue-500 to-blue-600" },
  { name: "Permis", desc: "Permis de conduire", to: "/declarations/new?nature=DOCUMENT", icon: "M10 8v8m-4-4v4m8-4v8m-6-4v4", color: "from-purple-500 to-purple-600" },
  { name: "Téléphone", desc: "Téléphone portable", to: "/declarations/new?nature=OBJET", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", color: "from-copper to-orange-600" },
  { name: "Clés", desc: "Clés voiture / maison", to: "/declarations/new?nature=OBJET", icon: "M15 7a2 2 0 012 2m4-2a2 2 0 01-4 0m-6 8a2 2 0 01-4 0m12 0a2 2 0 01-4 0m-6 4a2 2 0 01-4 0m12 0v2m-6-2v2m6-2v2", color: "from-yellow-500 to-yellow-600" },
  { name: "Autre", desc: "Autre objet / document", to: "/declarations/new", icon: "M5 8h14M5 12h14m-7-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "from-gray-500 to-gray-600" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-mali-beige/50 transition-colors duration-500 overflow-hidden">
      <header className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 -left-40 w-96 h-96 bg-mali-copper/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 text-brand-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Logo />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 transition-colors">Mali Retrouvé</h1>
                <p className="text-xs text-gray-500 transition-colors">Ensemble, retrouvons l'essentiel.</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-all duration-300 border border-brand-200"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse" />
              Service disponible sur tout le territoire malien
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 text-balance leading-tight mb-6">
              Retrouvez vos documents
              <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-mali-copper bg-clip-text text-transparent animate-shimmer">
                et objets perdus
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Déclarez une perte ou signalez une trouvaille en quelques clics. Notre système de correspondance intelligent vous met en relation avec les bonnes personnes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.to}
                className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-brand-500/5 border border-gray-200 p-6 transition-all duration-500 hover:shadow-brand-500/20 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link
              to="/declarations/new?nature=lost"
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-500/10 border-2 border-transparent hover:border-brand-500 p-10 transition-all duration-500 hover:shadow-brand-500/20 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">J'ai perdu un document / objet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Déclarez votre perte et soyez notifié si quelqu'un trouve un objet correspondant à votre description.
                </p>
                <span className="inline-flex items-center text-brand-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Déclarer une perte
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              to="/declarations/new?nature=found"
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-500/10 border-2 border-transparent hover:border-brand-500 p-10 transition-all duration-500 hover:shadow-brand-500/20 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">J'ai trouvé un document / objet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Signalez un objet trouvé et aidez son propriétaire à le récupérer en toute sécurité.
                </p>
                <span className="inline-flex items-center text-brand-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Signaler une trouvaille
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-50/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Rapide", desc: "Déclarez en moins de 3 minutes", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { title: "Sécurisé", desc: "Vos données sont chiffrées et protégées", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { title: "Gratuit", desc: "Service public national gratuit", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((item, i) => (
                <div key={i} className="card p-8 text-center group hover:-translate-y-1">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-24 border-t border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Mali Retrouvé</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Plateforme nationale de déclaration d'objets perdus et trouvés.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/declarations/new?nature=lost" className="text-gray-600 hover:text-brand-600 transition-colors">Déclarer une perte</Link></li>
                <li><Link to="/declarations/new?nature=found" className="text-gray-600 hover:text-brand-600 transition-colors">Signaler une trouvaille</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Aide</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/help" className="text-gray-600 hover:text-brand-600 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-brand-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Légal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/terms" className="text-gray-600 hover:text-brand-600 transition-colors">CGU</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-brand-600 transition-colors">Confidentialité</Link></li>
                <li><Link to="/rights" className="text-gray-600 hover:text-brand-600 transition-colors">Mes droits</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Mali Retrouvé. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
