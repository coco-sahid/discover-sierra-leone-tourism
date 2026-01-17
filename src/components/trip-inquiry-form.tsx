"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { submitInquiry } from "@/app/plan/actions";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelersCount: z.string().transform((val) => Number(val)).pipe(z.number().min(1)),
  interests: z.array(z.string()).default([]),
  message: z.string().min(10, "Please provide more details about your trip"),
});

const interestsOptions = [
  { id: "beaches", label: "Beaches & Islands" },
  { id: "wildlife", label: "Wildlife & Safaris" },
  { id: "history", label: "History & Heritage" },
  { id: "culture", label: "Local Culture" },
  { id: "adventure", label: "Adventure & Hiking" },
  { id: "food", label: "Culinary Experiences" },
];

export function TripInquiryForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travelersCount: 1,
      interests: [],
    },
  });

  const selectedInterests = watch("interests");

  const toggleInterest = (id: string) => {
    const current = selectedInterests || [];
    if (current.includes(id)) {
      setValue("interests", current.filter((i) => i !== id));
    } else {
      setValue("interests", [...current, id]);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    if (values.startDate) formData.append("startDate", values.startDate);
    if (values.endDate) formData.append("endDate", values.endDate);
    formData.append("travelersCount", values.travelersCount.toString());
    values.interests.forEach((interest) => formData.append("interests", interest));
    formData.append("message", values.message);

    try {
      const result = await submitInquiry(formData);
      if (result.success) {
        toast.success("Inquiry sent successfully! We'll get back to you soon.");
        reset();
      } else if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to submit inquiry");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" {...register("fullName")} className="rounded-xl" />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} className="rounded-xl" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input id="startDate" type="date" {...register("startDate")} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input id="endDate" type="date" {...register("endDate")} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelersCount">Number of Travelers</Label>
          <Input id="travelersCount" type="number" min="1" {...register("travelersCount")} className="rounded-xl" />
          {errors.travelersCount && <p className="text-sm text-red-500">{errors.travelersCount.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Areas of Interest</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {interestsOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedInterests.includes(option.id)}
                onCheckedChange={() => toggleInterest(option.id)}
              />
              <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Message / Special Requests</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your dream trip to Sierra Leone..."
          className="min-h-[150px] rounded-xl"
          {...register("message")}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-lg font-bold">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Inquiry...
          </>
        ) : (
          "Plan My Journey"
        )}
      </Button>
    </form>
  );
}
