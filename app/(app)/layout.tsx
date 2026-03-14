'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Home,
  LayoutDashboard,
  Video,
  Share2,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  Search
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/home',
    icon: <Home className="w-5 h-5" />,
    color: 'text-primary'
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    color: 'text-secondary'
  },
  {
    label: 'Video Upload',
    href: '/video-upload',
    icon: <Video className="w-5 h-5" />,
    color: 'text-accent'
  },
  {
    label: 'Social Share',
    href: '/social-share',
    icon: <Share2 className="w-5 h-5" />,
    color: 'text-info'
  }
];

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Mobile Header */}
      <div className="lg:hidden navbar bg-primary text-primary-content sticky top-0 z-50 shadow-lg">
        <div className="navbar-start">
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-circle"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <div className="navbar-center">
          <span className="text-xl font-bold">VideoSaaS</span>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-72 bg-base-100 shadow-2xl border-r border-primary/10
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo Section */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-base-300 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VideoSaaS
              </h1>
              <p className="text-xs text-base-content/60">Compress & Share</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <p className="px-4 text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-4">
              Main Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg shadow-primary/30 scale-[1.02]'
                      : 'hover:bg-base-200 hover:scale-[1.02]'
                    }
                  `}
                >
                  <span className={`${isActive ? 'text-primary-content' : item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-100/80 backdrop-blur">
            {/* Settings Link */}
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-base-200 transition-all mb-2"
            >
              <Settings className="w-5 h-5 text-base-content/70" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            {/* User Profile - Clerk Integrated */}
            <SignedIn>
              <UserProfileDisplay />
            </SignedIn>
              
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-base-200 transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold shadow-md">
                    <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">Sign In</p>
                      <p className="text-xs text-base-content/60">Click to login or register</p>
                    </div>
                    <LogOut className="w-4 h-4 text-base-content/50" />
                  </button>
                </SignInButton>
              </SignedOut>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen lg:ml-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-base-100/80 backdrop-blur sticky top-0 z-30 border-b border-base-300">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="btn btn-ghost btn-circle relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
              </button>

              {/* Theme Toggle */}
              <label className="swap swap-rotate btn btn-ghost btn-circle">
                <input type="checkbox" className="theme-controller" value="dark" />
                <svg className="swap-on w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                </svg>
                <svg className="swap-off w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                </svg>
              </label>

              {/* Upgrade Button */}
              <button className="btn btn-primary btn-sm gap-2 bg-gradient-to-r from-primary to-secondary border-0">
                <span className="text-xs">Upgrade</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Component to display user profile info
function UserProfileDisplay() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3 w-full p-3 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-base-300 rounded animate-pulse mb-2" />
          <div className="h-3 bg-base-300 rounded animate-pulse w-20" />
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
  const name = user.fullName || user.firstName || 'User';
  const imageUrl = user.imageUrl;
  
  return (
    <div className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-base-200 transition-all cursor-pointer" onClick={() => {
      const userButton = document.querySelector('.cl-userButtonTrigger') as HTMLElement;
      userButton?.click();
    }}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-base-content/60 truncate">{email}</p>
      </div>
      <div className="hidden">
        <UserButton />
      </div>
    </div>
  );
}
