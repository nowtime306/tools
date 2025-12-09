import { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en'
import es from '../locales/es'
import pt from '../locales/pt'
import hi from '../locales/hi'
import id from '../locales/id'
import ar from '../locales/ar'

const LanguageContext = createContext()

const translations = {
  en,
  es,
  pt,
  hi,
  id,
  ar,
}

const languageNames = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  ar: 'العربية',
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // 从 localStorage 读取保存的语言，默认为英语
    const saved = localStorage.getItem('language')
    return saved && translations[saved] ? saved : 'en'
  })

  useEffect(() => {
    // 保存语言选择到 localStorage
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

