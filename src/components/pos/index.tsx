import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import ProductSearch from "./ProductSearch";
import CategoryList from "./CategoryList";
import ProductGrid from "./ProductGrid";
import ShoppingCart from "./ShoppingCart";
import { Product, Category, CartItem } from "./types";
import { Button } from "../ui/button";
import { ShoppingBag, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const POS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Sample categories data
  const categories: Category[] = [
    { id: "1", name: "Minuman", icon: "☕" },
    { id: "2", name: "Makanan", icon: "🍔" },
    { id: "3", name: "Snack", icon: "🍿" },
    { id: "4", name: "Dessert", icon: "🍰" },
    { id: "5", name: "Paket", icon: "📦" },
    { id: "6", name: "Promo", icon: "🔥" },
  ];

  // Sample products data
  const products: Product[] = [
    {
      id: "1",
      name: "Kopi Susu",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1572286258217-215cf8e9d99a?w=300&q=80",
      categoryId: "1",
      stock: 50,
    },
    {
      id: "2",
      name: "Kopi Hitam",
      price: 12000,
      image:
        "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=300&q=80",
      categoryId: "1",
      stock: 45,
    },
    {
      id: "3",
      name: "Nasi Goreng",
      price: 25000,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80",
      categoryId: "2",
      stock: 20,
    },
    {
      id: "4",
      name: "Mie Goreng",
      price: 22000,
      image:
        "https://images.unsplash.com/photo-1645696301019-33e5b8c5d5e8?w=300&q=80",
      categoryId: "2",
      stock: 25,
    },
    {
      id: "5",
      name: "Es Teh",
      price: 8000,
      image:
        "https://images.unsplash.com/photo-1556679343-c1306ee6ac09?w=300&q=80",
      categoryId: "1",
      stock: 60,
    },
    {
      id: "6",
      name: "Kentang Goreng",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80",
      categoryId: "3",
      stock: 30,
    },
    {
      id: "7",
      name: "Cheese Cake",
      price: 20000,
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80",
      categoryId: "4",
      stock: 15,
    },
    {
      id: "8",
      name: "Paket Hemat 1",
      price: 35000,
      image:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&q=80",
      categoryId: "5",
      stock: 10,
    },
    {
      id: "9",
      name: "Promo Spesial",
      price: 30000,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
      categoryId: "6",
      stock: 5,
    },
    {
      id: "10",
      name: "Brownies",
      price: 18000,
      image:
        "https://images.unsplash.com/photo-1589375890993-7b568c0b8b1c?w=300&q=80",
      categoryId: "4",
      stock: 20,
    },
    {
      id: "11",
      name: "Lemon Tea",
      price: 10000,
      image:
        "https://images.unsplash.com/photo-1556679343-c1306ee6ac09?w=300&q=80",
      categoryId: "1",
      stock: 40,
    },
    {
      id: "12",
      name: "Ayam Goreng",
      price: 28000,
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&q=80",
      categoryId: "2",
      stock: 15,
    },
  ];

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  // Mobile sidebar for navigation
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <h1 className="text-xl font-bold">Point of Sale</h1>
          </div>

          {/* Mobile cart button */}
          {isMobile && (
            <Button
              onClick={() => setShowMobileCart(true)}
              variant="outline"
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>
          )}
        </header>

        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
          {/* Products section */}
          <div className="flex-1 flex flex-col gap-4">
            <ProductSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <ProductGrid products={filteredProducts} addToCart={addToCart} />
          </div>

          {/* Desktop cart */}
          {!isMobile && (
            <div className="w-full md:w-[350px] lg:w-[400px] bg-white rounded-lg shadow-sm">
              <ShoppingCart
                cartItems={cartItems}
                updateQuantity={updateCartItemQuantity}
                removeItem={removeFromCart}
                totalAmount={totalAmount}
              />
            </div>
          )}

          {/* Mobile cart (sheet) */}
          {isMobile && (
            <Sheet open={showMobileCart} onOpenChange={setShowMobileCart}>
              <SheetContent side="right" className="p-0 w-full sm:max-w-md">
                <ShoppingCart
                  cartItems={cartItems}
                  updateQuantity={updateCartItemQuantity}
                  removeItem={removeFromCart}
                  totalAmount={totalAmount}
                  onClose={() => setShowMobileCart(false)}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};

export default POS;
