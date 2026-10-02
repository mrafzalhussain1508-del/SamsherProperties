'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AgentAuthModal() {
  const { 
    isAuthModalOpen, 
    authModalTab, 
    closeAuthModal, 
    login, 
    registerAgent, 
    demoAgentCredentials 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRera, setRegRera] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleFillDemo = () => {
    setLoginEmail(demoAgentCredentials.email);
    setLoginPassword(demoAgentCredentials.password);
    setErrorMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
    }
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    // Form Validations
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all mandatory fields (Name, Email, Password).');
      setIsSubmitting(false);
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long for security compliance.');
      setIsSubmitting(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.');
      setIsSubmitting(false);
      return;
    }

    const res = registerAgent({
      name: regName,
      email: regEmail,
      password: regPassword,
      reraNumber: regRera.trim() || undefined,
      phone: regPhone || '+91 70110 07968',
      agencyName: 'Samsher RERA Certified Partner',
    });

    if (res.success) {
      setSuccessMessage('Agent account successfully registered! Redirecting to Agent Command Center...');
      setTimeout(() => {
        closeAuthModal();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#eef3ed] text-[#1a4332] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1a4332]" />
            Strict RERA Agent Access
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#163a34]">
            {activeTab === 'login' ? 'Agent Portal Login' : 'Register as RERA Agent'}
          </h2>
          <p className="text-xs text-[#5f7b6f] mt-1">
            {activeTab === 'login'
              ? 'Authorized access for licensed real estate partners & listing managers.'
              : 'Create your agent account to publish listings directly and manage buyer leads.'}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-[#f1f5f0] p-1 rounded-xl mb-4 text-xs font-bold border border-[#e1eae0]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'login'
                ? 'bg-white text-[#163a34] shadow-xs'
                : 'text-[#587568] hover:text-[#163a34]'
            }`}
          >
            Agent Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'register'
                ? 'bg-white text-[#163a34] shadow-xs'
                : 'text-[#587568] hover:text-[#163a34]'
            }`}
          >
            Register as Agent
          </button>
        </div>

        {/* Alerts / Error Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                Work Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="agent@samsherproperties.in"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#799487] hover:text-[#1a4332] p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Autofill Helper */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full bg-[#f4f8f3] hover:bg-[#eaf1e9] text-[#1a4332] border border-[#cfe0d5] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b47a3c]" />
                <span>Autofill Demo Agent Credentials (Password123)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a4332] hover:bg-[#123325] active:scale-[0.99] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#1a4332]/20 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Agent'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Register link */}
            <div className="pt-3 text-center border-t border-[#edf2ec] mt-4">
              <p className="text-xs text-[#527163]">
                Don&apos;t have an agent account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className="text-[#1a4332] font-bold hover:text-[#b47a3c] underline underline-offset-2 cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                />
                <User className="w-4 h-4 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                Work Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="vikram@realtypartners.in"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                RERA Registration Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={regRera}
                  onChange={(e) => setRegRera(e.target.value)}
                  placeholder="e.g. HRERA/PKL/AG/2026/894 (Optional)"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                />
                <FileText className="w-4 h-4 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+91 70110 07968"
                className="w-full px-3.5 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                  Password * (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2a483c] uppercase mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#fbfdfa] border border-[#dce5db] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1a4332] focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#799487] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#527163] pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRegPassword}
                  onChange={(e) => setShowRegPassword(e.target.checked)}
                  className="rounded text-[#1a4332] focus:ring-[#1a4332]"
                />
                <span>Show passwords</span>
              </label>
              <span className="text-[11px] text-[#789386]">RERA verified standard</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a4332] hover:bg-[#123325] active:scale-[0.99] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#1a4332]/20 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{isSubmitting ? 'Registering...' : 'Sign Up as Agent'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Login link */}
            <div className="pt-3 text-center border-t border-[#edf2ec] mt-4">
              <p className="text-xs text-[#527163]">
                Already have an agent account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="text-[#1a4332] font-bold hover:text-[#b47a3c] underline underline-offset-2 cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
