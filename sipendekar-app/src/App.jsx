import React, { useState } from 'react';

// --- 1. DATA & KONFIGURASI ---
const LOGO_URL = "https://drive.google.com/uc?export=view&id=1b2r2Rxa5ikEBdKG02z3Lm9edAqJkO2Di";

const initialUsers = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Admin Dinas', position: 'Administrator' },
  { id: 2, username: 'pengawas', password: '123', role: 'pengawas', name: 'Budi Santoso, S.Pd.', position: 'Pengawas Sekolah' },
  { id: 3, username: 'koordinator', password: '123', role: 'penilai', name: 'Dra. Siti Aminah', position: 'Koordinator Pengawas' },
];

const initialJournals = [
  {
    id: 1,
    userId: 2,
    userName: 'Budi Santoso',
    activity: 'Supervisi SDN 1 Madiun',
    findings: 'Guru sudah disiplin.',
    score: 'Baik',
    date: '2026-02-13T08:00:00'
  }
];

// --- 2. KOMPONEN HALAMAN ---

// Halaman Login
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <img src={LOGO_URL} alt="Logo Madiun" className="w-24 h-24 mx-auto mb-4 object-contain" />
        <h1 className="text-2xl font-bold text-green-700 mb-2">SI-PENDEKAR GTK</h1>
        <p className="text-gray-500 mb-6">Silakan Login</p>
        
        <input 
          type="text" 
          placeholder="Username (pengawas)" 
          className="w-full p-3 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password (123)" 
          className="w-full p-3 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={() => onLogin(username, password)}
          className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
        >
          MASUK APLIKASI
        </button>
      </div>
    </div>
  );
};

// Halaman Utama (Dashboard)
const Dashboard = ({ user, onLogout }) => (
  <div className="min-h-screen bg-gray-50 font-sans">
    {/* Header */}
    <nav className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={LOGO_URL} alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
        <div>
          <h1 className="font-bold">SI-PENDEKAR GTK</h1>
          <p className="text-xs text-green-200">Halo, {user.name}</p>
        </div>
      </div>
      <button onClick={onLogout} className="bg-red-500 px-4 py-1 rounded text-sm hover:bg-red-600">
        Keluar
      </button>
    </nav>

    {/* Konten */}
    <main className="p-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-600">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard {user.position}</h2>
        <p className="text-gray-600">Selamat datang di aplikasi SI-PENDEKAR GTK Kota Madiun.</p>
        <div className="mt-6 p-4 bg-green-50 text-green-800 rounded border border-green-200">
          <strong>Status Sistem:</strong> Online & Terhubung.
        </div>
      </div>
    </main>
  </div>
);

// --- 3. APP UTAMA ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username, password) => {
    const user = initialUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Login Gagal! Coba Username: pengawas, Password: 123');
    }
  };

  return currentUser 
    ? <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
    : <LoginScreen onLogin={handleLogin} />;
}