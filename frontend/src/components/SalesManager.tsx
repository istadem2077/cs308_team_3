import { useState } from 'react';
import { Sdashboard } from './SalesManager/Sdashboard';
import { PricingDiscount } from './SalesManager/PricingDiscount';
import { InvoiceManagement } from './SalesManager/InvoiceManagement';

interface SalesManagerProps {
  onBack: () => void;
}

export function SalesManager({ onBack }: SalesManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pricing' | 'invoices'>('dashboard');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'pricing' | 'invoices');
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

  return null;
}