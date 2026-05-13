"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AuthNav() {
  const { user } = useAuth();
  
  // Check if user has admin privileges
  const isAdmin = user?.customClaims?.admin === true;

  if (!user) {
    return (
      <Link 
        href="/portal" 
        className="rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] px-6 py-2 text-sm font-bold text-black shadow-lg hover:scale-105 transition-transform"
      >
        Client Portal
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Admin-only navigation links */}
      {isAdmin && (
        <>
          <Link href="/portal/admin" className="text-sm font-semibold text-white/80 hover:text-white transition">
            Admin
          </Link>
          <Link href="/portal/admin/blog" className="text-sm font-semibold text-white/80 hover:text-white transition">
            Blog Admin
          </Link>
        </>
      )}
      
      <Link 
        href="/portal" 
        className="text-sm font-semibold text-white/80 hover:text-white transition"
      >
        Portal
      </Link>
      
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {user.email?.[0]?.toUpperCase()}
        </span>
      </div>
    </div>
  );
}