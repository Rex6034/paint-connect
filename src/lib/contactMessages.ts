import { supabase } from "@/integrations/supabase/client";

export const saveContactMessage = async (
  name: string,
  phone: string,
  message: string,
  email?: string
) => {
  const { data, error } = await (supabase
    .from("contact_messages") as any)
    .insert([
      {
        name,
        phone,
        message,
        email: email || null,
      },
    ])
    .select();

  if (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }

  return data;
};

export const getContactMessages = async (limit: number = 50, offset: number = 0) => {
  const { data, error } = await (supabase
    .from("contact_messages") as any)
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }

  return data || [];
};

export const markMessageAsRead = async (id: string) => {
  const { error } = await (supabase
    .from("contact_messages") as any)
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const markMessageAsReplied = async (id: string) => {
  const { error } = await (supabase
    .from("contact_messages") as any)
    .update({ replied: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as replied:", error);
    throw error;
  }
};

export const deleteContactMessage = async (id: string) => {
  const { error } = await (supabase
    .from("contact_messages") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting contact message:", error);
    throw error;
  }
};
