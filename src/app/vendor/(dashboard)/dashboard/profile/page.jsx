"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function VendorProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/vendor/profile");
        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        setProfile(result.profile);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          businessName: profile.businessName,
          phone: profile.phone,
          location: profile.location,
          image: profile.image,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Vendor Name",
      icon: UserRound,
    },
    {
      name: "businessName",
      label: "Business Name",
      icon: Building2,
    },
    {
      name: "phone",
      label: "Phone Number",
      icon: Phone,
    },
    {
      name: "location",
      label: "Business Location",
      icon: MapPin,
    },
    {
      name: "image",
      label: "Profile Image URL",
      icon: UserRound,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#A94F70]" size={35} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-[#33232D]">Profile Settings</h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal and business information.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-pink-100 text-2xl font-bold text-[#A94F70]">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Vendor"
                className="h-full w-full object-cover"
              />
            ) : (
              profile.name?.charAt(0)
            )}
          </div>

          <div>
            <h2 className="font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.label}
                </label>

                <div className="relative">
                  <Icon
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    name={field.name}
                    value={profile[field.name] || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:border-[#A94F70]"
                  />
                </div>
              </div>
            );
          })}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                value={profile.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <button
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A94F70] py-3.5 font-semibold text-white transition hover:bg-[#843B59] disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {saving ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Save size={19} />
            )}
            Save Changes
          </button>
        </div>
      </motion.form>
    </div>
  );
}
