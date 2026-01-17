"use server";

import { supabase } from "../../lib/supabase";
import { z } from "zod";

const InquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelersCount: z.number().min(1).default(1),
  interests: z.array(z.string()).default([]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitInquiry(formData: FormData) {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    travelersCount: Number(formData.get("travelersCount")),
    interests: formData.getAll("interests"),
    message: formData.get("message"),
  };

  const validatedData = InquirySchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: validatedData.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase.from("inquiries").insert([
    {
      full_name: validatedData.data.fullName,
      email: validatedData.data.email,
      start_date: validatedData.data.startDate || null,
      end_date: validatedData.data.endDate || null,
      travelers_count: validatedData.data.travelersCount,
      interests: validatedData.data.interests,
      message: validatedData.data.message,
    },
  ]);

  if (error) {
    console.error("Supabase error:", error);
    return { error: "Failed to submit inquiry. Please try again later." };
  }

  return { success: true };
}
