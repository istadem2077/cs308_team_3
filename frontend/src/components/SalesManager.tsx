import { useState } from 'react';
import { Sdashboard } from './SalesManager/Sdashboard';

interface SalesManagerProps {
  onBack: () => void;
}

export function SalesManager({ onBack }: SalesManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard'>('dashboard');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard');
  };

  if (activeTab === 'dashboard') {
    return <Sdashboard onBack={onBack} onNavigate={handleNavigate} />;
  }

  return null;
}
