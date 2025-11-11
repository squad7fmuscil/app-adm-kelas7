import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Save,
  Download,
  Upload,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader,
  Users,
  FileText,
  Calculator,
  Search,
} from "lucide-react";
import { ImportModal, exportToExcel } from "./GradesExport";

// Stats Card Component
const StatsCard = ({ icon: Icon, number, label, color }) => {
  const colorClasses = {
    blue: "border-l-blue-500 bg-gradient-to-r from-blue-50 to-white",
    green: "border-l-green-500 bg-gradient-to-r from-green-50 to-white",
    purple: "border-l-purple-500 bg-gradient-to-r from-purple-50 to-white",
    orange: "border-l-orange-500 bg-gradient-to-r from-orange-50 to-white",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${colorClasses[color]} p-4 hover:shadow-md transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{number}</p>
          <p className="text-sm font-medium text-gray-600">{label}</p>
        </div>
        <Icon size={28} className={iconColorClasses[color]} />
      </div>
    </div>
  );
};

// Mobile Student Card Component
const StudentGradeCard = ({
  student,
  index,
  selectedType,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">
                {index + 1}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600">NIS: {student.nis}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Nilai {selectedType}
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(student.nis, e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0-100"
          />
        </div>

        {student.isExisting && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <p className="text-green-700 text-xs font-medium text-center">
              ✓ Nilai sudah tersimpan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Rekap Card Component
const RekapGradeCard = ({ student, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">
                {index + 1}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600">NIS: {student.nis}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">NH-1</p>
          <p className="font-bold text-gray-900">{student.nh1 || "-"}</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">NH-2</p>
          <p className="font-bold text-gray-900">{student.nh2 || "-"}</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">NH-3</p>
          <p className="font-bold text-gray-900">{student.nh3 || "-"}</p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600">PSTS</p>
          <p className="font-bold text-gray-900">{student.psts || "-"}</p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600">PSAS</p>
          <p className="font-bold text-gray-900">{student.psas || "-"}</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600">Nilai Akhir</p>
          <p className="font-bold text-green-700 text-lg">
            {student.nilai_akhir || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Grades = ({ userData, currentUser }) => {
  // Support both userData and currentUser props
  const user = userData || currentUser;
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [students, setStudents] = useState([]);
  const [showRekap, setShowRekap] = useState(false);
  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRekap, setLoadingRekap] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // NEW: Teacher assignments state
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const teacherId = user?.teacher_id || user?.id;
  const currentSemester = "ganjil";
  const currentAcademicYear = "2025/2026";

  console.log("DEBUG Grades - user object:", user);
  console.log("DEBUG Grades - teacherId:", teacherId);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const jenisNilai = [
    { value: "NH1", label: "NH1 - Nilai Harian 1" },
    { value: "NH2", label: "NH2 - Nilai Harian 2" },
    { value: "NH3", label: "NH3 - Nilai Harian 3" },
    { value: "PSTS", label: "PSTS - Penilaian Sumatif Tengah Semester" },
    { value: "PSAS", label: "PSAS - Penilaian Sumatif Akhir Semester" },
  ];

  const fetchTeacherAssignments = async () => {
    setLoadingAssignments(true);

    if (!teacherId) {
      console.error("Teacher ID tidak ditemukan!");
      showMessage("Teacher ID tidak ditemukan di profil user", "error");
      setLoadingAssignments(false);
      return;
    }

    console.log("Fetching grade assignments for teacher:", teacherId);

    try {
      const { data, error } = await supabase
        .from("teacher_assignments")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("academic_year", currentAcademicYear)
        .eq("semester", currentSemester);

      console.log("Grade assignments query result:", { data, error });

      if (error) throw error;

      setTeacherAssignments(data || []);

      const classes = [...new Set(data?.map((a) => a.class_id) || [])].sort();
      const subjects = [...new Set(data?.map((a) => a.subject) || [])].sort();

      setAvailableClasses(classes);
      setAvailableSubjects(subjects);

      if (classes.length > 0) {
        setSelectedClass(classes[0]);
      }

      console.log("Available Classes for Grades:", classes);
      console.log("Available Subjects for Grades:", subjects);
    } catch (error) {
      console.error("Error fetching teacher assignments:", error);
      showMessage("Error memuat data assignment: " + error.message, "error");
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTeacherAssignments();
    } else {
      console.log("Waiting for teacherId...");
      setLoadingAssignments(false);
    }
  }, [teacherId, user]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.toString().includes(searchTerm)
  );

  const filteredRekapData = rekapData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.toString().includes(searchTerm)
  );

  const loadRekapNilai = async () => {
    if (!selectedClass) {
      showMessage("Pilih kelas terlebih dahulu!", "error");
      return;
    }

    setLoadingRekap(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .eq("class_id", selectedClass)
        .order("full_name");

      console.log("📊 Rekap - Students query:", {
        selectedClass,
        studentsData,
        studentsError,
      });

      if (studentsError) {
        console.error("❌ Students error:", studentsError);
        throw studentsError;
      }

      if (!studentsData || studentsData.length === 0) {
        showMessage("Tidak ada siswa di kelas ini", "error");
        setRekapData([]);
        setShowRekap(false);
        return;
      }

      const studentNIS = studentsData.map((s) => s.nis);

      const { data: allGrades, error: gradesError } = await supabase
        .from("grades")
        .select("*")
        .in("student_id", studentNIS);

      console.log("📊 Rekap - Grades query:", {
        studentNIS,
        allGrades,
        gradesError,
      });

      if (gradesError) {
        console.error("❌ Grades error:", gradesError);
        throw gradesError;
      }

      const gradeTypes = ["NH1", "NH2", "NH3", "PSTS", "PSAS"];

      const processedData = studentsData.map((student, index) => {
        const studentGrades = {};
        const nhGrades = [];

        gradeTypes.forEach((type) => {
          const grade = allGrades?.find(
            (g) => g.student_id === student.nis && g.category === type
          );
          studentGrades[type] = grade ? grade.score : "";

          if (type.startsWith("NH") && grade && grade.score) {
            nhGrades.push(parseFloat(grade.score));
          }
        });

        let nilaiAkhir = "";
        const pstsGrade = studentGrades["PSTS"]
          ? parseFloat(studentGrades["PSTS"])
          : 0;
        const psasGrade = studentGrades["PSAS"]
          ? parseFloat(studentGrades["PSAS"])
          : 0;

        if (nhGrades.length > 0 || pstsGrade > 0 || psasGrade > 0) {
          const avgNH =
            nhGrades.length > 0
              ? nhGrades.reduce((a, b) => a + b, 0) / nhGrades.length
              : 0;
          nilaiAkhir = (
            avgNH * 0.4 +
            pstsGrade * 0.3 +
            psasGrade * 0.3
          ).toFixed(1);
        }

        return {
          no: index + 1,
          nis: student.nis,
          name: student.full_name,
          nh1: studentGrades["NH1"],
          nh2: studentGrades["NH2"],
          nh3: studentGrades["NH3"],
          psts: studentGrades["PSTS"],
          psas: studentGrades["PSAS"],
          nilai_akhir: nilaiAkhir,
        };
      });

      setRekapData(processedData);
      setShowRekap(true);
      setStudents([]);

      const currentSubject =
        teacherAssignments.find((a) => a.class_id === selectedClass)?.subject ||
        user?.full_name ||
        "Mata Pelajaran";
      showMessage(
        `Rekap nilai ${currentSubject} ${selectedClass} berhasil dimuat!`
      );
    } catch (error) {
      console.error("❌ Error loading rekap:", error);
      showMessage("Error memuat rekap: " + error.message, "error");
    } finally {
      setLoadingRekap(false);
    }
  };

  const loadStudents = async (showNotification = true) => {
    if (!selectedClass || !selectedType) {
      if (showNotification) {
        showMessage("Pilih kelas dan jenis nilai terlebih dahulu!", "error");
      }
      return;
    }

    setLoading(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .eq("class_id", selectedClass)
        .order("full_name");

      console.log("📖 Load students query:", {
        selectedClass,
        studentsData,
        studentsError,
      });

      if (studentsError) {
        console.error("❌ Students error:", studentsError);
        throw studentsError;
      }

      if (!studentsData || studentsData.length === 0) {
        if (showNotification) {
          showMessage("Tidak ada siswa di kelas ini", "error");
        }
        setStudents([]);
        return;
      }

      const studentNIS = studentsData.map((s) => s.nis);

      const { data: gradesData, error: gradesError } = await supabase
        .from("grades")
        .select("*")
        .in("student_id", studentNIS)
        .eq("category", selectedType);

      console.log("📖 Load grades query:", {
        selectedType,
        gradesData,
        gradesError,
      });

      if (gradesError) {
        console.error("❌ Grades error:", gradesError);
        throw gradesError;
      }

      const combinedData = studentsData.map((student) => {
        const existingGrade = gradesData?.find(
          (grade) => grade.student_id === student.nis
        );

        return {
          nis: student.nis,
          name: student.full_name,
          class_id: student.class_id,
          score: existingGrade ? existingGrade.score : "",
          gradeId: existingGrade ? existingGrade.id : null,
          isExisting: !!existingGrade,
        };
      });

      console.log(
        "✅ Combined data prepared:",
        combinedData.length,
        "students"
      );

      setStudents(combinedData);
      if (showNotification) {
        const currentSubject =
          teacherAssignments.find((a) => a.class_id === selectedClass)
            ?.subject || "Mata Pelajaran";
        showMessage(
          `Data nilai ${selectedType} ${currentSubject} ${selectedClass} berhasil dimuat!`
        );
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
      showMessage("Error memuat data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedType && !loadingAssignments) {
      loadStudents();
      setShowRekap(false);
    } else {
      setStudents([]);
      setShowRekap(false);
    }
  }, [selectedClass, selectedType, loadingAssignments]);

  const saveGrades = async () => {
    if (students.length === 0) {
      showMessage("Tidak ada data untuk disimpan!", "error");
      return;
    }

    const dataToSave = students.filter((student) => {
      const score = student.score;
      return score !== "" && !isNaN(score);
    });

    if (dataToSave.length === 0) {
      showMessage("Masukkan minimal satu nilai untuk disimpan!", "error");
      return;
    }

    const currentSubject =
      teacherAssignments.find((a) => a.class_id === selectedClass)?.subject ||
      "Mata Pelajaran";

    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menyimpan ${dataToSave.length} nilai siswa?\n\n` +
        `Kelas: ${selectedClass}\n` +
        `Mata Pelajaran: ${currentSubject}\n` +
        `Jenis Nilai: ${selectedType}`
    );

    if (!isConfirmed) return;

    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      for (const student of dataToSave) {
        if (student.isExisting && student.gradeId) {
          const { error } = await supabase
            .from("grades")
            .update({
              score: parseFloat(student.score),
              date: today,
            })
            .eq("id", student.gradeId);

          if (error) {
            console.error("❌ Error updating grade:", error);
            throw error;
          }
          console.log("✅ Updated grade for student:", student.nis);
        } else {
          const gradeData = {
            student_id: student.nis,
            category: selectedType,
            score: parseFloat(student.score),
            date: today,
            notes: `${currentSubject} - ${selectedClass}`,
            created_at: new Date().toISOString(),
          };

          console.log("🔍 Inserting new grade:", gradeData);

          const { error } = await supabase.from("grades").insert(gradeData);

          if (error) {
            console.error("❌ Error inserting grade:", error);
            throw error;
          }
          console.log("✅ Inserted grade for student:", student.nis);
        }
      }

      showMessage(
        `✅ ${dataToSave.length} nilai berhasil disimpan!`,
        "success"
      );
      await loadStudents(false);
    } catch (error) {
      console.error("❌ Error saving grades:", error);
      showMessage("Error menyimpan data: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (studentNIS, value) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setStudents((prev) =>
        prev.map((student) =>
          student.nis === studentNIS ? { ...student, score: value } : student
        )
      );
    }
  };

  if (loadingAssignments) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-blue-600 mr-3" size={24} />
            <p className="text-gray-600">Memuat data assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (availableClasses.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ Tidak ada kelas yang di-assign untuk guru ini. Silakan hubungi
              admin untuk menambahkan teacher assignment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentSubject =
    teacherAssignments.find((a) => a.class_id === selectedClass)?.subject ||
    "Mata Pelajaran";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
          <div className="flex items-center gap-2">
            {message.type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            {message.text}
          </div>
        </div>
      )}

      {showRekap && rekapData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Users}
            number={rekapData.length}
            label="Total Siswa"
            color="blue"
          />
          <StatsCard
            icon={FileText}
            number={
              rekapData.filter((s) => s.nilai_akhir && s.nilai_akhir > 0).length
            }
            label="Nilai Terisi"
            color="green"
          />
          <StatsCard
            icon={Calculator}
            number={
              rekapData.filter((s) => s.nilai_akhir && s.nilai_akhir >= 70)
                .length
            }
            label="Tuntas"
            color="purple"
          />
          <StatsCard
            icon={BookOpen}
            number={
              rekapData.filter((s) => s.nilai_akhir && s.nilai_akhir < 70)
                .length
            }
            label="Remedial"
            color="orange"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {availableClasses.map((classId) => (
                <option key={classId} value={classId}>
                  Kelas {classId}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Mata Pelajaran: {currentSubject}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Nilai
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Pilih Jenis Nilai</option>
              {jenisNilai.map((jenis) => (
                <option key={jenis.value} value={jenis.value}>
                  {jenis.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(students.length > 0 || rekapData.length > 0) && (
          <div className="mb-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama siswa atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={loadRekapNilai}
            disabled={loadingRekap || !selectedClass}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
            {loadingRekap ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <BookOpen size={18} />
            )}
            {loadingRekap ? "Memuat..." : "Lihat Rekap"}
          </button>

          <button
            onClick={saveGrades}
            disabled={saving || students.length === 0 || showRekap}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
            {saving ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Menyimpan..." : "Simpan Nilai"}
          </button>

          <button
            onClick={() =>
              exportToExcel({
                selectedClass,
                selectedSubject: currentSubject,
                userData: user,
                showMessage,
              })
            }
            disabled={
              !selectedClass ||
              (students.length === 0 && rekapData.length === 0)
            }
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
            <Download size={18} />
            Export Excel
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            disabled={!selectedClass || !selectedType}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
            <Upload size={18} />
            Import Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {showRekap
              ? `Rekap Nilai - ${currentSubject} - ${selectedClass}`
              : selectedType && selectedClass
              ? `Nilai ${selectedType} - ${currentSubject} - ${selectedClass}`
              : "Daftar Nilai Siswa"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {loading || loadingRekap
              ? "Memuat data..."
              : showRekap
              ? `Menampilkan ${filteredRekapData.length} dari ${rekapData.length} siswa`
              : `Menampilkan ${filteredStudents.length} dari ${students.length} siswa`}
          </p>
        </div>

        {loading || loadingRekap ? (
          <div className="text-center py-12">
            <Loader
              className="animate-spin mx-auto mb-4 text-blue-600"
              size={48}
            />
            <p className="text-gray-500 font-medium">Memuat data nilai...</p>
          </div>
        ) : isMobile ? (
          <div className="p-4 space-y-4">
            {showRekap ? (
              filteredRekapData.length > 0 ? (
                filteredRekapData.map((student, index) => (
                  <RekapGradeCard
                    key={student.nis}
                    student={student}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    {searchTerm
                      ? "Tidak ada siswa yang cocok dengan pencarian"
                      : "Tidak ada data rekap nilai"}
                  </p>
                </div>
              )
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <StudentGradeCard
                  key={student.nis}
                  student={student}
                  index={index}
                  selectedType={selectedType}
                  value={student.score}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  {searchTerm
                    ? "Tidak ada siswa yang cocok dengan pencarian"
                    : selectedClass && selectedType
                    ? "Tidak ada siswa di kelas ini"
                    : "Pilih kelas dan jenis nilai"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {showRekap ? (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nama Siswa
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NH-1
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NH-2
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NH-3
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      PSTS
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      PSAS
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nilai Akhir
                    </th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nama Siswa
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {selectedType || "Nilai"}
                    </th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {showRekap ? (
                  filteredRekapData.length > 0 ? (
                    filteredRekapData.map((student) => (
                      <tr
                        key={student.nis}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {student.no}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.nis}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {student.nh1 || "-"}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {student.nh2 || "-"}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {student.nh3 || "-"}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {student.psts || "-"}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          {student.psas || "-"}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">
                          {student.nilai_akhir || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <BookOpen size={48} className="text-gray-300" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm
                              ? "Tidak ada siswa yang cocok dengan pencarian"
                              : "Tidak ada data rekap nilai"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student.nis}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.nis}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={student.score}
                          onChange={(e) =>
                            handleInputChange(student.nis, e.target.value)
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                          placeholder="0-100"
                          disabled={saving}
                        />
                        {student.isExisting && (
                          <div className="mt-1">
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              tersimpan
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={48} className="text-gray-300" />
                        <p className="text-gray-500 font-medium">
                          {searchTerm
                            ? "Tidak ada siswa yang cocok dengan pencarian"
                            : selectedClass && selectedType
                            ? "Tidak ada siswa di kelas ini"
                            : "Pilih kelas dan jenis nilai"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedClass={selectedClass}
        selectedSubject={currentSubject}
        userData={user}
        onImportSuccess={() => {
          setShowImportModal(false);
          loadStudents(false);
        }}
      />
    </div>
  );
};

export default Grades;
