// components/UserManagement.js
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";

const UserManagement = ({ currentUser, onShowToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    teacher_id: "",
    role: "teacher",
    homeroom_class_id: "",
    no_hp: "",
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      onShowToast?.("Gagal memuat data users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);

    if (mode === "edit" && user) {
      setFormData({
        username: user.username,
        password: user.password,
        full_name: user.full_name,
        teacher_id: user.teacher_id || "",
        role: user.role,
        homeroom_class_id: user.homeroom_class_id || "",
        no_hp: user.no_hp || "",
        is_active: user.is_active,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        full_name: "",
        teacher_id: "",
        role: "teacher",
        homeroom_class_id: "",
        no_hp: "",
        is_active: true,
      });
    }

    setFormErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      username: "",
      password: "",
      full_name: "",
      teacher_id: "",
      role: "teacher",
      homeroom_class_id: "",
      no_hp: "",
      is_active: true,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      errors.username = "Username minimal 3 karakter";
    }

    if (modalMode === "add" && !formData.password.trim()) {
      errors.password = "Password harus diisi";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    if (!formData.full_name.trim()) {
      errors.full_name = "Nama lengkap harus diisi";
    }

    if (!formData.role) {
      errors.role = "Role harus dipilih";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      onShowToast?.("Mohon lengkapi form dengan benar", "error");
      return;
    }

    try {
      setLoading(true);

      if (modalMode === "add") {
        // Check if username already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (existingUser) {
          setFormErrors({ username: "Username sudah digunakan" });
          onShowToast?.("Username sudah digunakan", "error");
          return;
        }

        // Insert new user
        const { error } = await supabase.from("users").insert([
          {
            username: formData.username,
            password: formData.password,
            full_name: formData.full_name,
            teacher_id: formData.teacher_id || null,
            role: formData.role,
            homeroom_class_id: formData.homeroom_class_id || null,
            no_hp: formData.no_hp || null,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        onShowToast?.(
          `User ${formData.full_name} berhasil ditambahkan`,
          "success"
        );
      } else {
        // Update existing user
        const updateData = {
          username: formData.username,
          full_name: formData.full_name,
          teacher_id: formData.teacher_id || null,
          role: formData.role,
          homeroom_class_id: formData.homeroom_class_id || null,
          no_hp: formData.no_hp || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        };

        // Only update password if it's changed
        if (formData.password && formData.password !== selectedUser.password) {
          updateData.password = formData.password;
        }

        const { error } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", selectedUser.id);

        if (error) throw error;
        onShowToast?.(
          `User ${formData.full_name} berhasil diupdate`,
          "success"
        );
      }

      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      onShowToast?.("Gagal menyimpan user: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Yakin ingin menghapus user "${user.full_name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("users").delete().eq("id", user.id);

      if (error) throw error;

      onShowToast?.(`User ${user.full_name} berhasil dihapus`, "success");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      onShowToast?.("Gagal menghapus user: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          is_active: !user.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      onShowToast?.(
        `User ${user.full_name} ${
          !user.is_active ? "diaktifkan" : "dinonaktifkan"
        }`,
        "success"
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      onShowToast?.("Gagal mengubah status user", "error");
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.teacher_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = filterRole === "all" || user.role === filterRole;

    return matchSearch && matchRole;
  });

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-red-100 text-red-700 border-red-300",
      teacher: "bg-blue-100 text-blue-700 border-blue-300",
      guru_bk: "bg-purple-100 text-purple-700 border-purple-300",
      student: "bg-green-100 text-green-700 border-green-300",
    };

    const labels = {
      admin: "Admin",
      teacher: "Guru",
      guru_bk: "Guru BK",
      student: "Siswa",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[role] || "bg-gray-100 text-gray-700"
        }`}>
        {labels[role] || role}
      </span>
    );
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Manajemen Users
            </h1>
          </div>
          <p className="text-gray-600">Kelola data pengguna sistem</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Aktif</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Non-Aktif</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => !u.is_active).length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Admin</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama, username, atau ID guru..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Role */}
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 sm:flex-none"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}>
                <option value="all">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Guru</option>
                <option value="guru_bk">Guru BK</option>
                <option value="student">Siswa</option>
              </select>

              {/* Add Button */}
              <button
                onClick={() => handleOpenModal("add")}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada user ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Nama Lengkap
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      ID Guru
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      No HP
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {user.full_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.teacher_id || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.no_hp || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } transition-colors`}>
                          {user.is_active ? "Aktif" : "Non-Aktif"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal("edit", user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-xl font-bold">
                {modalMode === "add" ? "Tambah User Baru" : "Edit User"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Masukkan username"
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password{" "}
                  {modalMode === "add" && (
                    <span className="text-red-500">*</span>
                  )}
                  {modalMode === "edit" && (
                    <span className="text-gray-500 text-xs">
                      (Kosongkan jika tidak diubah)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.full_name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                />
                {formErrors.full_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.full_name}
                  </p>
                )}
              </div>

              {/* Teacher ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Guru
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teacher_id}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher_id: e.target.value })
                  }
                  placeholder="Contoh: Guru-12"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }>
                  <option value="teacher">Guru</option>
                  <option value="guru_bk">Guru BK</option>
                  <option value="admin">Admin</option>
                  <option value="student">Siswa</option>
                </select>
                {formErrors.role && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                )}
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No HP
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.no_hp}
                  onChange={(e) =>
                    setFormData({ ...formData, no_hp: e.target.value })
                  }
                  placeholder="08123456789"
                />
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    User Aktif
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>
                        {modalMode === "add" ? "Tambah User" : "Update User"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
