"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Wand2Icon,
  ClipboardType,
  DownloadIcon,
  Share2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import trendServices from "@/services/trendServices";
import closetServices from "@/services/closetServices";

interface DressUp {
  id: number;
  title: string;
  imgUrl: string;
}
const generateDummyData = (
  count: number,
  type: "dressUp" | "trend"
): DressUp[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${type === "dressUp" ? "Dress-Up" : "Trend"} ${i + 1}`,
    imgUrl: `https://picsum.photos/${300 + i}/${400 + i}`,
  }));
};

const HomeScreen: React.FC = () => {
  const [dressUps] = useState<DressUp[]>(
    generateDummyData(5, "dressUp") as DressUp[]
  );
  const [trends, setTrends] = useState<any[]>([]);
  const [mostUsed, setMostUsed] = useState<any[]>([]);
  const router = useRouter();
  const currentSeason = "Autumn";

  const fetchTrends = async (page: number) => {
    try {
      const data = await trendServices.getAllTrends(page, 5);

      console.log(data?.result, ">>>");
      setTrends(data?.result?.data);
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

  useEffect(() => {
    fetchAllCloset();
  }, []);
  useEffect(() => {
    fetchTrends(1);
  }, []);
  const navigateTo = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <div className="p-4 space-y-6 bg-gray-950 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex text-black space-x-4">
          <Button size="icon" variant="outline">
            <Bell className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline">
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-4">
        <Button
          size="lg"
          variant="outline"
          className="flex gap-2 bg-black text-white  items-center py-4"
          onClick={() => navigateTo("dressup")}
        >
          <Wand2 className="w-4  h-4 " />
          Try-On
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex bg-black gap-2 items-center py-4"
          onClick={() => navigateTo("recommendations")}
        >
          <TrendingUp className="w-4  h-4 " />
          Trends
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex bg-black text-white gap-2 items-center py-4"
          onClick={() => navigateTo("assistant")}
        >
          <MessageCircle className="w-4  h-4 " />
          AI Chat
        </Button>
      </section>

      {/* Recent Dress-Ups */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your Recent Dress-Ups</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {dressUps?.map((dressUp) => (
              <CarouselItem
                key={dressUp.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <img
                      src={dressUp.imgUrl}
                      alt={dressUp.title}
                      className="rounded-t-lg w-full h-[200px] object-cover"
                    />
                  </CardContent>
                  <CardFooter className="p-2 flex text-white justify-between items-center">
                    <span>{dressUp.title}</span>
                    <div>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
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
          {trends?.map((trend) => (
            <motion.div
              key={trend.id}
              className="relative rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-[250px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
                <span className="max-w-15 truncate">{trend.title}</span>
                <Button size="sm" className="flex gap-2" variant="secondary">
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
          {mostUsed?.map((item) => (
            <Card
              key={item.id}
              className="w-[200px] flex-shrink-0 bg-gray-800 border-gray-700"
            >
              <CardContent className="p-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-t-lg w-full h-[150px] object-cover"
                />
              </CardContent>
              <CardFooter className="p-2 flex text-white justify-between items-center">
                <span>{item.title}</span>
                <Button size="sm" variant="ghost">
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
          {trends?.slice(0, 2).map((trend) => (
            <Card key={trend.id} className="w-full bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <img
                  src={trend.image}
                  alt={trend.title}
                  className="rounded-t-lg w-full h-[200px] object-cover"
                />
              </CardContent>
              <CardFooter className="flex-col py-2 items-start">
                <h3 className="text-lg text-white font-bold">{trend.title}</h3>
                <p className="text-gray-400">
                  Check out the latest in {trend.title} for {currentSeason}.
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
