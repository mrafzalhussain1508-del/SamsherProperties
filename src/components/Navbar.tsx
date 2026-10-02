'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/property';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  X, 
  Upload, 
  Phone, 
  KeyRound, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  User, 
  Lock,
  Heart 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateHome: () => void;
  onOpenEnquiry: () => void;
  customLogoUrl?: string;
  onOpenBrandingModal: () => void;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  onNavigateHome,
  onOpenEnquiry,
  customLogoUrl,
  onOpenBrandingModal,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, isAuthenticated, openLoginModal, openRegisterModal, logout } = useAuth();
  const { wishlistCount, openWishlist } = useWishlist();

  const handleLogout = () => {
    logout();
    onRoleChange('visitor');
    onNavigateHome();
    setMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 transition-all"
    >
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="bg-[#103629] text-[#e0ece5] text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span>A more thoughtful way to find your place.</span>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#e5ebe3] transition-all w-full">
        <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Name: Samsher Properties */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none min-w-0"
              title="Samsher Properties"
            >
              <BrandLogo customLogoUrl={customLogoUrl} size={36} className="sm:w-10 sm:h-10 shrink-0" />

              <div className="flex items-baseline gap-1 sm:gap-1.5 truncate">
                <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-[#163a34]">
                  Samsher
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-[#b47a3c]">
                  Properties
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links (Hidden below 768px md breakpoint) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            <button
              onClick={onNavigateHome}
              className="text-xs lg:text-sm font-semibold text-[#163a34] hover:text-[#b47a3c] transition-colors cursor-pointer"
            >
              Curated Homes
            </button>
            <button
              onClick={onOpenEnquiry}
              className="text-xs lg:text-sm font-semibold text-[#163a34] hover:text-[#b47a3c] transition-colors cursor-pointer"
            >
              Private Consultation
            </button>

            {/* Wishlist Saved Residences Button */}
            <button
              type="button"
              onClick={openWishlist}
              className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-[#163a34] hover:text-[#b47a3c] transition-colors cursor-pointer relative py-1 px-2.5 rounded-xl hover:bg-[#eef3ed]"
              title="Saved Residences Shortlist"
            >
              <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500 scale-110' : 'text-[#567366]'}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* YouTube Official Channel Link */}
            <a
              href="https://www.youtube.com/@samsherproperty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-[#163a34] hover:text-red-600 transition-colors"
              title="Samsher official - YouTube (@samsherproperty)"
            >
              <span className="w-4 h-3 bg-red-600 text-white rounded-xs flex items-center justify-center text-[7.5px] font-black shadow-2xs">▶</span>
              <span>YouTube</span>
            </a>

            {/* CONDITIONAL RENDERING: Authenticated Agent Navigation */}
            {isAuthenticated && role === 'agent' && (
              <>
                <button
                  onClick={() => onRoleChange('agent')}
                  className={`text-xs lg:text-sm font-bold transition-all px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                    currentRole === 'agent'
                      ? 'bg-[#1a4332] text-white shadow-xs'
                      : 'text-[#1a4332] bg-[#eef3ed] hover:bg-[#e4ece2]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Agent Dashboard</span>
                </button>

                <button
                  onClick={onOpenBrandingModal}
                  className="bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Change Logo or Hero Image"
                >
                  <Upload className="w-3.5 h-3.5 text-[#b47a3c]" />
                  <span className="hidden lg:inline">Change Assets</span>
                </button>

                {/* Logged in Agent Profile Badge */}
                <div className="flex items-center gap-2 bg-[#f4f7f3] pl-2 pr-3 py-1 rounded-xl border border-[#d6e3d5]">
                  <div className="w-5 h-5 rounded-full bg-[#1a4332] text-white text-[10px] font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-xs font-bold text-[#163a34] line-clamp-1 max-w-[110px]">
                    {user?.name}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Agent
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Sign out of Agent Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {/* CONDITIONAL RENDERING: Authenticated Admin Navigation */}
            {isAuthenticated && role === 'admin' && (
              <>
                <button
                  onClick={() => onRoleChange('admin')}
                  className={`text-xs lg:text-sm font-bold transition-all px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                    currentRole === 'admin'
                      ? 'bg-[#b47a3c] text-white shadow-xs'
                      : 'text-[#b47a3c] bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>

                <button
                  onClick={onOpenBrandingModal}
                  className="bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Change Logo or Hero Image"
                >
                  <Upload className="w-3.5 h-3.5 text-[#b47a3c]" />
                  <span>Change Assets</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {/* CONDITIONAL RENDERING: Unauthenticated / Buyer View */}
            {!isAuthenticated && (
              <button
                onClick={openLoginModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4332] bg-[#eef3ed] hover:bg-[#e3ede1] px-3.5 py-1.5 rounded-xl border border-[#d6e3d5] transition-all cursor-pointer shadow-2xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#b47a3c]" />
                <span>Agent Login</span>
              </button>
            )}

            {/* Desktop Direct Call */}
            <a
              href="tel:+917011007968"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4332] hover:text-[#b47a3c] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#1a4332]" />
              <span>+91 70110 07968</span>
            </a>
          </nav>

          {/* Mobile Action: Hamburger Menu Toggle Button (Visible below 768px) */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {!isAuthenticated && (
              <button
                onClick={openLoginModal}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#1a4332] bg-[#eef3ed] hover:bg-[#e3ede1] px-2.5 py-1.5 rounded-lg border border-[#d6e3d5] transition-colors whitespace-nowrap"
              >
                <KeyRound className="w-3 h-3 text-[#b47a3c] shrink-0" />
                <span>Agent Login</span>
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#163a34] hover:bg-[#f0f4ef] rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              ) : (
                <div className="w-5 flex flex-col gap-1 items-end">
                  <span className="w-5 h-[2px] bg-[#163a34] rounded-full" />
                  <span className="w-5 h-[2px] bg-[#163a34] rounded-full" />
                  <span className="w-3.5 h-[2px] bg-[#163a34] rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible only when menuOpen on mobile) */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[#e1e9df] px-4 sm:px-5 py-4 sm:py-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200 w-full">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#7c9388] mb-2">
              Samsher Properties Menu
            </p>

            {/* Saved Residences / Wishlist inside Mobile Menu with Live Notification Badge */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openWishlist();
              }}
              className="w-full text-left font-serif text-base text-[#163a34] hover:text-[#b47a3c] py-2.5 px-3 rounded-xl hover:bg-[#f7faf6] flex items-center justify-between cursor-pointer transition-colors bg-[#fbfdfa] border border-[#e8eee7] mb-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#567366]'}`} />
                </div>
                <div>
                  <span className="font-semibold block text-sm sm:text-base">Saved Residences</span>
                  <span className="text-[11px] text-[#6e8a7d] font-sans block">View your shortlisted properties</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                wishlistCount > 0 
                  ? 'bg-rose-500 text-white border-rose-600 shadow-2xs' 
                  : 'bg-[#eef3ed] text-[#1a4332] border-[#dae6d8]'
              }`}>
                {wishlistCount}
              </span>
            </button>

            <button
              onClick={() => {
                onNavigateHome();
                setMenuOpen(false);
              }}
              className="w-full text-left font-serif text-base text-[#163a34] hover:text-[#b47a3c] py-2 flex items-center justify-between cursor-pointer"
            >
              <span>Explore Curated Properties</span>
              <span className="text-xs bg-[#eef3ed] text-[#1a4332] font-semibold px-2 py-0.5 rounded-full">
                Verified
              </span>
            </button>
            <button
              onClick={() => {
                onOpenEnquiry();
                setMenuOpen(false);
              }}
              className="w-full text-left font-serif text-base text-[#163a34] hover:text-[#b47a3c] py-2 cursor-pointer"
            >
              Request Private Consultation
            </button>
            <a
              href="tel:+917011007968"
              onClick={() => setMenuOpen(false)}
              className="w-full text-left font-serif text-base text-[#163a34] hover:text-[#b47a3c] py-2 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#1a4332]" />
              <span>Helpline: +91 70110 07968</span>
            </a>

            <a
              href="https://www.youtube.com/@samsherproperty"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full text-left font-serif text-base text-[#163a34] hover:text-red-600 py-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-red-600 text-white rounded-xs flex items-center justify-center text-[7.5px] font-black">▶</span>
                <span>Samsher official (YouTube)</span>
              </div>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                Video Tours
              </span>
            </a>
          </div>

          {/* CONDITIONAL RENDERING: Authenticated Agent Section */}
          {isAuthenticated && role === 'agent' && (
            <div className="pt-3 border-t border-[#f0f3ef] space-y-3">
              <div className="p-3 bg-[#f8faf7] rounded-xl border border-[#dce5db] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#799487]">
                    Logged in as
                  </p>
                  <p className="text-xs font-bold text-[#163a34]">{user?.name}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Licensed Agent
                </span>
              </div>

              <button
                onClick={() => {
                  onRoleChange('agent');
                  setMenuOpen(false);
                }}
                className="w-full bg-[#1a4332] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Agent Command Center</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBrandingModal();
                }}
                className="w-full bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#b47a3c]" />
                <span>Change Logo or Hero Interior Photo</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Agent Account</span>
              </button>
            </div>
          )}

          {/* CONDITIONAL RENDERING: Authenticated Admin Section */}
          {isAuthenticated && role === 'admin' && (
            <div className="pt-3 border-t border-[#f0f3ef] space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Admin Superuser
                  </p>
                  <p className="text-xs font-bold text-amber-950">{user?.name}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>

              <button
                onClick={() => {
                  onRoleChange('admin');
                  setMenuOpen(false);
                }}
                className="w-full bg-[#b47a3c] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Moderation Panel</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBrandingModal();
                }}
                className="w-full bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#b47a3c]" />
                <span>Change Logo or Hero Interior Photo</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* CONDITIONAL RENDERING: Unauthenticated Guest / Buyer Action */}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-[#f0f3ef] space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7c9388]">
                Agent & Partner Portal
              </p>
              <div className="p-3 bg-[#f8faf7] rounded-2xl border border-[#dce5db] space-y-2">
                <p className="text-xs text-[#527163]">
                  Are you a licensed real estate partner? Log in to manage verified listings and respond to buyer enquiries.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openLoginModal();
                    }}
                    className="flex-1 bg-[#1a4332] hover:bg-[#123325] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#e6ca85]" />
                    <span>Agent Login</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openRegisterModal();
                    }}
                    className="flex-1 bg-white hover:bg-[#f0f5ee] text-[#1a4332] border border-[#cfe0d5] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </motion.header>
  );
}
