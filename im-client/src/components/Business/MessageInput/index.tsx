"use client"

import { useState, useRef } from "react"
import Editor from '@/components/Common/TinymceEditor';
import { Button } from "@/components/ui/button"
import type { LanguageCode } from "../../../locales/translations"

interface MessageInputProps {
  onSendMessage: (content: string, type: "text" | "image") => void
  language: LanguageCode
  translations: Record<string, string>
}

export default function MessageInput({ onSendMessage, translations }: MessageInputProps) {
  const [content, setContent] = useState("")
  const editorRef = useRef<any>(null)

  const handleSendMessage = () => {
    if (content.trim()) {
      onSendMessage(content, "text")
      setContent("")
      if (editorRef.current) {
        editorRef.current.setCurrentContent("")
      }
    }
  }

  return (
    <div className="border-t p-4">
      <Editor
        ref={editorRef}
        init={{
          height: 250,
          menubar: false,
          plugins: ['lists', 'link'],
          toolbar: 'undo redo | bold italic underline | bullist numlist | removeformat',
        }}
        value={content}
        onChange={setContent}
        content_style={`
          .mce-content-body { padding-bottom: 50px !important; }
            .editor-buttons {
              position: absolute;
              bottom: 10px;
              right: 10px;
              display: flex;
              gap: 8px;
              z-index: 1000;
            }
        `}
        setup={
          (editor) => {
            console.log('editor test ==============>')
            editor.on("init", () => {
              const editorContainer = editor.getContainer()
              const buttonsDiv = document.createElement("div")
              buttonsDiv.className = "editor-buttons"
              editorContainer.appendChild(buttonsDiv)

              // Create and render the buttons
              const sendButton = document.createElement("button")
              sendButton.textContent = translations.send
              sendButton.className = "bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              sendButton.onclick = handleSendMessage


              buttonsDiv.appendChild(sendButton)
            })
          }
        }
      />
      <div className="flex justify-end mt-4">
        <Button onClick={handleSendMessage}>{translations.send}</Button>
      </div>
    </div>
  )
}

