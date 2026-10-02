'use client';

import React, { useState, useId } from 'react';
import { calculateEMI, formatIndianCurrency } from '@/utils/formatters';
import { Calculator, ArrowRight, CheckCircle2, IndianRupee } from 'lucide-react';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(7500000); // 75 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const loanAmountInputId = useId();
  const interestRateInputId = useId();
  const tenureYearsInputId = useId();

  const { monthlyEmi, totalPayment, totalInterest } = calculateEMI(
    loanAmount,
    interestRate,
    tenureYears
  );

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 my-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Home Loan Planning Tool
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Smart Home Loan EMI Calculator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Calculate your monthly outflows across leading Indian banks (SBI, HDFC, ICICI, Axis).
          </p>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            %
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Current Lowest Rates</p>
            <p className="text-sm font-bold text-white">Starting at 8.35% p.a.*</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
              <label htmlFor={loanAmountInputId} className="text-slate-300">Loan Amount</label>
              <span className="text-emerald-400 font-mono text-base font-black">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>
            <input
              id={loanAmountInputId}
              type="range"
              min={1000000}
              max={50000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              aria-label="Loan Amount in Indian Rupees"
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>₹10 Lacs</span>
              <span>₹2.5 Cr</span>
              <span>₹5 Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
              <label htmlFor={interestRateInputId} className="text-slate-300">Interest Rate (% p.a.)</label>
              <span className="text-emerald-400 font-mono text-base font-black">
                {interestRate}%
              </span>
            </div>
            <input
              id={interestRateInputId}
              type="range"
              min={7.0}
              max={13.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-label="Interest Rate per annum"
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>7.0%</span>
              <span>10.0%</span>
              <span>13.0%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
              <label htmlFor={tenureYearsInputId} className="text-slate-300">Loan Tenure (Years)</label>
              <span className="text-emerald-400 font-mono text-base font-black">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              id={tenureYearsInputId}
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              aria-label="Loan Tenure in years"
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>5 Years</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* EMI Result Summary Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700/80 shadow-inner flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                Your Monthly Estimated EMI
              </p>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-mono">
                ₹ {monthlyEmi.toLocaleString('en-IN')}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-700/60 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Loan Amount:</span>
                <span className="font-bold text-white font-mono">{formatIndianCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-bold text-amber-400 font-mono">{formatIndianCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700/40">
                <span className="text-slate-200 font-bold">Total Payment (P + I):</span>
                <span className="font-black text-emerald-300 font-mono">{formatIndianCurrency(totalPayment)}</span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/917011007968?text=Hi%2C%20I%20used%20your%20EMI%20calculator%20and%20want%20to%20get%20pre-approved%20home%20loan%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <span>Get Pre-Approved Loan Assistance</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
