import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductSearch = ({ searchQuery, setSearchQuery }: ProductSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
};

export default ProductSearch;
