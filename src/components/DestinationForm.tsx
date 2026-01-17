"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Loader2, 
  X, 
  Plus, 
  ChevronLeft,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

interface DestinationFormProps {
  id?: string;
  initialData?: any;
}

export function DestinationForm({ id, initialData }: DestinationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    region: "",
    category: "",
    image: "",
    description: "",
    best_time: "",
    getting_there: "",
    fees: "",
    highlights: [] as string[],
    experience_types: [] as string[],
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newExperience, setNewExperience] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        highlights: initialData.highlights || [],
        experience_types: initialData.experience_types || [],
      });
    }
  }, [initialData]);

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: handleSlugify(name),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `destination-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("destinations")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("destinations")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from("destinations")
          .update(formData)
          .eq("id", id);
        if (error) throw error;
        toast.success("Destination updated successfully");
      } else {
        const { error } = await supabase
          .from("destinations")
          .insert([formData]);
        if (error) throw error;
        toast.success("Destination created successfully");
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: "highlights" | "experience_types", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()],
    });
    setter("");
  };

  const removeItem = (field: "highlights" | "experience_types", index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/destinations"
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Destinations
        </Link>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {id ? "Save Changes" : "Create Destination"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. River No. 2 Beach"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="river-no-2-beach"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g. Western Area"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Beach, Wildlife, History"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the destination in detail..."
                required
                className="rounded-xl min-h-[150px]"
              />
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair">Practical Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="best_time">Best Time to Visit</Label>
                <Input
                  id="best_time"
                  value={formData.best_time}
                  onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                  placeholder="e.g. November to April"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fees">Entry Fees / Costs</Label>
                <Input
                  id="fees"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  placeholder="e.g. Free, $5 for locals"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="getting_there">How to Get There</Label>
              <Textarea
                id="getting_there"
                value={formData.getting_there}
                onChange={(e) => setFormData({ ...formData, getting_there: e.target.value })}
                placeholder="Transport options..."
                className="rounded-xl min-h-[100px]"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Media & Lists */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair">Main Image</h3>
            
            <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 transition-colors hover:border-emerald-500">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-zinc-300" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {uploading ? "Uploading..." : "Click to upload"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair">Highlights</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight..."
                  className="rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("highlights", newHighlight, setNewHighlight))}
                />
                <Button 
                  type="button" 
                  onClick={() => addItem("highlights", newHighlight, setNewHighlight)}
                  variant="outline" 
                  className="rounded-xl shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => removeItem("highlights", i)} className="hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair">Experiences</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  placeholder="Add experience type..."
                  className="rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("experience_types", newExperience, setNewExperience))}
                />
                <Button 
                  type="button" 
                  onClick={() => addItem("experience_types", newExperience, setNewExperience)}
                  variant="outline" 
                  className="rounded-xl shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.experience_types.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => removeItem("experience_types", i)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
