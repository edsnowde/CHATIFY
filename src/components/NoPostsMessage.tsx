
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

const NoPostsMessage: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-semibold text-foreground">No Posts Found</p>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or be the first to share something!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoPostsMessage;

