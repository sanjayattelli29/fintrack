import React from 'react';
import { Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FinTrack</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted partner in financial tracking and analysis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <a
                href="tel:+918977300290"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Phone className="h-4 w-4" />
                <span>+91 8977300290</span>
              </a>
              <a
                href="mailto:editwithsanjay@gmail.com"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Mail className="h-4 w-4" />
                <span>editwithsanjay@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}