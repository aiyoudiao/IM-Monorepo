import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LanguageCode } from "../../../locales/translations"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
}

const languages: { code: LanguageCode; name: string }[] = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
]

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-8 h-8 text-blue-400" />
      <Select value={language} onValueChange={(value: LanguageCode) => setLanguage(value)}>
        <SelectTrigger className="w-[140px] bg-white text-black border-gray-300 text-sm">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-sm">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

