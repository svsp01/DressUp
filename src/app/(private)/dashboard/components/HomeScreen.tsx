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
  Check,
  Facebook,
  Twitter,
  Copy,
  CopyCheck,
  Loader2,
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
import StackLoader from "./StackLoader";

const HomeScreen: React.FC = () => {
  const [aiGenerations, setAiGenerations] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>([]);
  const [mostUsed, setMostUsed] = useState([]);
  const [notifications] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    ai: true,
    trends: true,
    mostUsed: true,
    season: false,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [viewImage, setViewImage] = useState<any>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isFacebookShared, setIsFacebookShared] = useState(false);
  const [isTwitterShared, setIsTwitterShared] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<any>(null);

  const router = useRouter();
  const currentSeason = "Autumn";
  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      selectedUrl
    )}`;
    window.open(facebookShareUrl, "_blank");
    setIsFacebookShared(true);
    setTimeout(() => {
      setIsFacebookShared(false);
    }, 1000);
  };

  const handleShareTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      selectedUrl
    )}&text=Check%20this%20out!`;
    window.open(twitterShareUrl, "_blank");
    setIsTwitterShared(true);
    setTimeout(() => {
      setIsTwitterShared(false);
    }, 1000);
  };

  const fetchAiGenerations = async () => {
    setIsLoading((prevState) => ({ ...prevState, ai: true }));
    try {
      const data = await aiServices.GetAiGenerations();
      console.log(data.aiGenerations[0]?.aiResponse?.data[0]?.url, ">>>");
      setAiGenerations(data.aiGenerations);
    } catch (error) {
      console.error("Error fetching AI generations:", error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, ai: false }));
    }
  };

  const fetchTrends = async () => {
    setIsLoading((prevState) => ({ ...prevState, trends: true }));
    try {
      const { result } = await trendServices.getAllTrends(1, 5);
      setTrends(result?.data || []);
    } catch (error) {
      console.error("Error fetching trends:", error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, trends: false }));
    }
  };

  const fetchAllCloset = async () => {
    setIsLoading((prevState) => ({ ...prevState, mostUsed: true }));
    try {
      const fetchedItems: any = await closetServices.fetchItems();

      const filteredAndSortedItems = fetchedItems?.data
        .filter((item: any) => item.usageCount > 0)
        .sort((a: any, b: any) => b.usageCount - a.usageCount);

      setMostUsed(filteredAndSortedItems);
    } catch (error) {
      console.error("Failed to fetch closet items:", error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, mostUsed: false }));
    }
  };
  const handleDownload = () => {
    if (selectedUrl) {
      const link = document.createElement("a");
      link.href = selectedUrl;
      link.target = "_blank";
      link.setAttribute("download", "DressUpImg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    fetchAiGenerations();
    fetchAllCloset();
    fetchTrends();
  }, []);

  const navigateTo = (screen: string) => router.push(`/${screen}`);

  const handleShareClick = (url: any) => {
    setSelectedUrl(url);
    setShareModalOpen(true);
  };
  const handleDownloadClick = (url: any) => {
    setSelectedUrl(url);

    setDownloadModalOpen(true);
  };
  const handleImageClick = (imgUrl: string) => setViewImage(imgUrl);
  const handleCopyLink = () => {
    if (selectedUrl) {
      navigator.clipboard.writeText(selectedUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000); // Reset the animation after 1 second
      });
    }
  };
  return (
    <div className="p-4 space-y-6 bg-gray-950 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex text-black space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-transparent text-white">
                <Bell className="w-5  h-5" />
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
        {isLoading.ai ? (
          <div className="flex w-full justify-center">
            {/* <StackLoader/> */}
            <StackLoader type="ai" />
          </div>
        ) : (
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
                          onClick={() =>
                            handleDownloadClick(
                              dressUp?.additionalData?.imageUrl
                            )
                          }
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleShareClick(dressUp?.additionalData?.imageUrl)
                          }
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
        )}
      </section>

      {/* Latest Trends */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Latest Trends</h2>
        {isLoading.trends ? (
          <div className="flex w-full justify-center">
            <StackLoader type="trends" />
          </div>
        ) : (
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
        )}
      </section>

      {/* Most Used */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Most Used</h2>
        {isLoading.mostUsed ? (
          <div className="flex w-full justify-center">
            <StackLoader type='mostUsed' />
          </div>
        ) : (
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShareClick(item.image)}
                  >
                    <Share2Icon className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Seasonal Picks */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">{currentSeason} Picks</h2>
        {isLoading.trends ? (
          <div className="flex w-full justify-center">
            <StackLoader type='seasonalTrends' />
          </div>
        ) : (
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShareClick(trend.image)}
                  >
                    <Share2Icon className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog
        open={shareModalOpen}
        onOpenChange={() => setShareModalOpen(!shareModalOpen)}
      >
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
            <DialogDescription>
              Share this content on social media or copy the link.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex gap-2">
            {/* Share options */}
            <Button
              variant="ghost"
              className="flex gap-2"
              onClick={handleShareFacebook}
            >
              {isFacebookShared ? (
                <div className="icon-animation flex gap-2 items-center">
                  <Check className="w-4 h-4" /> Shared on Facebook!
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Facebook className="w-4 h-4" /> Share on Facebook
                </div>
              )}
            </Button>
            <Button
              variant="ghost"
              className="flex gap-2"
              onClick={handleShareTwitter}
            >
              {isTwitterShared ? (
                <div className="icon-animation  flex gap-2 items-center">
                  <Check className="w-4 h-4" /> Shared on Twitter!
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Twitter className="w-4 h-4" /> Share on Twitter
                </div>
              )}
            </Button>
            <Button
              variant="ghost"
              className="flex w-full gap-2"
              onClick={handleCopyLink}
            >
              {isCopied ? (
                <div className="icon-animation flex gap-2 items-center">
                  <CopyCheck className="w-4 h-4" /> Copied!
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Copy className="w-4 h-4" /> Copy Link
                </div>
              )}
            </Button>
          </div>
          <DialogFooter className="w-full flex justify-end">
            <Button variant="outline">Close</Button>
          </DialogFooter>
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
