import { useState } from 'react';
import { Sdashboard } from './SalesManager/Sdashboard';
import { PricingDiscount } from './SalesManager/PricingDiscount';
import { InvoiceManagement } from './SalesManager/InvoiceManagement';
import { RevenueProfit } from './SalesManager/RevenueProfit';
import { RefundManagement } from './SalesManager/RefundManagement';

interface SalesManagerProps {
  onBack: () => void;
}

export function SalesManager({ onBack }: SalesManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pricing' | 'invoices' | 'revenue' | 'refunds'>('dashboard');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'pricing' | 'invoices' | 'revenue' | 'refunds');
  };

  if (activeTab === 'dashboard') {
    return <Sdashboard onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'pricing') {
    return <PricingDiscount onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'invoices') {
    return <InvoiceManagement onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'revenue') {
    return <RevenueProfit onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'refunds') {
    return <RefundManagement onBack={onBack} onNavigate={handleNavigate} />;
  }

  return null;
}