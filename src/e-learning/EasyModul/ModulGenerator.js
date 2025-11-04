import {
  getOfficialCP,
  getUnitDetails,
  GROQ_API_URL,
  GROQ_API_KEY,
  GROQ_CONFIG,
} from "./modulConfig";

export const ModulGenerator = {
  /**
   * Generate modul ajar menggunakan Groq API
   * @param {Object} params - Parameter untuk generate modul
   * @returns {Promise<Object>} - Modul data yang sudah di-parse
   */
  async generateModul(params) {
    const {
      namaSekolah,
      namaGuru,
      mapel,
      kelas,
      chapter,
      topik,
      alokasiWaktu,
      dimensi,
    } = params;

    // Validasi input params
    this.validateParams(params);

    const unitDetails = getUnitDetails(chapter, topik, kelas);
    const officialCP = getOfficialCP(kelas);

    const systemPrompt = this.generateSystemPrompt(kelas);
    const userPrompt = this.generateUserPrompt({
      namaSekolah,
      namaGuru,
      mapel,
      kelas,
      chapter,
      topik,
      alokasiWaktu,
      dimensi,
      unitDetails,
      officialCP,
    });

    const additionalInstructions = this.generateAdditionalInstructions(kelas);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_CONFIG.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt + additionalInstructions },
          ],
          max_tokens: GROQ_CONFIG.maxTokens,
          temperature: GROQ_CONFIG.temperature,
          top_p: GROQ_CONFIG.topP,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error?.message ||
          errorData.message ||
          response.statusText ||
          "Unknown error";

        throw new Error(`Groq API Error: ${errorMessage}`);
      }

      const data = await response.json();

      // Validasi response structure
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response structure from AI");
      }

      const generatedContent = data.choices[0].message.content;

      return this.parseGeneratedContent(generatedContent);
    } catch (error) {
      console.error("Modul Generation Error:", error);

      // User-friendly error messages
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "❌ Gagal terhubung ke server AI. Periksa koneksi internet Anda."
        );
      }

      if (error.message.includes("Groq API Error")) {
        throw new Error(
          `❌ Error dari AI: ${error.message.replace("Groq API Error: ", "")}`
        );
      }

      if (error.message.includes("Invalid response structure")) {
        throw new Error(
          "❌ Respons AI tidak valid. Silakan coba lagi dalam beberapa saat."
        );
      }

      if (error.message.includes("JSON") || error.message.includes("parse")) {
        throw new Error(
          "❌ AI menghasilkan format tidak valid. Silakan coba lagi."
        );
      }

      if (
        error.message.includes("NetworkError") ||
        error.message.includes("timeout")
      ) {
        throw new Error("❌ Koneksi terputus. Periksa jaringan internet Anda.");
      }

      // Fallback error message
      throw new Error(
        `❌ Terjadi kesalahan: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Generate modul dengan retry mechanism
   * @param {Object} params - Parameter untuk generate modul
   * @param {number} maxRetries - Maksimal percobaan ulang (default: 2)
   * @returns {Promise<Object>} - Modul data
   */
  async generateModulWithRetry(params, maxRetries = 2) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateModul(params);
      } catch (error) {
        lastError = error;

        // Jangan retry kalau error validasi input
        if (
          error.message.includes("Parameter") ||
          error.message.includes("wajib")
        ) {
          throw error;
        }

        // Jika masih ada kesempatan retry
        if (attempt < maxRetries) {
          console.warn(`Attempt ${attempt + 1} failed, retrying...`);
          // Delay sebelum retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  },

  /**
   * Validasi input parameters
   * @param {Object} params - Parameter yang akan divalidasi
   */
  validateParams(params) {
    const required = [
      "namaSekolah",
      "namaGuru",
      "mapel",
      "kelas",
      "topik",
      "alokasiWaktu",
      "dimensi",
    ];

    for (const field of required) {
      if (!params[field]) {
        throw new Error(`❌ Parameter '${field}' wajib diisi!`);
      }
    }

    // Validasi kelas
    if (!["7", "8", "9"].includes(params.kelas)) {
      throw new Error("❌ Kelas harus 7, 8, atau 9!");
    }

    // Validasi alokasi waktu
    if (params.alokasiWaktu < 1 || params.alokasiWaktu > 10) {
      throw new Error("❌ Alokasi waktu harus antara 1-10 JP!");
    }

    // Validasi dimensi
    if (!Array.isArray(params.dimensi) || params.dimensi.length === 0) {
      throw new Error(
        "❌ Dimensi profil lulusan harus berupa array dan tidak boleh kosong!"
      );
    }
  },

  /**
   * Generate system prompt berdasarkan kelas
   * @param {string} kelas - Kelas siswa (7, 8, atau 9)
   * @returns {string} - System prompt
   */
  generateSystemPrompt(kelas) {
    const kelasSpecs = {
      7: "Fokus pada pembelajaran dasar, aktivitas interaktif, dan membangun kepercayaan diri siswa dalam berbahasa Inggris dengan pendekatan yang menyenangkan dan kontekstual.",
      8: "Fokus pada pembelajaran berbasis nilai moral, lingkungan, dan pengembangan karakter dengan pendekatan storytelling dan project-based learning sederhana.",
      9: "Fokus pada berbagai jenis teks kompleks, critical thinking, dan project-based learning yang menantang.",
    };

    return `Anda adalah guru Bahasa Inggris expert Kurikulum Merdeka yang berpengalaman membuat Modul Ajar sesuai format resmi Kemendikdasmen 2025. Anda memiliki pemahaman mendalam tentang pedagogi pembelajaran mendalam (deep learning) yang berkesadaran, bermakna, dan menggembirakan.

SPESIALISASI KELAS ${kelas}:
${kelasSpecs[kelas]}

PENTING:
1. Berikan respons dalam format JSON yang valid dan lengkap dengan struktur yang terorganisir dan detail
2. Pastikan setiap komponen saling terkait dan koheren
3. Sesuaikan dengan fase perkembangan siswa (Fase D)
4. Integrasikan nilai-nilai Pancasila secara konkret dalam kegiatan pembelajaran
5. Gunakan pendekatan diferensiasi yang sesuai dengan kebutuhan heterogen siswa
6. Sertakan asesmen autentik yang bermakna`;
  },

  /**
   * Generate user prompt dengan detail parameter
   * @param {Object} params - Parameter untuk prompt
   * @returns {string} - User prompt
   */
  generateUserPrompt(params) {
    const {
      namaSekolah,
      namaGuru,
      mapel,
      kelas,
      topik,
      alokasiWaktu,
      dimensi,
      unitDetails,
      officialCP,
    } = params;

    return `
BUAT MODUL AJAR KOMPREHENSIF SESUAI FORMAT KEMENDIKDASMEN 2025 DENGAN KRITERIA BERIKUT:

INFORMASI UMUM:
- Nama Sekolah: ${namaSekolah}
- Nama Guru: ${namaGuru}
- Mata Pelajaran: ${mapel}
- Kelas: ${kelas} (Fase D)
- Unit/Tema: ${topik}
- Tipe Teks: ${unitDetails.textType || "General"}
- Alokasi Waktu: ${alokasiWaktu} JP (${alokasiWaktu * 40} menit)
- Dimensi Profil Lulusan: ${dimensi.join(", ")}

CAPAIAN PEMBELAJARAN RESMI:
- Elemen Menyimak-Berbicara: "${officialCP.listening_speaking}"
- Elemen Membaca-Memirsa: "${officialCP.reading_viewing}"
- Elemen Menulis-Mempresentasikan: "${officialCP.writing_presenting}"

MATERI PEMBELAJARAN:
- Sumber Utama: Buku "ENGLISH FOR NUSANTARA" Kelas ${kelas}
- Halaman: ${unitDetails.pages || "TBD"}
- Fokus Keterampilan: ${unitDetails.skills || "Integrated Skills"}
- Fokus Tata Bahasa: ${unitDetails.grammar || "Basic Grammar"}
- Kosakata Inti: ${unitDetails.vocabulary || "General vocabulary"}
- Jenis Teks: ${unitDetails.textType || "General"}
- Kompetensi Inti: ${unitDetails.coreCompetencies || "General communication"}

FORMAT OUTPUT JSON YANG DIMINTA:
${this.getJSONTemplate()}
`;
  },

  /**
   * Generate template JSON untuk modul ajar
   * @returns {string} - JSON template string
   */
  getJSONTemplate() {
    return `{
  "informasiUmum": {
    "identitas": {
      "namaSekolah": "[namaSekolah]",
      "namaGuru": "[namaGuru]",
      "fase": "D",
      "kelas": "[kelas]",
      "mataPelajaran": "Bahasa Inggris",
      "tema": "[topik]",
      "subTema": "[Tentukan sub-tema yang relevan berdasarkan topik utama]",
      "jenisText": "[textType]",
      "alokasiWaktu": "[alokasiWaktu] JP ([alokasiWaktu * 40] menit)",
      "tahunAjaran": "2024/2025",
      "mingguKe": "[Tentukan minggu ke- dalam semester]"
    },
    "bahanAjar": {
      "sumberUtama": "Buku English for Nusantara Kelas [kelas]",
      "halaman": "[pages]",
      "materiInti": "[Jelaskan materi inti yang akan diajarkan]",
      "prasyaratPengetahuan": "[Sebutkan pengetahuan prasyarat yang harus dikuasai siswa]"
    }
  },
  "capaianPembelajaran": {
    "elemen": ["Menyimak-Berbicara", "Membaca-Memirsa", "Menulis-Mempresentasikan"],
    "capaianUtama": {
      "menyimakBerbicara": "[listening_speaking]",
      "membacaMemirsa": "[reading_viewing]",
      "menulisMempresentasikan": "[writing_presenting]"
    },
    "indikatorKeberhasilan": [
      {
        "keterampilan": "Menyimak",
        "indikator": "[3-4 indikator spesifik kemampuan menyimak]"
      },
      {
        "keterampilan": "Berbicara",
        "indikator": "[3-4 indikator spesifik kemampuan berbicara]"
      },
      {
        "keterampilan": "Membaca",
        "indikator": "[3-4 indikator spesifik kemampuan membaca]"
      },
      {
        "keterampilan": "Menulis",
        "indikator": "[3-4 indikator spesifik kemampuan menulis]"
      }
    ]
  },
  "tujuanPembelajaran": {
    "tujuanUmum": "Setelah mengikuti pembelajaran, siswa mampu [coreCompetencies] menggunakan [textType] dengan tepat dalam konteks yang relevan",
    "tujuanKhusus": [
      {
        "aspek": "Pengetahuan",
        "tujuan": "[Tujuan terkait pengetahuan yang harus dikuasai]"
      },
      {
        "aspek": "Keterampilan", 
        "tujuan": "[Tujuan terkait keterampilan yang harus dimiliki]"
      },
      {
        "aspek": "Sikap",
        "tujuan": "[Tujuan terkait sikap yang dikembangkan]"
      }
    ],
    "kriteriaKeberhasilan": ["[Sebutkan kriteria keberhasilan pembelajaran dalam bentuk array string, setiap poin menjadi satu item]"]
  },
  "dimensiLulusan": {
    "dimensiUtama": "[dimensi]",
    "indikatorDimensi": [
      {
        "dimensi": "[Dimensi pertama]",
        "indikator": "[Indikator perilaku yang diharapkan]"
      },
      {
        "dimensi": "[Dimensi kedua]", 
        "indikator": "[Indikator perilaku yang diharapkan]"
      }
    ],
    "integrasiDalamPembelajaran": {
      "kegiatanIntegrasi": "[Jelaskan kegiatan konkret untuk mengintegrasikan nilai-nilai Pancasila]",
      "strategiPenguatan": "[Strategi untuk memperkuat internalisasi nilai]"
    }
  },
  "pendekatanPembelajaranMendalam": {
      "prinsip": "Berkesadaran, Bermakna, dan Menggembirakan",
      "penerapan": "[Jelaskan secara ringkas bagaimana seluruh rangkaian kegiatan pembelajaran dirancang untuk mewujudkan ketiga prinsip tersebut]"
  },
  "kegiatanPembelajaran": {
    "pendahuluan": {
      "waktu": "10 menit",
      "tujuan": "[Tujuan kegiatan pendahuluan]",
      "kegiatan": [
        "Guru membuka pembelajaran dengan salam, doa, dan presensi",
        "Guru melakukan apersepsi dengan menanyakan pengalaman siswa terkait [topik]",
        "Guru menyampaikan tujuan pembelajaran dan manfaatnya dalam kehidupan sehari-hari",
        "Guru memotivasi siswa dengan cerita, video pendek, atau gambar yang relevan",
        "Guru melakukan icebreaker singkat terkait tema"
      ],
      "metode": "Interactive questioning, storytelling, brainstorming",
      "media": "[Sebutkan media yang digunakan]",
      "nilaiKarakter": "Religius, Komunikatif, Rasa Ingin Tahu"
    },
    "inti": {
      "waktu": "[alokasiWaktu * 40 - 20] menit",
      "tahapan": {
        "eksplorasi": {
          "waktu": "[Math.floor((alokasiWaktu * 40 - 20) * 0.4)] menit",
          "tujuan": "[Tujuan tahap eksplorasi]",
          "kegiatan": [
            "Siswa mengamati [textType] dari buku halaman [pages]",
            "Guru memfasilitasi tanya jawab tentang isi [textType]",
            "Siswa mengidentifikasi [vocabulary] baru dan struktur [grammar]",
            "Siswa mengeksplorasi konteks penggunaan bahasa target"
          ],
          "metode": "Discovery learning, questioning, observation",
          "peranGuru": "Fasilitator, motivator",
          "peranSiswa": "Aktif mengeksplorasi, bertanya, mengamati"
        },
        "elaborasi": {
          "waktu": "[Math.floor((alokasiWaktu * 40 - 20) * 0.4)] menit",
          "tujuan": "[Tujuan tahap elaborasi]",
          "kegiatan": [
            "Siswa berlatih [skills] dalam kelompok kecil dengan panduan LKPD",
            "Guru memberikan guidance untuk penggunaan [grammar] yang tepat",
            "Siswa membuat karya sederhana menggunakan [textType]",
            "Siswa berkolaborasi menyelesaikan tugas proyek kecil"
          ],
          "metode": "Collaborative learning, project-based learning, practice",
          "peranGuru": "Pembimbing, pemberi umpan balik",
          "peranSiswa": "Berlatih, berkolaborasi, menghasilkan karya"
        },
        "konfirmasi": {
          "waktu": "[Math.floor((alokasiWaktu * 40 - 20) * 0.2)] menit",
          "tujuan": "[Tujuan tahap konfirmasi]",
          "kegiatan": [
            "Siswa mempresentasikan hasil kerja kelompok",
            "Guru memberikan feedback konstruktif dan penguatan",
            "Siswa melakukan refleksi terhadap proses pembelajaran",
            "Guru menjelaskan kembali konsep yang masih sulit dipahami"
          ],
          "metode": "Presentation, feedback, reflection",
          "peranGuru": "Evaluator, pemberi penguatan",
          "peranSiswa": "Mempresentasikan, merefleksi, mengkonfirmasi pemahaman"
        }
      },
      "nilaiKarakter": "Kolaboratif, Kreatif, Komunikatif, Percaya Diri"
    },
    "penutup": {
      "waktu": "10 menit",
      "tujuan": "[Tujuan kegiatan penutup]",
      "kegiatan": [
        "Guru dan siswa melakukan refleksi pembelajaran hari ini",
        "Siswa menyimpulkan materi yang telah dipelajari dengan bimbingan guru",
        "Guru memberikan umpan balik terhadap proses dan hasil belajar",
        "Guru memberikan preview materi selanjutnya dan tugas pengayaan",
        "Guru menutup pembelajaran dengan doa dan salam"
      ],
      "metode": "Reflection, summary, reinforcement",
      "nilaiKarakter": "Reflektif, Religius, Bertanggung Jawab"
    }
  },
  "diferensiasi": {
    "diferensiasiKonten": {
      "pemula": {
        "materi": "Materi dasar [textType] dengan vocabulary sederhana dan contoh konkret",
        "dukungan": "Scaffolding lebih banyak, contoh lebih detail, langkah-langkah terurai"
      },
      "menengah": {
        "materi": "Materi standar sesuai buku dengan latihan tambahan dan variasi konteks",
        "dukungan": "Guidance sesuai kebutuhan, contoh sedang, tantangan sesuai level"
      },
      "mahir": {
        "materi": "Materi diperkaya dengan sumber tambahan dan tantangan lebih kompleks",
        "dukungan": "Tantangan kreatif, proyek mandiri, kesempatan menjadi tutor sebaya"
      }
    },
    "diferensiasiProses": {
      "visual": "Menggunakan gambar, diagram, mind mapping, dan video demonstrasi",
      "auditori": "Mendengarkan audio, diskusi, presentasi lisan, dan podcast pendek",
      "kinestetik": "Role play, games, simulasi, dan aktivitas hands-on",
      "readwrite": "Membaca teks, menulis catatan, membuat ringkasan, dan worksheet terstruktur"
    },
    "diferensiasiProduk": {
      "pilihan1": {
        "jenis": "Presentasi lisan",
        "deskripsi": "Presentasi individu atau kelompok tentang hasil belajar"
      },
      "pilihan2": {
        "jenis": "Karya tulis kreatif",
        "deskripsi": "Menulis teks sesuai jenis teks yang dipelajari dengan tema bebas"
      },
      "pilihan3": {
        "jenis": "Video pendek atau poster digital",
        "deskripsi": "Membuat media visual yang merepresentasikan pemahaman konsep"
      },
      "pilihan4": {
        "jenis": "Proyek kolaboratif",
        "deskripsi": "Bekerja dalam kelompok menghasilkan produk tertentu"
      }
    }
  },
  "asesmen": {
    "asesmenFormatif": {
      "teknik": [
        "Observasi partisipasi selama pembelajaran",
        "Tanya jawab langsung untuk cek pemahaman",
        "Exit ticket di akhir pembelajaran",
        "Peer assessment dalam kerja kelompok",
        "Self-assessment melalui jurnal belajar",
        "Kuis singkat untuk evaluasi pemahaman"
      ],
      "instrumen": "Checklist observasi, rubrik penilaian, lembar cek pemahaman, kuis",
      "waktu": "Selama proses pembelajaran (on-process assessment)",
      "tujuan": "Memantau perkembangan belajar dan memberikan umpan balik segera"
    },
    "asesmenSumatif": {
      "teknik": [
        "Tes tertulis dengan soal objektif dan subjektif",
        "Performance assessment melalui presentasi", 
        "Portfolio assessment kumpulan karya siswa",
        "Project-based assessment untuk tugas akhir"
      ],
      "instrumen": "Soal tes, rubrik penilaian kinerja, panduan penilaian portofolio",
      "waktu": "Akhir pembelajaran atau sesuai jadwal (end-point assessment)",
      "tujuan": "Mengukur pencapaian hasil belajar secara komprehensif"
    },
    "rubrikPenilaian": {
      "aspekPenilaian": [
        {
          "aspek": "Pengetahuan",
          "indikator": "[Indikator penilaian pengetahuan]",
          "skala": "1-4 dengan deskripsi setiap level"
        },
        {
          "aspek": "Keterampilan",
          "indikator": "[Indikator penilaian keterampilan]",
          "skala": "1-4 dengan deskripsi setiap level"
        },
        {
          "aspek": "Sikap",
          "indikator": "[Indikator penilaian sikap]",
          "skala": "1-4 dengan deskripsi setiap level"
        }
      ]
    }
  },
  "sumberBelajar": {
    "sumberUtama": [
      "Buku English for Nusantara Kelas [kelas] halaman [pages]",
      "Buku guru dan buku siswa Kurikulum Merdeka",
      "Audio files dan video pendukung dari buku siswa"
    ],
    "sumberPendukung": [
      "Video pembelajaran dari YouTube atau platform edukasi lainnya",
      "Aplikasi pembelajaran bahasa Inggris interaktif",
      "Worksheet dan LKPD yang dikembangkan guru",
      "Real objects atau realia terkait tema",
      "Gambar, chart, dan poster pendukung"
    ],
    "teknologiDigital": [
      "Google Classroom untuk tugas dan diskusi",
      "Kahoot atau Quizizz untuk quiz interaktif",
      "Padlet untuk kolaborasi dan curah pendapat",
      "Canva untuk membuat presentasi dan poster",
      "Platform video untuk merekam presentasi"
    ]
  },
  "refleksiGuru": {
    "evaluasiPembelajaran": {
      "kelebihan": "[Catatan tentang aspek yang berjalan efektif]",
      "kendala": "[Identifikasi hambatan selama pembelajaran]",
      "strategiMengatasi": "[Rencana mengatasi kendala]"
    },
    "tindakLanjut": {
      "remedial": "Program untuk siswa yang belum mencapai target",
      "pengayaan": "Aktivitas untuk siswa yang telah mencapai target",
      "perbaikanRPP": "Penyempurnaan untuk pembelajaran berikutnya"
    },
    "catatanKhusus": {
      "siswaBerkebutuhan": "Observasi tentang siswa yang memerlukan perhatian khusus",
      "ketercapaianTujuan": "Analisis tingkat pencapaian tujuan pembelajaran",
      "rekomendasi": "Saran untuk pembelajaran topik serupa di masa datang"
    }
  }
}`;
  },

  /**
   * Generate additional instructions berdasarkan kelas
   * @param {string} kelas - Kelas siswa
   * @returns {string} - Additional instructions
   */
  generateAdditionalInstructions(kelas) {
    return `

PETUNJUK KHUSUS:
1. Isi semua bagian dalam kurung siku [] dengan konten yang relevan dan spesifik
2. Pastikan alokasi waktu untuk setiap kegiatan proporsional dan realistis
3. Rancang kegiatan yang sesuai dengan fase perkembangan siswa kelas ${kelas}
4. Integrasikan literasi digital dan keterampilan abad 21 dalam pembelajaran
5. Sertakan contoh konkret untuk setiap kegiatan pembelajaran
6. Gunakan pendekatan saintifik (5M) dalam kegiatan inti
7. Pastikan asesmen sesuai dengan tujuan pembelajaran yang ditetapkan
8. Berikan pilihan diferensiasi yang praktis dan dapat diterapkan
9. PENTING: Implementasikan pendekatan Pembelajaran Mendalam (Deep Learning) dalam seluruh kegiatan pembelajaran, khususnya pada bagian 'inti'. Pastikan kegiatan yang dirancang relevan dengan dimensi 'berkesadaran', 'bermakna', dan 'menggembirakan'.`;
  },

  /**
   * Parse dan validate generated content dari AI
   * @param {string} generatedContent - Raw content dari AI
   * @returns {Object} - Parsed modul data
   */
  parseGeneratedContent(generatedContent) {
    // Coba parse langsung dulu
    try {
      const directParse = JSON.parse(generatedContent);
      if (this.validateModulStructure(directParse)) {
        return directParse;
      }
    } catch (e) {
      // Lanjut ke regex parsing
    }

    // Extract JSON dari markdown atau text wrapper
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI tidak menghasilkan format JSON. Mohon coba kembali.");
    }

    try {
      const cleanJson = jsonMatch[0]
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const modulData = JSON.parse(cleanJson);

      // Validasi struktur modul
      if (!this.validateModulStructure(modulData)) {
        throw new Error("Struktur JSON tidak lengkap");
      }

      return modulData;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error(
        "AI menghasilkan format yang tidak valid. Coba ulangi atau periksa kembali isian Anda."
      );
    }
  },

  /**
   * Validasi struktur modul yang dihasilkan
   * @param {Object} data - Modul data yang akan divalidasi
   * @returns {boolean} - True jika struktur valid
   */
  validateModulStructure(data) {
    const requiredFields = [
      "informasiUmum",
      "capaianPembelajaran",
      "tujuanPembelajaran",
      "kegiatanPembelajaran",
      "diferensiasi",
      "asesmen",
      "sumberBelajar",
    ];

    // Cek apakah semua field yang diperlukan ada
    for (const field of requiredFields) {
      if (!data || !data[field]) {
        console.warn(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validasi nested structure
    if (
      !data.informasiUmum.identitas ||
      !data.capaianPembelajaran.capaianUtama ||
      !data.kegiatanPembelajaran.pendahuluan ||
      !data.kegiatanPembelajaran.inti ||
      !data.kegiatanPembelajaran.penutup
    ) {
      console.warn("Incomplete nested structure");
      return false;
    }

    return true;
  },
};
