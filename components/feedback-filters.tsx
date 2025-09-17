"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

export interface FilterOptions {
  search: string
  category: string
  status: string
  sortBy: string
}

interface FeedbackFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  totalCount: number
  filteredCount: number
}

export function FeedbackFilters({ filters, onFiltersChange, totalCount, filteredCount }: FeedbackFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      status: "all",
      sortBy: "newest",
    })
  }

  const hasActiveFilters = filters.search || filters.category !== "all" || filters.status !== "all"

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="improvement">Improvement</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
            <SelectItem value="least-upvoted">Least Upvoted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} feedback items
      </div>
    </div>
  )
}
