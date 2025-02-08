import { memo } from "react"
import Chat from "./features/chat"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <div>
     <Chat />
     <Toaster />
    </div>
  )
}

export default memo(App)
