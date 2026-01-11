import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-gray-100">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] text-gray-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bm')}
        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          language === 'bm'
            ? 'bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] text-gray-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        BM
      </button>
    </div>
  );
}