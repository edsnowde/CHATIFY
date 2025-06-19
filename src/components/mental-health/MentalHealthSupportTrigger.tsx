
import React from 'react';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react'; // Or Heart, Leaf

interface MentalHealthSupportTriggerProps {
  onOpenModal: () => void;
}

const MentalHealthSupportTrigger: React.FC<MentalHealthSupportTriggerProps> = ({ onOpenModal }) => {
  return (
    <Button
      variant="outline"
      className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 rounded-full py-3 px-4 shadow-lg bg-card hover:bg-muted/50 border-primary/30 transition-all hover:shadow-xl animate-fade-in"
      onClick={onOpenModal}
    >
      <LifeBuoy className="h-5 w-5 text-primary" />
      <span className="text-sm text-foreground">Feeling overwhelmed? We’re here for you.</span>
    </Button>
  );
};

export default MentalHealthSupportTrigger;
