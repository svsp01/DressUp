import React from "react";
import { BotIcon, Brain, Cpu, LandPlot, TrendingUp } from "lucide-react";
import { CpuChipIcon } from "@heroicons/react/24/outline";

const loaderConfig: any = {
  ai: {
    icons: [
      <Brain key={"Brain"} className="animate-pulse w-8 h-8 text-gray-500" />,
      <Cpu key={"Cpu"} className="animate-pulse w-8 h-8 text-gray-500" />,
    ],
    title: "AI Generations",
  },
  trends: {
    icons: [
      <TrendingUp
        key={"trending"}
        className="animate-pulse w-8 h-8 text-yellow-500"
      />,
      <CpuChipIcon
        key={"CpuChipIcon"}
        className="animate-pulse w-8 h-8 text-purple-500"
      />,
    ],
    title: "Trends",
  },
  mostUsed: {
    icons: [
      <BotIcon
        key={"BotIcon"}
        className="animate-pulse w-8 h-8 text-red-500"
      />,
      <Cpu
        key={"trending BotIcon"}
        className="animate-pulse w-8 h-8 text-gray-500"
      />,
    ],
    title: "Most Used",
  },
  seasonalTrends: {
    icons: [
      <LandPlot
        key={"trending"}
        className="animate-pulse w-8 h-8 text-teal-500"
      />,
      <Brain
        key={"trending"}
        className="animate-pulse w-8 h-8 text-orange-500"
      />,
    ],
    title: "Seasonal Trends",
  },
};

function StackLoader({ type }: any) {
  const loader = loaderConfig[type] || loaderConfig.ai;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
      <h2 className="text-lg font-semibold mb-2">{loader.title}</h2>
      <div className="flex items-center space-x-4">{loader.icons}</div>
    </div>
  );
}

export default StackLoader;
