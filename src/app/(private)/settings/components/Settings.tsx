"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const [selectedModel, setSelectedModel] = useState("DressTrial");
  const [resolution, setResolution] = useState(1080);
  const [realism, setRealism] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  return (
    <div className="container text-white mx-auto px-4 py-8 bg-gray-900 rounded-xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-medium">AI Model Configuration</h2>

          <div className="">
            <label className="block text-sm font-medium mb-2">
              Choose Model
            </label>
            <Select onValueChange={(value) => setSelectedModel(value)}>
              <SelectTrigger className="w-[220px] bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select">{selectedModel}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectGroup>
                  <SelectItem value="DressTrial">Dress Trial Model</SelectItem>
                  <SelectItem value="TextToText">Text to Text</SelectItem>
                  <SelectItem value="TextToImage">Text to Image</SelectItem>
                  <SelectItem value="ImageToText">Image to Text</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Model Settings</h2>

          {selectedModel === "DressTrial" && (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
              <p className="text-sm text-gray-400 mb-4">
                Configure the Dress Trial Model, optimized for virtual try-ons
                and real-time fitting analysis.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Image Resolution
                </label>
                <Select onValueChange={(value: any) => setResolution(value)}>
                  <SelectTrigger className="w-[220px] bg-gray-700 text-white">
                    <SelectValue placeholder="Select">
                      {resolution}p
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectGroup>
                      <SelectItem value={`${720}`}>720p</SelectItem>
                      <SelectItem value={`${1080}`}>1080p</SelectItem>
                      <SelectItem value={`${1440}`}>1440p</SelectItem>
                      <SelectItem value={`${2160}`}>2160p (4K)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Realism Mode</label>
                <Switch
                  checked={realism}
                  onCheckedChange={setRealism}
                  className="bg-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Animation Speed
                </label>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value: any) => setAnimationSpeed(value)}
                  min={10}
                  max={100}
                  step={5}
                  className="bg-gray-700"
                />
                <p className="text-sm text-gray-400 mt-2">{animationSpeed}%</p>
              </div>
            </div>
          )}

          {selectedModel === "TextToText" && (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
              <p className="text-sm text-gray-400">
                Configure settings for the Text to Text model, focusing on
                natural language processing and text generation.
              </p>
            </div>
          )}

          {selectedModel === "TextToImage" && (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
              <p className="text-sm text-gray-400">
                Configure settings for the Text to Image model, used for
                generating images from text descriptions.
              </p>
            </div>
          )}

          {selectedModel === "ImageToText" && (
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
              <p className="text-sm text-gray-400">
                Configure settings for the Image to Text model, which extracts
                text from images.
              </p>
              {/* Additional settings can be added here */}
            </div>
          )}
        </div>

        {/* Performance Settings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Performance Settings</h2>
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                GPU Acceleration
              </label>
              <Switch
                className="bg-gray-700"
                // add functionality to toggle GPU settings
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Memory Usage Limit
              </label>
              <Input
                type="number"
                placeholder="Enter memory limit in MB"
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <Button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
