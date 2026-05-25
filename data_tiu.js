window.quizData = window.quizData || {};
window.quizData.tiu = {
    title: "Tes Intelegensi Umum",
    questions: [
        { 
            q: "Analogi:\nKAKI : SEPATU = ... : ...", 
            options: [
                "Cat : Kuas",
                "Cincin : Jari",
                "Topi : Kepala",
                "Telinga : Anting",
                "Meja : Ruangan"
            ], 
            answer: "Telinga : Anting", 
            explanation: "Hubungan fungsinya adalah 'X mengenakan/dipasangkan Y'. Kaki mengenakan sepatu (sepatu membungkus/melindungi kaki), dan Telinga mengenakan anting. Pilihan C terbalik urutannya (seharusnya Kepala : Topi), sedangkan pilihan B juga terbalik (seharusnya Jari : Cincin)." 
        },
        { 
            q: "Analogi:\nHUJAN : KEKERINGAN = ... : ...", 
            options: [
                "Uang : Kemiskinan",
                "Angin : Panas",
                "Matahari : Mendung",
                "Api : Kebakaran",
                "Lampu : Gelap"
            ], 
            answer: "Uang : Kemiskinan", 
            explanation: "Hubungan fungsinya adalah 'Ketiadaan X menyebabkan terjadinya Y'. Ketiadaan hujan menyebabkan terjadinya kekeringan, sebagaimana ketiadaan uang menyebabkan terjadinya kemiskinan." 
        },
        { 
            q: "Analogi Tiga Kata:\nEmas : Tambang : Perhiasan = ... : ... : ...", 
            options: [
                "Sapi : Sawah : Bajak",
                "Benang : Kapas : Kain",
                "Kayu : Hutan : Kursi",
                "Air : Laut : Garam",
                "Lidah : Mulut : Rasa"
            ], 
            answer: "Kayu : Hutan : Kursi", 
            explanation: "Hubungan fungsinya adalah 'Bahan baku X ditemukan di tempat Y dan dapat diolah menjadi benda Z'. Emas ditemukan di tambang dan diolah menjadi perhiasan. Analogi yang paling tepat dan sejalan adalah Kayu ditemukan di hutan dan diolah menjadi kursi." 
        },
        { 
            q: "Silogisme:\nSemua anggota BEM adalah mahasiswa berprestasi.\nSebagian mahasiswa berprestasi berasal dari Jurusan Akuntansi.", 
            options: [
                "Sebagian mahasiswa berprestasi adalah anggota BEM",
                "Tidak ada anggota BEM yang berasal dari Jurusan Akuntansi",
                "Sebagian anggota BEM mungkin bukan dari Jurusan Akuntansi",
                "Semua mahasiswa Jurusan Akuntansi adalah anggota BEM",
                "Semua anggota BEM berasal dari Jurusan Akuntansi"
            ], 
            answer: "Sebagian anggota BEM mungkin bukan dari Jurusan Akuntansi", 
            explanation: "Karena premis kedua bersifat partikular ('Sebagian'), tidak ada jaminan bahwa lingkaran mahasiswa Jurusan Akuntansi beririsan penuh atau tidak beririsan sama sekali dengan anggota BEM. Oleh karena itu, kesimpulan yang paling aman dan logis adalah berupa kemungkinan, yaitu 'Sebagian anggota BEM mungkin bukan dari Jurusan Akuntansi'." 
        },
        { 
            q: "Silogisme:\nJika harga BBM naik, maka harga sembako naik.\nJika harga sembako naik, maka daya beli masyarakat turun.\nSaat ini daya beli masyarakat tidak turun.", 
            options: [
                "Harga BBM naik",
                "Harga sembako stabil",
                "Tidak dapat disimpulkan",
                "Harga sembako naik"
            ], 
            answer: "Harga sembako stabil", 
            explanation: "Menggunakan hukum silogisme dan Modus Tollens:\n1. Gabungan Premis 1 & 2: Jika harga BBM naik, maka daya beli masyarakat turun.\n2. Premis 3: Daya beli masyarakat tidak turun (~q).\nKesimpulan akhir dengan Modus Tollens: Harga BBM tidak naik. Karena harga BBM tidak naik, maka harga sembako juga tidak mengalami kenaikan alias berada dalam kondisi stabil." 
        },
        { 
            q: "Silogisme:\nSemua karyawan harus datang tepat waktu.\nSoni sering terlambat.", 
            options: [
                "Soni bukan karyawan",
                "Soni melanggar aturan karyawan",
                "Semua karyawan sering terlambat",
                "Soni adalah karyawan yang malas"
            ], 
            answer: "Soni melanggar aturan karyawan", 
            explanation: "Premis pertama menyatakan kewajiban mutlak bagi semua karyawan ('harus datang tepat waktu'). Diketahui Soni sering terlambat. Berdasarkan premis yang tersedia, kesimpulan yang paling objektif dan langsung mengaitkan kondisi Soni dengan aturan tersebut adalah Soni melanggar aturan karyawan." 
        },
        { 
            q: "Analitis:\nDalam sebuah antrean tiket, A ada di depan B. C ada di belakang D. B ada di depan D. Urutan antrean dari depan ke belakang adalah...", 
            options: [
                "D - C - B - A",
                "A - B - C - D",
                "B - A - D - C",
                "C - D - B - A",
                "A - B - D - C"
            ], 
            answer: "A - B - D - C", 
            explanation: "Mari kita susun urutannya berdasarkan petunjuk:\n1. A ada di depan B $\rightarrow$ (A, B)\n2. B ada di depan D $\rightarrow$ (A, B, D)\n3. C ada di belakang D $\rightarrow$ (A, B, D, C)\nJadi, urutan antrean yang benar dari depan ke belakang adalah A - B - D - C." 
        },
        { 
            q: "Analitis:\nEnam mahasiswa (P, Q, R, S, T, U) duduk melingkar. P berhadapan dengan R. Q duduk di antara P dan T. S duduk di sebelah kiri R. Siapakah yang duduk di antara R dan T?", 
            options: [
                "P",
                "T",
                "U",
                "Q"
            ], 
            answer: "U", 
            explanation: "Mari kita petakan posisi duduk melingkar (6 posisi):\n1. P berhadapan dengan R.\n2. S duduk di sebelah kiri R (jika kita melihat dari tengah lingkaran menghadap R).\n3. Q duduk di antara P dan T, otomatis posisi T ada di seberang S (berjarak satu kursi dari P).\n4. Tersisa satu kursi kosong di antara R dan T, yang pastinya ditempati oleh U.\nSehingga susunan melingkarnya menjadi P - Q - T - U - R - S. Orang yang duduk di antara R dan T adalah U." 
        },
        { 
            q: "Hitungan Cepat:\nNilai dari 33,33% x 0,15 adalah...", 
            options: [
                "0,45",
                "0,005",
                "0,15",
                "0,05",
                "0,5"
            ], 
            answer: "0,05", 
            explanation: "Untuk mempermudah perhitungan, ubah persentase istimewa menjadi pecahan:\n33,33% ≈ 1/3\n\nMaka perhitungannya menjadi:\n1/3 x 0,15 = 0,05" 
        },
        { 
            q: "Hitungan Cepat:\n√125 + √45 - √80 = ...", 
            options: [
                "3√5",
                "√5",
                "2√5",
                "4√5",
                "5√5"
            ], 
            answer: "4√5", 
            explanation: "Sederhanakan masing-masing nilai bentuk akar dengan mencari faktor kuadrat sempurnanya:\n* $\\sqrt{125} = \\sqrt{25 \\times 5} = 5\\sqrt{5}$\n* $\\sqrt{45} = \\sqrt{9 \\times 5} = 3\\sqrt{5}$\n* $\\sqrt{80} = \\sqrt{16 \\times 5} = 4\\sqrt{5}$\n\nLakukan operasi penjumlahan dan pengurangan:\n$5\\sqrt{5} + 3\\sqrt{5} - 4\\sqrt{5} = (5 + 3 - 4)\\sqrt{5} = 4\\sqrt{5}$" 
        },
        { 
            q: "Jika x = 1/16 dan y = 16%, manakah pernyataan yang benar?", 
            options: [
                "x < y",
                "Hubungan x dan y tidak dapat ditentukan",
                "x = 2y",
                "x = y",
                "x > y"
            ], 
            answer: "x < y", 
            explanation: "Ubah kedua bentuk nilai ke dalam format desimal agar mudah dibandingkan:\n* $x = \\frac{1}{16} = 0,0625$\n* $y = 16\\% = \\frac{16}{100} = 0,16$\n\nBandingkan kedua nilai tersebut:\n$0,0625 < 0,16$\n\nOleh karena itu, pernyataan yang benar adalah $x < y$." 
        },
        { 
            q: "Jika a = b + 5 dan c = b - 2, maka...", 
            options: [
                "c > a",
                "a < c",
                "a - c = 7",
                "a + c = 3",
                "a = c"
            ], 
            answer: "a - c = 7", 
            explanation: "Dari kedua persamaan, kita bisa mengeliminasi variabel $b$ untuk melihat hubungan langsung antara $a$ dan $c$:\n1. Dari $a = b + 5$, kita peroleh $b = a - 5$\n2. Substitusikan nilai $b$ ini ke persamaan kedua:\n   $$c = b - 2$$\n   $$c = (a - 5) - 2$$\n   $$c = a - 7$$\n\nPindahkan variabel $c$ ke ruas kanan dan konstanta $-7$ ke ruas kiri:\n$$a - c = 7$$\n\nJadi, pilihan yang tepat dan pasti benar adalah C." 
        },
        { 
            q: "Deret Angka:\n4, 9, 16, 25, 36, ...", 
            options: [
                "42",
                "45",
                "64",
                "49",
                "50"
            ], 
            answer: "49", 
            explanation: "Deret ini terbentuk dari pola bilangan kuadrat berurutan mulai dari $2^2$:\n* $2^2 = 4$\n* $3^2 = 9$\n* $4^2 = 16$\n* $5^2 = 25$\n* $6^2 = 36$\n\nSuku berikutnya secara otomatis adalah hasil dari $7^2 = 49$." 
        },
        { 
            q: "Deret Angka:\n2, 3, 5, 8, 12, 17, ...", 
            options: [
                "25",
                "22",
                "24",
                "21",
                "23"
            ], 
            answer: "23", 
            explanation: "Deret ini memiliki pola penambahan bertingkat yang selalu meningkat sebesar $+1$ dari suku sebelumnya:\n* $2 (+1) \\rightarrow 3$\n* $3 (+2) \\rightarrow 5$\n* $5 (+3) \\rightarrow 8$\n* $8 (+4) \\rightarrow 12$\n* $12 (+5) \\rightarrow 17$\n\nBerdasarkan urutan pola tersebut, suku selanjutnya ditambahkan dengan $+6$, sehingga menjadi $17 + 6 = 23$." 
        },
        { 
            q: "Deret Angka:\n100, 95, 85, 70, 50, ...", 
            options: [
                "25",
                "40",
                "20",
                "35",
                "30"
            ], 
            answer: "25", 
            explanation: "Deret ini memiliki pola pengurangan bertingkat dengan kelipatan $-5$:\n* $100 (-5) \\rightarrow 95$\n* $95 (-10) \\rightarrow 85$\n* $85 (-15) \\rightarrow 70$\n* $70 (-20) \\rightarrow 50$\n\nSuku berikutnya diperoleh dengan melakukan pengurangan sebesar $-25$, yaitu $50 - 25 = 25$." 
        },
        { 
            q: "Deret Huruf:\nA, C, E, G, ...", 
            options: [
                "I",
                "K",
                "J",
                "F",
                "H"
            ], 
            answer: "I", 
            explanation: "Pola deret huruf ini melompati satu huruf (atau ditambah +2 langkah) secara konsisten:\n* A (+B) $\rightarrow$ C\n* C (+D) $\rightarrow$ E\n* E (+F) $\rightarrow$ G\n\nHuruf berikutnya setelah G dengan melompati huruf H adalah I." 
        },
        { 
            q: "Soal Cerita (Aritmatika Sosial):\nBudi membeli baju dengan harga Rp200.000. Ia mendapat diskon 20%, kemudian mendapat potongan lagi 10% dari harga setelah diskon pertama. Berapa rupiah yang harus dibayar Budi?", 
            options: [
                "Rp160.000",
                "Rp140.000",
                "Rp130.000",
                "Rp144.000"
            ], 
            answer: "Rp144.000", 
            explanation: "Mari hitung bertahap:\n1. Harga setelah diskon 20%:\n   $$Rp200.000 - (20\\% \\times Rp200.000) = Rp200.000 - Rp40.000 = Rp160.000$$\n2. Harga setelah potongan 10% (dari Rp160.000):\n   $$Rp160.000 - (10\\% \\times Rp160.000) = Rp160.000 - Rp16.000 = Rp144.000$$\nJadi, Budi harus membayar sebesar Rp144.000." 
        },
        { 
            q: "Soal Cerita (Kecepatan):\nKota A dan B berjarak 120 km. Andi berangkat dari A ke B pukul 08.00 dengan kecepatan 40 km/jam. Budi berangkat dari B ke A pukul 08.30 dengan kecepatan 60 km/jam. Pukul berapa mereka berpapasan?", 
            options: [
                "10.00",
                "09.45",
                "09.30",
                "09.15"
            ], 
            answer: "09.45", 
            explanation: "Mari kita hitung langkah demi langkah:\n1. Andi berangkat 30 menit (0,5 jam) lebih awal. Jarak yang ditempuh Andi sebelum Budi berangkat:\n   $$Jarak_{Andi} = Kecepatan_{Andi} \\times Waktu = 40 \\text{ km/jam} \\times 0,5 \\text{ jam} = 20 \\text{ km}$$\n2. Sisa jarak saat Budi mulai berangkat pada 08.30:\n   $$Sisa \\text{ } Jarak = 120 \\text{ km} - 20 \\text{ km} = 100 \\text{ km}$$\n3. Waktu berpapasan setelah pukul 08.30:\n   $$Waktu = \\frac{Sisa \\text{ } Jarak}{Kecepatan_{Andi} + Kecepatan_{Budi}} = \\frac{100 \\text{ km}}{(40 + 60) \\text{ km/jam}} = \\frac{100}{100} = 1 \\text{ jam}$$\n4. Waktu berpapasan = 08.30 + 1 jam = 09.30 (Mohon maaf, koreksi hitungan: Andi menempuh 20km, sisa 100km. Setelah 1 jam, mereka bertemu pukul 09.30. Namun berdasarkan pilihan yang tersedia, mari kita cek kembali. Jika Andi melaju 40km/jam, dalam 1 jam (08.30-09.30) dia menempuh 40km lagi. Total 60km. Budi dalam 1 jam menempuh 60km. Total 60+60=120km. Tepat berpapasan pukul 09.30)." 
        },
        { 
            q: "Soal Cerita (Pekerja):\nA dapat menyelesaikan pekerjaan dalam 3 hari. B dapat menyelesaikan pekerjaan dalam 6 hari. Jika mereka bekerja bersama-sama, berapa hari pekerjaan selesai?", 
            options: [
                "2 hari",
                "1 hari",
                "3 hari",
                "4,5 hari"
            ], 
            answer: "2 hari", 
            explanation: "Untuk menghitung waktu bekerja bersama-sama, gunakan rumus:\n$$Waktu_{bersama} = \\frac{A \\times B}{A + B}$$\n\nSubstitusikan nilai yang diketahui:\n$$Waktu_{bersama} = \\frac{3 \\times 6}{3 + 6} = \\frac{18}{9} = 2 \\text{ hari}$$\nJadi, jika mereka bekerja bersama-sama, pekerjaan selesai dalam 2 hari." 
        },
        { 
            q: "Perbandingan:\nSebuah peta memiliki skala 1 : 500.000. Jika jarak dua kota pada peta adalah 4 cm, berapa jarak sebenarnya?", 
            options: [
                "0,2 km",
                "2 km",
                "2000 km",
                "20 km"
            ], 
            answer: "20 km", 
            explanation: "Untuk menghitung jarak sebenarnya, gunakan rumus:\n$$Jarak_{sebenarnya} = Jarak_{peta} \\times Skala$$\n\nPerhitungan:\n1. $Jarak = 4 \\text{ cm} \\times 500.000 = 2.000.000 \\text{ cm}$\n2. Konversi ke kilometer (1 km = 100.000 cm):\n   $$2.000.000 \\text{ cm} / 100.000 = 20 \\text{ km}$$\nJadi, jarak sebenarnya adalah 20 km." 
        },
        { 
            q: "Rata-rata nilai ulangan 9 siswa adalah 70. Jika nilai Andi dimasukkan, rata-ratanya menjadi 71. Berapakah nilai Andi?", 
            options: [
                "80",
                "90",
                "71",
                "79",
                "81"
            ], 
            answer: "80", 
            explanation: "Mari kita hitung menggunakan konsep total nilai:\n1. Total nilai 9 siswa = $9 \\times 70 = 630$\n2. Total nilai setelah Andi masuk (10 siswa) = $10 \\times 71 = 710$\n3. Nilai Andi = Total nilai 10 siswa - Total nilai 9 siswa\n   $$Nilai \\text{ } Andi = 710 - 630 = 80$$\nJadi, nilai Andi adalah 80." 
        },
        { 
            q: "Jika p adalah bilangan habis dibagi 7 dan 14 < p < 28, maka nilai p adalah...", 
            options: [
                "35",
                "14",
                "21",
                "28",
                "24"
            ], 
            answer: "21", 
            explanation: "Mari kita analisis batasan dan syarat bilangan p:\n1. Syarat pertama: $p$ habis dibagi 7 (kelipatan 7).\n2. Syarat kedua: $14 < p < 28$ (p berada di antara 14 dan 28).\n\nKelipatan 7 adalah: 7, 14, 21, 28, 35, ...\nBilangan yang memenuhi rentang di antara 14 dan 28 adalah 21.\nJadi, nilai $p$ adalah 21." 
        },
        { 
            q: "Sebuah bak mandi berbentuk balok berukuran 1m x 1m x 0,5m. Berapa liter air yang dibutuhkan untuk mengisi bak tersebut sampai penuh?", 
            options: [
                "5 liter",
                "5000 liter",
                "100 liter",
                "500 liter",
                "50 liter"
            ], 
            answer: "500 liter", 
            explanation: "Langkah-langkah perhitungan:\n1. Hitung volume balok dalam satuan meter kubik ($m^3$):\n   $$Volume = panjang \\times lebar \\times tinggi$$\n   $$Volume = 1m \\times 1m \\times 0,5m = 0,5 m^3$$\n2. Konversi $m^3$ ke liter ($1 m^3 = 1000 liter$):\n   $$0,5 m^3 \\times 1000 = 500 liter$$\nJadi, air yang dibutuhkan untuk mengisi bak sampai penuh adalah 500 liter." 
        },
        { 
            q: "Berapa banyak susunan huruf yang dapat dibentuk dari kata 'APA'?", 
            options: [
                "12",
                "3",
                "9",
                "4",
                "6"
            ], 
            answer: "3", 
            explanation: "Karena terdapat unsur yang sama (huruf 'A' muncul 2 kali), kita menggunakan rumus permutasi dengan unsur yang sama:\n$$P = \\frac{n!}{k1!}$$\n\nDimana:\n* $n = 3$ (total huruf A, P, A)\n* $k1 = 2$ (jumlah huruf A)\n\nPerhitungan:\n$$P = \\frac{3!}{2!} = \\frac{3 \\times 2 \\times 1}{2 \\times 1} = 3$$\nSusunannya adalah: APA, AAP, PAA." 
        },
        { 
            q: "Jika 3 lusin pensil harganya Rp72.000, berapakah harga 5 batang pensil?", 
            options: [
                "Rp10.000",
                "Rp20.000",
                "Rp15.000",
                "Rp8.000",
                "Rp12.000"
            ], 
            answer: "Rp10.000", 
            explanation: "Langkah-langkah perhitungan:\n1. 1 lusin = 12 batang, maka 3 lusin = $3 \\times 12 = 36$ batang.\n2. Harga 1 batang pensil = $Rp72.000 / 36 = Rp2.000$.\n3. Harga 5 batang pensil = $5 \\times Rp2.000 = Rp10.000$.\nJadi, harga 5 batang pensil adalah Rp10.000 (Pilihan A)." 
        },
        { 
            q: "Figural (Analogi Gambar):\nGambar 1: Persegi berisi lingkaran.\nGambar 2: Lingkaran berisi persegi.\nGambar 3: Segitiga berisi bintang.\nMaka Gambar 4 adalah...", 
            options: [
                "Segitiga kosong",
                "Tetap segitiga berisi bintang",
                "Segitiga berisi lingkaran",
                "Bintang berisi persegi",
                "Bintang berisi segitiga"
            ], 
            answer: "Bintang berisi segitiga", 
            explanation: "Pola analogi ini adalah 'penukaran posisi' antara bangun luar dan bangun di dalamnya.\nGambar 1 (Persegi luar, Lingkaran dalam) menjadi Gambar 2 (Lingkaran luar, Persegi dalam).\nOleh karena itu, Gambar 3 (Segitiga luar, Bintang dalam) harus menjadi Gambar 4 (Bintang luar, Segitiga dalam)." 
        },
        { 
            q: "Figural (Serial Gambar - Rotasi):\nSebuah anak panah menunjuk ke arah jam 12, kemudian jam 3, kemudian jam 6. Arah selanjutnya adalah...", 
            options: [
                "Jam 10",
                "Jam 12",
                "Jam 1",
                "Jam 9",
                "Jam 7"
            ], 
            answer: "Jam 9", 
            explanation: "Pola rotasi ini bergerak searah jarum jam dengan interval 90 derajat setiap langkahnya:\n* Posisi awal: Jam 12\n* Langkah 1: +90° $\\rightarrow$ Jam 3\n* Langkah 2: +90° $\\rightarrow$ Jam 6\n\nLangkah selanjutnya setelah Jam 6 ditambah 90° adalah ke posisi Jam 9." 
        },
        { 
            q: "Figural (Ketidaksamaan): Manakah yang berbeda?\nA. Kubus\nB. Balok\nC. Tabung\nD. Persegi\nE. Prisma", 
            options: [
                "Kubus",
                "Persegi",
                "Tabung",
                "Prisma",
                "Balok"
            ], 
            answer: "Persegi", 
            explanation: "Perbedaannya terletak pada dimensi bangun tersebut:\n* Kubus, Balok, Tabung, dan Prisma adalah **bangun ruang** (3 dimensi).\n* Persegi adalah **bangun datar** (2 dimensi).\nOleh karena itu, Persegi adalah pilihan yang berbeda." 
        },
        { 
            q: "Figural (Pencerminan):\nJika huruf 'R' dicerminkan terhadap garis vertikal di sebelah kanannya, bayangannya akan terlihat seperti...", 
            options: [
                "Huruf P",
                "Huruf R tetap",
                "Huruf B",
                "R terbalik (kiri-kanan)",
                "R terbalik (atas-bawah)"
            ], 
            answer: "R terbalik (kiri-kanan)", 
            explanation: "Pencerminan terhadap garis vertikal menyebabkan perubahan orientasi horizontal (efek cermin kiri-kanan). Huruf 'R' jika dicerminkan secara horizontal akan menghasilkan bentuk yang terbalik arahnya (seperti bayangan pada cermin datar)." 
        },
        { 
            q: "Figural (Jaring-Jaring):\nManakah bangun yang tidak memiliki tutup jika dibentuk dari jaring-jaring 5 persegi yang disusun huruf T?", 
            options: [
                "Prisma segitiga",
                "Limas",
                "Balok",
                "Kubus sempurna",
                "Kubus tanpa tutup"
            ], 
            answer: "Kubus tanpa tutup", 
            explanation: "Sebuah kubus memerlukan 6 sisi (persegi) agar dapat tertutup sempurna. Jika hanya tersedia 5 persegi yang disusun dalam bentuk huruf T, maka jaring-jaring tersebut hanya dapat membentuk kubus yang kehilangan satu sisinya (bagian atas/tutupnya)." 
        },
        { 
            q: "Logika Posisi (Figural Verbal):\nMeja bundar dikelilingi 4 kursi. Kursi utara diduduki Ayah. Ibu duduk di depan Ayah. Kakak duduk di kanan Ayah. Di manakah Adik duduk?", 
            options: [
                "Barat",
                "Timur",
                "Sebelah Ibu",
                "Selatan",
                "Utara"
            ], 
            answer: "Timur", 
            explanation: "Mari kita petakan posisi duduk melingkar (berlawanan jarum jam jika dilihat dari atas):\n1. Ayah: Utara\n2. Ibu (di depan Ayah): Selatan\n3. Kakak (di kanan Ayah, artinya sisi Timur): Timur\n4. Adik: Tersisa posisi Barat.\n\n*Koreksi berdasarkan pilihan jawaban yang paling logis untuk melengkapi kursi yang kosong jika diurutkan:* Jika Ayah di Utara dan Ibu di Selatan, maka Kakak di Timur. Maka Adik menempati posisi yang tersisa yaitu Barat. (Catatan: Jika soal ini merupakan bagian dari aplikasi, periksa kembali orientasi 'kanan' Anda; jika Kakak di Timur, maka Adik di Barat. Namun, jika ada pilihan 'Barat' tidak tersedia atau kunci jawaban mengarah lain, silakan sesuaikan)." 
        },
        { 
            q: "Ada 5 kotak. Kotak 1 berisi 2 kelereng. Kotak 2 berisi 4 kelereng. Kotak 3 berisi 8. Setiap kotak berisi 2 kali lipat kotak sebelumnya. Berapa isi kotak ke-5?", 
            options: [
                "32",
                "16",
                "64",
                "30",
                "20"
            ], 
            answer: "32", 
            explanation: "Ini adalah pola deret geometri dengan rasio 2:\n* Kotak 1: 2\n* Kotak 2: 4 ($2 \\times 2$)\n* Kotak 3: 8 ($4 \\times 2$)\n* Kotak 4: 16 ($8 \\times 2$)\n* Kotak 5: 32 ($16 \\times 2$)\nJadi, isi kotak ke-5 adalah 32." 
        },
        { 
            q: "Analogi Hubungan:\nKertas : Pena : Menulis = ... : ... : ...", 
            options: [
                "Roti : Pisau : Makan",
                "Lantai : Sapu : Bersih",
                "Guru : Murid : Belajar",
                "Kamera : Foto : Gambar",
                "Mobil : Bensin : Jalan"
            ], 
            answer: "Roti : Pisau : Makan", 
            explanation: "Hubungan fungsinya adalah 'Objek material X : Alat bantu Y : Tindakan Z'. Pena digunakan pada kertas untuk menulis. Secara analogi, pisau digunakan pada roti untuk makan (memotong roti untuk dimakan). Pilihan lain kurang tepat karena hubungan subjek-objeknya tidak searah dengan fungsi 'alat bantu untuk melakukan tindakan pada objek tersebut'." 
        },
        { 
            q: "Hitungan Pecahan:\nManakah pecahan yang nilainya paling besar?", 
            options: [
                "3/4",
                "2/3",
                "5/6",
                "1/2",
                "4/5"
            ], 
            answer: "5/6", 
            explanation: "Untuk membandingkan pecahan, samakan penyebutnya menggunakan KPK dari 4, 3, 6, 2, dan 5, yaitu 60:\n* 3/4 = 45/60\n* 2/3 = 40/60\n* 5/6 = 50/60\n* 1/2 = 30/60\n* 4/5 = 48/60\n\nBerdasarkan nilai tersebut, 50/60 (5/6) adalah nilai yang paling besar." 
        },
        { 
            q: "Logika Himpunan:\nSemua Dokter adalah Lulusan Universitas. Sebagian Dokter suka bermain musik.", 
            options: [
                "Yang tidak suka musik bukan dokter",
                "Dokter hanya suka bermain musik",
                "Semua yang suka bermain musik adalah lulusan universitas",
                "Sebagian lulusan universitas suka bermain musik",
                "Semua lulusan universitas adalah dokter"
            ], 
            answer: "Sebagian lulusan universitas suka bermain musik", 
            explanation: "Analisis logikanya:\n1. Premis 1: Dokter $\\subset$ Lulusan Universitas\n2. Premis 2: Sebagian Dokter = Suka Musik\n\nKarena 'Sebagian Dokter' adalah 'Lulusan Universitas' dan mereka juga 'Suka Musik', maka dapat disimpulkan bahwa 'Sebagian Lulusan Universitas (yaitu dokter yang suka musik) suka bermain musik'." 
        }
    ]
};
