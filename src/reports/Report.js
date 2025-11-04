// src/reports/Report.js
import React from "react";
import TeacherReports from "./TeacherReports";

// ✅ Admin Reports Component
const AdminReports = ({ currentUser, onShowToast }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Laporan Admin
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {currentUser?.full_name || currentUser?.nama || "Admin"} - Akses
                Penuh Sistem
              </p>
            </div>
          </div>
          <p className="text-slate-600">
            Kelola semua laporan dan data sistem dengan akses administrator
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Siswa</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👨‍🏫</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Guru</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Kelas</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Aktivitas</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Fitur Sedang Dalam Pengembangan
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Laporan administrator dengan akses ke semua data sistem akan segera
            hadir. Fitur ini akan mencakup laporan komprehensif untuk monitoring
            seluruh aspek akademik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📋</span>
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Laporan Siswa
              </h3>
              <p className="text-sm text-blue-700">
                Data lengkap semua siswa, presensi, dan nilai
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">👨‍🏫</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">
                Laporan Guru
              </h3>
              <p className="text-sm text-green-700">
                Monitoring kinerja guru dan penugasan mengajar
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">Analytics</h3>
              <p className="text-sm text-purple-700">
                Statistik dan trend performa akademik sekolah
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">💡</span>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Info:</h4>
                <p className="text-sm text-yellow-800">
                  Untuk sementara, gunakan menu individual untuk mengakses
                  laporan per modul. Fitur laporan terpusat akan segera
                  tersedia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Student Reports Component
const StudentReports = ({ currentUser, onShowToast }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          Laporan Akademik
        </h2>
        <p className="text-slate-600 mb-4">
          Halaman laporan untuk siswa sedang dalam pengembangan.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-700">
            Fitur ini akan segera hadir. Anda dapat melihat nilai dan laporan
            melalui menu rapor.
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Kembali
        </button>
      </div>
    </div>
  );
};

// ✅ Parent Reports Component
const ParentReports = ({ currentUser, onShowToast }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
        </div>
        <h2 className="text-xl font-bold text-purple-600 mb-2">Laporan Anak</h2>
        <p className="text-slate-600 mb-4">
          Halaman laporan untuk orang tua/wali sedang dalam pengembangan.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-700">
            Anda akan dapat memantau perkembangan akademik dan perilaku anak
            Anda di sini.
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Kembali
        </button>
      </div>
    </div>
  );
};

// ✅ Main Reports Component
const Reports = ({ currentUser, onShowToast }) => {
  // Debug log untuk memastikan data sampai
  console.log("🔍 REPORTS - CurrentUser received:", currentUser);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-4">
            Data user tidak ditemukan. Silakan login kembali.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser.role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-yellow-600 mb-2">
            Role Tidak Ditemukan
          </h2>
          <p className="text-slate-600 mb-4">
            User tidak memiliki role yang valid.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-left">
            <p className="text-sm font-mono break-all">
              User data: {JSON.stringify(currentUser, null, 2)}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // ✅ Render berdasarkan role
  if (currentUser.role === "admin") {
    return <AdminReports currentUser={currentUser} onShowToast={onShowToast} />;
  }

  if (currentUser.role === "teacher") {
    return <TeacherReports user={currentUser} onShowToast={onShowToast} />;
  }

  if (currentUser.role === "student") {
    return (
      <StudentReports currentUser={currentUser} onShowToast={onShowToast} />
    );
  }

  if (currentUser.role === "parent") {
    return (
      <ParentReports currentUser={currentUser} onShowToast={onShowToast} />
    );
  }

  // Fallback untuk role yang tidak dikenali
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❓</span>
        </div>
        <h2 className="text-xl font-bold text-yellow-600 mb-2">
          Role Tidak Dikenali
        </h2>
        <p className="text-slate-600 mb-2">
          Role "<span className="font-semibold">{currentUser.role}</span>" tidak
          valid.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">
            Role yang didukung: admin, teacher, student, parent
          </p>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Hubungi administrator untuk bantuan.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Kembali
        </button>
      </div>
    </div>
  );
};

export default Reports;
