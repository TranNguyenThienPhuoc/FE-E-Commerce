import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Heart, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Command, CommandInput } from "./ui/command";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated, isAdmin, canCreateProduct } =
    useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isSearchPage = location.pathname === "/search";

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            zopee
          </Link>

          <nav className="hidden md:flex items-center space-x-8 ">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              activeProps={{
                className: "text-gray-900 underline underline-offset-4",
              }}
            >
              Home
            </Link>
            <Link
              to="/"
              hash="#contact"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/"
              hash="#about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center gap-4 px-2">
            {!isSearchPage && (
              <div className="w-64">
                <Command className="rounded-lg border border-gray-300 shadow-sm">
                  <CommandInput
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        navigate({
                          to: "/search",
                          search: { q: searchQuery.trim() },
                        });
                      }
                    }}
                  />
                </Command>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Heart size={24} />
              </Button>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-gray-900 transition-colors relative"
                >
                  <ShoppingCart size={24} />
                  {getItemCount() > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {getItemCount() > 99 ? "99+" : getItemCount()}
                    </Badge>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {canCreateProduct && (
                      <DropdownMenuItem asChild>
                        <Link to="/sell" className="cursor-pointer">
                          Sell Product
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/products" className="cursor-pointer">
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/login">
                    <Button className="bg-red-500 hover:bg-red-600 px-6">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button
                      variant="outline"
                      className="px-6 border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
