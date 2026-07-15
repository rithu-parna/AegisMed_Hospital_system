'use client';

import React, { useState } from 'react';
import { Invoice, Patient, InvoiceItem } from '../types/hospital';
import { calculateInvoiceTotals } from '../utils/mockData';
import { 
  CreditCard, 
  Search, 
  Plus, 
  X, 
  Printer, 
  AlertCircle, 
  DollarSign, 
  CheckCircle,
  Clock, 
  Building2, 
  FileText,
  Trash2
} from 'lucide-react';

interface BillingManagerProps {
  invoices: Invoice[];
  patients: Patient[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function BillingManager({
  invoices,
  patients,
  setInvoices
}: BillingManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);

  // New Invoice Form state
  const [patientId, setPatientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(8);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Insurance' | 'Bank Transfer'>('Card');

  // Dynamic invoice items builder
  const [invoiceItems, setInvoiceItems] = useState<{
    description: string;
    quantity: number;
    unitPrice: number;
  }[]>([]);
  const [itemDesc, setItemDesc] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  // Stats calculation
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = totalRevenue - totalPaid;

  const handleAddItem = () => {
    if (!itemDesc || itemPrice <= 0 || itemQty <= 0) return;
    setInvoiceItems([...invoiceItems, {
      description: itemDesc,
      quantity: Number(itemQty),
      unitPrice: Number(itemPrice)
    }]);
    setItemDesc('');
    setItemQty(1);
    setItemPrice(0);
  };

  const handleRemoveItem = (idx: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  // Subtotal for new invoice items
  const newSubtotal = invoiceItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const newTaxAmount = newSubtotal * (taxRate / 100);
  const newTotalAmount = Math.max(0, newSubtotal + newTaxAmount - discount);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || invoiceItems.length === 0 || !invoiceDate || !dueDate) return;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const items: InvoiceItem[] = invoiceItems.map((itm, index) => ({
      id: `ITM-${index + 1}`,
      description: itm.description,
      quantity: itm.quantity,
      unitPrice: itm.unitPrice
    }));

    const finalTotal = calculateInvoiceTotals(items, taxRate, discount);

    let status: Invoice['status'] = 'unpaid';
    if (paidAmount >= finalTotal) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partially-paid';
    }

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      patientId: patient.id,
      patientName: patient.name,
      invoiceDate,
      dueDate,
      items,
      taxRate,
      discount,
      totalAmount: finalTotal,
      paidAmount: Math.min(paidAmount, finalTotal),
      status,
      paymentMethod: paidAmount > 0 ? paymentMethod : undefined
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Reset Fields
    setPatientId('');
    setInvoiceItems([]);
    setTaxRate(8);
    setDiscount(0);
    setPaidAmount(0);
    setIsCreateModalOpen(false);
  };

  const handleRecordPayment = (invId: string, amountStr: string, method: Invoice['paymentMethod']) => {
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        const newPaid = Math.min(inv.paidAmount + amount, inv.totalAmount);
        const status: Invoice['status'] = newPaid >= inv.totalAmount ? 'paid' : 'partially-paid';
        return {
          ...inv,
          paidAmount: newPaid,
          status,
          paymentMethod: method
        };
      }
      return inv;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter invoices list
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeInvoice = invoices.find(inv => inv.id === activeInvoiceId);
  const activePatientObj = activeInvoice 
    ? patients.find(p => p.id === activeInvoice.patientId) 
    : null;

  return (
    <div className="space-y-6">
      
      {/* Financial Overview counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 no-print">
        <div className="p-6 premium-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Total Billing Generated</span>
            <h3 className="text-2xl font-bold font-mono text-foreground">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 premium-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Payments Collected</span>
            <h3 className="text-2xl font-bold font-mono text-emerald-500">${totalPaid.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 premium-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Outstanding Balance</span>
            <h3 className="text-2xl font-bold font-mono text-rose-500">${totalOutstanding.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Query Filter and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 premium-card no-print">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Patient name or Invoice ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 premium-input"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="premium-input py-2 px-3 text-muted-foreground font-bold"
          >
            <option value="All">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partially-paid">Partially Paid</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto premium-btn premium-btn-primary py-2.5 px-4 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Invoice Data Grid table */}
      <div className="premium-card overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Patient Name</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Grand Total</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground font-semibold">
                    No matching invoices found in billing archives.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const amtDue = inv.totalAmount - inv.paidAmount;
                  return (
                    <tr key={inv.id}>
                      <td className="font-bold font-mono text-primary">{inv.id}</td>
                      <td className="font-bold text-sm">{inv.patientName}</td>
                      <td className="text-muted-foreground font-medium">{inv.invoiceDate}</td>
                      <td className="text-muted-foreground font-medium">{inv.dueDate}</td>
                      <td className="font-bold font-mono">${inv.totalAmount.toFixed(2)}</td>
                      <td className="font-bold font-mono text-rose-500">${amtDue.toFixed(2)}</td>
                      <td>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
                          inv.status === 'partially-paid' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => {
                              const payAmount = prompt(`Record payment for ${inv.patientName}. Outstanding: $${amtDue.toFixed(2)}. Enter payment amount:`);
                              if (payAmount) {
                                handleRecordPayment(inv.id, payAmount, 'Card');
                              }
                            }}
                            className="premium-btn premium-btn-primary px-3 py-1.5 text-[10px]"
                          >
                            Pay Bill
                          </button>
                        )}
                        <button
                          onClick={() => setActiveInvoiceId(inv.id)}
                          className="premium-btn premium-btn-secondary px-3 py-1.5 text-[10px]"
                        >
                          View Statement
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detailed Statement Print Preview Modal */}
      {activeInvoiceId && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print:relative print:bg-white print:p-0">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 print:border-none print:shadow-none print:p-0 print:bg-white">
            
            {/* Modal Close Action */}
            <button 
              onClick={() => setActiveInvoiceId(null)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80 no-print"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Print Header buttons */}
            <div className="flex gap-2 justify-end mb-6 no-print">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-primary text-primary-foreground font-bold hover:opacity-90 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setActiveInvoiceId(null)}
                className="px-4 py-2 border border-border rounded-xl hover:bg-muted text-xs font-bold"
              >
                Close View
              </button>
            </div>

            {/* Billing Statement Paper Layout */}
            <div className="space-y-6 text-foreground print:text-black">
              {/* Top Banner: Logo & Identity details */}
              <div className="flex justify-between items-start border-b border-border/80 pb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">A</span>
                    <h2 className="text-xl font-bold tracking-tight text-foreground print:text-black">AegisMed Medical Center</h2>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[220px] print:text-zinc-500">
                    742 Evergreen Terrace, Sector 4<br />
                    Medical Sciences Tower, Suite 402<br />
                    Phone: +1 (555) 911-3829 • contact@aegismed.com
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-extrabold uppercase tracking-widest text-primary print:text-teal-700">Invoice Statement</h3>
                  <p className="text-sm font-bold font-mono text-muted-foreground print:text-zinc-600 mt-1">{activeInvoice.id}</p>
                  
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-2 ${
                    activeInvoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                    activeInvoice.status === 'partially-paid' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>
                    Payment: {activeInvoice.status}
                  </span>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block print:text-zinc-500">Patient Details (Bill To)</span>
                  <p className="font-extrabold text-sm">{activeInvoice.patientName}</p>
                  <p className="text-muted-foreground print:text-zinc-500">Patient ID: {activeInvoice.patientId}</p>
                  {activePatientObj && (
                    <>
                      <p className="text-muted-foreground print:text-zinc-500">{activePatientObj.contact}</p>
                      <p className="text-muted-foreground print:text-zinc-500">{activePatientObj.email}</p>
                      <p className="text-muted-foreground print:text-zinc-500">{activePatientObj.address}</p>
                    </>
                  )}
                </div>

                <div className="space-y-1.5 text-right font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Invoice Date:</span>
                    <span className="text-foreground print:text-black">{activeInvoice.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Due Date:</span>
                    <span className="text-foreground print:text-black">{activeInvoice.dueDate}</span>
                  </div>
                  {activeInvoice.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground print:text-zinc-500">Payment Mode:</span>
                      <span className="text-foreground print:text-black">{activeInvoice.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Lines Table */}
              <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/70 print:bg-zinc-100 text-muted-foreground print:text-zinc-700 font-bold border-b border-border/80">
                      <th className="p-3">Line Item / Medical Service</th>
                      <th className="p-3 text-center">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {activeInvoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 print:hover:bg-transparent">
                        <td className="p-3">
                          <p className="font-bold">{item.description}</p>
                          <p className="text-[9px] text-muted-foreground print:text-zinc-500">{item.id}</p>
                        </td>
                        <td className="p-3 text-center font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-bold font-mono">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation summary blocks */}
              <div className="flex justify-between items-start pt-2">
                <div className="text-[10px] text-muted-foreground print:text-zinc-500 max-w-[280px] space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-foreground print:text-black mb-1">Hospital Guidelines</h4>
                  <p>1. Co-payments are due at the time of consultation or visit.</p>
                  <p>2. Unpaid balances will accumulate a standard late-payment fee after 30 days.</p>
                  <p>3. Direct billing requests are routed to registered insurance providers.</p>
                </div>

                <div className="w-64 space-y-1.5 text-xs text-right font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Subtotal:</span>
                    <span className="text-foreground print:text-black font-mono">
                      ${(activeInvoice.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Tax Rate:</span>
                    <span className="text-foreground print:text-black font-mono">{activeInvoice.taxRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Discount applied:</span>
                    <span className="text-rose-500 font-mono">-${activeInvoice.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5 text-sm font-bold">
                    <span className="text-foreground print:text-black">Grand Total:</span>
                    <span className="text-primary print:text-black font-mono">${activeInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-zinc-500">Amount Paid:</span>
                    <span className="text-emerald-500 font-mono">${activeInvoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border border-double pt-1 text-sm font-extrabold bg-muted/30 p-2 rounded">
                    <span>Balance Due:</span>
                    <span className="text-rose-500 font-mono">${(activeInvoice.totalAmount - activeInvoice.paidAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg premium-card p-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Close */}
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Generate New Hospital Invoice</span>
            </h3>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              {/* Select Patient */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Billing Account (Patient) *</label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full premium-input font-bold text-muted-foreground"
                >
                  <option value="">-- Choose Account --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full premium-input font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full premium-input font-bold"
                  />
                </div>
              </div>

              {/* Billing Itemized Builder */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Itemized Charges</h4>
                
                {/* Items table list */}
                {invoiceItems.length > 0 && (
                  <div className="border border-border/80 rounded-xl overflow-hidden text-xs bg-white/50 backdrop-blur-sm">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th className="text-center">Price</th>
                          <th className="text-center">Qty</th>
                          <th className="text-right">Subtotal</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((itm, idx) => (
                          <tr key={idx}>
                            <td className="font-bold">{itm.description}</td>
                            <td className="text-center font-mono">${itm.unitPrice.toFixed(2)}</td>
                            <td className="text-center">{itm.quantity}</td>
                            <td className="text-right font-bold font-mono">${(itm.unitPrice * itm.quantity).toFixed(2)}</td>
                            <td className="text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Charge Builder Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-xl border border-border/40">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      placeholder="Service / Medication / Lab desc"
                      className="w-full premium-input"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      placeholder="Unit Price"
                      className="w-full premium-input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      placeholder="Qty"
                      className="w-full premium-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="premium-btn premium-btn-primary p-1.5 rounded-lg border border-primary/20 shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax, Discounts & Payments capture */}
              <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-4 text-xs font-semibold">
                <div>
                  <label className="text-muted-foreground block mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full premium-input"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Flat Discount ($)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full premium-input"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Paid Amount ($)</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full premium-input"
                  />
                </div>
                {paidAmount > 0 && (
                  <div className="col-span-3">
                    <label className="text-muted-foreground block mb-1">Payment Method</label>
                    <div className="flex gap-4">
                      {(['Cash', 'Card', 'Insurance', 'Bank Transfer'] as const).map(mode => (
                        <label key={mode} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer capitalize">
                          <input
                            type="radio"
                            name="payMode"
                            checked={paymentMethod === mode}
                            onChange={() => setPaymentMethod(mode)}
                            className="text-primary focus:ring-primary"
                          />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary calculations */}
              <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${newSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax calculated ({taxRate}%):</span>
                  <span>+${newTaxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount applied:</span>
                  <span className="text-rose-500">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="text-primary">${newTotalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="premium-btn premium-btn-secondary px-4 py-2 text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={invoiceItems.length === 0}
                  className="premium-btn premium-btn-primary px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
