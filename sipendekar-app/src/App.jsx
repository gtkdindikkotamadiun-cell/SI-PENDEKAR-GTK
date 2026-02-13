import React, { useState, useEffect, useRef } from 'react';
import {
MapPin, Camera, FileText, Users, LogOut, Star, Upload,
Award, CheckCircle, Clock, Activity, Map, User, BarChart2,
ChevronDown, ChevronUp, Image as ImageIcon
} from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrBsQz2E205CTiPPkZM_oFFsu7dIIbNwda-H2WuZ0AFG_5zGMi4axIYXcMsl21OA8HoA/exec";

const LOGO_URL = "/logo.png";

const formatDateTime = (isoString) => {
if (!isoString) return '-';
const date = new Date(isoString);
const datePart = date.toLocaleDateString('id-ID', {
weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});
const timePart = date.toLocaleTimeString('id-ID', {
hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
});
return ${datePart}, ${timePart.replace(/\./g, ':')} WIB;
};

const getScoreBadgeStyles = (score) => {
switch(score) {
case 'Sangat Baik': return 'bg-green-100 text-green-800 border-green-300';
case 'Baik': return 'bg-blue-100 text-blue-800 border-blue-300';
case 'Cukup': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
case 'Kurang': return 'bg-red-100 text-red-800 border-red-300';
default: return 'bg-slate-100 text-slate-800 border-slate-300';
}
};

const getScoreColorHex = (score) => {
switch(score) {
case 'Sangat Baik': return 'bg-green-500';
case 'Baik': return 'bg-blue-500';
case 'Cukup': return 'bg-yellow-400';
case 'Kurang': return 'bg-red-400';
default: return 'bg-slate-300';
}
};

const PREDICATES = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'];

const initialUsers = [
{ id: 1, username: 'admin', password: '123', role: 'admin', name: 'Admin Dinas', position: 'Administrator' },
{ id: 2, username: 'pengawas', password: '123', role: 'pengawas', name: 'Budi Santoso, S.Pd., M.Pd.', position: 'Pengawas Sekolah' },
{ id: 3, username: 'koordinator', password: '123', role: 'pengawas', name: 'Dra. Siti Aminah', position: 'Koordinator Pengawas' },
{ id: 4, username: 'penilai', password: '123', role: 'penilai', name: 'Drs. Supriyadi, M.Si.', position: 'Penilai GTK' }
];

const initialJournals = [];

// --- MAIN APP ---
export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [journals, setJournals] = useState(initialJournals);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(false); // Tambahkan state loading jika belum ada

  // --- 1. TAMBAHKAN USEEFFECT DI SINI ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. TAMBAHKAN FUNGSI FETCHDATA DI SINI ---
  const fetchData = async () => {
    // Pastikan variabel SCRIPT_URL sudah didefinisikan di atas (di luar fungsi App)
    if (typeof SCRIPT_URL === 'undefined' || !SCRIPT_URL) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=read`);
      const result = await response.json();
      if (result.status === 'success') {
        setJournals(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    } else {
      alert('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* HEADER */}
      <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">SI-PENDEKAR GTK</h1>
              <p className="text-xs text-green-100">Dinas Pendidikan Kota Madiun</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-yellow-300">{currentUser.name}</p>
              <p className="text-xs text-green-100">{currentUser.position}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-green-700 hover:bg-orange-500 rounded-lg transition-colors flex items-center shadow-inner"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="bg-white border-b shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto">
          {currentUser.role === 'admin' && (
            <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<Users />} text="Kelola Data GTK" />
          )}
          {currentUser.role === 'pengawas' && (
            <>
              <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<Activity />} text="Dashboard Saya" />
              <NavButton active={currentView === 'input_jurnal'} onClick={() => setCurrentView('input_jurnal')} icon={<FileText />} text="Isi Jurnal & Presensi" />
            </>
          )}
          {currentUser.role === 'penilai' && (
            <>
              <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<BarChart2 />} text="Dashboard Laporan" />
              <NavButton active={currentView === 'penilaian'} onClick={() => setCurrentView('penilaian')} icon={<Award />} text="Beri Penilaian" />
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'admin' && currentView === 'dashboard' && <AdminDashboard users={users} setUsers={setUsers} />}
        {currentUser.role === 'pengawas' && currentView === 'dashboard' && <PengawasDashboard journals={journals.filter(j => j.userId === currentUser.id)} />}
        {currentUser.role === 'pengawas' && currentView === 'input_jurnal' && (
          <InputJurnal currentUser={currentUser} onSave={(newJournal) => { 
              setJournals([newJournal, ...journals]);
              setCurrentView('dashboard'); 
          }} />
        )}
        {currentUser.role === 'penilai' && currentView === 'dashboard' && <PenilaiDashboard journals={journals} />}
        {currentUser.role === 'penilai' && currentView === 'penilaian' && (
          <PenilaianList journals={journals} onUpdateJournal={(updatedJournal) => { setJournals(journals.map(j => j.id === updatedJournal.id ? updatedJournal : j)); }} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm font-medium text-slate-500">
            &copy; 2026 GTK Dinas Pendidikan Kota Madiun
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, text }) {
  return (
    <button onClick={onClick} className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${active ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-slate-500 hover:text-green-600 hover:bg-green-50/50'}`}>
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span>{text}</span>
    </button>
  );
}

// --- LOGIN SCREEN ---
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-orange-500 flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
          <div className="text-center mb-8">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100 shadow-lg overflow-hidden p-2">
              <img src={LOGO_URL} alt="Logo Dinas" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">SI-PENDEKAR GTK</h1>
            <p className="text-slate-500 mt-2 text-sm">Sistem Informasi Pencatatan Digital Evaluasi & Kinerja Pengawas & Koordinator Pengawas Real-time<br/>Dinas Pendidikan Kota Madiun</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none" placeholder="Masukkan username..." value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
              Masuk ke Sistem
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">Akun demo:<br/>admin/123 | pengawas/123 | koordinator/123 | penilai/123</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-white/80 text-sm font-medium text-center pb-4">
        &copy; 2026 GTK Dinas Pendidikan Kota Madiun
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ users }) {
  const fileInputRef = useRef(null);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna (GTK)</h2>
          <p className="text-slate-500">Kelola data Pengawas, Koordinator, dan Penilai.</p>
        </div>
        <button onClick={() => fileInputRef.current.click()} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm">
            <Upload className="w-5 h-5" /><span>Unggah Database Kolektif</span>
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={() => alert('Fitur demo')} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600">Nama Lengkap</th>
                <th className="py-4 px-6 font-semibold text-slate-600">Jabatan</th>
                <th className="py-4 px-6 font-semibold text-slate-600">Role Sistem</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-medium text-slate-800">{user.name}</td>
                  <td className="py-4 px-6 text-slate-600">{user.position}</td>
                  <td className="py-4 px-6"><span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">{user.role.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- PENGAWAS DASHBOARD ---
// --- CARI DAN GANTI FUNGSI INI DI App.jsx ---
function PengawasDashboard({ journals }) {
  const evaluatedCount = journals.filter(j => j.score && j.score !== "").length;
  const appreciatedCount = journals.filter(j => j.appreciated).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<FileText className="w-8 h-8 text-blue-500" />} title="Total Jurnal" value={journals.length} bg="bg-blue-50" />
        <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} title="Jurnal Dievaluasi" value={evaluatedCount} bg="bg-green-50" />
        <StatCard icon={<Star className="w-8 h-8 text-yellow-500" />} title="Apresiasi Diterima" value={appreciatedCount} bg="bg-yellow-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Riwayat Jurnal Kegiatan Anda</h3>
        <div className="space-y-4">
          {journals.length === 0 ? (
            <p className="text-center py-8 text-slate-500">Belum ada jurnal yang diinput.</p>
          ) : (
            journals.map(journal => (
              <div key={journal.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-slate-50/50">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <h4 className="font-bold text-slate-800 text-lg">{journal.activity}</h4>
                  <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
                    <span className="text-xs text-slate-600 flex items-center font-medium">
                      <Clock className="w-4 h-4 mr-1.5 text-orange-500" /> {formatDateTime(journal.date)}
                    </span>
                  </div>
                </div>

                {journal.address && (
                  <div className="flex items-start mt-2 mb-3 text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 mr-1.5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{journal.address}</span>
                  </div>
                )}

                {/* --- BAGIAN YANG DIPERBAIKI (Temuan, Solusi, Tindak Lanjut) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Temuan Lapangan</p>
                    <p className="text-sm text-slate-700">{journal.findings}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Solusi Diberikan</p>
                    <p className="text-sm text-slate-700">{journal.solution}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tindak Lanjut</p>
                    <p className="text-sm text-slate-700">{journal.followUp}</p>
                  </div>
                </div>

                {/* --- BAGIAN DOKUMENTASI --- */}
                {journal.documentationUrl && (
                  <div className="mt-3">
                    <img 
                      src={journal.documentationUrl} 
                      alt="Dokumentasi" 
                      className="w-full h-48 object-cover rounded-xl border border-slate-200"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Gambar+Tidak+Tersedia'; }}
                    />
                  </div>
                )}

                {journal.score && journal.score !== "" && (
                  <div className={`mt-4 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getScoreBadgeStyles(journal.score)}`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase opacity-80">Predikat Penilaian</span>
                        {journal.appreciated && <Star className="w-4 h-4 text-yellow-600 fill-current" />}
                      </div>
                      <p className="text-2xl font-black mt-1">{journal.score}</p>
                    </div>
                    {journal.notes && (
                      <div className="bg-white/60 p-3 rounded-lg flex-1 md:ml-4 border border-white/40">
                        <p className="text-sm font-medium italic">"{journal.notes}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- INPUT JURNAL (DENGAN FETCH APPS SCRIPT) ---
function InputJurnal({ currentUser, onSave }) {
  const [formData, setFormData] = useState({ activity: '', findings: '', solution: '', followUp: '' });
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [locationTime, setLocationTime] = useState(null);
  const [locating, setLocating] = useState(false);
  const [docPreview, setDocPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          setLocationTime(new Date().toISOString());

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress('Alamat tidak ditemukan');
            }
          } catch (error) {
            setAddress('Gagal memuat alamat jaringan');
          }
          setLocating(false);
        },
        () => { 
          alert("Gagal mendapatkan lokasi. Pastikan GPS aktif."); 
          setLocating(false); 
        }
      );
    } else {
      alert("Browser tidak mendukung Geolocation."); 
      setLocating(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Harap lakukan presensi lokasi terlebih dahulu.");
    if (!docPreview) return alert("Harap sertakan foto dokumentasi.");

    setLoading(true);

    // 1. DATA YANG AKAN DIKIRIM KE GOOGLE SHEET
    const payload = {
      userId: currentUser.id,
      userName: currentUser.name,
      userPosition: currentUser.position,
      date: locationTime,
      activity: formData.activity,
      location: `${location.lat}, ${location.lng}`, // Format String untuk Spreadsheet
      address: address, 
      findings: formData.findings,
      solution: formData.solution,
      followUp: formData.followUp,
      documentationUrl: docPreview, // Base64 Foto
      score: "",
      notes: "",
      appreciated: false
    };

    try {
      // 2. KIRIM KE APPS SCRIPT
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // 3. UPDATE LOCAL STATE
      onSave({
        id: Date.now(),
        ...payload,
        location: location // Simpan obj location asli untuk map lokal
      });
      
      alert("✅ Laporan Berhasil Terkirim ke Server!");

    } catch (error) {
      console.error(error);
      alert("Gagal koneksi ke server, tapi data tersimpan lokal sementara.");
      // Tetap simpan lokal jika gagal fetch
      onSave({
        id: Date.now(),
        ...payload,
        location: location
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-orange-500 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <FileText className="w-6 h-6" /><span>Formulir Jurnal & Presensi Kegiatan</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8">
        {/* PRESENSI */}
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-500" /><span>1. Presensi Lokasi & Waktu</span>
          </h3>
          <div className="flex flex-col gap-4">
            <button type="button" onClick={handleGetLocation} disabled={locating} className={`flex items-center justify-center sm:justify-start w-full sm:w-fit space-x-2 px-6 py-3 rounded-xl text-white font-bold shadow flex-shrink-0 transition-colors ${location ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
              <MapPin className="w-5 h-5" /><span>{locating ? 'Mendeteksi Lokasi...' : location ? 'Perbarui Posisi' : 'Ambil Posisi Saat Ini'}</span>
            </button>
            
            {location && (
              <div className="flex flex-col md:flex-row md:items-center gap-4 bg-green-100 p-4 rounded-xl border border-green-200 w-full">
                <div className="flex-1">
                   {address ? (
                    <>
                      <p className="text-sm font-bold text-green-900 leading-snug">{address}</p>
                      <p className="text-xs font-medium text-green-700 mt-1">Titik: Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}</p>
                    </>
                  ) : (
                     <p className="text-sm font-bold text-green-900">Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</p>
                  )}
                </div>
                <div className="md:border-l border-green-300 md:pl-4 flex items-center text-green-800 shrink-0">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm">{formatDateTime(locationTime)}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* KEGIATAN */}
        <section className="space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 border-b pb-2">
            <Activity className="w-5 h-5 text-green-600" /><span>2. Detail Laporan</span>
          </h3>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kegiatan</label>
            <input type="text" required className="w-full p-3 rounded-xl border border-slate-300 focus:border-green-500 outline-none" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Temuan Lapangan</label>
              <textarea required rows="4" className="w-full p-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-none" value={formData.findings} onChange={(e) => setFormData({...formData, findings: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Solusi Diberikan</label>
              <textarea required rows="4" className="w-full p-3 rounded-xl border border-slate-300 focus:border-green-500 outline-none" value={formData.solution} onChange={(e) => setFormData({...formData, solution: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tindak Lanjut Ke Depan</label>
              <textarea required rows="4" className="w-full p-3 rounded-xl border border-slate-300 focus:border-yellow-400 outline-none" value={formData.followUp} onChange={(e) => setFormData({...formData, followUp: e.target.value})}></textarea>
            </div>
          </div>
        </section>

        {/* DOKUMENTASI */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4 border-b pb-2">
            <Camera className="w-5 h-5 text-blue-500" /><span>3. Dokumentasi Visual</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="w-full sm:w-1/2 flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-sm text-slate-500 font-semibold">Pilih atau Ambil Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
            <div className="w-full sm:w-1/2 flex justify-center items-center bg-slate-100 h-48 rounded-xl border overflow-hidden">
              {docPreview ? <img src={docPreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 opacity-50 text-slate-400" />}
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button type="submit" disabled={loading} className={`w-full sm:w-auto text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-colors ${loading ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}>
            <CheckCircle className="w-6 h-6" /><span>{loading ? 'Mengirim...' : 'Kirim Jurnal'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// --- PENILAI DASHBOARD & LIST ---
function PenilaiDashboard({ journals }) {
  const total = journals.length;
  const evaluatedList = journals.filter(j => j.score !== null);
  const evaluatedCount = evaluatedList.length;
  const distribution = { 'Kurang': 0, 'Cukup': 0, 'Baik': 0, 'Sangat Baik': 0 };
  evaluatedList.forEach(j => { if (distribution[j.score] !== undefined) distribution[j.score]++; });
  
  let majorityLabel = '-';
  if (evaluatedCount > 0) {
    majorityLabel = Object.keys(distribution).reduce((a, b) => distribution[a] > distribution[b] ? a : b);
  }

  const maxDist = Math.max(...Object.values(distribution), 1);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Visualisasi Data Kinerja</h2>
          <p className="text-green-100">Pantau progres laporan Pengawas dan Koordinator secara real-time.</p>
        </div>
        <div className="mt-6 md:mt-0 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 text-center md:text-right">
          <p className="text-sm font-medium text-green-100 mb-1">Status Penilaian</p>
          <div className="flex items-end justify-center md:justify-end space-x-2">
            <span className="text-4xl font-black text-yellow-300">{total > 0 ? Math.round((evaluatedCount/total)*100) : 0}%</span>
            <span className="text-lg text-white mb-1">Selesai</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<FileText className="w-8 h-8 text-blue-500" />} title="Total Jurnal Masuk" value={total} bg="bg-white" />
        <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} title="Sudah Dievaluasi" value={evaluatedCount} bg="bg-white" />
        <StatCard icon={<Award className="w-8 h-8 text-yellow-500" />} title="Mayoritas Predikat" value={majorityLabel} bg="bg-white" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-orange-500"/> Distribusi Predikat Kinerja</h3>
        <div className="flex items-end space-x-4 h-56 mt-4">
          {PREDICATES.slice().reverse().map((pred, i) => {
            const count = distribution[pred];
            const heightPercent = `${(count / maxDist) * 100}%`;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group h-full">
                <span className="text-sm font-bold text-slate-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                <div 
                  className={`w-full max-w-[5rem] rounded-t-md ${getScoreColorHex(pred)} transition-all duration-500 group-hover:opacity-80`}
                  style={{ height: heightPercent === '0%' ? '4px' : heightPercent }}
                ></div>
                <span className="text-xs font-semibold text-slate-500 mt-3 text-center h-8 hidden sm:block">{pred}</span>
                <span className="text-xs font-semibold text-slate-500 mt-3 text-center h-8 sm:hidden">{pred.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PenilaianList({ journals, onUpdateJournal }) {
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Daftar Jurnal Menunggu Penilaian</h2>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-4">
          {journals.filter(j => !j.score || j.score === "").length} Perlu Dinilai
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {journals.map(journal => (
          <div key={journal.id} className="p-6 transition-colors hover:bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer" onClick={() => toggleExpand(journal.id)}>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full hidden sm:block shrink-0"><User className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{journal.userName}</h3>
                  <div className="flex flex-wrap items-center mt-1 gap-y-1 gap-x-3">
                    <span className="text-sm font-medium text-orange-600">{journal.userPosition}</span>
                    <span className="text-xs text-slate-600 flex items-center"><Clock className="w-3 h-3 mr-1 text-green-600" /> {formatDateTime(journal.date)}</span>
                  </div>
                  <p className="text-slate-700 mt-2 font-medium">{journal.activity}</p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center justify-between w-full md:w-auto space-x-4 shrink-0">
                {(journal.score && journal.score !== "") ? (
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getScoreBadgeStyles(journal.score)}`}>
                    <span className="text-sm font-bold">{journal.score}</span>
                    {journal.appreciated && <Star className="w-4 h-4 text-yellow-600 fill-current" />}
                  </div>
                ) : (
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">Belum Dinilai</span>
                )}
                {expandedId === journal.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </div>

            {expandedId === journal.id && (
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Detail Jurnal */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Temuan</p>
                      <p className="text-sm text-slate-800">{journal.findings}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Solusi</p>
                      <p className="text-sm text-slate-800">{journal.solution}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Tindak Lanjut</p>
                      <p className="text-sm text-slate-800">{journal.followUp}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={journal.documentationUrl} alt="Dokumentasi" className="w-full sm:w-1/2 h-auto max-h-48 object-cover rounded-xl border" />
                    <div className="w-full sm:w-1/2 h-48 bg-slate-100 rounded-xl border flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                      <MapPin className="w-8 h-8 text-green-500 mb-2 shrink-0" />
                      {journal.address && <p className="text-sm font-bold text-slate-800 mb-2 line-clamp-3">{journal.address}</p>}
                      <div className="text-xs font-medium text-slate-500">
                        {journal.location.lat ? (
                           <>
                             <span>Lat: {journal.location.lat.toFixed(5)}</span><br/>
                             <span>Lng: {journal.location.lng.toFixed(5)}</span>
                           </>
                        ) : 'Lokasi tidak tersedia'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Evaluasi */}
                <div className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center border-b border-yellow-200 pb-2">
                    <Award className="w-5 h-5 text-orange-500 mr-2" /> Evaluasi & Apresiasi
                  </h4>
                  <EvaluationForm journal={journal} onSave={(updated) => { onUpdateJournal(updated); setExpandedId(null); alert('Penilaian disimpan!'); }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EvaluationForm({ journal, onSave }) {
  const [score, setScore] = useState(journal.score || '');
  const [notes, setNotes] = useState(journal.notes || '');
  const [appreciated, setAppreciated] = useState(journal.appreciated || false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!score) return alert("Silakan pilih predikat penilaian terlebih dahulu.");
    onSave({ ...journal, score, notes, appreciated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Predikat Kinerja</label>
        <div className="grid grid-cols-2 gap-2">
          {PREDICATES.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setScore(p)}
              className={`py-2 px-1 text-sm font-bold rounded-lg border transition-all ${
                score === p 
                  ? `${getScoreBadgeStyles(p)} shadow-sm ring-2 ring-offset-1 ring-${getScoreBadgeStyles(p).split(' ')[0].replace('bg-','')}` 
                  : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Penilai</label>
        <textarea 
          rows="3" required
          className="w-full p-3 rounded-xl border border-slate-300 focus:border-green-500 outline-none text-sm"
          placeholder="Berikan masukan konstruktif..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
      
      <div className="pt-2 border-t border-yellow-200">
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-yellow-100 transition-colors border border-transparent hover:border-yellow-300">
          <div className="relative shrink-0">
            <input type="checkbox" className="sr-only" checked={appreciated} onChange={(e) => setAppreciated(e.target.checked)} />
            <div className={`w-10 h-6 rounded-full transition-colors ${appreciated ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${appreciated ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm font-bold flex items-center text-slate-700">
             Apresiasi Khusus <Star className={`w-4 h-4 ml-1 shrink-0 ${appreciated ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
          </span>
        </label>
      </div>

      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2">
        Simpan Penilaian
      </button>
    </form>
  );
}

function StatCard({ icon, title, value, bg }) {
  return (
    <div className={`${bg} p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4`}>
      <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 break-words">{value}</h3>
      </div>
    </div>
  );
}