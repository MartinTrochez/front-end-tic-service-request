import { Facebook, Rss, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="font-medium">Dirección de Capacitación</div>

        <div className="flex items-center gap-4">
          <span className="font-medium">Contactos: </span>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=100063617002043"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com/direcciondeTIC"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="RSS Feed"
            >
              <Rss size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
