import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          <div className="text-center">
            
          </div>
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
              O banco de dados digital que promove a visibilidade dos projetos
              alinhados aos Objetivos de Desenvolvimento Sustentável (ODS) no
              estado do Rio de Janeiro.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-bold uppercase text-gray-800 mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center justify-center gap-3">
                <Mail size={16} />
                <span>aquitemods@gmail.com</span>
              </li>
              <li className="flex items-center justify-center gap-3 break-words">
                <MapPin size={16} />
                <span>R. Cel. Madureira, 77 - Centro, Saquarema - RJ</span>
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
