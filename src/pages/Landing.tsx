import { Link } from 'react-router-dom';
import { Baby, Users, GraduationCap, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Landing() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Users,
      title: language === 'en' ? 'For Admins' : 'Untuk Pentadbir',
      description: language === 'en'
        ? 'Manage enrollments, staff, compliance (JKM, BOMBA, KKM), fees, and generate reports with ease.'
        : 'Urus pendaftaran, kakitangan, pematuhan (JKM, BOMBA, KKM), yuran, dan hasilkan laporan dengan mudah.',
      color: 'from-[#B5EAD7] to-emerald-200',
    },
    {
      icon: GraduationCap,
      title: language === 'en' ? 'For Teachers' : 'Untuk Guru',
      description: language === 'en'
        ? 'Log daily activities (meals, sleep, health), upload photos, and track children with allergy safety alerts.'
        : 'Catat aktiviti harian (makan, tidur, kesihatan), muat naik foto, dan pantau kanak-kanak dengan amaran keselamatan alahan.',
      color: 'from-[#C7CEEA] to-blue-200',
    },
    {
      icon: Heart,
      title: language === 'en' ? 'For Parents' : 'Untuk Ibubapa',
      description: language === 'en'
        ? 'View your child\'s timeline, photos, temperature, meals, and receive instant updates throughout the day.'
        : 'Lihat garis masa anak anda, foto, suhu, makanan, dan terima kemas kini segera sepanjang hari.',
      color: 'from-pink-200 to-rose-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0F9FF] to-[#F0FDF4]">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#B5EAD7] to-[#C7CEEA] p-2 rounded-xl">
              <Baby className="w-6 h-6 text-gray-800" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Taska-Care</span>
          </div>
          <LanguageToggle />
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] rounded-full">
            <p className="text-sm font-semibold text-gray-800">
              {language === 'en' ? 'Modern Childcare Management' : 'Pengurusan Taska Moden'}
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {language === 'en' ? (
              <>
                Care, Connect,<br />
                <span className="bg-gradient-to-r from-[#B5EAD7] via-[#C7CEEA] to-emerald-400 bg-clip-text text-transparent">
                  Communicate
                </span>
              </>
            ) : (
              <>
                Jagaan, Hubungan,<br />
                <span className="bg-gradient-to-r from-[#B5EAD7] via-[#C7CEEA] to-emerald-400 bg-clip-text text-transparent">
                  Komunikasi
                </span>
              </>
            )}
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {language === 'en'
              ? 'The all-in-one platform for childcare centers. Simplify enrollment, activity tracking, compliance, and parent communication.'
              : 'Platform semua-dalam-satu untuk pusat jagaan kanak-kanak. Permudahkan pendaftaran, penjejakan aktiviti, pematuhan, dan komunikasi ibubapa.'}
          </p>

          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] text-gray-800 font-semibold rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            {t('enterApp')}
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'en'
                ? 'Designed for everyone in the childcare ecosystem'
                : 'Direka untuk semua dalam ekosistem jagaan kanak-kanak'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-gray-800" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Ready to get started?' : 'Bersedia untuk bermula?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'en'
              ? 'Join hundreds of childcare centers using Taska-Care to deliver better care.'
              : 'Sertai beratus-ratus pusat jagaan kanak-kanak yang menggunakan Taska-Care untuk memberikan jagaan yang lebih baik.'}
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] text-gray-800 font-semibold rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            {t('enterApp')}
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#B5EAD7] to-[#C7CEEA] p-2 rounded-xl">
              <Baby className="w-6 h-6 text-gray-800" />
            </div>
            <span className="text-2xl font-bold">Taska-Care</span>
          </div>
          <p className="text-gray-400">
            © 2026 Taska-Care. {language === 'en' ? 'All rights reserved.' : 'Hak cipta terpelihara.'}
          </p>
        </div>
      </footer>
    </div>
  );
}