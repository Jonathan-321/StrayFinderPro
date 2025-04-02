import { Link } from "wouter";
import { Facebook, Globe, Mail, Phone, MapPin, PawPrint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <PawPrint className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl">PawFinder</span>
            </div>
            <p className="text-gray-400 mb-4">
              Helping reunite lost dogs with their owners through community support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Globe className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/found-dogs">
                  <a className="text-gray-400 hover:text-white">Found Dogs</a>
                </Link>
              </li>
              <li>
                <Link href="/report-dog">
                  <a className="text-gray-400 hover:text-white">Report Dog</a>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <a className="text-gray-400 hover:text-white">About Us</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works">
                  <a className="text-gray-400 hover:text-white">How It Works</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Safety Tips</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Dog Care</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">support@pawfinder.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">123 Main St, City, Country</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PawFinder. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
