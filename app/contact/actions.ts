"use server";

import { contactTopics, site } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface ContactState {
  status: "idle" | "sent" | "error";
  message?: string;
  // sent back on an error so the form keeps what was typed
  fields?: Record<string, string>;
}

function field(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

// saves a contact form message to the supabase messages table
export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // a hidden field people never see. bots fill it in
  if (field(formData, "website", 200)) {
    return { status: "sent" };
  }

  const fields = {
    name: field(formData, "name", 200),
    email: field(formData, "email", 320),
    topic: field(formData, "topic", 100),
    message: field(formData, "message", 5000),
  };

  if (!fields.name || !fields.message) {
    return { status: "error", message: "Please add your name and a message.", fields };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { status: "error", message: "That email address doesn’t look right.", fields };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      status: "error",
      message: `The form isn’t connected yet. Please email us at ${site.email}.`,
      fields,
    };
  }

  const { error } = await supabase.from("messages").insert({
    name: fields.name,
    email: fields.email,
    topic: contactTopics.includes(fields.topic) ? fields.topic : null,
    message: fields.message,
  });

  if (error) {
    console.error("couldn't save contact message:", error.message);
    return {
      status: "error",
      message: `Your message didn’t send. Please try again, or email us at ${site.email}.`,
      fields,
    };
  }

  return { status: "sent" };
}
