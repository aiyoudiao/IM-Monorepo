'use client';

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LanguageCode } from '../../../locales/translations'

interface EmailFeedbackProps {
  language: LanguageCode
  translations: Record<string, string>
}

export default function EmailFeedback({ translations }: EmailFeedbackProps) {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(true)
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setIsValid(validateEmail(newEmail))
  }

  const handleSaveEmail = () => {
    if (isValid && email) {
      // Here you would typically save the email to your backend or local storage
      console.log("Saving email:", email)
      toast({
        description: translations.emailSaved,
      })
    } else {
      toast({
        description: translations.invalidEmail,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mb-2 pl-4 bg-white rounded-lg">
      <div className="flex items-center flex-grow">
        <p className="text-sm text-gray-600 mr-2 -mt-3">{translations.emailFeedback}</p>
        <div className="mr-2 mt-4 relative">
          <Input
            type="email"
            placeholder={translations.emailPlaceholder}
            value={email}
            onChange={handleEmailChange}
            className={`border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 focus-visible:ring-0 bg-transparent rounded-none  ${!isValid && email ? "border-red-500" : ""
              }`}
          />
          <p className="h-8">{!isValid && email && <p className="text-red-500 text-xs mt-1">{translations.invalidEmail}</p>}</p>
        </div>
        <Button size="sm" className="-mt-3" onClick={handleSaveEmail} disabled={!isValid || !email}>
          {translations.saveEmail}
        </Button>
      </div>

    </div>
  )
}

