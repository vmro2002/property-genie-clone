import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  aiDescriptionSchema,
  type AiDescriptionValues,
} from "@/schemas/aiDescriptionSchema";

export function useAiGeneration() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors: formErrors },
  } = useForm<AiDescriptionValues>({
    resolver: zodResolver(aiDescriptionSchema),
  });

  const mutation = useMutation({
    mutationFn: async (description: string) => {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error ?? "Something went wrong. Please try again.",
        );
      }

      return res.json();
    },
    onSuccess: (data) => {
      // Build query object, stripping zeros and empty arrays
      const query: Record<string, string | string[] | number | number[]> = {};

      if (data.section) query.section = data.section;
      if (data.minPrice > 0) query.minPrice = data.minPrice;
      if (data.maxPrice > 0) query.maxPrice = data.maxPrice;
      if (data.categories) query.categories = data.categories;
      if (data.bedRooms?.length) query.bedRooms = data.bedRooms;
      if (data.bathRooms?.length) query.bathRooms = data.bathRooms;
      if (data.furnishings?.length) query.furnishings = data.furnishings;

      router.push({
        pathname: router.pathname,
        query,
      });

      setModalOpen(false);
      reset();
    },
    onError: (err: Error) => {
      setError("description", { message: err.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data.description);
  });

  return {
    modalOpen,
    setModalOpen,
    register,
    handleSubmit,
    onSubmit,
    formErrors,
    mutation,
  };
}
