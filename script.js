// ==========================================
// MANAJEMEN DATA ARTIKEL
// ==========================================

// Ambil artikel dari localStorage
function getArtikel() {
    const data = localStorage.getItem('artikel');
    return data ? JSON.parse(data) : [];
}

// Simpan artikel ke localStorage
function saveArtikel(artikel) {
    localStorage.setItem('artikel', JSON.stringify(artikel));
}

// Tambah artikel baru
function tambahArtikel(event) {
    event.preventDefault();

    const judulArtikel = document.getElementById('judulArtikel').value.trim();
    const kontenArtikel = document.getElementById('kontenArtikel').value.trim();
    const uploadFoto = document.getElementById('uploadFoto').files[0];
    const linkArtikel = document.getElementById('linkArtikel').value.trim();

    // Validasi input
    if (!judulArtikel || !kontenArtikel) {
        alert('Judul dan konten tidak boleh kosong!');
        return;
    }

    // Buat object artikel baru
    const artikel = {
        id: Date.now(),
        judul: judulArtikel,
        konten: kontenArtikel,
        foto: null,
        link: linkArtikel || null,
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    // Handle foto jika ada
    if (uploadFoto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            artikel.foto = e.target.result; // Base64 string
            
            // Simpan ke localStorage
            const daftarArtikel = getArtikel();
            daftarArtikel.push(artikel);
            saveArtikel(daftarArtikel);

            // Reset form
            document.getElementById('formArtikel').reset();
            document.getElementById('previewFoto').innerHTML = '';

            // Tampilkan notifikasi sukses
            alert('Artikel berhasil dipublikasikan!');

            // Refresh tampilan artikel
            tampilkanArtikel();
        };
        reader.readAsDataURL(uploadFoto);
    } else {
        // Simpan tanpa foto
        const daftarArtikel = getArtikel();
        daftarArtikel.push(artikel);
        saveArtikel(daftarArtikel);

        // Reset form
        document.getElementById('formArtikel').reset();
        document.getElementById('previewFoto').innerHTML = '';

        alert('Artikel berhasil dipublikasikan!');
        tampilkanArtikel();
    }
}

// Tampilkan semua artikel
function tampilkanArtikel() {
    const daftarArtikel = getArtikel();
    const container = document.getElementById('daftarArtikel');

    // Kosongkan container
    container.innerHTML = '';

    // Jika tidak ada artikel
    if (daftarArtikel.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Belum ada artikel. Mulai publikasikan artikel Anda!</p>';
        return;
    }

    // Tampilkan setiap artikel (urutan terbaru di depan)
    daftarArtikel.reverse().forEach(artikel => {
        const card = document.createElement('div');
        card.className = 'artikel-card';
        card.innerHTML = `
            ${artikel.foto ? `<img src="${artikel.foto}" alt="${artikel.judul}" class="artikel-foto">` : ''}
            <div class="artikel-content">
                <h4>${artikel.judul}</h4>
                <p style="color: #aaa; font-size: 12px; margin-bottom: 10px;">📅 ${artikel.tanggal}</p>
                <p style="color: #ddd; margin-bottom: 10px; line-height: 1.5;">${artikel.konten.substring(0, 100)}...</p>
                ${artikel.link ? `<a href="${artikel.link}" target="_blank" class="artikel-link">🔗 Baca selengkapnya</a>` : ''}
                <button onclick="hapusArtikel(${artikel.id})" class="btn-hapus-artikel">🗑️ Hapus</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Hapus artikel
function hapusArtikel(id) {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
        let daftarArtikel = getArtikel();
        daftarArtikel = daftarArtikel.filter(artikel => artikel.id !== id);
        saveArtikel(daftarArtikel);
        tampilkanArtikel();
        alert('Artikel berhasil dihapus!');
    }
}

// ==========================================
// MANAJEMEN LINK SOSIAL
// ==========================================

// Ambil link sosial dari localStorage
function getLinkSosial() {
    const data = localStorage.getItem('linkSosial');
    return data ? JSON.parse(data) : [];
}

// Simpan link sosial ke localStorage
function saveLinkSosial(links) {
    localStorage.setItem('linkSosial', JSON.stringify(links));
}

// Tambah link sosial
function tambahLinkSosial() {
    const input = document.getElementById('linkSosial');
    const url = input.value.trim();

    // Validasi URL
    if (!url) {
        alert('Masukkan link sosial media!');
        return;
    }

    // Validasi format URL
    try {
        new URL(url);
    } catch (e) {
        alert('Format URL tidak valid!');
        return;
    }

    // Cek duplikat
    const linkSosial = getLinkSosial();
    if (linkSosial.some(link => link.url === url)) {
        alert('Link ini sudah ada!');
        return;
    }

    // Buat object link baru
    const link = {
        id: Date.now(),
        url: url,
        nama: extractSocialName(url)
    };

    // Tambah ke localStorage
    linkSosial.push(link);
    saveLinkSosial(linkSosial);

    // Reset input
    input.value = '';

    // Tampilkan notifikasi
    alert('Link sosial media berhasil ditambahkan!');

    // Refresh tampilan
    tampilkanLinkSosial();
}

// Extract nama platform dari URL
function extractSocialName(url) {
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('twitter') || url.includes('x.com')) return 'Twitter/X';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('tiktok')) return 'TikTok';
    if (url.includes('github')) return 'GitHub';
    if (url.includes('whatsapp')) return 'WhatsApp';
    if (url.includes('telegram')) return 'Telegram';
    if (url.includes('discord')) return 'Discord';
    return 'Media Sosial';
}

// Tampilkan link sosial
function tampilkanLinkSosial() {
    const linkSosial = getLinkSosial();
    const container = document.getElementById('daftarLinkSosial');

    // Kosongkan container
    container.innerHTML = '';

    // Jika tidak ada link
    if (linkSosial.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">Belum ada link sosial. Tambahkan link Anda!</p>';
        return;
    }

    // Tampilkan setiap link
    linkSosial.forEach(link => {
        const linkElement = document.createElement('div');
        linkElement.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #1a1a1a; border: 1px solid #444; border-radius: 5px; margin-bottom: 10px; transition: all 0.3s ease;';
        linkElement.innerHTML = `
            <a href="${link.url}" target="_blank" class="social-link" style="flex: 1; text-decoration: none; display: flex; align-items: center; gap: 10px;">
                ${getSocialIcon(link.nama)} <span>${link.nama}</span>
            </a>
            <button onclick="hapusLinkSosial(${link.id})" class="btn-hapus" style="margin-left: 10px;">✕</button>
        `;
        linkElement.addEventListener('mouseenter', function () {
            this.style.borderColor = '#ff6b6b';
            this.style.backgroundColor = '#2a2a2a';
        });
        linkElement.addEventListener('mouseleave', function () {
            this.style.borderColor = '#444';
            this.style.backgroundColor = '#1a1a1a';
        });
        container.appendChild(linkElement);
    });
}

// Get icon untuk social media
function getSocialIcon(nama) {
    const icons = {
        'Instagram': '📷',
        'Facebook': '👍',
        'Twitter/X': '𝕏',
        'YouTube': '🎥',
        'LinkedIn': '💼',
        'TikTok': '🎵',
        'GitHub': '🐙',
        'WhatsApp': '💬',
        'Telegram': '✈️',
        'Discord': '🎮'
    };
    return icons[nama] || '🔗';
}

// Hapus link sosial
function hapusLinkSosial(id) {
    if (confirm('Yakin ingin menghapus link ini?')) {
        let linkSosial = getLinkSosial();
        linkSosial = linkSosial.filter(link => link.id !== id);
        saveLinkSosial(linkSosial);
        tampilkanLinkSosial();
    }
}

// ==========================================
// PREVIEW FOTO
// ==========================================

document.getElementById('uploadFoto')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('previewFoto');

    if (file) {
        // Validasi ukuran file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB');
            this.value = '';
            previewContainer.innerHTML = '';
            return;
        }

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar!');
            this.value = '';
            previewContainer.innerHTML = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            previewContainer.innerHTML = `
                <div style="position: relative; margin-top: 10px; border-radius: 5px; overflow: hidden;">
                    <img src="${event.target.result}" alt="Preview Foto" style="width: 100%; max-height: 300px; border-radius: 5px; object-fit: cover; display: block;">
                    <p style="color: #aaa; font-size: 12px; margin-top: 8px;">✓ Foto siap dipublikasikan</p>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.innerHTML = '';
    }
});

// ==========================================
// FORM SUBMISSION
// ==========================================

document.getElementById('formArtikel')?.addEventListener('submit', tambahArtikel);

// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K untuk fokus ke form judul artikel
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('judulArtikel')?.focus();
    }
});

// ==========================================
// INISIALISASI SAAT PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Blog Saya - Aplikasi dimulai');

    // Tampilkan artikel yang tersimpan
    tampilkanArtikel();

    // Tampilkan link sosial yang tersimpan
    tampilkanLinkSosial();

    // Logo click untuk scroll ke atas
    document.getElementById('logoImg')?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scroll untuk navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Enter key untuk tambah link sosial (saat input fokus)
    document.getElementById('linkSosial')?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            tambahLinkSosial();
        }
    });

    // Info jumlah artikel
    console.log(`📝 Total artikel: ${getArtikel().length}`);
    console.log(`🔗 Total link sosial: ${getLinkSosial().length}`);
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Clear all data (Utility Function)
function clearAllData() {
    if (confirm('⚠️ Ini akan menghapus SEMUA artikel dan link sosial. Lanjutkan?')) {
        if (confirm('Yakin? Tindakan ini tidak bisa dibatalkan!')) {
            localStorage.clear();
            alert('✓ Semua data berhasil dihapus!');
            location.reload();
        }
    }
}

// Export data ke JSON
function exportData() {
    const data = {
        artikel: getArtikel(),
        linkSosial: getLinkSosial(),
        exportDate: new Date().toLocaleString('id-ID')
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✓ Data berhasil diunduh!');
}

// Import data dari JSON
function importData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.artikel) saveArtikel(data.artikel);
            if (data.linkSosial) saveLinkSosial(data.linkSosial);
            alert('✓ Data berhasil diimport!');
            location.reload();
        } catch (err) {
            alert('❌ File tidak valid!');
        }
    };
    reader.readAsText(file);
}

// ==========================================
// LOCAL STORAGE INFO
// ==========================================

function getStorageInfo() {
    const artikel = getArtikel();
    const links = getLinkSosial();
    const fotoSize = artikel.reduce((total, a) => total + (a.foto ? a.foto.length : 0), 0);
    
    console.log('=== STORAGE INFO ===');
    console.log(`Artikel: ${artikel.length}`);
    console.log(`Link Sosial: ${links.length}`);
    console.log(`Ukuran data foto: ${(fotoSize / 1024).toFixed(2)} KB`);
    console.log(`Total localStorage: ${(new Blob(Object.values(localStorage)).size / 1024).toFixed(2)} KB`);
}

// Uncomment untuk menjalankan:
// clearAllData();
// exportData();
// getStorageInfo();