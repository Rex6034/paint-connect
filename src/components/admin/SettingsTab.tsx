import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string>("");
  const [formData, setFormData] = useState({
    store_name: "",
    whatsapp_number: "",
    phone_number: "",
    address: "",
    opening_hours: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load settings.",
        variant: "destructive",
      });
    } else if (data) {
      setSettingsId(data.id);
      setFormData({
        store_name: data.store_name || "",
        whatsapp_number: data.whatsapp_number || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        opening_hours: data.opening_hours || "",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .update(formData)
      .eq("id", settingsId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="store_name">Store Name</Label>
          <Input
            id="store_name"
            value={formData.store_name}
            onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
          <Input
            id="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            placeholder="+1234567890"
          />
          <p className="text-sm text-muted-foreground">
            Include country code (e.g., +1 for US)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="opening_hours">Opening Hours</Label>
          <Textarea
            id="opening_hours"
            value={formData.opening_hours}
            onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
            rows={3}
            placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 10AM-4PM"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
};

export default SettingsTab;
