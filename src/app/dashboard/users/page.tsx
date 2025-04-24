"use client";

import { useUsers } from "@/Hooks/useAuth";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await deleteUser(id);
      refetch();
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
      password: "",
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
    refetch();
  };

  // Filter and search logic
  const filteredUsers = users.list?.filter((user: any) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-black">
          All Registered Users ({filteredUsers.length})
        </h2>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border bg-white rounded-lg dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg bg-white  text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="applicant">Applicant</option>
        </select>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 bg-white text-black dark:text-white"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-900 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-sm">
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user: any) => (
                <tr key={user._id} className="border-b text-gray-700 dark:text-gray-200">
                  <td className="py-3 px-4">{user.firstName}</td>
                  <td className="py-3 px-4">{user.lastName}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:underline"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                  {loading ? "Loading users..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded border disabled:opacity-50 dark:border-gray-700 bg-gray-600 text-white hover:bg-gray-700"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded border disabled:opacity-50 dark:border-gray-700 bg-gray-600 text-white hover:bg-gray-700"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded ${currentPage === pageNum ? 
                      'bg-blue-600 text-white ' : 
                      'border hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700 bg-white '}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border disabled:opacity-50 bg-gray-600 text-white hover:bg-gray-700 dark:border-gray-700"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border disabled:opacity-50 dark:border-gray-700 bg-gray-600 text-white hover:bg-gray-700"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal (unchanged) */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm sm:max-w-md rounded bg-white dark:bg-[#1f1f1f] p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Edit User
            </Dialog.Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="applicant">Applicant</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
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

      {/* Background elements (unchanged) */}
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
  <svg
    width="500"
    height="500"
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M400 100C450 150 480 200 470 250C460 300 410 330 380 350C350 370 340 400 300 420C260 440 200 450 150 430C100 410 70 360 80 300C90 240 140 180 200 150C260 120 330 120 370 140C410 160 420 200 400 250C380 300 350 350 400 100Z"
      fill="url(#topRightGradient)"
      fillOpacity="0.5"
    />
    <defs>
      <linearGradient
        id="topRightGradient"
        x1="100"
        y1="100"
        x2="400"
        y2="400"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#9333EA" stopOpacity="0.5" />
      </linearGradient>
    </defs>
  </svg>
</div>
<div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
  <svg
    width="500"
    height="300"
    viewBox="0 0 500 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 150C50 100 100 120 150 100C200 80 250 50 300 70C350 90 400 140 450 120C500 100 500 0 450 0C400 0 350 50 300 30C250 10 200 -20 150 10C100 40 50 100 0 150Z"
      fill="url(#bottomLeftGradient)"
      fillOpacity="0.5"
    />
    <defs>
      <linearGradient
        id="bottomLeftGradient"
        x1="0"
        y1="0"
        x2="500"
        y2="300"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#10B981" stopOpacity="0.5" />
      </linearGradient>
    </defs>
  </svg>
</div>
    </div>
  );
}