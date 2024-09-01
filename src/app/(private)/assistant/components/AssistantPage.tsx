"use client";
import React, { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Image,
  MessageSquare,
  SendHorizontalIcon,
  HelpCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import chatServices from "@/services/chatServices";
import WelcomeChatComponent from "./WelcomeChatComponent";
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
const AssistantPage = () => {
  const [activeTab, setActiveTab] = useState("text-to-text");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [responseImage, setResponseImage] = useState<any>(null);
  const [analysedRespose, setAnalysedRespose] = useState<any>("");

  const fileInputRef = useRef<any>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "user", content: input };
    setChatHistory((prev: any) => [...prev, newMessage]);

    try {
      let payload = { message: input, Aitype: "", body: {} };

      switch (activeTab) {
        case "text-to-text":
          payload.Aitype = "texttotext";
          break;
        case "text-to-image":
          payload.Aitype = "texttoimage";
          break;
        case "image-text-to-text":
          payload.Aitype = "imageclassification";
          payload.body = { dressImage: imagePreview };
          break;
        default:
          throw new Error("Invalid AI type");
      }

      const aiResponse = await chatServices.Chat(payload);
      const aiMessage = { type: "ai", content: aiResponse.result.data };
      if ((payload.Aitype = "texttoimage")) {
        setResponseImage(aiResponse?.result?.data[0]?.url);
      }
      if ((payload.Aitype = "imageclassification")) {
        setAnalysedRespose(aiResponse?.result?.data[0]);
      }

      setChatHistory((prev: any) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error during chat:", error);
      const errorMessage = {
        type: "ai",
        content: error.message || "Failed to get AI response",
      };
      setChatHistory((prev: any) => [...prev, errorMessage]);
    } finally {
      setInput("");
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const renderHelpContent = () => {
    switch (activeTab) {
      case "text-to-text":
        return "Chat with our AI to get fashion advice, outfit ideas, or descriptions for your closet items.";
      case "text-to-image":
        return "Describe an outfit or clothing item, and our AI will generate an image based on your description.";
      case "image-text-to-text":
        return "Upload an image of an outfit or item, then ask questions or get styling advice related to it.";
      default:
        return "Select a tab to get started with our AI assistant.";
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <header className="p-4 bg-gray-950">
        <h1 className="text-2xl font-bold">Virtual Try-On Assistant</h1>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-950">
          <TabsTrigger
            value="text-to-text"
            className="data-[state=active]:bg-gray-700"
          >
            <MessageSquare className="mr-2" />
            Chat Assistant
          </TabsTrigger>
          <TabsTrigger
            value="text-to-image"
            className="data-[state=active]:bg-gray-700"
          >
            <Image className="mr-2" />
            Image Generator
          </TabsTrigger>
          <TabsTrigger
            value="image-text-to-text"
            className="data-[state=active]:bg-gray-700"
          >
            <Camera className="mr-2" />
            Image Analyzer
          </TabsTrigger>
        </TabsList>

        <div className="px-10">
          <Alert variant="default" className="my-4 bg-transparent text-white">
            <HelpCircle color="white" className="h-4 w-4" />
            <AlertTitle>How to use this feature</AlertTitle>
            <AlertDescription>{renderHelpContent()}</AlertDescription>
          </Alert>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "text-to-text" && (
            <motion.div
              key="text-to-text"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col p-4"
            >
              {chatHistory.length > 0 ? (
                <ScrollArea className="mb-4 h-[400px] bg-gray-900 rounded-lg p-4">
                  {chatHistory.map((msg: any, index: any) => (
                    <div
                      key={index}
                      className={`mb-2 ${
                        msg.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`inline-block p-2 rounded-lg ${
                          msg.type === "user" ? "bg-blue-600" : "bg-gray-700"
                        }`}
                      >
                        {msg.content}
                      </motion.span>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <ScrollArea className="mb-4 h-[400px] bg-gray-900 rounded-lg p-4">
                  <WelcomeChatComponent />
                </ScrollArea>
              )}

              <div className="flex">
                <Input
                  placeholder="Ask about fashion, outfits, or your closet..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="flex-grow mr-2 bg-gray-950"
                />
                <Button onClick={handleSubmit}>
                  <SendHorizontalIcon />
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "text-to-image" && (
            <motion.div
              key="text-to-image"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col p-4"
            >
              <Textarea
                placeholder="Describe the outfit or item you want to generate..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mb-4 bg-gray-950"
              />
              <Button onClick={handleSubmit}>Generate Image</Button>
              {responseImage && (
                <img src={responseImage} className="w-[300px] pt-10" />
              )}
            </motion.div>
          )}

          {activeTab === "image-text-to-text" && (
            <motion.div
              key="image-text-to-text"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col p-4"
            >
              <div className="mb-4">
                <Button onClick={() => fileInputRef.current.click()}>
                  Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>
              <div className="flex gap-4">
                {imagePreview && (
                  <motion.img
                    src={imagePreview}
                    alt="Uploaded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 max-w-[300px] h-auto rounded-lg"
                  />
                )}
                {analysedRespose && (
                  <div>
                    <div className="text-xl font-mono">Analysed data</div>
                    <ScrollArea className="h-[200px] ">
                      <p className="pt-5">{analysedRespose}</p>
                    </ScrollArea>
                  </div>
                )}
              </div>
              <Textarea
                placeholder="Ask about the uploaded image or request styling advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mb-4 bg-gray-950"
              />
              <Button onClick={handleSubmit}>Analyze</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default AssistantPage;
