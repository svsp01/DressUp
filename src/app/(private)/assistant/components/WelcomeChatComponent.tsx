import React from "react";
import {   MessagesSquare } from "lucide-react";

function WelcomeChatComponent() {
  return (
    <div className="flex flex-col h-full p-6 text-center">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Dress Up Assistant!
        </h1>
      </div>
      <div className="my-4 w-full flex justify-center">
        <MessagesSquare  className=" w-20 h-20 text-gray-800 " />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-lg text-gray-500">
          Your virtual wardrobe is here to help! Ask me anything about your
          outfits, get fashion tips, or manage your clothing items. Type your
          questions or commands below to get started.
        </p>
      </div>
    </div>
  );
}

export default WelcomeChatComponent;
