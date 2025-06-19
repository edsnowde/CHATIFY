
import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Leaf, Users, BookOpen, X } from 'lucide-react';

interface MentalHealthSupportModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MentalHealthSupportModal: React.FC<MentalHealthSupportModalProps> = ({ isOpen, onOpenChange }) => {
  const [showSupportOptions, setShowSupportOptions] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset state when modal is closed
    setTimeout(() => setShowSupportOptions(false), 300); // Delay to allow animation
  }, [onOpenChange]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !showSupportOptions) {
      timer = setTimeout(() => {
        handleClose();
      }, 30000); // Auto-dismiss after 30 seconds
    }
    return () => clearTimeout(timer);
  }, [isOpen, showSupportOptions, handleClose]);

  const handleYesClick = () => {
    setShowSupportOptions(true);
  };

  const handleOpenResource = (url: string) => {
    window.open(url, '_blank');
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(true);
    }}>
      <AlertDialogContent className="bg-card text-card-foreground rounded-lg shadow-xl max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-primary">
            {showSupportOptions ? "Here are some ways we can help" : "We're here for you"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2">
            {!showSupportOptions && "It’s okay to feel this way. Would you like some support?"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!showSupportOptions ? (
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={handleClose} className="hover:bg-muted/50">
              Not now
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleYesClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Yes, please
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <div className="mt-4 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start py-6 text-left h-auto border-primary/20 hover:bg-primary/5"
              onClick={() => {
                // Placeholder for actual breathing exercise feature
                alert("Initiating breathing exercise guidance...");
                handleClose();
              }}
            >
              <Leaf className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <p className="font-medium text-foreground">Try a Breathing Exercise</p>
                <p className="text-xs text-muted-foreground">A quick way to find calm.</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start py-6 text-left h-auto border-primary/20 hover:bg-primary/5"
              onClick={() => {
                // Placeholder for peer mentor chat
                alert("Connecting you with a Peer Mentor...");
                handleClose();
              }}
            >
              <Users className="h-5 w-5 mr-3 text-blue-600" />
               <div>
                <p className="font-medium text-foreground">Talk to a Peer Mentor</p>
                <p className="text-xs text-muted-foreground">Connect with someone who understands.</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start py-6 text-left h-auto border-primary/20 hover:bg-primary/5"
              onClick={() => handleOpenResource('/campus-wellbeing')} // Example URL
            >
              <BookOpen className="h-5 w-5 mr-3 text-purple-600" />
              <div>
                <p className="font-medium text-foreground">Visit Campus Well-being Resources</p>
                <p className="text-xs text-muted-foreground">Find articles, contacts, and more.</p>
              </div>
            </Button>

            <p className="text-xs italic text-muted-foreground pt-4 text-center">
              “You’ve survived 100% of your worst days so far.”
            </p>
            <AlertDialogFooter className="mt-6">
              <Button variant="ghost" onClick={handleClose}>Close</Button>
            </AlertDialogFooter>
          </div>
        )}
         {/* Manual close button as per Radix AlertDialog best practices for accessibility if needed, though covered by AlertDialogCancel or actions */}
         {/* <AlertDialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </AlertDialogPrimitive.Close> */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MentalHealthSupportModal;
