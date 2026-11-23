"use client";

import { authClient } from "@/lib/auth-client";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Guest Navigation
const guestLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Find Vendors", href: "/vendors" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// User Navigation
const userLinks = [
  { name: "Home", href: "/" },
  { name: "Find Vendors", href: "/all-services" },
  { name: "My Bookings", href: "/user/my-bookings" },
  { name: "Dashboard", href: "/user/dashboard" },
];

// Vendor Navigation
const vendorLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/vendor/dashboard" },
  { name: "My Services", href: "/vendor/dashboard/services" },
  { name: "Booking Requests", href: "/vendor/dashboard/bookings" },
  { name: "Reviews", href: "/vendor/dashboard/reviews" },
];

// Admin Navigation
const adminLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/admin" },
  { name: "Services", href: "/admin/services" },
  { name: "Transactions", href: "/admin/transactions" },
  { name: "Users", href: "/admin/users" },
];

// Main Navbar Component
function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckPending, setAdminCheckPending] = useState(true);

  const { data: session, isPending } = authClient.useSession();

  const currentUser = session?.user;

  const pathname = usePathname();
  const router = useRouter();

  const accountType = currentUser?.accountType?.toLowerCase();

  // Verify Admin
  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      if (!currentUser?.id) {
        setIsAdmin(false);
        setAdminCheckPending(false);
        return;
      }

      setAdminCheckPending(true);

      try {
        const response = await fetch("/api/auth/check-admin", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (isMounted) {
          setIsAdmin(response.ok && result.success && result.isAdmin);
        }
      } catch (error) {
        console.error("Admin verification failed:", error);

        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setAdminCheckPending(false);
        }
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // Select Navigation
  const navLinks = !currentUser
    ? guestLinks
    : adminCheckPending
      ? []
      : isAdmin
        ? adminLinks
        : accountType === "vendor"
          ? vendorLinks
          : accountType === "user"
            ? userLinks
            : guestLinks;

  // Check Active Route
  const isActive = (href) => pathname === href;

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsOpen(false);
      setProfileOpen(false);

      await authClient.signOut();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close Mobile Menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  if (isPending || (currentUser && adminCheckPending)) {
    return (
      <header className="sticky top-0 z-50 h-[73px] border-b border-rose-100 bg-white/95" />
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Heart size={21} fill="currentColor" />
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Wed<span className="text-rose-600">Plan</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-2 text-sm font-semibold transition duration-300 ${
                isActive(link.href)
                  ? "text-rose-600"
                  : "text-gray-600 hover:text-rose-600"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-rose-600" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {!currentUser ? (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-rose-50 hover:text-rose-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-rose-700 hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Profile Dropdown Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-rose-100 px-3 py-2 transition hover:bg-rose-50"
              >
                {currentUser.image ? (
                  <Image
                    src={currentUser.image}
                    alt={currentUser.name || "User"}
                    width={100}
                    height={100}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <UserRound size={19} />
                  </div>
                )}

                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser.name || "My Account"}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {accountType}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <Link
                    href={
                      accountType === "vendor"
                        ? "/vendor/dashboard"
                        : "/profile"
                    }
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LayoutDashboard size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-rose-50 lg:hidden"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-rose-100 bg-white transition-all duration-300 ease-in-out lg:hidden ${
          isOpen
            ? "max-h-[650px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {/* Mobile User Information */}
          {currentUser && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-rose-50 p-4">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name || "User"}
                  width={100}
                  height={100}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <UserRound size={19} />
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {currentUser.name || "My Account"}
                </p>

                <p className="text-xs capitalize text-rose-600">
                  {accountType}
                </p>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Authentication */}
          <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-4">
            {!currentUser ? (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-full border border-rose-200 px-5 py-3 text-center text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-full bg-rose-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    accountType === "vendor" ? "/vendor/dashboard" : "/profile"
                  }
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <UserRound size={17} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-full bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Navbar with Suspense Boundary
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 h-[73px] border-b border-rose-100 bg-white/95" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
