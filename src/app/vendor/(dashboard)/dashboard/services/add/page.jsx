"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  DollarSign,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categories = [
  "Photography",
  "Videography",
  "Wedding Decoration",
  "Catering",
  "Wedding Planning",
  "Makeup Artist",
  "Venue",
  "Music & Entertainment",
  "Other",
];

export default function AddServicePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (e) => {
    const selected = Array.from(e.target.files || []);

    const remaining = 5 - images.length;

    if (selected.length > remaining) {
      setError("You can upload a maximum of 5 images.");
      e.target.value = "";
      return;
    }

    const validImages = selected.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
    );

    if (validImages.length !== selected.length) {
      setError("Images must be valid and under 5MB each.");
    } else {
      setError("");
    }

    setImages((prev) => [...prev, ...validImages]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/vendor/services", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", responseText);

      const data = JSON.parse(responseText);

      if (data.code === "SERVICE_LIMIT_REACHED") {
        router.push("/vendor/upgrade");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add service");
      }

      setSuccess("Service submitted for admin approval!");

      setForm({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
      });

      setImages([]);

      setTimeout(() => {
        router.push("/vendor/dashboard/services");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#b47b57]">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#202b35] md:text-4xl">
            Add New Service
          </h1>

          <p className="mt-2 text-gray-500">
            Share your service with customers and grow your business.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8"
        >
          {/* Service Name */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Service Name *
            </label>

            <input
              required
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              placeholder="e.g. Premium Wedding Photography"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#b47b57] focus:ring-2 focus:ring-[#b47b57]/10"
            />
          </div>

          {/* Category and Price */}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category *
              </label>

              <div className="relative">
                <Tag className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <select
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-[#b47b57]"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price (USD) *
              </label>

              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  required
                  type="number"
                  min="1"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="25000"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#b47b57]"
                />
              </div>
            </div>
          </div>

          {/* Location */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Service Location *
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <input
                required
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Sorrento (Campania) , Italy"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#b47b57]"
              />
            </div>
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description *
            </label>

            <div className="relative">
              <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />

              <textarea
                required
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your service, experience and what customers will receive..."
                className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#b47b57]"
              />
            </div>
          </div>

          {/* Image Upload */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Service Images *
              </label>

              <span className="text-xs text-gray-400">
                {images.length}/5 images
              </span>
            </div>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8c1ad] bg-[#faf7f4] p-8 text-center transition hover:bg-[#f5eee8] ${
                images.length >= 5 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <UploadCloud className="mb-3 h-10 w-10 text-[#b47b57]" />

              <p className="font-semibold text-gray-700">
                Click to upload images
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or WEBP · Maximum 5MB per image
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= 5}
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Image Preview */}

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="group relative overflow-hidden rounded-xl border"
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                      height={100}
                      width={100}
                      className="h-36 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-90 transition hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts */}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={20} />
              {success}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#263b42] px-6 py-4 font-semibold text-white transition hover:bg-[#38545d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading Images & Submitting...
              </>
            ) : (
              <>
                <ImagePlus size={20} />
                Submit for Approval
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Your service will be visible to customers after admin approval.
          </p>
        </form>
      </div>
    </div>
  );
}
