// AttendanceExcel.js - Excel Export Logic with Modal
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React, { useState } from "react";

/**
 * Modal component for month/year selection
 */
const ExportModal = ({ show, onClose, onExport, loading }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Initialize with current month/year when modal opens
  React.useEffect(() => {
    if (show) {
      const now = new Date();
      setSelectedYear(now.getFullYear().toString());
      setSelectedMonth(String(now.getMonth() + 1).padStart(2, "0"));
    }
  }, [show]);

  const handleExport = () => {
    if (!selectedMonth || !selectedYear) return;

    const yearMonth = `${selectedYear}-${selectedMonth}`;
    onExport(yearMonth);
  };

  if (!show) return null;

  // Year options
  const yearOptions = [];
  for (let year = 2025; year <= 2030; year++) {
    yearOptions.push(year);
  }

  // Month names
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header - Blue theme */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Export Excel</h2>
              <p className="text-blue-100 text-sm">
                Pilih periode untuk diunduh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-blue-600 rounded-lg transition disabled:opacity-50">
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Month Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="">-- Pilih Bulan --</option>
              {monthNames.map((name, index) => (
                <option key={index} value={String(index + 1).padStart(2, "0")}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tahun
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="">-- Pilih Tahun --</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-700">
                  Data akan diekspor dalam format Excel (.xlsx) untuk periode
                  yang dipilih
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50">
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={loading || !selectedMonth || !selectedYear}
              className="flex-1 px-4 py-3 bg-blue-500 border border-blue-600 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main export function with modal
 */
export const exportToExcel = async ({
  rekapData,
  attendanceDates,
  getPeriodLabel,
  attendanceMode,
  selectedClass,
  homeroomClass,
  selectedSubject,
  teacherName = null,
  onShowToast = null,
}) => {
  // Create a wrapper to show the modal
  const showModal = () => {
    return new Promise((resolve) => {
      // Create modal container
      const modalContainer = document.createElement("div");
      modalContainer.id = "export-modal-container";
      document.body.appendChild(modalContainer);

      // Render modal component
      const ModalWrapper = () => {
        const [show, setShow] = useState(true);
        const [loading, setLoading] = useState(false);

        const handleClose = () => {
          setShow(false);
          setTimeout(() => {
            document.body.removeChild(modalContainer);
          }, 300);
          resolve(null);
        };

        const handleExport = async (yearMonth) => {
          setLoading(true);
          try {
            await performExport(yearMonth);
            setShow(false);
            setTimeout(() => {
              document.body.removeChild(modalContainer);
            }, 300);
            resolve(yearMonth);
          } catch (error) {
            console.error("Export error:", error);
            onShowToast?.(
              "Gagal mengunduh file Excel: " + error.message,
              "error"
            );
            setLoading(false);
          }
        };

        const performExport = async (yearMonth) => {
          try {
            if (!rekapData || rekapData.length === 0) {
              onShowToast?.("Tidak ada data siswa untuk diexport!", "error");
              return;
            }

            const workbook = new ExcelJS.Workbook();
            const detailSheet = workbook.addWorksheet("Rekap Presensi");

            // Calculate total columns
            const baseCols = 3; // No, NIS, Nama
            const dateCols = attendanceDates.length;
            const summaryCols = 6; // Hadir, Izin, Sakit, Alpa, Total, %
            const totalCols = baseCols + dateCols + summaryCols;

            // Title
            detailSheet.mergeCells(1, 1, 1, totalCols);
            const detailTitleCell = detailSheet.getCell("A1");
            detailTitleCell.value = "SMP MUSLIMIN CILILIN";
            detailTitleCell.font = { name: "Arial", size: 14, bold: true };
            detailTitleCell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
            detailSheet.getRow(1).height = 22;

            // Subtitle
            detailSheet.mergeCells(2, 1, 2, totalCols);
            const detailSubtitleCell = detailSheet.getCell("A2");
            detailSubtitleCell.value = `REKAP PRESENSI KELAS ${
              attendanceMode === "subject" ? selectedClass : homeroomClass
            }`;
            detailSubtitleCell.font = { name: "Arial", size: 12, bold: true };
            detailSubtitleCell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
            detailSheet.getRow(2).height = 20;

            // Period info
            detailSheet.mergeCells(3, 1, 3, totalCols);
            const periodCell = detailSheet.getCell("A3");
            periodCell.value = `MATA PELAJARAN: ${
              attendanceMode === "subject" ? selectedSubject : "PRESENSI HARIAN"
            } - ${getPeriodLabel()}`;
            periodCell.font = { name: "Arial", size: 10, bold: true };
            periodCell.alignment = { horizontal: "center", vertical: "middle" };
            detailSheet.getRow(3).height = 18;

            // Empty row
            detailSheet.addRow([]);

            // Headers
            const detailHeaders = [
              "No",
              "NIS",
              "Nama Siswa",
              ...attendanceDates.map((date) => {
                const d = new Date(date + "T00:00:00");
                return `${d.getDate()}-${d.getMonth() + 1}`;
              }),
              "Hadir",
              "Izin",
              "Sakit",
              "Alpa",
              "Total",
              "%",
            ];

            const headerRow = detailSheet.addRow(detailHeaders);
            headerRow.font = { name: "Arial", size: 10, bold: true };
            headerRow.alignment = { horizontal: "center", vertical: "middle" };
            headerRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE8F4FD" },
            };
            headerRow.height = 20;

            // Add borders to header
            headerRow.eachCell((cell) => {
              cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              };
            });

            // Data rows
            rekapData.forEach((student) => {
              const row = [
                student.no,
                student.nis || "-",
                student.name,
                ...attendanceDates.map((date) => {
                  const status = student.dailyStatus[date];
                  if (!status) return "";
                  return status.charAt(0).toUpperCase();
                }),
                student.hadir,
                student.izin,
                student.sakit,
                student.alpa,
                student.total,
                student.percentage,
              ];

              const dataRow = detailSheet.addRow(row);
              dataRow.font = { name: "Arial", size: 9 };

              // Alignment
              dataRow.getCell(1).alignment = {
                horizontal: "center",
                vertical: "middle",
              };
              dataRow.getCell(2).alignment = {
                horizontal: "center",
                vertical: "middle",
              };
              dataRow.getCell(3).alignment = {
                horizontal: "left",
                vertical: "middle",
              };

              // Date columns alignment and coloring
              for (let i = 4; i <= 3 + attendanceDates.length; i++) {
                dataRow.getCell(i).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                };

                const value = dataRow.getCell(i).value;
                if (value === "H") {
                  dataRow.getCell(i).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD4F1D4" },
                  };
                } else if (value === "S") {
                  dataRow.getCell(i).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFF4CD" },
                  };
                } else if (value === "I") {
                  dataRow.getCell(i).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFCDE4FF" },
                  };
                } else if (value === "A") {
                  dataRow.getCell(i).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFD4D4" },
                  };
                }
              }

              // Summary columns alignment
              const summaryStartCol = 4 + attendanceDates.length;
              for (let i = 0; i < 6; i++) {
                dataRow.getCell(summaryStartCol + i).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                };
              }

              // Borders
              dataRow.eachCell((cell) => {
                cell.border = {
                  top: { style: "thin" },
                  bottom: { style: "thin" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                };
              });

              dataRow.height = 18;
            });

            // Column widths
            detailSheet.getColumn(1).width = 5;
            detailSheet.getColumn(2).width = 12;

            const maxNameLength = Math.max(
              ...rekapData.map((s) => s.name.length)
            );
            detailSheet.getColumn(3).width = Math.min(
              Math.max(maxNameLength + 2, 20),
              40
            );

            for (let i = 0; i < attendanceDates.length; i++) {
              detailSheet.getColumn(4 + i).width = 6;
            }

            const summaryStartCol = 4 + attendanceDates.length;
            detailSheet.getColumn(summaryStartCol).width = 8;
            detailSheet.getColumn(summaryStartCol + 1).width = 8;
            detailSheet.getColumn(summaryStartCol + 2).width = 8;
            detailSheet.getColumn(summaryStartCol + 3).width = 8;
            detailSheet.getColumn(summaryStartCol + 4).width = 8;
            detailSheet.getColumn(summaryStartCol + 5).width = 12;

            // Footer with teacher signature
            const footerStartRow = 5 + rekapData.length + 2;
            const isHomeroomDaily = attendanceMode !== "subject";
            const roleTitle = isHomeroomDaily
              ? "Wali Kelas"
              : "Guru Mata Pelajaran";
            const signatureCol = Math.max(6, totalCols - 3);

            detailSheet.getCell(footerStartRow, signatureCol).value =
              "Mengetahui";
            detailSheet.getCell(footerStartRow, signatureCol).font = {
              name: "Arial",
              size: 10,
            };
            detailSheet.getCell(footerStartRow, signatureCol).alignment = {
              horizontal: "center",
            };

            detailSheet.getCell(footerStartRow + 1, signatureCol).value =
              roleTitle;
            detailSheet.getCell(footerStartRow + 1, signatureCol).font = {
              name: "Arial",
              size: 10,
            };
            detailSheet.getCell(footerStartRow + 1, signatureCol).alignment = {
              horizontal: "center",
            };

            const nameRow = footerStartRow + 5;
            const displayName = teacherName || "(____________________)";
            detailSheet.getCell(nameRow, signatureCol).value = displayName;
            detailSheet.getCell(nameRow, signatureCol).font = {
              name: "Arial",
              size: 10,
              bold: true,
              underline: true,
            };
            detailSheet.getCell(nameRow, signatureCol).alignment = {
              horizontal: "center",
            };

            // Generate and download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const filename = `Rekap_Presensi_${
              attendanceMode === "subject" ? selectedClass : homeroomClass
            }_${yearMonth.replace(/-/g, "_")}.xlsx`;

            saveAs(blob, filename);
            onShowToast?.("File Excel berhasil diunduh!", "success");
          } catch (error) {
            console.error("Error exporting to Excel:", error);
            throw error;
          }
        };

        return (
          <ExportModal
            show={show}
            onClose={handleClose}
            onExport={handleExport}
            loading={loading}
          />
        );
      };

      // Render the modal
      import("react-dom/client").then(({ createRoot }) => {
        const root = createRoot(modalContainer);
        root.render(<ModalWrapper />);
      });
    });
  };

  // Show modal and wait
  const selectedPeriod = await showModal();
  return selectedPeriod;
};
