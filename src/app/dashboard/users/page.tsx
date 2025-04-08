"use client";

import { useUsers } from "@/Hooks/useAuth";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function UsersPage() {
  const { users, loading, refetch, deleteUser, updateUser }: any = useUsers();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await deleteUser(id);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "", // optional
      role: user.role || "",
    });
  };

  const handleUpdate = async () => {
    const updatedData = { ...formData };
    if (!formData.password) {
      delete updatedData.password;
    }
    await updateUser(editingUser._id, updatedData);
    setEditingUser(null);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Registered Users</h2>

      <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white dark:bg-[#1f1f1f]">
  <thead>
    <tr className="bg-gray-100 dark:bg-gray-800 text-left text-sm uppercase text-gray-600 dark:text-gray-300">
      <th className="py-3 px-4">First Name</th>
      <th className="py-3 px-4">Last Name</th>
      <th className="py-3 px-4">Username</th>
      <th className="py-3 px-4">Email</th>
      <th className="py-3 px-4">Phone</th>
      <th className="py-3 px-4">Role</th>
      <th className="py-3 px-4">Created At</th>
      <th className="py-3 px-4">Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.total > 0 ? (
      users.list.map((user: any) => (
        <tr key={user._id} className="border-b text-sm text-gray-700 dark:text-gray-200">
          <td className="py-3 px-4">{user.firstName}</td>
          <td className="py-3 px-4">{user.lastName}</td>
          <td className="py-3 px-4">{user.username}</td>
          <td className="py-3 px-4">{user.email}</td>
          <td className="py-3 px-4">{user.phone}</td>
          <td className="py-3 px-4 capitalize">{user.role}</td>
          <td className="py-3 px-4">{new Date(user.createdAt).toLocaleString()}</td>
          <td className="py-3 px-4 flex gap-2">
            <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} className="py-4 text-center text-gray-500">
          No users found.
        </td>
      </tr>
    )}
  </tbody>
</table>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white dark:bg-[#1f1f1f] p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Edit User
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password (optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                  placeholder="Leave empty to keep current"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="applicant">Applicant</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
