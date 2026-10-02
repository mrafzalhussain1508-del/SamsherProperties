'use client';

import React, { useState } from 'react';
import { Property, LeadEnquiry, PropertyPurpose, PropertyType, VastuFacing } from '@/types/property';
import { formatIndianCurrency, formatSqFt } from '@/utils/formatters';
import { 
  PlusCircle, 
  Building2, 
  Users, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar,
  Sparkles,
  ArrowRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AgentDashboardProps {
  properties: Property[];
  leads: LeadEnquiry[];
  onAddNewProperty: (newProp: Partial<Property>) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadEnquiry['status']) => void;
  onViewProperty: (property: Property) => void;
}

export default function AgentDashboard({
  properties,
  leads,
  onAddNewProperty,
  onUpdateLeadStatus,
  onViewProperty,
}: AgentDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'add_property' | 'leads'>('listings');

  // Filter and display only those properties where property.agentId === loggedInAgent.id
  const myProperties = properties.filter((prop) => {
    if (!user) return false;
    return prop.agentId === user.id || prop.ownerId === user.id || prop.agent?.id === user.id;
  });

  // Form State for Adding a Property
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [priceInInr, setPriceInInr] = useState<number>(8500000); // 85L
  const [bhk, setBhk] = useState<number>(2);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1050);
  const [cityName, setCityName] = useState('Faridabad');
  const [locality, setLocality] = useState('Sector 82');
  const [fullAddress, setFullAddress] = useState('');
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || '');
  const [facing, setFacing] = useState<VastuFacing>('East');
  const [possessionStatus, setPossessionStatus] = useState('Ready to Move');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reraNumber || !priceInInr) return;

    const finalImage = imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

    const newProp: Partial<Property> = {
      title,
      agentId: user?.id || 'agent-curr',
      ownerId: user?.id || 'agent-curr',
      description: description || 'High-specification verified home with modern amenities and scenic city views.',
      purpose,
      propertyType,
      priceInInr: Number(priceInInr),
      pricePerSqFt: Math.round(Number(priceInInr) / Number(carpetAreaSqFt)),
      bhk: Number(bhk),
      carpetAreaSqFt: Number(carpetAreaSqFt),
      cityName,
      locality,
      fullAddress: fullAddress || `${locality}, ${cityName}`,
      reraNumber,
      isReraVerified: true,
      facing,
      possessionStatus,
      approvalStatus: 'approved', // Bypass admin approval - published directly to live website
      images: [finalImage],
      amenities: ['100% Power Backup', 'Lift', 'Clubhouse', 'Gym', '24x7 Security'],
      landmarks: [
        { name: 'Nearest Metro Station', distance: '1.2 km', type: 'metro' },
        { name: 'Supermarket & Clinic', distance: '500 m', type: 'hospital' }
      ],
      agent: {
        id: user?.id || 'agent-curr',
        name: user?.name ? `${user.name} (You)` : 'Rohan Deshmukh (You)',
        phone: user?.phone || '+917011007968',
        whatsapp: user?.phone ? user.phone.replace(/\D/g, '') : '+917011007968',
        agencyName: user?.agencyName || 'Samsher Verified Partner Agency',
        isVerified: true,
        rating: 4.9,
        avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      }
    };

    onAddNewProperty(newProp);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setImageUrl('');
      setImagePreview(null);
      setActiveTab('listings');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Agent Portal
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Agent Command Center & Leads CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your verified RERA listings, track inbound inquiries, and respond directly via WhatsApp.
          </p>
        </div>

        {/* Tab Switcher Buttons (Responsive wrap on mobile) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'listings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Listings ({myProperties.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'leads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Leads ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add_property')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'add_property' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Listing</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              Active & Moderated Properties
            </h3>
            <span className="text-xs text-slate-500">
              Only Approved listings appear in the public search engine.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProperties.length === 0 ? (
              <div className="col-span-full py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm sm:text-base">No Listings Assigned Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You currently have no properties assigned to your agent ID. Click below to add and publish your first verified property.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('add_property')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Listing</span>
                </button>
              </div>
            ) : (
              myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9]">
                    <img
                      src={typeof prop.images[0] === 'string' ? prop.images[0] : (prop.images[0] as any)?.url}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      {prop.approvalStatus === 'approved' ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live & Approved
                        </span>
                      ) : prop.approvalStatus === 'pending_approval' ? (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Admin Review
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-base font-black text-slate-900">
                      {formatIndianCurrency(prop.priceInInr, prop.purpose)}
                    </p>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      📍 {prop.locality}, {prop.cityName} • {prop.bhk} BHK • {formatSqFt(prop.carpetAreaSqFt)}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      RERA: {prop.reraNumber}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onViewProperty(prop)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ID: #{prop.id.slice(0, 6)}
                  </span>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* TAB 2: INBOUND LEADS CRM */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              Direct Buyer Inquiries & Site Visit Bookings
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ⚡ High-Conversion Lead Pipeline
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No inquiries received yet. Submit an enquiry on any property page to test!
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {lead.leadName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        lead.status === 'new' 
                          ? 'bg-blue-100 text-blue-800' 
                          : lead.status === 'contacted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-slate-900 font-bold">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {lead.leadPhone}
                      </span>
                      {lead.leadEmail && (
                        <span>✉️ {lead.leadEmail}</span>
                      )}
                      <span>Prefers: {lead.preferredContact.toUpperCase()}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-900">Message:</span> &quot;{lead.message}&quot;
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Interested in: <strong className="text-slate-700">{lead.propertyTitle}</strong></span>
                      {lead.scheduledDate && (
                        <span className="text-emerald-700 font-semibold">• Visit Date: {lead.scheduledDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons for Agent */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <a
                      href={`https://wa.me/${lead.leadPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.leadName)}%2C%20thank%20you%20for%20enquiring%20about%20${encodeURIComponent(lead.propertyTitle)}%20on%20Aura%20Realty.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${lead.leadPhone}`}
                      className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call Lead</span>
                    </a>

                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadEnquiry['status'])}
                      className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-2.5 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="visit_scheduled">Visit Scheduled</option>
                      <option value="closed">Closed Deal</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW LISTING FORM */}
      {activeTab === 'add_property' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900">
              Submit New RERA Verified Listing
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Listings require a valid RERA registration number and will go live instantly on the website.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-950">Property Published Live!</h4>
              <p className="text-xs text-emerald-800">
                Your listing has been published directly and is now live on the website.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Project / Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Godrej Woodsville - 3 BHK Luxury Garden Home"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Purpose *
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Price in INR *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceInInr}
                    onChange={(e) => setPriceInInr(Number(e.target.value))}
                    placeholder="8500000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    = {formatIndianCurrency(priceInInr, purpose)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    BHK Configuration
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Carpet Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={carpetAreaSqFt}
                    onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                    placeholder="1050"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Vastu Facing
                  </label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value as VastuFacing)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  >
                    <option value="East">East</option>
                    <option value="North-East">North-East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Locality / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  RERA Registration Number * (Strictly Verified)
                </label>
                <input
                  type="text"
                  required
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  placeholder="e.g. PRM/KA/RERA/1251/446/PR/200123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Property Image Upload *
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="flex items-center gap-3.5 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl animate-in fade-in">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-300 shadow-xs shrink-0 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Selected property preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Image Preview Ready
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          This image is ready and will be published directly with your listing.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Listing Directly</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
