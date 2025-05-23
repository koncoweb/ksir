import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Category } from "./types";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) => {
  return (
    <div className="bg-white rounded-lg p-2 shadow-sm">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-2 pb-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(null)}
          >
            Semua
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap",
                selectedCategory === category.id ? "bg-primary text-white" : "",
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryList;
