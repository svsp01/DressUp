"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Bell,
  MessageSquare,
  PlusCircle,
  Wand2,
  MessageCircle,
  TrendingUp,
  DownloadIcon,
  Share2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import trendServices from "@/services/trendServices";
import closetServices from "@/services/closetServices";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import aiServices from "@/services/aiServices";
import Image from "next/image";

const HomeScreen: React.FC = () => {
  const [aiGenerations, setAiGenerations] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>([]);
  const [mostUsed, setMostUsed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiQueries, setAiQueries] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [viewImage, setViewImage] = useState<any>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const router = useRouter();
  const currentSeason = "Autumn";

  const fetchAiGenerations = async () => {
    try {
      const data = await aiServices.GetAiGenerations();
      console.log(data.aiGenerations[0]?.aiResponse?.data[0]?.url, ">>>");
      setAiGenerations(data.aiGenerations);
    } catch (error: any) {
      console.error("Error fetching trends:", error);

      // setError(error.message);
    } finally {
      // setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const { result } = await trendServices.getAllTrends(1, 5);
      setTrends(result?.data || []);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  const fetchAllCloset = async () => {
    try {
      const fetchedItems: any = await closetServices.fetchItems();

      const filteredAndSortedItems = fetchedItems?.data
        .filter((item: any) => item.usageCount > 0)
        .sort((a: any, b: any) => b.usageCount - a.usageCount);

      setMostUsed(filteredAndSortedItems);
    } catch (error) {
      console.error("Failed to fetch closet items:", error);
    }
  };

  const handleDownload = () => {};

  useEffect(() => {
    fetchAiGenerations();
    fetchAllCloset();
    fetchTrends();
  }, []);

  const navigateTo = (screen: string) => router.push(`/${screen}`);

  const handleShareClick = () => setShareModalOpen(true);
  const handleDownloadClick = () => setDownloadModalOpen(true);
  const handleImageClick = (imgUrl: string) => setViewImage(imgUrl);

  return (
    <div className="p-4 space-y-6 bg-gray-950 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex text-black space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <Bell className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {notifications.length ? (
                notifications.map((notif, index) => (
                  <DropdownMenuItem key={index} className="p-2">
                    {notif}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="p-2">
                  No Notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {aiQueries.length ? (
                aiQueries.map((query, index) => (
                  <DropdownMenuItem key={index} className="p-2">
                    {query}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="p-2">
                  No Recent AI Queries
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-4">
        <Button
          size="lg"
          variant="outline"
          className="flex gap-2 bg-black text-white items-center py-4"
          onClick={() => navigateTo("dressup")}
        >
          <Wand2 className="w-4 h-4" />
          Try-On
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex bg-black gap-2 items-center py-4"
          onClick={() => navigateTo("recommendations")}
        >
          <TrendingUp className="w-4 h-4" />
          Trends
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex bg-black text-white gap-2 items-center py-4"
          onClick={() => navigateTo("assistant")}
        >
          <MessageCircle className="w-4 h-4" />
          AI Chat
        </Button>
      </section>

      {/* Recent Dress-Ups */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your Recent Ai Generations</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {aiGenerations.map((dressUp: any) => (
              <CarouselItem
                key={dressUp._id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <img
                      
                      src={dressUp?.additionalData?.imageUrl}
                      // src="https://multimodalart-flux-1-merged.hf.space/file=/tmp/gradio/8a5368dd1722261be88d26d059226f84d95188e7/image.webp"
                      alt={dressUp?.prompt}
                      className="rounded-t-lg w-full h-[200px] object-cover cursor-pointer"
                      onClick={() =>
                        handleImageClick(dressUp?.additionalData?.imageUrl)
                      }
                    />
                  </CardContent>
                  <CardFooter className="p-2 flex text-white justify-between items-center">
                    <span>{dressUp?.prompt}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDownloadClick}
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleShareClick}
                      >
                        <Share2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black" />
          <CarouselNext className="text-black" />
        </Carousel>
      </section>

      {/* Latest Trends */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Latest Trends</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trends.map((trend: any) => (
            <motion.div
              key={trend.id}
              className="relative rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={trend?.image}
                alt={trend?.title}
                className="w-full h-[250px] object-cover"
                onClick={() => handleImageClick(trend?.image)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
                <span className="max-w-15 truncate">{trend?.title}</span>
                <Button
                  disabled
                  size="sm"
                  className="flex gap-2"
                  variant="secondary"
                >
                  Add To Closet
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Most Used */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Most Used</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {mostUsed.map((item: any) => (
            <Card
              key={item.id}
              className="w-[200px] flex-shrink-0 bg-gray-800 border-gray-700"
            >
              <CardContent className="p-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-t-lg w-full h-[150px] object-cover cursor-pointer"
                  onClick={() => handleImageClick(item.image)}
                />
              </CardContent>
              <CardFooter className="p-2 flex text-white justify-between items-center">
                <span>{item.title}</span>
                <Button size="sm" variant="ghost" onClick={handleShareClick}>
                  <Share2Icon className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Seasonal Picks */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">{currentSeason} Picks</h2>
        <div className="grid grid-cols-2 gap-4">
          {trends.slice(0, 2).map((trend: any) => (
            <Card key={trend.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <img
                  src={trend.image}
                  alt={trend.title}
                  className="rounded-t-lg w-full h-[200px] object-cover cursor-pointer"
                  onClick={() => handleImageClick(trend.image)}
                />
              </CardContent>
              <CardFooter className="p-2 flex text-white justify-between items-center">
                <span>{trend.title}</span>
                <Button size="sm" variant="ghost" onClick={handleShareClick}>
                  <Share2Icon className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Dialog
        open={shareModalOpen}
        onOpenChange={() => setShareModalOpen(!shareModalOpen)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
            <DialogDescription>
              Share this content on social media or copy the link.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            {/* Share options */}
            <Button variant="ghost">Share on Facebook</Button>
            <Button variant="ghost">Share on Twitter</Button>
            <Button variant="ghost">Copy Link</Button>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog
        open={downloadModalOpen}
        onOpenChange={() => setDownloadModalOpen(!downloadModalOpen)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Content</DialogTitle>
            <DialogDescription>
              Click the button below to download the content.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4"></div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button variant="default" onClick={handleDownload}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewImage !== null}
        onOpenChange={() => setViewImage(viewImage ? null : viewImage)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Content</DialogTitle>
            <DialogDescription>
              Here you can view the detailed content.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <img src={viewImage} alt="Image" className="w-full h-auto" />
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeScreen;
