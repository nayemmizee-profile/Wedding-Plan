import {
  BriefcaseBusiness,
  Clock,
  Package,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

const icons = {
  users: Users,
  vendors: BriefcaseBusiness,
  customers: UserRound,
  services: Package,
  pending: Clock,
  transactions: Wallet,
};

const colors = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  pink: "bg-pink-50 text-pink-600",
  teal: "bg-teal-50 text-teal-600",
};

export default function StatCard({
  title,
  value,
  type,
  color = "blue",
  description,
}) {
  const Icon = icons[type] || Package;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${colors[color] || colors.blue}`}>
          <Icon size={23} />
        </div>

        <span className="text-xs font-medium text-gray-400">Overview</span>
      </div>

      <h2 className="mt-5 text-3xl font-bold text-gray-900">{value ?? 0}</h2>

      <p className="mt-1 text-sm font-semibold text-gray-700">{title}</p>

      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </div>
  );
}
