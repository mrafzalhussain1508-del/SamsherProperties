'use client';

import React from 'react';
import { Property } from '@/types/property';
import { formatIndianCurrency, formatSqFt } from '@/utils/formatters';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Layers, 
  Building,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface AdminPanelProps {
  properties: Property[];
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onViewProperty: (property: Property) => void;
}

export default function AdminPanel({
  properties,
  onApproveProperty,
  onRejectProperty,
  onViewProperty,
}: AdminPanelProps) {
  const pendingProperties = properties.filter(p => p.approvalStatus === 'pending_approval');
  const approvedProperties = properties.filter(p => p.approvalStatus === 'approved');
  const rejectedProperties = properties.filter(p => p.approvalStatus === 'rejected');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            Admin Superuser & Compliance Portal
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Listing Moderation & Verification Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify official state RERA numbers, prevent duplicate broker entries, and audit listing accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Anti-Spam Enforced
          </span>
        </div>
      </div>

      {/* Metrics Bar: 1 col on mobile, 2 on sm, 4 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Moderation Queue</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pendingProperties.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">Awaiting RERA audit</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Live Marketplace</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{approvedProperties.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">Publicly searchable</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">RERA Verified Rate</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">100%</p>
          <span className="text-[11px] text-emerald-700 font-medium">Mandatory legal check</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Rejected Entries</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{rejectedProperties.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">Failed verification</span>
        </div>
      </div>

      {/* PENDING APPROVAL SECTION */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Pending Listings Requiring Review ({pendingProperties.length})
          </h3>
          <span className="text-xs text-slate-400">Review against State RERA registry</span>
        </div>

        {pendingProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="font-bold text-slate-800">Queue Clean! No pending moderation requests.</p>
            <p className="text-xs text-slate-400">Switch to the &apos;Agent&apos; role to submit a test listing for approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingProperties.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  <img
                    src={typeof prop.images[0] === 'string' ? prop.images[0] : (prop.images[0] as any)?.url}
                    alt={prop.title}
                    className="w-full sm:w-36 h-24 rounded-xl object-cover shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Pending Verification
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Agent: <strong className="text-slate-800">{prop.agent.name}</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {prop.title}
                    </h4>

                    <p className="text-xs text-slate-600">
                      📍 {prop.locality}, {prop.cityName} • {prop.bhk} BHK • {formatSqFt(prop.carpetAreaSqFt)} • Price: <strong className="text-emerald-700">{formatIndianCurrency(prop.priceInInr, prop.purpose)}</strong>
                    </p>

                    <div className="bg-slate-100 text-slate-800 font-mono text-xs px-2.5 py-1 rounded inline-block font-semibold">
                      Submitted RERA Number: {prop.reraNumber}
                    </div>
                  </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onViewProperty(prop)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Preview Property"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRejectProperty(prop.id)}
                    className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => onApproveProperty(prop.id)}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALL PROPERTIES AUDIT LOG */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          Master Repository Listing Audit ({properties.length})
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {properties.map((p) => (
            <div key={p.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  p.approvalStatus === 'approved' ? 'bg-emerald-500' : p.approvalStatus === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <div>
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                  <p className="text-slate-500">
                    {p.cityName} • {formatIndianCurrency(p.priceInInr, p.purpose)} • Agent: {p.agent.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <span className="font-mono text-slate-400 text-[11px]">{p.reraNumber}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  p.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.approvalStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.approvalStatus.replace('_', ' ')}
                </span>
                <button
                  onClick={() => onViewProperty(p)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold ml-1 cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
