'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { 
  Menu, 
  X, 
  User, 
  TrendingUp, 
  Target, 
  Map, 
  Home,
  Settings,
  LogOut,
  UserCircle,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { checkAuth } from '../AuthGuard';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
  { name: 'Explore', href: '/explore', icon: Target },
  { name: 'Careers', href: '/careers', icon: Briefcase },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
];

export default function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    (async () => {
      setIsAuth(await checkAuth());
    })();
    console.log("isAuth:", isAuth);
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleUserMenuClick = (action) => {
    setUserMenuOpen(false);
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        // Add logout logic here
        console.log('Logging out...');
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-[120px] h-10 overflow-hidden">
              <Image 
                src="/logo.png"
                alt="Growgle Logo"
                fill
                className={cn(
                  "object-contain transition-opacity duration-200",
                  logoLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLogoLoaded(true)}
                priority
                sizes="120px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop user menu */}
            <div className="relative hidden md:flex" ref={userMenuRef}>
              {isAuth ? (
                <button
                  aria-label="Open user menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((s) => !s)}
                  className={cn(
                    "inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                    userMenuOpen 
                      ? "bg-blue-50 text-blue-600 shadow-sm" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  <User className="h-5 w-5" />
                </button>
              ) : (
                <button
                  aria-label="Sign In"
                  onClick={() => router.push('/auth/login')}
                  className={cn(
                    "inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  )}
                >
                  Sign In
                </button>
              )}
              
              {/* Improved Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black/5 border border-gray-100 z-50"
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{props.name}</p>
                          <p className="text-xs text-gray-500">{props.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="py-2">
                      <button
                        onClick={() => handleUserMenuClick('profile')}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        <span>View Profile</span>
                      </button>
                      
                      <button
                        onClick={() => handleUserMenuClick('settings')}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        <span>Settings</span>
                      </button>
                      
                      <hr className="my-2 border-gray-100" />
                      
                      <button
                        onClick={() => handleUserMenuClick('logout')}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        <span>Sign out</span>
                      </button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-200 py-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile User Menu */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href="/profile"
                    className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Add logout logic here
                      console.log('Logging out...');
                    }}
                    className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign out</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}