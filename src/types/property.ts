export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'villa' | 'independent_house' | 'plot' | 'penthouse' | 'commercial';
export type FurnishingStatus = 'unfurnished' | 'semi_furnished' | 'fully_furnished';
export type VastuFacing = 'North' | 'North-East' | 'East' | 'South-East' | 'South' | 'South-West' | 'West' | 'North-West';
export type ListingStatus = 'pending_approval' | 'approved' | 'rejected' | 'sold' | 'published' | 'live';
export type UserRole = 'visitor' | 'buyer' | 'agent' | 'admin';

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
}

export interface Landmark {
  name: string;
  distance: string;
  type: 'metro' | 'hospital' | 'school' | 'it_park' | 'mall';
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  agentId?: string | null;
  ownerId?: string | null;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  propertyTypeCustom?: string;
  priceInInr: number; // e.g. 9500000 for 95 Lakhs
  priceDisplayCustom?: string;
  areaDisplayCustom?: string;
  pricePerSqFt: number;
  maintenanceMonthly?: number;
  specificationsSummary?: string;
  bhk: number;
  bathrooms: number;
  balconies: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt?: number;
  floorNumber: number;
  totalFloors: number;
  furnishing: FurnishingStatus;
  facing: VastuFacing;
  possessionStatus: string; // e.g. "Ready to Move" or "Dec 2026"
  reraNumber: string;
  isReraVerified: boolean;
  approvalStatus: ListingStatus;
  isFeatured?: boolean;
  cityName: string;
  locality: string;
  fullAddress: string;
  pincode: string;
  amenities: string[];
  images: string[];
  landmarks: Landmark[];
  agent: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    agencyName: string;
    isVerified: boolean;
    rating: number;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface LeadEnquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  message: string;
  preferredContact: 'whatsapp' | 'call';
  scheduledDate?: string;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'closed';
  createdAt: string;
}
