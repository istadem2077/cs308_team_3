import { useState } from 'react';
import { Sdashboard } from './SalesManager/Sdashboard';
import { PricingDiscount } from './SalesManager/PricingDiscount';

interface SalesManagerProps {
  onBack: () => void;
}

export function SalesManager({ onBack }: SalesManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pricing'>('dashboard');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'pricing');
  };

  if (activeTab === 'dashboard') {
    return <Sdashboard onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'pricing') {
    return <PricingDiscount onBack={onBack} onNavigate={handleNavigate} />;
  }

  return null;
}