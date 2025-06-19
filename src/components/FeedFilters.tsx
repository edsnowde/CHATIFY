
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ListFilter, Users, Clock, ThumbsUp, GraduationCap, Briefcase } from "lucide-react";
import { UserRole } from "@/utils/types";

export type FilterType = "all" | UserRole; // "faculty" | "student"
export type SortByType = "latest" | "popular";

interface FeedFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sortBy: SortByType;
  setSortBy: (sortBy: SortByType) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="my-6 p-4 bg-card border border-border rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <ListFilter className="h-4 w-4" />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </Button>
        
        {showFilters && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><Users className="h-4 w-4 mr-2 inline-block" />All Roles</SelectItem>
                <SelectItem value="faculty"><Briefcase className="h-4 w-4 mr-2 inline-block text-dsu-maroon" />Faculty</SelectItem>
                <SelectItem value="student"><GraduationCap className="h-4 w-4 mr-2 inline-block text-dsu-navy" />Students</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest"><Clock className="h-4 w-4 mr-2 inline-block" />Latest</SelectItem>
                <SelectItem value="popular"><ThumbsUp className="h-4 w-4 mr-2 inline-block" />Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedFilters;

