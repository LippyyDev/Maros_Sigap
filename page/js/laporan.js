// =========================
// LAPORAN PAGE FUNCTIONALITY
// =========================

// Firestore collection name
const COLLECTION_NAME = "reports";
let reports = [];
let map = null;
let mapMarkers = {};
let currentDetailId = null;
let unsubscribeReports = null; // For real-time listener

// DOM References
const formReport = document.getElementById("formReport");
const listReports = document.getElementById("listReports");
const totalCount = document.getElementById("totalCount");
const detailCard = document.getElementById("detailCard");
const detailCategory = document.getElementById("detailCategory");
const detailDesc = document.getElementById("detailDesc");
const detailImg = document.getElementById("detailImg");
const detailMeta = document.getElementById("detailMeta");
const detailStatus = document.getElementById("detailStatus");
const btnMarkProcessing = document.getElementById("btnMarkProcessing");
const btnMarkDone = document.getElementById("btnMarkDone");
const btnDelete = document.getElementById("btnDelete");
const clearAllBtn = document.getElementById("clearAll");
const locateBtn = document.getElementById("locateBtn");
const pickManual = document.getElementById("pickManual");
const successModal = document.getElementById("successModal");
const btnViewReports = document.getElementById("btnViewReports");
const inpName = document.getElementById("inpName");
const inpCategory = document.getElementById("inpCategory");
const inpDesc = document.getElementById("inpDesc");
const inpPhoto = document.getElementById("inpPhoto");
const inpLat = document.getElementById("inpLat");
const inpLng = document.getElementById("inpLng");
const photoPreview = document.getElementById("photoPreview");

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check if Firebase is loaded
  if (typeof firebase === 'undefined' || typeof db === 'undefined') {
    console.error('Firebase not loaded! Make sure firebase-config.js is included before this file.');
    alert('Firebase belum dimuat. Pastikan konfigurasi Firebase sudah benar.');
    return;
  }
  
  initMap();
  loadReportsFromFirestore();
  setupEventListeners();
  setupPhotoPreview();
  setupAdminMode();
  
  // GSAP animations (only if GSAP is loaded)
  if (typeof gsap !== 'undefined') {
    const pageHeader = document.querySelector('.page-header');
    const mapSection = document.querySelector('.map-section');
    const formSection = document.querySelector('.form-section');

    if (pageHeader) {
      gsap.from(pageHeader, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2
      });
    }

    if (mapSection) {
      gsap.from(mapSection, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.4
      });
    }

    const formReportsSection = document.querySelector('.form-reports-section');
    if (formReportsSection) {
      gsap.from(formReportsSection, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6
      });
    }
  }
});

// =========================
// MAP INITIALIZATION
// =========================
function initMap() {
  map = L.map("map", { zoomControl: true }).setView([-5.1069, 119.4154], 12);
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Sample POIs
  const facilities = [
    { name: "Kantor Bupati Maros", coords: [-5.0032, 119.744] },
    { name: "Taman Kota Maros", coords: [-5.0051, 119.7416] },
    { name: "RSUD Salewangang", coords: [-5.0078, 119.7452] },
  ];
  
  facilities.forEach((f) =>
    L.marker(f.coords).addTo(map).bindPopup(f.name)
  );

  window.addEventListener("resize", () => {
    if (map) map.invalidateSize();
  });
}

// =========================
// FIRESTORE OPERATIONS
// =========================
function loadReportsFromFirestore() {
  // Set up real-time listener
  // Try with orderBy first, fallback to no orderBy if index not created yet
  let query = db.collection(COLLECTION_NAME);
  
  try {
    query = query.orderBy('createdAt', 'desc');
  } catch (e) {
    console.warn('Index for createdAt not created yet. Loading without order.');
  }
  
  unsubscribeReports = query.onSnapshot((snapshot) => {
      reports = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if needed
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        });
      });
      
      // Sort manually if orderBy failed
      if (reports.length > 0 && reports[0].createdAt) {
        reports.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Descending
        });
      }
      
      renderReportList();
      placeMarkers();
    }, (error) => {
      console.error('Error loading reports:', error);
      // If it's an index error, show helpful message
      if (error.code === 'failed-precondition') {
        alert('Index belum dibuat. Silakan buka Firebase Console dan ikuti link untuk membuat index, atau refresh halaman setelah beberapa saat.');
      } else {
        alert('Gagal memuat laporan: ' + error.message);
      }
    });
}

async function saveReportToFirestore(reportData) {
  try {
    // Remove id from data (Firestore will generate it)
    const { id, ...dataToSave } = reportData;
    
    // Convert createdAt to Firestore Timestamp
    const data = {
      ...dataToSave,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection(COLLECTION_NAME).add(data);
    return docRef.id;
  } catch (error) {
    console.error('Error saving report:', error);
    throw error;
  }
}

async function updateReportInFirestore(reportId, updates) {
  try {
    await db.collection(COLLECTION_NAME).doc(reportId).update(updates);
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

async function deleteReportFromFirestore(reportId) {
  try {
    await db.collection(COLLECTION_NAME).doc(reportId).delete();
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

async function clearAllReportsFromFirestore() {
  try {
    const batch = db.batch();
    const snapshot = await db.collection(COLLECTION_NAME).get();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing reports:', error);
    throw error;
  }
}

// =========================
// MARKERS
// =========================
function clearAllMarkers() {
  Object.values(mapMarkers).forEach((m) => {
    try {
      map.removeLayer(m);
    } catch (e) {}
  });
  mapMarkers = {};
}

function placeMarkers() {
  if (!map) return;
  clearAllMarkers();
  
  reports.forEach((r) => {
    try {
      const marker = L.marker([r.lat, r.lng])
        .addTo(map)
        .bindPopup(
          `<b>${escapeHtml(r.category)}</b><br>${escapeHtml(truncate(r.description, 80))}`
        );
      
      marker.on("click", () => {
        openDetailCard(r.id);
      });
      
      mapMarkers[r.id] = marker;
    } catch (e) {
      console.warn("Marker error", e);
    }
  });
  
  totalCount.textContent = reports.length;
}

// =========================
// RENDER REPORT LIST
// =========================
function renderReportList() {
  listReports.innerHTML = "";
  
  if (reports.length === 0) {
    listReports.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px;">Belum ada laporan. Coba kirim satu lewat form di atas.</div>';
    totalCount.textContent = 0;
    return;
  }

  reports.forEach((r) => {
    const item = document.createElement("div");
    item.className = "report-item";
    
    const emoji = categoryToEmoji(r.category);
    const statusClass = r.status === "Pending" ? "status-pending" : 
                       r.status === "Diproses" ? "status-processing" : "status-done";
    
    item.innerHTML = `
      <div class="report-icon">${emoji}</div>
      <div class="report-content">
        <div class="report-header">
          <div class="report-category">${escapeHtml(r.category)}</div>
          <div class="report-date">${new Date(r.createdAt).toLocaleString('id-ID')}</div>
        </div>
        <div class="report-desc">${escapeHtml(truncate(r.description, 100))}</div>
        <div class="report-footer">
          <div class="report-status ${statusClass}">${r.status}</div>
          <button class="btn-detail" onclick="event.stopPropagation(); viewReportDetail('${r.id}')">Detail</button>
        </div>
      </div>
    `;
    
    item.onclick = () => {
      if (mapMarkers[r.id]) map.panTo([r.lat, r.lng], 15);
      openDetailCard(r.id);
    };
    
    listReports.appendChild(item);
  });
  
  totalCount.textContent = reports.length;
}

// =========================
// DETAIL CARD
// =========================
function openDetailCard(id) {
  const r = reports.find((x) => x.id === id);
  if (!r) return;
  
  currentDetailId = id;
  detailCategory.textContent = r.category;
  detailDesc.textContent = r.description;
  detailMeta.textContent = `oleh: ${r.name || "-"} • ${new Date(r.createdAt).toLocaleString('id-ID')}`;
  
  // Status badge
  if (r.status === "Pending") {
    detailStatus.className = "detail-status status-pending";
    detailStatus.textContent = "Pending";
  } else if (r.status === "Diproses") {
    detailStatus.className = "detail-status status-processing";
    detailStatus.textContent = "Diproses";
  } else {
    detailStatus.className = "detail-status status-done";
    detailStatus.textContent = "Selesai";
  }
  
  if (r.photo) {
    detailImg.src = r.photo;
    detailImg.style.display = "block";
  } else {
    detailImg.style.display = "none";
  }
  
  // Update admin buttons visibility
  updateAdminButtons();
  
  detailCard.classList.add("active");
}

function closeDetailCard() {
  detailCard.classList.remove("active");
  currentDetailId = null;
}

// Global function for inline onclick
window.viewReportDetail = function(id) {
  if (mapMarkers[id]) map.panTo([reports.find(r => r.id === id).lat, reports.find(r => r.id === id).lng], 15);
  openDetailCard(id);
};

// =========================
// FORM SUBMIT
// =========================
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const name = inpName.value.trim();
  const category = inpCategory.value;
  const description = inpDesc.value.trim();
  const lat = parseFloat(inpLat.value);
  const lng = parseFloat(inpLng.value);
  const photoFile = inpPhoto.files[0];

  if (!category || !description || !isFinite(lat) || !isFinite(lng)) {
    alert("Harap isi kategori, deskripsi, dan koordinat lokasi.");
    return;
  }

  const photoData = await fileToDataURL(photoFile);

  const newReport = {
    name: name || "",
    category,
    description,
    lat,
    lng,
    photo: photoData || null,
    status: "Pending",
  };

  try {
    // Show loading state
    const submitBtn = formReport.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Mengirim...</span>';

    await saveReportToFirestore(newReport);
    
    // Reset form
    formReport.reset();
    photoPreview.innerHTML = "";
    
    // Show success modal
    successModal.classList.add("active");
    if (typeof gsap !== 'undefined') {
      gsap.from('.modal-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    closeDetailCard();
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  } catch (error) {
    alert('Gagal mengirim laporan: ' + error.message);
    const submitBtn = formReport.querySelector('.btn-submit');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Kirim Laporan</span>';
  }
}

// =========================
// MAP INTERACTIONS
// =========================
locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung perangkat ini.");
    return;
  }
  
  locateBtn.disabled = true;
  locateBtn.innerHTML = '<span class="btn-icon">⏳</span> Mencari lokasi...';
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      inpLat.value = latitude.toFixed(6);
      inpLng.value = longitude.toFixed(6);
      map.setView([latitude, longitude], 15);
      locateBtn.disabled = false;
      locateBtn.innerHTML = '<span class="btn-icon">📍</span> Gunakan Lokasi Saya';
    },
    (err) => {
      locateBtn.disabled = false;
      locateBtn.innerHTML = '<span class="btn-icon">📍</span> Gunakan Lokasi Saya';
      alert("Gagal mendapatkan lokasi: " + err.message);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

pickManual.addEventListener("click", () => {
  alert("Klik 1x di peta untuk memilih lokasi laporan.");
  const handler = (ev) => {
    inpLat.value = ev.latlng.lat.toFixed(6);
    inpLng.value = ev.latlng.lng.toFixed(6);
    
    const selMarker = L.circleMarker([ev.latlng.lat, ev.latlng.lng], {
      radius: 8,
      color: "#2563eb",
      fillColor: "#2563eb",
      fillOpacity: 0.8,
    }).addTo(map);
    
    setTimeout(() => map.removeLayer(selMarker), 4000);
    map.off("click", handler);
  };
  map.on("click", handler);
});

// =========================
// ADMIN MODE SETUP
// =========================
function setupAdminMode() {
  // Check admin mode on load
  updateAdminButtons();
  
  // Listen for admin mode changes
  window.addEventListener('adminModeChanged', (event) => {
    updateAdminButtons();
  });
}

// Show/hide admin buttons based on admin mode
function updateAdminButtons() {
  const isAdminMode = window.adminMode && window.adminMode.isEnabled();
  const detailActions = document.querySelector('.detail-actions');
  
  if (detailActions) {
    if (isAdminMode) {
      detailActions.style.display = 'flex';
    } else {
      detailActions.style.display = 'none';
    }
  }
  
  // Also hide buttons individually for safety
  if (btnMarkProcessing) {
    btnMarkProcessing.style.display = isAdminMode ? 'inline-block' : 'none';
  }
  if (btnMarkDone) {
    btnMarkDone.style.display = isAdminMode ? 'inline-block' : 'none';
  }
  if (btnDelete) {
    btnDelete.style.display = isAdminMode ? 'inline-block' : 'none';
  }
}

// =========================
// ADMIN ACTIONS
// =========================
if (btnMarkProcessing) {
  btnMarkProcessing.addEventListener("click", () => {
    if (!currentDetailId) return;
    if (!window.adminMode || !window.adminMode.isEnabled()) {
      alert('Mode Admin harus diaktifkan untuk mengubah status laporan.');
      return;
    }
    updateReportStatus(currentDetailId, "Diproses");
  });
}

if (btnMarkDone) {
  btnMarkDone.addEventListener("click", () => {
    if (!currentDetailId) return;
    if (!window.adminMode || !window.adminMode.isEnabled()) {
      alert('Mode Admin harus diaktifkan untuk mengubah status laporan.');
      return;
    }
    updateReportStatus(currentDetailId, "Selesai");
  });
}

if (btnDelete) {
  btnDelete.addEventListener("click", () => {
    if (!currentDetailId) return;
    if (!window.adminMode || !window.adminMode.isEnabled()) {
      alert('Mode Admin harus diaktifkan untuk menghapus laporan.');
      return;
    }
    if (!confirm("Hapus laporan ini? Tindakan tidak dapat dibatalkan.")) return;
    deleteReport(currentDetailId);
    closeDetailCard();
  });
}

async function updateReportStatus(id, newStatus) {
  try {
    await updateReportInFirestore(id, { status: newStatus });
    // Real-time listener will update the UI automatically
  } catch (error) {
    alert('Gagal memperbarui status: ' + error.message);
  }
}

async function deleteReport(id) {
  try {
    await deleteReportFromFirestore(id);
    closeDetailCard();
    // Real-time listener will update the UI automatically
  } catch (error) {
    alert('Gagal menghapus laporan: ' + error.message);
  }
}

// =========================
// CLEAR ALL
// =========================
clearAllBtn.addEventListener("click", async () => {
  if (!confirm("Reset semua data? (akan menghapus semua laporan)")) return;
  
  try {
    clearAllBtn.disabled = true;
    clearAllBtn.textContent = "Menghapus...";
    await clearAllReportsFromFirestore();
    // Real-time listener will update the UI automatically
    clearAllBtn.disabled = false;
    clearAllBtn.textContent = "Reset";
  } catch (error) {
    alert('Gagal menghapus semua laporan: ' + error.message);
    clearAllBtn.disabled = false;
    clearAllBtn.textContent = "Reset";
  }
});

// =========================
// PHOTO PREVIEW
// =========================
function setupPhotoPreview() {
  inpPhoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// =========================
// MODAL ACTIONS
// =========================
btnViewReports.addEventListener("click", () => {
  successModal.classList.remove("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.classList.remove("active");
  }
});

// =========================
// EVENT LISTENERS
// =========================
function setupEventListeners() {
  formReport.addEventListener("submit", handleFormSubmit);
  
  document.addEventListener("click", (ev) => {
    const inside = detailCard.contains(ev.target);
    const isButton = ev.target.closest(".report-item") || ev.target.closest("#listReports");
    if (!inside && !isButton) {
      closeDetailCard();
    }
  });
}

// =========================
// UTILITIES
// =========================
function fileToDataURL(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"'`=\/]/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    }[s];
  });
}

function categoryToEmoji(cat) {
  if (!cat) return "📍";
  if (cat.toLowerCase().includes("jalan")) return "🚧";
  if (cat.toLowerCase().includes("lampu")) return "💡";
  if (cat.toLowerCase().includes("drain")) return "💦";
  if (cat.toLowerCase().includes("sampah")) return "🗑️";
  if (cat.toLowerCase().includes("fasil")) return "🏫";
  return "🔎";
}

