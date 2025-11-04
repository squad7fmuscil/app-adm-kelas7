import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    nis: "",
    gender: "L",
    class_id: "7F",
    academic_year: "2025/2026",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    class: "Semua Kelas",
    gender: "Semua",
  });

  // Fetch data siswa
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
      setFilteredStudents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = students;

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(
        (student) =>
          student.full_name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (student.nis &&
            student.nis.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Filter by class
    if (filters.class !== "Semua Kelas") {
      filtered = filtered.filter(
        (student) => student.class_id === filters.class
      );
    }

    // Filter by gender
    if (filters.gender !== "Semua") {
      filtered = filtered.filter(
        (student) => student.gender === filters.gender
      );
    }

    setFilteredStudents(filtered);
  }, [filters, students]);

  // Calculate stats
  const stats = {
    totalKelas: [...new Set(students.map((s) => s.class_id))].length,
    totalSiswa: students.length,
    lakiLaki: students.filter((s) => s.gender === "L").length,
    perempuan: students.filter((s) => s.gender === "P").length,
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add/Edit student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update student
        const { error } = await supabase
          .from("students")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        // Add new student
        const { error } = await supabase.from("students").insert([formData]);

        if (error) throw error;
      }

      await fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Error saving student: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
      full_name: student.full_name,
      nis: student.nis,
      gender: student.gender,
      class_id: student.class_id,
      academic_year: student.academic_year,
      is_active: student.is_active,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus siswa ini?")) return;

    setLoading(true);
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student: " + error.message);
    } else {
      await fetchStudents();
    }
    setLoading(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      full_name: "",
      nis: "",
      gender: "L",
      class_id: "7F",
      academic_year: "2025/2026",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters({
      search: "",
      class: "Semua Kelas",
      gender: "Semua",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Siswa</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalKelas}
          </div>
          <div className="text-sm text-blue-800">Total Kelas</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.totalSiswa}
          </div>
          <div className="text-sm text-green-800">Total Siswa</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {stats.lakiLaki}
          </div>
          <div className="text-sm text-orange-800">Laki-laki</div>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-pink-600">
            {stats.perempuan}
          </div>
          <div className="text-sm text-pink-800">Perempuan</div>
        </div>
      </div>

      {/* Filters + Tambah Siswa dalam satu baris */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Cari Siswa */}
          <div>
            <label className="block text-sm font-medium mb-1">Cari Siswa</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Cari nama atau NIS..."
            />
          </div>

          {/* Filter Kelas */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Kelas
            </label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg">
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="7A">Kelas 7A</option>
              <option value="7B">Kelas 7B</option>
              <option value="7C">Kelas 7C</option>
              <option value="7D">Kelas 7D</option>
              <option value="7E">Kelas 7E</option>
              <option value="7F">Kelas 7F</option>
              <option value="8A">Kelas 8A</option>
              <option value="8B">Kelas 8B</option>
              <option value="8C">Kelas 8C</option>
              <option value="8D">Kelas 8D</option>
              <option value="8E">Kelas 8E</option>
              <option value="8F">Kelas 8F</option>
              <option value="9A">Kelas 9A</option>
              <option value="9B">Kelas 9B</option>
              <option value="9C">Kelas 9C</option>
              <option value="9D">Kelas 9D</option>
              <option value="9E">Kelas 9E</option>
              <option value="9F">Kelas 9F</option>
            </select>
          </div>

          {/* Filter Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Jenis Kelamin
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg">
              <option value="Semua">Semua</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Reset Filter */}
          <div className="flex items-end">
            <button
              onClick={resetAllFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full">
              Reset Filter
            </button>
          </div>

          {/* Tambah Siswa */}
          <div className="flex items-end">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
              + Tambah Siswa
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Siswa" : "Tambah Siswa Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Siswa
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg"
                placeholder="Nama lengkap siswa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">NIS</label>
              <input
                type="text"
                name="nis"
                value={formData.nis}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Nomor Induk Siswa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Jenis Kelamin
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kelas</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg">
                <option value="7A">7A</option>
                <option value="7B">7B</option>
                <option value="7C">7C</option>
                <option value="7D">7D</option>
                <option value="7E">7E</option>
                <option value="7F">7F</option>
                <option value="8A">8A</option>
                <option value="8B">8B</option>
                <option value="8C">8C</option>
                <option value="8D">8D</option>
                <option value="8E">8E</option>
                <option value="8F">8F</option>
                <option value="9A">9A</option>
                <option value="9B">9B</option>
                <option value="9C">9C</option>
                <option value="9D">9D</option>
                <option value="9E">9E</option>
                <option value="9F">9F</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="2025/2026"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Aktif</label>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                {loading ? "Loading..." : editingId ? "Update" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan {filteredStudents.length} dari {students.length} siswa
        </div>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">NIS</th>
              <th className="px-4 py-2 text-left">Jenis Kelamin</th>
              <th className="px-4 py-2 text-left">Kelas</th>
              <th className="px-4 py-2 text-left">Tahun Ajaran</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{student.full_name}</td>
                <td className="px-4 py-2">{student.nis}</td>
                <td className="px-4 py-2">
                  {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                </td>
                <td className="px-4 py-2">{student.class_id}</td>
                <td className="px-4 py-2">{student.academic_year}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      student.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {student.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && !loading && (
          <p className="text-center py-4 text-gray-500">Tidak ada data siswa</p>
        )}

        {loading && (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
