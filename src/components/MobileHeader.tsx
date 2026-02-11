import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * MobileHeader Component
 * Implements the mobile-only header based on Figma design.
 * Features: Transparent background, fixed positioning, and Radix UI Drawer.
 */
const MobileHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-4 bg-transparent">
      {/* Logo Section */}
      <Link to="/">
        <img src="/images/logo.png" alt="Treelah Logo" />
      </Link>

      {/* Hamburger Menu / Drawer */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="flex h-10 w-10 items-center justify-center text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu size={28} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-0 right-0 z-[70] h-full w-[80%] bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-bold text-gray-900">Menu</span>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            {/* Hidden Navigation Links */}
            <nav className="mt-8 flex flex-col gap-6">
              <a
                href="#"
                className="text-lg font-medium text-gray-800 active:text-orange-500"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-lg font-medium text-gray-800 active:text-orange-500"
              >
                Souvenirs & Bulk Orders
              </a>
              <a
                href="#"
                className="text-lg font-medium text-gray-800 active:text-orange-500"
              >
                Track Order
              </a>
              <a
                href="#"
                className="text-lg font-medium text-gray-800 active:text-orange-500"
              >
                Support
              </a>
            </nav>

            <div className="absolute bottom-10 left-6 right-6">
              <button className="w-full rounded-full bg-orange-500 py-3 font-semibold text-white">
                Sign In
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
};

export default MobileHeader;