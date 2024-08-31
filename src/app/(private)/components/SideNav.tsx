"use client";

import { Button } from "@/components/ui/button";
import handleLogout from "@/lib/authUtils";
import {
  ChatBubbleLeftIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ConfirmationModal from "./ReusableComponents/ConfirmationModel";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/assets/Logo.jpg";

function SideNav() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmLogout = () => {
    handleLogout(router);
    handleCloseModal();
  };

  return (
    <aside className="min-w-64 border-r  bg-gray-950 text-gray-100 flex flex-col shadow-xl">
      <div className="flex  rounded-b-none items-center justify-start pl-8 gap-2 h-16 bg-gray-950 border-b shadow-xl">
        <Avatar>
          <AvatarImage
            src="https://res.cloudinary.com/dp0oybgbl/image/upload/v1725040878/Logo_umkvjx.jpg"
            alt="logo image of Dress up"
          />
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
        <Link href="/" className="text-xl font-serif font-bold text-white">
          Dress Up
        </Link>
      </div>

      <nav className="flex flex-col flex-grow p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <HomeIcon className="w-6 h-6 mr-3" />
          Home
        </Link>
        <Link
          href="/dressup"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <ShoppingBagIcon className="w-6 h-6 mr-3" />
          Virtual Try-On
        </Link>
        <Link
          href="/recommendations"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <SparklesIcon className="w-6 h-6 mr-3" />
          Style
        </Link>
        <Link
          href="/assistant"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <ChatBubbleLeftIcon className="w-6 h-6 mr-3" />
          Assistant
        </Link>
        <Link
          href="/closet"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <ArchiveBoxIcon className="w-6 h-6 mr-3" />
          My Closet
        </Link>
        <Link
          href="/profile"
          className="flex items-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <UserIcon className="w-6 h-6 mr-3" />
          Profile
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link
          href="/settings"
          className="flex items-center justify-center px-4 py-2 text-gray-200 hover:bg-blue-600 hover:text-white rounded-md"
        >
          <CogIcon className="w-6 h-6 mr-3" />
          Settings
        </Link>
        <Button
          onClick={handleOpenModal}
          variant="default"
          className="w-full mt-2 bg-blue-600 text-white"
        >
          Logout
        </Button>

        <ConfirmationModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </aside>
  );
}

export default SideNav;
