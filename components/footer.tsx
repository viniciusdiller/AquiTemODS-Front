import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mail, MapPin } from "lucide-react";

const address = "R. Cel. Madureira, 77, Saquarema - RJ";
const encodedAddress = encodeURIComponent(address);
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          <div className="text-center"></div>
          <div className=" text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/Logo_aquitemods_preto.png"
                alt="Logo MeideSaqua"
                width={160}
                height={57}
                className="h-14 w-auto mx-auto md:mx-auto "
              />
            </Link>
            <p className="text-gray-600 max-w-xs mx-auto ">
              O ecossistema de conhecimento e colaboração entre gestores, técnicos, servidores e cidadãos comprometidos com o desenvolvimento sustentável municipal alinhado aos Objetivos de Desenvolvimento Sustentável.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-bold uppercase text-gray-800 mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center justify-center gap-3 hover:text-[#D7386E] transition-colors">
                <Mail size={16} />
                <a
                  href="mailto:aquitemods@gmail.com"
                  className="hover:underline hover:text-[#D7386E] transition-colors"
                >
                  aquitemods@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center gap-3 hover:text-[#D7386E] transition-colors">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-3 text-left hover:underline hover:text-[#D7386E] transition-colors"
                >
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>{address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Desenvolvido pela Secretaria Municipal
            de Governança e Sustentabilidade de Saquarema
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
