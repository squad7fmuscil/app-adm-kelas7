import { useState } from "react";
import {
  Menu,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  currentPage,
  onPageChange,
  currentUser,
  onLogout,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "students", label: "Data Siswa" },
    { id: "attendance", label: "Presensi" },
    { id: "grades", label: "Nilai" },
    { id: "notes", label: "Catatan" },
    { id: "schedule", label: "Jadwal" },
    { id: "report", label: "Laporan" },
  ];

  // E-Learning Menu Items - Sesuai struktur file
  const elearningMenuItems = [
    { id: "easymodul", label: "Easy Modul" },
    { id: "easymateri", label: "Easy Materi" },
    { id: "easytext", label: "Easy Text" },
    { id: "easyvocab", label: "Easy Vocab" },
    { id: "easysoal", label: "Easy Soal" },
  ];

  const systemMenuItems = [
    { id: "setting", label: "Pengaturan" },
    { id: "sistem", label: "Monitor" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getPageTitle = () => {
    // Gabungkan semua menu items
    const allItems = [...menuItems, ...elearningMenuItems, ...systemMenuItems];
    const currentItem = allItems.find((item) => item.id === currentPage);
    return currentItem ? currentItem.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keluar dari Sistem?
              </h3>
              <p className="text-sm text-gray-500">
                Anda harus login kembali untuk mengakses sistem
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-out;
        }
      `}</style>

      {/* Sidebar Component */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        currentUser={currentUser}
        isSidebarOpen={isSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu size={20} className="text-gray-600" />
              </button>

              {/* Desktop Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}>
                {isSidebarOpen ? (
                  <PanelLeftClose size={20} className="text-gray-600" />
                ) : (
                  <PanelLeftOpen size={20} className="text-gray-600" />
                )}
              </button>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {getPageTitle()}
                </h2>
              </div>
            </div>

            {/* Right Section - User Info & Logout */}
            <div className="flex items-center gap-2">
              {/* User Info Desktop */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                  {/* Status Online - Titik Hijau */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {currentUser?.full_name || currentUser?.nama || "User"}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {currentUser?.role === "admin"
                      ? "Admin"
                      : currentUser?.role === "teacher"
                      ? "Guru"
                      : "User"}
                  </span>
                </div>
              </div>

              {/* Logout Button - Enhanced */}
              <button
                onClick={handleLogout}
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 overflow-hidden"
                title="Keluar">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <svg
                  className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>

                <span className="hidden sm:inline text-sm font-semibold relative z-10">
                  Keluar
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
