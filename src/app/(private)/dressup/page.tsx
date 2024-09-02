"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RefreshCw, Download, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dressUpServices from "@/services/dressUpServices";
import Image from "next/image";
import closetServices from "@/services/closetServices";
import { useToast } from "@/components/ui/use-toast";
import { useDynamicToast } from "@/lib/toastUtils";

interface Dress {
  _id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  type: string;
  color: string;
  season: string;
}

const VirtualWardrobeRoom: React.FC = () => {
  const [humanImage, setHumanImage] = useState<string | null>(null);
  // const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dressFileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useDynamicToast();

  const fetchAllItems = async () => {
    const fetchedItems: any = await closetServices.fetchItems();
    console.log(fetchedItems, "????");
    setWardrobe(fetchedItems?.data);
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const handleHumanImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setHumanImage(imageUrl);
    }
  };

  const handleDressSelect = (dress: Dress) => {
    // setSelectedDress(dress);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    dress: Dress
  ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(dress));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dressData = e.dataTransfer.getData("text");
    const dress: Dress = JSON.parse(dressData);
    if (humanImage) {
      // setSelectedDress(dress);
      handleTryOn(dress);
    } else {
      showToast(
        "Upload Your Photo First",
        "Please upload a photo of yourself before trying on clothes.",
        "destructive"
      );
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
  };
  const handleTryOn = async (dress: Dress) => {
    if (humanImage && dress) {
      setIsLoading(true);

      try {
        const humanBlob = await fetch(humanImage).then((res) => res.blob());
        const dressBlob = await fetch(dress.image).then((res) => res.blob());

        const humanBase64 = await blobToBase64(humanBlob);
        const dressBase64 = await blobToBase64(dressBlob);

        const result = await dressUpServices.dressUp({
          clothingItemId: dress._id,
          humanImage: humanBase64,
          dressImage: dressBase64,
        });
        if (result?.error?.queue) {
          showToast(
            "Service Overloaded",
            "The service is currently experiencing high traffic. Please try again later.",
            "destructive"
          );
        } else {
          setResultImage(result?.result?.data[0]?.url);
          setShowResults(true);
        }
      } catch (error: any) {
        console.log("Failed to process dress-up:", error);
        if (error?.queue) {
          showToast(
            "Service Overloaded",
            "The service is currently experiencing high traffic. Please try again later.",
            "destructive"
          );
        } else {
          showToast(
            "Error",
            "An error occurred while processing your request.",
            "destructive"
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const handleCameraCapture = () => {
  //   if (cameraInputRef.current) {
  //     cameraInputRef.current.click();
  //   }
  // };

  // const handleCameraInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     const newDress: Dress = { _id: Date.now().toString(), image:imageUrl };
  //     setWardrobe((prev) => [...prev, newDress]);
  //   }
  // };

  const handleDressUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await blobToBase64(file);

      const fileName = file.name.toLowerCase();
      const defaultTitle = fileName.split(".")[0];

      let category = "Unknown";
      let color = "Unknown";
      let season = "All Seasons";

      if (fileName.includes("summer")) {
        category = "Dress";
        season = "Summer";
      } else if (fileName.includes("winter")) {
        category = "Jacket";
        season = "Winter";
      } else if (fileName.includes("red")) {
        color = "Red";
      } else if (fileName.includes("blue")) {
        color = "Blue";
      }
      const newDress: Dress = {
        title: defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1),
        description: "A beautiful piece from your wardrobe.",
        category: category,
        type: "Casual",
        color: color,
        season: season,
        image: imageUrl,
      };

      await closetServices.AddCloset(newDress);
      await fetchAllItems();

      setWardrobe((prev) => [...prev, newDress]);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = "virtual-try-on.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container text-white mx-auto p-6 max-w-6xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-8 text-gradient"
      >
        Virtual Wardrobe Room
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-gray-900 border-none text-white ">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Wardrobe</h2>
            <div className="grid grid-cols-3 p-10 scroll gap-4 max-h-96 overflow-y-auto">
              {wardrobe?.map((dress) => (
                <motion.div
                  key={dress.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-move"
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, dress)}
                  onClick={() => handleDressSelect(dress)}
                >
                  <img
                    src={dress.image}
                    alt={`Dress ${dress.id}`}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                onClick={() => dressFileInputRef.current?.click()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Dress
              </Button>
              {/* <Button
                onClick={handleCameraCapture}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Camera className="mr-2 h-4 w-4" /> Take Photo
              </Button> */}
            </div>
            <input
              type="file"
              ref={dressFileInputRef}
              onChange={handleDressUpload}
              accept="image/*"
              className="hidden"
            />
            {/* <input
              type="file"
              ref={cameraInputRef}
              onChange={handleCameraInput}
              accept="image/*"
              capture="environment"
              className="hidden"
            /> */}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-none text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Try It On</h2>
            <div
              className="h-96 bg-gray-950 rounded-lg flex items-center justify-center overflow-hidden relative"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {humanImage ? (
                <>
                  <img
                    src={humanImage}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Your Photo
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleHumanImageUpload}
              accept="image/*"
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="text-white text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 mb-4" />
              </motion.div>
              <p className="text-xl">Magic in progress...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Virtual Try-On</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img
              loading="lazy"
              src={resultImage || ""}
              alt="Result"
              className="w-full h-auto rounded-lg"
              // placeholder="blur"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => setShowResults(false)} variant="outline">
              Try Another
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VirtualWardrobeRoom;
