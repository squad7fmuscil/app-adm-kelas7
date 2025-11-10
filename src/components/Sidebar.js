import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Monitor,
  X,
  User,
  BookOpenCheck,
  LogOut,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  FileStack,
  ClipboardList,
} from "lucide-react";

export default function Sidebar({
  currentPage,
  onPageChange,
  currentUser,
  isSidebarOpen,
  isMobileMenuOpen,
  toggleMobileMenu,
  onLogout,
}) {
  const [isElearningOpen, setIsElearningOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Data Siswa", icon: Users },
    { id: "attendance", label: "Presensi", icon: ClipboardCheck },
    { id: "grades", label: "Nilai", icon: FileText },
    { id: "notes", label: "Catatan", icon: BookOpen },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "report", label: "Laporan", icon: BarChart3 },
  ];

  // Menu E-Learning dengan submenu - Sesuai struktur file
  const elearningSubmenus = [
    { id: "easymodul", label: "Easy Modul", icon: BookOpenCheck },
    { id: "easymateri", label: "Easy Materi", icon: FileStack },
    { id: "easytext", label: "Easy Text", icon: FileText },
    { id: "easyvocab", label: "Easy Vocab", icon: BookOpen },
    { id: "easysoal", label: "Easy Soal", icon: ClipboardList },
  ];

  const systemMenuItems = [
    { id: "setting", label: "Pengaturan", icon: Settings },
    { id: "sistem", label: "Monitor", icon: Monitor },
  ];

  // Check if current page is in e-learning submenu
  const isElearningActive = elearningSubmenus.some(
    (item) => item.id === currentPage
  );

  // Auto expand e-learning if active
  useState(() => {
    if (isElearningActive) {
      setIsElearningOpen(true);
    }
  }, [currentPage]);

  return (
    <>
      {/* Overlay untuk mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
          bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isSidebarOpen ? "lg:w-64" : "lg:w-20"}
          w-64 shadow-2xl shadow-blue-900/20
        `}>
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 animate-pulse"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Border gradient */}
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
            <div
              className={`flex items-center gap-3 ${
                !isSidebarOpen && "lg:justify-center lg:w-full"
              }`}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-xl -z-10"></div>
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-sm tracking-wide">
                    SMP MUSLIMIN
                  </h1>
                  <p className="text-blue-200 font-semibold text-xs">CILILIN</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar">
            {/* Main Menu */}
            <div className="space-y-1 mb-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      if (window.innerWidth < 1024) {
                        toggleMobileMenu();
                      }
                    }}
                    className={`
                      group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${!isSidebarOpen && "lg:justify-center lg:px-2"}
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                          : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
                    title={!isSidebarOpen ? item.label : ""}>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}

                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />

                    {isSidebarOpen && (
                      <>
                        <span className="font-medium text-sm flex-1 text-left">
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight size={16} className="opacity-70" />
                        )}
                      </>
                    )}

                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* E-Learning Menu Section */}
            <div className="mb-3">
              {/* E-Learning Header/Toggle */}
              <button
                onClick={() => {
                  if (isSidebarOpen) {
                    setIsElearningOpen(!isElearningOpen);
                  } else {
                    // If sidebar collapsed, expand it first
                    setIsElearningOpen(true);
                  }
                }}
                className={`
                  group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${!isSidebarOpen && "lg:justify-center lg:px-2"}
                  ${
                    isElearningActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                  }
                `}
                title={!isSidebarOpen ? "E-Learning" : ""}>
                {/* Active indicator */}
                {isElearningActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}

                <GraduationCap
                  size={20}
                  strokeWidth={2}
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isElearningActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                />

                {isSidebarOpen && (
                  <>
                    <span className="font-medium text-sm flex-1 text-left">
                      E-Learning
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isElearningOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}

                {/* Hover glow effect */}
                {!isElearningActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
                )}
              </button>

              {/* E-Learning Submenus */}
              {isSidebarOpen && (
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isElearningOpen
                        ? "max-h-[400px] opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }
                  `}>
                  <div className="space-y-0.5 pl-3 border-l-2 border-blue-500/30 ml-5">
                    {elearningSubmenus.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onPageChange(item.id);
                            if (window.innerWidth < 1024) {
                              toggleMobileMenu();
                            }
                          }}
                          className={`
                            group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200
                            ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-white shadow-md"
                                : "text-blue-100/70 hover:bg-white/5 hover:text-white"
                            }
                          `}>
                          <Icon
                            size={18}
                            strokeWidth={2}
                            className={`flex-shrink-0 transition-transform duration-200 ${
                              isActive ? "scale-110" : "group-hover:scale-110"
                            }`}
                          />

                          <span className="font-medium text-sm flex-1 text-left">
                            {item.label}
                          </span>

                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}

                          {/* Hover glow effect */}
                          {!isActive && (
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* System Menu Section */}
            <div className="border-t border-white/10 pt-3">
              {isSidebarOpen && (
                <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                  <span className="w-3 h-px bg-blue-400/30"></span>
                  System
                </p>
              )}
              <div className="space-y-1">
                {systemMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        if (window.innerWidth < 1024) {
                          toggleMobileMenu();
                        }
                      }}
                      className={`
                        group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                        ${!isSidebarOpen && "lg:justify-center lg:px-2"}
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                            : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                        }
                      `}
                      title={!isSidebarOpen ? item.label : ""}>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}

                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={`flex-shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />

                      {isSidebarOpen && (
                        <>
                          <span className="font-medium text-sm flex-1 text-left">
                            {item.label}
                          </span>
                          {isActive && (
                            <ChevronRight size={16} className="opacity-70" />
                          )}
                        </>
                      )}

                      {!isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User Info */}
          <div className="border-t border-white/10 p-3 backdrop-blur-sm">
            {/* User Card */}
            <div
              className={`
              bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10
              hover:bg-white/10 transition-all duration-200 group
              ${!isSidebarOpen && "lg:p-2"}
            `}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>

                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {currentUser?.full_name || currentUser?.nama || "User"}
                    </p>
                    <p className="text-xs text-blue-200/80 truncate">
                      {currentUser?.role === "admin"
                        ? "Administrator"
                        : currentUser?.role === "teacher"
                        ? "Guru"
                        : "User"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        `}</style>
      </aside>
    </>
  );
}
