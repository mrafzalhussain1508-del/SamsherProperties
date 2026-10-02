/**
 * Indian Real Estate formatting utilities
 */

export function formatIndianCurrency(amount: number, purpose: 'sale' | 'rent' = 'sale'): string {
  if (purpose === 'rent') {
    return `₹ ${amount.toLocaleString('en-IN')}/mo`;
  }
  
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹ ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lacs = amount / 100000;
    return `₹ ${lacs % 1 === 0 ? lacs : lacs.toFixed(2)} Lacs`;
  } else {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  }
}

export function formatSqFt(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  propertyTitle: string,
  propertyId: string,
  priceFormatted: string,
  locality: string
): string {
  // Strip non-digits and ensure 91 country code for India
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }

  const message = `Hi! I found your listing on Aura Realty:\n\n*${propertyTitle}* (ID: #${propertyId.slice(0, 6)})\n📍 ${locality}\n💰 Price: ${priceFormatted}\n\nI am interested in scheduling a site visit and viewing the brochure. Please share the details!`;
  
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function calculateEMI(principal: number, annualInterestRate: number, tenureYears: number): {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
} {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const monthlyEmi = principal / totalMonths;
    return {
      monthlyEmi: Math.round(monthlyEmi),
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}
