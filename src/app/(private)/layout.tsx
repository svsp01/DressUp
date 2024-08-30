import React from "react";
import {
  HomeIcon,
  UserIcon,
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import SideNav from "./components/SideNav";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-grow  bg-gray-950  p-6 md:overflow-y-auto md:p-12">
        {children}
      </main>
    </div>
  );
}

export default Layout;
