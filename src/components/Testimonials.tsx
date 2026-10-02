'use client';

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const REVIEWS = [
  {
    id: 1,
    name: 'Siddharth & Priya Sharma',
    role: 'Homeowners in Faridabad',
    propertyBought: '3 BHK in Sector 82, Faridabad',
    comment: 'The 100% RERA verification on Samsher Properties gave us complete peace of mind. We booked a weekend site visit via WhatsApp and finalized our dream home with zero broker runaround.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Deepak Singhal',
    role: 'NRI Investor (Dubai / Gurgaon)',
    propertyBought: 'Luxury 4 BHK on Golf Course Road (Gurgaon)',
    comment: 'Managing real estate purchases in Gurgaon from Dubai can be daunting. Samsher Singh gave me transparent video walkthroughs, sanctioned carpet area docs, and seamless legal support.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Meenakshi & Ankit Gupta',
    role: 'Tech Professionals in Noida',
    propertyBought: '2 BHK in Sector 150, Noida',
    comment: 'Love the green sector focus and transparent carpet area disclosures. Direct agent connect via WhatsApp saved us hours compared to generic spam portals.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  }
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 my-14">
      <ScrollReveal delay={0} yOffset={24}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Buyer & Investor Trust
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trusted by 5,000+ Indian Families & NRIs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Read verified experiences from buyers who discovered their homes through our certified agent network.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, idx) => (
          <ScrollReveal key={review.id} delay={idx * 120} yOffset={32}>
            <div
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group h-full"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-slate-100 group-hover:text-emerald-100 transition-colors pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{review.name}</h4>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    Verified: {review.propertyBought}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
