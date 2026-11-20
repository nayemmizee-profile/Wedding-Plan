"use client";

import { motion } from "framer-motion";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServiceForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload a service image.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload image to ImgBB
      const imageData = new FormData();
      imageData.append("image", image);

      const uploadResponse = await fetch("/api/vendor/upload", {
        method: "POST",
        body: imageData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message);
      }

      const imageUrl = uploadResult.imageUrl;

      // Step 2: Save service information
      const response = await fetch("/api/vendor/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          image: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Service submitted successfully! Waiting for approval.");

      router.push("/vendor/dashboard/services");
      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
    >
      <div>
        <h2 className="text-xl font-bold text-[#33232D]">
          Add Wedding Service
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Submit your service for admin approval.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Service Name</label>
          <input
            name="serviceName"
            required
            value={form.serviceName}
            onChange={handleChange}
            placeholder="Wedding Photography"
            className="w-full rounded-xl border p-3 outline-none focus:border-[#A94F70]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Service Category
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border bg-white p-3 outline-none focus:border-[#A94F70]"
          >
            <option value="">Select Category</option>
            <option value="Photography">Photography</option>
            <option value="Catering">Catering</option>
            <option value="Decoration">Decoration</option>
            <option value="Venue">Venue</option>
            <option value="Makeup">Makeup Artist</option>
            <option value="Wedding Planning">Wedding Planning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Price (BDT)</label>
          <input
            name="price"
            type="number"
            min="1"
            required
            value={form.price}
            onChange={handleChange}
            placeholder="25000"
            className="w-full rounded-xl border p-3 outline-none focus:border-[#A94F70]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            placeholder="Chittagong"
            className="w-full rounded-xl border p-3 outline-none focus:border-[#A94F70]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your wedding service..."
          className="w-full resize-none rounded-xl border p-3 outline-none focus:border-[#A94F70]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Service Image</label>

        <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-[#A94F70]">
          {preview ? (
            <div className="relative h-48 w-full">
              <img
                src={preview}
                alt="Service preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setImage(null);
                  setPreview("");
                }}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
              >
                <X size={17} />
              </button>
            </div>
          ) : (
            <>
              <ImagePlus size={35} className="text-[#A94F70]" />
              <p className="mt-3 text-sm font-medium">Upload Service Image</p>
              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG or WEBP · Maximum 5MB
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImage}
            className="hidden"
          />
        </label>
      </div>

      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A94F70] py-3.5 font-semibold text-white transition hover:bg-[#843B59] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={19} />
            Submitting...
          </>
        ) : (
          "Submit Service for Approval"
        )}
      </button>
    </motion.form>
  );
}
