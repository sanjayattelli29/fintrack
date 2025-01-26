import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Footer } from '../components/Layout/Footer';
import { BarChart as ChartBar, Shield, Zap, DollarSign } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">FinTrack</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Your Finances with Confidence
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Powerful financial tracking and analysis tools to help you make better investment decisions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <ChartBar className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive financial analysis and visualization tools.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your financial data is protected with enterprise-grade security.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your investments and earnings in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 dark:text-gray-400">Product Demo Video</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}