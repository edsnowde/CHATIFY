
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FeedLoadingSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-muted rounded-full mr-3"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-24 bg-muted rounded-lg mb-3"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FeedLoadingSkeleton;

