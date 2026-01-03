import { ActiveChats } from './SupportManager/ActiveChats';

interface SupportManagerProps {
  onBack: () => void;
}

export function SupportManager({ onBack }: SupportManagerProps) {
  return <ActiveChats onBack={onBack} />;
}
