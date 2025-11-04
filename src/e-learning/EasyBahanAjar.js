import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Link2,
  Trash2,
  Download,
  Edit2,
  Save,
  X,
  BookOpen,
  Folder,
  File,
} from "lucide-react";

const EasyBahanAjar = () => {
  // Struktur chapters sesuai buku English for Nusantara
  const chaptersStructure = [
    {
      id: 0,
      title: "Chapter 0: The Beginning",
      units: [{ id: 0, name: "Introduction" }],
    },
    {
      id: 1,
      title: "Chapter 1: About Me",
      units: [
        { id: 1, name: "Unit 1: Galang from Kalimantan" },
        { id: 2, name: "Unit 2: I Love Fishing" },
        { id: 3, name: "Unit 3: My Friends and I" },
      ],
    },
    {
      id: 2,
      title: "Chapter 2: Culinary and Me",
      units: [
        { id: 1, name: "Unit 1: My Favorite Food" },
        { id: 2, name: "Unit 2: My Favorite Snack" },
        { id: 3, name: "Unit 3: A Secret Recipe" },
      ],
    },
    {
      id: 3,
      title: "Chapter 3: Home Sweet Home",
      units: [
        { id: 1, name: "Unit 1: My House" },
        { id: 2, name: "Unit 2: My House Chores" },
        { id: 3, name: "Unit 3: Let's Clean Up!" },
      ],
    },
    {
      id: 4,
      title: "Chapter 4: My School Activities",
      units: [
        { id: 1, name: "Unit 1: My Class Schedule" },
        { id: 2, name: "Unit 2: My Online Class" },
        { id: 3, name: "Unit 3: My Study Habits" },
      ],
    },
    {
      id: 5,
      title: "Chapter 5: This is My School",
      units: [
        { id: 1, name: "Unit 1: School Buildings" },
        { id: 2, name: "Unit 2: Extracurricular Activities" },
        { id: 3, name: "Unit 3: School Festival" },
      ],
    },
  ];

  const materialTypes = [
    "Lesson Plan",
    "PPT/Slides",
    "Worksheet",
    "Vocabulary List",
    "Grammar Notes",
    "Practice Exercise",
    "Reading Text",
    "Listening Material",
    "Video Link",
    "Homework",
    "Quiz/Test",
    "Answer Key",
    "Other",
  ];

  const classes = ["7A", "7B", "7C", "7D", "7E", "7F", "All Classes"];

  const [materials, setMaterials] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    chapter: 1,
    unit: 1,
    title: "",
    type: "Worksheet",
    link: "",
    targetClass: "All Classes",
    notes: "",
    status: "Belum Dipakai",
  });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("easyBahanAjar");
    if (saved) {
      setMaterials(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("easyBahanAjar", JSON.stringify(materials));
  }, [materials]);

  const handleAddMaterial = () => {
    if (!formData.title || !formData.link) {
      alert("Judul dan Link/File harus diisi bre!");
      return;
    }

    const newMaterial = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    setMaterials([...materials, newMaterial]);
    resetForm();
    setShowAddModal(false);
  };

  const handleUpdateMaterial = () => {
    if (!formData.title || !formData.link) {
      alert("Judul dan Link/File harus diisi bre!");
      return;
    }

    setMaterials(
      materials.map((m) =>
        m.id === editingMaterial.id
          ? { ...formData, id: m.id, createdAt: m.createdAt }
          : m
      )
    );
    resetForm();
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("Yakin mau hapus material ini bre?")) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      chapter: selectedChapter,
      unit: selectedUnit,
      title: "",
      type: "Worksheet",
      link: "",
      targetClass: "All Classes",
      notes: "",
      status: "Belum Dipakai",
    });
  };

  const openAddModal = () => {
    setFormData({
      ...formData,
      chapter: selectedChapter,
      unit: selectedUnit,
    });
    setShowAddModal(true);
  };

  const openEditModal = (material) => {
    setFormData(material);
    setEditingMaterial(material);
  };

  const getChapterTitle = (chapterId) => {
    const chapter = chaptersStructure.find((c) => c.id === chapterId);
    return chapter ? chapter.title : `Chapter ${chapterId}`;
  };

  const getUnitName = (chapterId, unitId) => {
    const chapter = chaptersStructure.find((c) => c.id === chapterId);
    if (!chapter) return `Unit ${unitId}`;
    const unit = chapter.units.find((u) => u.id === unitId);
    return unit ? unit.name : `Unit ${unitId}`;
  };

  const getMaterialsByUnit = () => {
    let filtered = materials.filter(
      (m) => m.chapter === selectedChapter && m.unit === selectedUnit
    );

    if (filterType !== "all") {
      filtered = filtered.filter((m) => m.type === filterType);
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Belum Dipakai":
        return "bg-gray-100 text-gray-600";
      case "Sedang Dipakai":
        return "bg-blue-50 text-blue-600";
      case "Sudah Selesai":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const currentChapter = chaptersStructure.find(
    (c) => c.id === selectedChapter
  );
  const currentUnit = currentChapter?.units.find((u) => u.id === selectedUnit);
  const unitMaterials = getMaterialsByUnit();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-gray-700" size={28} />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  EasyBahanAjar
                </h1>
                <p className="text-sm text-gray-500">
                  English Grade 7 Teaching Materials
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Total Materials
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {materials.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Chapters</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {chaptersStructure.map((chapter) => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => {
                        setSelectedChapter(chapter.id);
                        setSelectedUnit(chapter.units[0].id);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedChapter === chapter.id
                          ? "bg-gray-50 border-l-2 border-gray-900"
                          : ""
                      }`}>
                      <div className="flex items-center gap-2">
                        <Folder size={16} className="text-gray-400" />
                        <span
                          className={`text-sm ${
                            selectedChapter === chapter.id
                              ? "font-medium text-gray-900"
                              : "text-gray-600"
                          }`}>
                          {chapter.title}
                        </span>
                      </div>
                    </button>
                    {selectedChapter === chapter.id && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {chapter.units.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => setSelectedUnit(unit.id)}
                            className={`w-full text-left px-4 py-2 pl-10 hover:bg-gray-100 transition-colors ${
                              selectedUnit === unit.id
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-600"
                            }`}>
                            <div className="flex items-center gap-2">
                              <File size={14} className="text-gray-400" />
                              <span className="text-xs">{unit.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Content Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentUnit?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {getChapterTitle(selectedChapter)}
                    </p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Plus size={16} />
                    Add Material
                  </button>
                </div>

                {/* Filter */}
                <div className="mt-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    <option value="all">All Types</option>
                    {materialTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Materials List */}
              <div className="p-6">
                {unitMaterials.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p className="text-gray-500">No materials yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click "Add Material" to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unitMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {material.title}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                  material.status
                                )}`}>
                                {material.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <FileText size={14} />
                                {material.type}
                              </span>
                              <span>•</span>
                              <span>{material.targetClass}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-2">
                              <Link2 size={14} className="text-gray-400" />
                              <a
                                href={material.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 hover:underline truncate max-w-xl">
                                {material.link}
                              </a>
                            </div>
                            {material.notes && (
                              <p className="text-sm text-gray-600 italic mt-2 pl-5">
                                "{material.notes}"
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-3">
                              Added{" "}
                              {new Date(material.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <button
                              onClick={() =>
                                window.open(material.link, "_blank")
                              }
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Open Link">
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => openEditModal(material)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit">
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingMaterial) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaterial ? "Edit Material" : "Add New Material"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMaterial(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter
                  </label>
                  <select
                    value={formData.chapter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chapter: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    {chaptersStructure.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unit: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    {chaptersStructure
                      .find((c) => c.id === formData.chapter)
                      ?.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Simple Present Tense Worksheet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    {materialTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Class
                  </label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) =>
                      setFormData({ ...formData, targetClass: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link/URL *
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="Google Drive, YouTube, OneDrive, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste link from Google Drive, YouTube, or other file hosting
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                  <option value="Belum Dipakai">Belum Dipakai</option>
                  <option value="Sedang Dipakai">Sedang Dipakai</option>
                  <option value="Sudah Selesai">Sudah Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Personal notes: teaching experience, student response, etc."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={
                    editingMaterial ? handleUpdateMaterial : handleAddMaterial
                  }
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingMaterial ? "Update Material" : "Save Material"}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMaterial(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EasyBahanAjar;
