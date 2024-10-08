"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Plus, Trash2, Flag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import trendServices from "@/services/trendServices";
import { ScrollArea } from "@/components/ui/scroll-area";
import closetServices from "@/services/closetServices";

interface Trend {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  color: string;
  season: string;
  image: string;
  width: number;
  height: number;
  deleted?: boolean;
  reported?: boolean;
}

const TrendsScreen: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchTrends = async (page: number) => {
    try {
      const data = await trendServices.getAllTrends(page, 10);

      console.log(data?.result, ">>>");
      setTrends(data?.result?.data);
      setHasMore(data?.result.hasMore);
    } catch (error) {
      console.error("Error fetching trends:", error);
      toast({
        title: "Error",
        description: "Unable to fetch trends data.",
      });
    }
  };

  useEffect(() => {
    fetchTrends(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  const handleActionClick = (action: string, trend: Trend) => {
    setSelectedAction(action);
    setSelectedTrend(trend);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedAction === "delete") {
      try {
        await trendServices.deleteTrendById(`${selectedTrend?.id}` ?? "");
        setTrends((prevTrends) =>
          prevTrends.filter((trend) => trend.id !== selectedTrend?.id)
        );
        toast({
          title: "Trend Deleted",
          description: "The trend has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting trend:", error);
        toast({
          title: "Error",
          description: "Unable to delete the trend.",
        });
      }
    } else if (selectedAction === "report") {
      try {
        await trendServices.reportTrendById(
          `${selectedTrend?.id}` ?? "",
          feedback
        );
        setTrends((prevTrends) =>
          prevTrends.map((trend) =>
            trend.id === selectedTrend?.id
              ? { ...trend, reported: true }
              : trend
          )
        );
        toast({
          title: "Trend Reported",
          description: "Thank you for your report. We will review it shortly.",
        });
      } catch (error) {
        console.error("Error reporting trend:", error);
        toast({
          title: "Error",
          description: "Unable to report the trend.",
        });
      }
    } else if (selectedAction === "addToCloset") {
      await closetServices.AddCloset(selectedTrend);
      toast({
        title: "Added to Closet",
        description: "The trend has been successfully added to your closet.",
      });
    }
    setIsModalOpen(false);
    setFeedback("");
  };

  return (
    <div className="p-2 relative">
      <div className="text-2xl mb-4 text-white font-semibold">
        Trends in world
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-2">
        <AnimatePresence>
          {trends?.map((trend) => (
            <motion.div
              key={trend.id}
              className="relative mb-2 break-inside-avoid"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`${trend.image}`}
                alt={trend.title}
                style={{ width: trend.width, height: trend.height }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex flex-col justify-end items-center transition-opacity duration-300 p-2">
                <p className="text-white text-lg mb-2">{trend.title}</p>
                <div className="flex justify-around w-full space-x-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-gray-950 text-red-500"
                    onClick={() => handleActionClick("delete", trend)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActionClick("report", trend)}
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    report
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-gray-950"
                    onClick={() => handleActionClick("addToCloset", trend)}
                  >
                    <Plus className="w-4 h-4 " />
                  </Button>
                </div>
              </div>
              <Button
                className="absolute bg-gray-950 text-white hover:bg-gray-800 hover:text-white top-2 right-2"
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedTrend(trend);
                  setShowInfo(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
              {trend.deleted && (
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Check className="text-green-500" size={48} />
                </motion.div>
              )}
              {trend.reported && (
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertTriangle className="text-yellow-500" size={48} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div ref={loaderRef} className="h-10 w-full" />

      <AnimatePresence>
        {isModalOpen && (
          <Dialog onOpenChange={() => setIsModalOpen(false)} open={isModalOpen}>
            <DialogContent>
              <DialogHeader>
                {selectedAction === "report"
                  ? "Report Trend"
                  : "Confirm Action"}
              </DialogHeader>
              {selectedAction === "report" ? (
                <>
                  <p>
                    Please provide your feedback and reason for reporting this
                    trend:
                  </p>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your reason"
                    className="mt-2"
                  />
                </>
              ) : (
                <p>Are you sure you want to {selectedAction} this trend?</p>
              )}
              <DialogFooter>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmAction} className="ml-2">
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {showInfo && selectedTrend && (
          <Dialog onOpenChange={() => setShowInfo(false)} open={showInfo}>
            <DialogContent className="max-h-[90%]">
              <DialogHeader>Trend Information</DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ScrollArea className="h-[400px]">
                  <img
                    src={selectedTrend.image}
                    alt={selectedTrend.title}
                    className="w-full h-auto mb-2"
                  />
                  <p className="text-lg font-semibold">{selectedTrend.title}</p>
                  <p className="text-sm">{selectedTrend.description}</p>
                </ScrollArea>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrendsScreen;
