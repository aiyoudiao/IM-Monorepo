"use client"

import { useState } from "react"
import ChatComponent from "../components/Business/ChatComponent"
import LanguageSelector from "../components/Business/LanguageSelector"
import { type LanguageCode, translations } from "../locales/translations"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>("en")

  return (
    <main className="flex h-screen w-screen">
      <section className="flex flex-col h-screen w-full bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">IM Client</h1>
          </div>
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </header>
        <main className="flex-grow overflow-hidden p-4">
          <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
            <ChatComponent language={language} translations={translations[language]} />
          </div>
        </main>
      </section>
    </main>
  )
}

