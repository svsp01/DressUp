'use client'

import { useToast } from "@/components/ui/use-toast";

export const useDynamicToast = () => {
  const { toast } = useToast();

  const showToast = (title: string, description: string, variant: "default" | "destructive" | null | undefined = "default") => {
    toast({
      title,
      description,
      variant
    });
  };

  return { showToast };
};
