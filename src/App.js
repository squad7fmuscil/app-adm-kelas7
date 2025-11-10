// App.js
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Students from "./page/Students";
import Attendance from "./page/Attendance";
import Grades from "./page/Grades";
import StudentNotes from "./page/StudentNotes";
import Schedule from "./page/Schedule";
import Report from "./reports/Report";
import Setting from "./page/Setting";
import MonitorSistem from "./system/MonitorSistem";

// E-Learning Components - Sesuai struktur file
import EasyModul from "./e-learning/EasyModul";
import EasyMateri from "./e-learning/EasyMateri";
import EasyText from "./e-learning/EasyText";
import EasyVocab from "./e-learning/EasyVocab";
import EasySoal from "./e-learning/EasySoal";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Check localStorage saat pertama load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUser && rememberMe) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rememberMe");
      }
    } else {
      // Check sessionStorage
      const sessionUser = sessionStorage.getItem("currentUser");
      if (sessionUser) {
        try {
          const user = JSON.parse(sessionUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing session user:", error);
          sessionStorage.removeItem("currentUser");
        }
      }
    }
  }, []);

  const handleLogin = (userData, rememberMe) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);

    if (rememberMe) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("rememberMe", "false");
    }

    // Set default page based on role
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage("dashboard");

    // Clear storage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("currentUser");

    showToast("Anda telah keluar dari sistem", "success");
  };

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard onPageChange={setCurrentPage} currentUser={currentUser} />
        );

      case "students":
        return <Students currentUser={currentUser} />;

      case "attendance":
        return <Attendance currentUser={currentUser} />;

      case "grades":
        return <Grades currentUser={currentUser} />;

      case "notes":
        return <StudentNotes currentUser={currentUser} />;

      case "schedule":
        return <Schedule currentUser={currentUser} />;

      case "report":
        return <Report currentUser={currentUser} />;

      // E-Learning Routes - Sesuai struktur file
      case "easymodul":
        return (
          <EasyModul
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        );

      case "easymateri":
        return (
          <EasyMateri
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        );

      case "easytext":
        return (
          <EasyText currentUser={currentUser} setCurrentPage={setCurrentPage} />
        );

      case "easyvocab":
        return (
          <EasyVocab
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        );

      case "easysoal":
        return (
          <EasySoal currentUser={currentUser} setCurrentPage={setCurrentPage} />
        );

      case "setting":
        return <Setting currentUser={currentUser} />;

      case "sistem":
        return <MonitorSistem currentUser={currentUser} />;

      default:
        return (
          <Dashboard onPageChange={setCurrentPage} currentUser={currentUser} />
        );
    }
  };

  // Jika belum login, tampilkan halaman Login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onShowToast={showToast} />;
  }

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-[70] animate-slide-in">
          <div
            className={`
            px-6 py-4 rounded-lg shadow-xl border-l-4 
            ${
              toast.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : toast.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-blue-50 border-blue-500 text-blue-800"
            }
          `}>
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {toast.type === "error" && (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <p className="font-semibold">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {/* Main Layout dengan semua halaman */}
      <Layout
        currentPage={currentPage}
        onPageChange={handlePageChange}
        currentUser={currentUser}
        onLogout={handleLogout}>
        {renderPage()}
      </Layout>
    </>
  );
}
