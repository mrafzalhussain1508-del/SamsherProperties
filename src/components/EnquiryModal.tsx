'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { generateWhatsAppLink, formatIndianCurrency } from '@/utils/formatters';
import { X, CheckCircle2, ShieldCheck, Sparkles, MessageSquare, Phone, Info } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  onSubmitLead: (lead: {
    propertyId: string;
    leadName: string;
    leadPhone: string;
    leadEmail?: string;
    message: string;
    preferredContact: 'whatsapp' | 'call';
    scheduledDate?: string;
  }) => void;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  property,
  onSubmitLead,
}: EnquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call'>('whatsapp');
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('Please share official brochure, price breakdown & arrange a site visit.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '840ae262-367a-4b15-b403-470edfcabf91',
          name: fullName,
          phone: phone,
          email: email,
          message: message,
          from_name: 'Samsher Properties Portal',
          subject: property ? `New Consultation Request: ${property.title}` : 'New General Consultation Request',
          property_name: property ? property.title : 'General Consultation',
          property_price: property ? formatIndianCurrency(property.priceInInr, property.purpose) : 'N/A',
          preferred_contact: preferredContact,
        }),
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        // Record lead internally for the Agent Dashboard
        const propertyId = property ? property.id : 'general-inquiry';
        onSubmitLead({
          propertyId,
          leadName: fullName,
          leadPhone: phone,
          leadEmail: email,
          message,
          preferredContact,
          scheduledDate,
        });

        // Reset all form states
        setFullName('');
        setPhone('');
        setEmail('');
        setMessage('Please share official brochure, price breakdown & arrange a site visit.');
        setSubmitted(true);

        // Optional WhatsApp redirection if property is selected & preferredContact is whatsapp
        if (property && preferredContact === 'whatsapp') {
          const link = generateWhatsAppLink(
            property.agent.whatsapp,
            property.title,
            property.id,
            formatIndianCurrency(property.priceInInr, property.purpose),
            property.locality
          );
          window.open(link, '_blank', 'noopener,noreferrer');
        }

        // Close modal after showing success state
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1800);
      } else {
        setErrorMessage(result.message || 'Unable to submit enquiry. Please check your details and try again.');
      }
    } catch (err) {
      console.error('Web3Forms submit error:', err);
      setErrorMessage('Network connection error. Please try again or reach out directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enquiry Successfully Dispatched!</h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              {property 
                ? `Agent ${property.agent.name} has received your direct request and will connect via ${preferredContact.toUpperCase()} immediately.`
                : 'Our verified senior real estate advisor will call you within 15 minutes.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Priority Connect
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {property ? 'Instant Property Enquiry' : 'Schedule Free Property Consultation'}
              </h3>
              {property && (
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  📍 {property.title} ({formatIndianCurrency(property.priceInInr, property.purpose)})
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sen"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <div className="flex">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-600 px-3 py-2.5 rounded-l-xl text-xs sm:text-sm font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Preferred Mode
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('whatsapp')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        preferredContact === 'whatsapp' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('call')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        preferredContact === 'call' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Call
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message / Site Visit Note
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 disabled:cursor-not-allowed active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit & Connect with Agent</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-600 text-center flex items-center justify-center gap-1">
                <Info className="w-3 h-3 text-slate-600" />
                100% Privacy Protection • Your number is never shared with third-party telemarketers.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
