"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { AdminUserItem } from "@/lib/adminTypes";
import { useAuthStore } from "@/lib/authStore";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"writer" | "editor">("writer");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadUsers() {
    adminFetch<AdminUserItem[]>("/api/auth/users").then(setUsers).catch(() => {});
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await adminFetch("/api/auth/users", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      setSuccess(`Account created for ${name}. Share the email and password with them directly.`);
      setName("");
      setEmail("");
      setPassword("");
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSaving(false);
    }
  }

  const canCreateEditors = currentUser?.role === "admin";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-navy mb-6">Team</h1>

      <form onSubmit={handleInvite} className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-navy mb-1">Add a new writer or editor</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary password (8+ characters)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "writer" | "editor")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
          >
            <option value="writer">Writer</option>
            {canCreateEditors && <option value="editor">Editor</option>}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50 w-fit"
        >
          <UserPlus size={16} />
          {saving ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-navy">{u.name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <span className="text-xs bg-gray-100 text-navy px-2.5 py-1 rounded-full capitalize">{u.role}</span>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-gray-400 px-5 py-8 text-center">No team members yet.</p>}
      </div>
    </div>
  );
}
