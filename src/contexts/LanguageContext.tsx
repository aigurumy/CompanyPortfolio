import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type Language = 'en' | 'bm';

interface Translations {
  [key: string]: {
    en: string;
    bm: string;
  };
}

const translations: Translations = {
  enterApp: { en: 'Enter App', bm: 'Masuk Aplikasi' },
  howItWorks: { en: 'How it Works', bm: 'Cara Ia Berfungsi' },
  admin: { en: 'Admin', bm: 'Pentadbir' },
  teacher: { en: 'Teacher', bm: 'Guru' },
  parent: { en: 'Parent', bm: 'Ibubapa' },
  login: { en: 'Login', bm: 'Log Masuk' },
  logout: { en: 'Logout', bm: 'Log Keluar' },
  email: { en: 'Email', bm: 'E-mel' },
  password: { en: 'Password', bm: 'Kata Laluan' },
  fullName: { en: 'Full Name', bm: 'Nama Penuh' },
  signIn: { en: 'Sign In', bm: 'Daftar Masuk' },
  signUp: { en: 'Sign Up', bm: 'Daftar' },
  createAccount: { en: 'Create Account', bm: 'Buat Akaun' },
  dashboard: { en: 'Dashboard', bm: 'Papan Pemuka' },
  enrollment: { en: 'Enrollment', bm: 'Pendaftaran' },
  students: { en: 'Students', bm: 'Pelajar' },
  staff: { en: 'Staff', bm: 'Kakitangan' },
  attendance: { en: 'Attendance', bm: 'Kehadiran' },
  activities: { en: 'Activities', bm: 'Aktiviti' },
  messages: { en: 'Messages', bm: 'Mesej' },
  fees: { en: 'Fees', bm: 'Yuran' },
  reports: { en: 'Reports', bm: 'Laporan' },
  settings: { en: 'Settings', bm: 'Tetapan' },
  welcome: { en: 'Welcome', bm: 'Selamat Datang' },
  hello: { en: 'Hello', bm: 'Helo' },
  total: { en: 'Total', bm: 'Jumlah' },
  capacity: { en: 'Capacity', bm: 'Kapasiti' },
  quickActions: { en: 'Quick Actions', bm: 'Tindakan Pantas' },
  addTeacher: { en: 'Add Teacher', bm: 'Tambah Guru' },
  viewReports: { en: 'View Reports', bm: 'Lihat Laporan' },
  sendAnnouncement: { en: 'Send Announcement', bm: 'Hantar Pengumuman' },
  recentActivity: { en: 'Recent Activity', bm: 'Aktiviti Terkini' },
  viewAll: { en: 'View All', bm: 'Lihat Semua' },
  save: { en: 'Save', bm: 'Simpan' },
  cancel: { en: 'Cancel', bm: 'Batal' },
  delete: { en: 'Delete', bm: 'Padam' },
  edit: { en: 'Edit', bm: 'Ubah' },
  add: { en: 'Add', bm: 'Tambah' },
  search: { en: 'Search', bm: 'Cari' },
  filter: { en: 'Filter', bm: 'Tapis' },
  export: { en: 'Export', bm: 'Eksport' },
  import: { en: 'Import', bm: 'Import' },
  newParent: { en: 'New Parent', bm: 'Ibubapa Baru' },
  registerNewStudent: { en: 'Register New Student', bm: 'Daftar Pelajar Baru' },
  staffLogin: { en: 'Staff Login', bm: 'Log Masuk Kakitangan' },
  parentPortal: { en: 'Parent Portal', bm: 'Portal Ibubapa' },
  meal: { en: 'Meal', bm: 'Makan' },
  milk: { en: 'Milk', bm: 'Susu' },
  sleep: { en: 'Sleep', bm: 'Tidur' },
  nap: { en: 'Nap', bm: 'Tidur' },
  diaper: { en: 'Diaper', bm: 'Lampin' },
  health: { en: 'Health', bm: 'Kesihatan' },
  photo: { en: 'Photo', bm: 'Foto' },
  camera: { en: 'Camera', bm: 'Kamera' },
  temperature: { en: 'Temperature', bm: 'Suhu' },
  present: { en: 'Present', bm: 'Hadir' },
  absent: { en: 'Absent', bm: 'Tidak Hadir' },
  checkedIn: { en: 'Checked In', bm: 'Telah Masuk' },
  checkIn: { en: 'Check In', bm: 'Daftar Masuk' },
  checkOut: { en: 'Check Out', bm: 'Daftar Keluar' },
  pending: { en: 'Pending', bm: 'Menunggu' },
  approved: { en: 'Approved', bm: 'Diluluskan' },
  rejected: { en: 'Rejected', bm: 'Ditolak' },
  review: { en: 'Review', bm: 'Semak' },
  approve: { en: 'Approve', bm: 'Luluskan' },
  reject: { en: 'Reject', bm: 'Tolak' },
  compliance: { en: 'Compliance', bm: 'Pematuhan' },
  jkmLicense: { en: 'JKM License', bm: 'Lesen JKM' },
  bombaLicense: { en: 'BOMBA License', bm: 'Lesen BOMBA' },
  kkmLicense: { en: 'KKM License', bm: 'Lesen KKM' },
  valid: { en: 'Valid', bm: 'Sah' },
  expiringSoon: { en: 'Expiring Soon', bm: 'Akan Tamat' },
  expired: { en: 'Expired', bm: 'Tamat Tempoh' },
  exportAudit: { en: 'Export Audit', bm: 'Eksport Audit' },
  leaveRequest: { en: 'Leave Request', bm: 'Permohonan Cuti' },
  sick: { en: 'Sick', bm: 'Sakit' },
  annual: { en: 'Annual', bm: 'Tahunan' },
  emergency: { en: 'Emergency', bm: 'Kecemasan' },
  paid: { en: 'Paid', bm: 'Berbayar' },
  overdue: { en: 'Overdue', bm: 'Tertunggak' },
  balance: { en: 'Balance', bm: 'Baki' },
  payment: { en: 'Payment', bm: 'Bayaran' },
  invoice: { en: 'Invoice', bm: 'Invois' },
  uploadReceipt: { en: 'Upload Receipt', bm: 'Muat Naik Resit' },
  whatsappReminder: { en: 'WhatsApp Reminder', bm: 'Peringatan WhatsApp' },
  myChild: { en: 'My Child', bm: 'Anak Saya' },
  currentStatus: { en: 'Current Status', bm: 'Status Semasa' },
  timeline: { en: 'Timeline', bm: 'Garis Masa' },
  noticeBoard: { en: 'Notice Board', bm: 'Papan Kenyataan' },
  announcement: { en: 'Announcement', bm: 'Pengumuman' },
  feedback: { en: 'Feedback', bm: 'Maklum Balas' },
  rating: { en: 'Rating', bm: 'Penilaian' },
  submit: { en: 'Submit', bm: 'Hantar' },
  bugReport: { en: 'Bug Report', bm: 'Laporan Pepijat' },
  featureRequest: { en: 'Feature Request', bm: 'Permintaan Ciri' },
  allergy: { en: 'Allergy', bm: 'Alahan' },
  allergyAlert: { en: 'Allergy Alert', bm: 'Amaran Alahan' },
  medicalCondition: { en: 'Medical Condition', bm: 'Keadaan Perubatan' },
  safetyWatchlist: { en: 'Safety Watchlist', bm: 'Senarai Keselamatan' },
  classroom: { en: 'Classroom', bm: 'Bilik Darjah' },
  premium: { en: 'Premium', bm: 'Premium' },
  goPro: { en: 'Go Pro', bm: 'Naik Taraf' },
  subscribe: { en: 'Subscribe', bm: 'Langgan' },
  today: { en: 'Today', bm: 'Hari Ini' },
  yesterday: { en: 'Yesterday', bm: 'Semalam' },
  thisWeek: { en: 'This Week', bm: 'Minggu Ini' },
  thisMonth: { en: 'This Month', bm: 'Bulan Ini' },
  date: { en: 'Date', bm: 'Tarikh' },
  time: { en: 'Time', bm: 'Masa' },
  duration: { en: 'Duration', bm: 'Tempoh' },
  notes: { en: 'Notes', bm: 'Nota' },
  details: { en: 'Details', bm: 'Butiran' },
  description: { en: 'Description', bm: 'Keterangan' },
  name: { en: 'Name', bm: 'Nama' },
  age: { en: 'Age', bm: 'Umur' },
  gender: { en: 'Gender', bm: 'Jantina' },
  male: { en: 'Male', bm: 'Lelaki' },
  female: { en: 'Female', bm: 'Perempuan' },
  phone: { en: 'Phone', bm: 'Telefon' },
  address: { en: 'Address', bm: 'Alamat' },
  emergencyContact: { en: 'Emergency Contact', bm: 'Kenalan Kecemasan' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const { user } = useAuth();

  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', user.id)
          .maybeSingle();

        if (data?.language_preference) {
          setLanguageState(data.language_preference as Language);
        }
      } else {
        const saved = localStorage.getItem('language');
        if (saved === 'en' || saved === 'bm') {
          setLanguageState(saved);
        }
      }
    };

    loadLanguagePreference();
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    if (user) {
      await supabase
        .from('profiles')
        .update({ language_preference: lang })
        .eq('id', user.id);
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}