"use client";

import { Ban, Eye, RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);

  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const parseResponse = async (response) => {
    const text = await response.text();

    if (!text) {
      throw new Error(
        `Server returned empty response. HTTP Status: ${response.status}`,
      );
    }

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Invalid API Response:", text);

      throw new Error(
        `Server returned invalid JSON. HTTP Status: ${response.status}`,
      );
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || `Request failed: ${response.status}`);
    }

    return result;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        role,
        page: String(page),
        limit: "10",
      });

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      console.log("Users API Status:", response.status);

      const result = await parseResponse(response);

      console.log("Users API Data:", result);

      setUsers(result.data.users || []);
      setTotal(result.data.total || 0);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 350);

    return () => clearTimeout(timer);
  }, [search, role, page]);

  const handleBlock = async (user) => {
    const blocked = Boolean(user.banned);

    const confirmed = window.confirm(
      `Are you sure you want to ${blocked ? "unblock" : "block"} ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      const action = blocked ? "unblock" : "block";

      const response = await fetch(`/api/admin/users/${user.id}/${action}`, {
        method: "PATCH",
      });

      const result = await parseResponse(response);

      alert(result.message || "Action completed successfully");

      await fetchUsers();
    } catch (err) {
      console.error("Block User Error:", err);
      alert(err.message);
    }
  };

  const fetchDetails = async (id) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await parseResponse(response);

      setSelectedUser(result.data);
    } catch (err) {
      console.error("Fetch User Details Error:", err);
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>

        <p className="mt-2 text-sm text-gray-500">
          View, search and manage registered users.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or email..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-400"
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All Roles</option>
          <option value="vendor">Vendor</option>
          <option value="user">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={fetchUsers}
          className="rounded-xl bg-gray-100 px-4 py-2.5 text-gray-700 hover:bg-gray-200"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {user.name || "Unnamed"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">{user.email}</p>
                    </td>

                    <td className="px-5 py-4 capitalize">
                      {user.role || "customer"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.banned
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {user.banned ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchDetails(user.id)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="View details"
                        >
                          <Eye size={17} />
                        </button>

                        {user.isAdmin ? (
                          <span
                            className="rounded-lg bg-purple-50 p-2 text-purple-600"
                            title="Admin account"
                          >
                            <ShieldCheck size={17} />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBlock(user)}
                            className={`rounded-lg p-2 ${
                              user.banned
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                            title={user.banned ? "Unblock" : "Block"}
                          >
                            {user.banned ? (
                              <ShieldCheck size={17} />
                            ) : (
                              <Ban size={17} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t p-4">
          <p className="text-xs text-gray-500">Total users: {total}</p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 py-2 text-sm">{page}</span>

            <button
              disabled={page * 10 >= total}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">User Details</h2>

              <button onClick={() => setSelectedUser(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <b>Name:</b> {selectedUser.name}
              </p>
              <p>
                <b>Email:</b> {selectedUser.email}
              </p>
              <p>
                <b>Role:</b> {selectedUser.role || "customer"}
              </p>
              <p>
                <b>Status:</b> {selectedUser.banned ? "Blocked" : "Active"}
              </p>
              <p>
                <b>Email Verified:</b>{" "}
                {selectedUser.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <b>User ID:</b> {selectedUser.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
