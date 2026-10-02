'use client';

import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AccessDeniedProps {
  onGoHome: () => void;
}

export default function AccessDenied({ onGoHome }: AccessDeniedProps) {
  const { openLoginModal, openRegisterModal, user, role } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Lock / Security Shield Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-rose-600" />
          <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1.5 rounded-full shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            HTTP 403 • Forbidden Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163a34]">
            Agent Portal Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-[#5a7669] leading-relaxed max-w-md mx-auto">
            The Agent Command Center, listing publishing engine, and inbound buyer CRM are strictly restricted to verified RERA agents.
          </p>
        </div>

        {/* Current Role Indicator */}
        <div className="bg-[#f8faf7] border border-[#e2eae0] rounded-2xl p-3.5 text-xs text-[#4e6c5e] flex items-center justify-between">
          <span className="font-medium">Active Session Status:</span>
          <span className="font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
            {user ? `${user.role} (${user.name})` : 'Buyer (Not Logged In)'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={openLoginModal}
              className="w-full bg-[#1a4332] hover:bg-[#123325] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#1a4332]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#e6ca85]" />
              <span>Agent Login</span>
            </button>

            <button
              onClick={openRegisterModal}
              className="w-full bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#b47a3c]" />
              <span>Register as Agent</span>
            </button>
          </div>

          <button
            onClick={onGoHome}
            className="w-full text-xs font-semibold text-[#5a7669] hover:text-[#163a34] py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Curated Homes</span>
          </button>
        </div>

      </div>
    </div>
  );
}
