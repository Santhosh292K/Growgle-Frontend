'use client';
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { Heart, Github, Linkedin, Twitter } from 'lucide-react';
import Image from "next/image";
import { cn } from '@/lib/utils';

export default function Footer() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  return (
    <footer className="bg-grey-50 border-t border-grey-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative w-[120px] h-15 overflow-hidden">
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
            <p className="text-grey-600 max-w-md">
              Empowering students and professionals with AI-driven career guidance, 
              skill mapping, and personalized roadmaps for the future of work.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-grey-400 hover:text-grey-600 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-grey-400 hover:text-grey-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-grey-400 hover:text-grey-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-grey-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/skills" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Skills Assessment
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Career Roadmap
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Industry Trends
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-grey-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-grey-600 hover:text-grey-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-grey-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-grey-600 text-sm">
            © 2025 Growgle. All rights reserved.
          </p>
          <p className="text-grey-600 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for the future workforce
          </p>
        </div>
      </div>
    </footer>
  );
}