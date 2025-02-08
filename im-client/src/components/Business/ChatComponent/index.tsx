"use client"

import { useState, useRef, useEffect, memo } from "react"
import type { Message, User } from "../../../types"
import MessageInput from "../MessageInput"
import EmailFeedback from "../EmailFeedback"
import type { LanguageCode } from "../../../locales/translations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIdleCallback } from "@/hooks/useIdleCallback"
import { socketService } from '@/services/socketService';


interface ChatComponentProps {
  language: LanguageCode
  translations: Record<string, string>
}


const users: User[] = [
  { id: "1", name: "Alice", avatar: "/alice-avatar.png" },
  { id: "2", name: "Bob", avatar: "/bob-avatar.png" },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender: users[0].id,
    content: "Hey Bob! <strong>How are you doing?</strong> 😊",
    timestamp: new Date("2023-07-01T10:00:00"),
    type: "text",
  },
  {
    id: "2",
    sender: users[1].id,
    content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
    timestamp: new Date("2023-07-01T10:02:00"),
    type: "text",
  },
  {
    id: "3",
    sender: users[0].id,
    content: `I'm doing well too! Just finished a <em>great book</em> on machine learning. Here are some key points I learned:
    <ul>
      <li>The importance of data preprocessing</li>
      <li>Different types of machine learning algorithms</li>
      <li>How to evaluate model performance</li>
    </ul>
    Have you read any interesting books lately?`,
    timestamp: new Date("2023-07-01T10:05:00"),
    type: "text",
  },
  {
    id: "4",
    sender: users[1].id,
    content: `That sounds interesting! I haven't read any ML books recently, but I've been diving into some classic literature. Just finished <em>Pride and Prejudice</em>. Here's my reading list for the next few months:
    <ol>
      <li>To Kill a Mockingbird</li>
      <li>1984</li>
      <li>The Great Gatsby</li>
      <li>One Hundred Years of Solitude</li>
    </ol>`,
    timestamp: new Date("2023-07-01T10:08:00"),
    type: "text",
  },
  {
    id: "5",
    sender: users[0].id,
    content: "Oh, that's a great choice! Speaking of classics, have you seen this beautiful edition I found?",
    timestamp: new Date("2023-07-01T10:10:00"),
    type: "text",
  },
  {
    id: "6",
    sender: users[0].id,
    content: "/placeholder.svg?height=300&width=200",
    timestamp: new Date("2023-07-01T10:10:30"),
    type: "image",
  },
  {
    id: "7",
    sender: users[1].id,
    content: "Wow, that looks amazing! I love the cover design. Where did you find it?",
    timestamp: new Date("2023-07-01T10:12:00"),
    type: "text",
  },
  {
    id: "8",
    sender: users[0].id,
    content:
      "I found it in a small bookshop downtown. They have a great collection of <strong>vintage and special editions</strong>.",
    timestamp: new Date("2023-07-01T10:15:00"),
    type: "text",
  },
  {
    id: "9",
    sender: users[1].id,
    content:
      "That's awesome! We should go there sometime. By the way, have you heard about the new <em>tech meetup</em> happening next week?",
    timestamp: new Date("2023-07-01T10:18:00"),
    type: "text",
  },
  {
    id: "10",
    sender: users[0].id,
    content: "No, I haven't! Tell me more about it. What's the focus?",
    timestamp: new Date("2023-07-01T10:20:00"),
    type: "text",
  },
  {
    id: "11",
    sender: users[1].id,
    content:
      "It's all about <strong>AI and its applications in everyday life</strong>. I thought you might be interested, given your recent ML reading!",
    timestamp: new Date("2023-07-01T10:22:00"),
    type: "text",
  },
  {
    id: "12",
    sender: users[0].id,
    content: "That sounds fascinating! Do you have a link to the event details?",
    timestamp: new Date("2023-07-01T10:25:00"),
    type: "text",
  },
  {
    id: "13",
    sender: users[1].id,
    content:
      'Sure, here\'s the link: <a href="https://example.com/tech-meetup" target="_blank">Tech Meetup Details</a>',
    timestamp: new Date("2023-07-01T10:27:00"),
    type: "text",
  },
  {
    id: "14",
    sender: users[0].id,
    content: "Thanks, Bob! I'll definitely check it out. Maybe we can go together?",
    timestamp: new Date("2023-07-01T10:30:00"),
    type: "text",
  },
  {
    id: "15",
    sender: users[1].id,
    content: "That's a great idea! Let's plan on it. Oh, and check out this cool AI-generated image I made:",
    timestamp: new Date("2023-07-01T10:32:00"),
    type: "text",
  },
  {
    id: "16",
    sender: users[1].id,
    content: "/placeholder.svg?height=400&width=400",
    timestamp: new Date("2023-07-01T10:32:30"),
    type: "image",
  },
  {
    id: "17",
    sender: users[0].id,
    content: "Wow, that's impressive! What tool did you use to create it?",
    timestamp: new Date("2023-07-01T10:35:00"),
    type: "text",
  },
  {
    id: "18",
    sender: users[1].id,
    content: "I used <strong>DALL-E 2</strong>. It's amazing what AI can do these days!",
    timestamp: new Date("2023-07-01T10:37:00"),
    type: "text",
  },
  {
    id: "19",
    sender: users[0].id,
    content:
      "Indeed! We'll have a lot to talk about at the meetup. Anyway, I need to run some errands now. Talk to you later?",
    timestamp: new Date("2023-07-01T10:40:00"),
    type: "text",
  },
  {
    id: "20",
    sender: users[1].id,
    content: "Sounds good, Alice! Have a great day, and let's touch base about the meetup later. 👋",
    timestamp: new Date("2023-07-01T10:42:00"),
    type: "text",
  },
]


function ChatComponent({ language, translations }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useIdleCallback<unknown>(scrollToBottom, [messages])

  const addMessage = (content: string, type: "text" | "image") => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: users[0].id,
      content,
      timestamp: new Date(),
      type,
    }
    setMessages([...messages, newMessage])

    // socketService.sendMessage({ room: 'room1', username: 'Alice', message: newMessage });
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // useEffect(() => {

  //   console.log('socketService ---> ', socketService)
  //   socketService.connectWithAuthToken('token');

  //   socketService.subscribeConnect(() => {
  //     console.log('Connected to WebSocket server');
  //     socketService.joinRoom({ room: 'room1', username: 'Alice' })
  //   })

  //   socketService.subscribeDisConnect(() => {
  //     console.log('Disconnected from server');
  //   })

  //   socketService.subscribeToMessages((data) => {
  //     console.log('Received message:', data);
  //     // 有消息就设置
  //     setMessages(prevMessages => [...prevMessages, { id: Date.now(), message: data.message, status: 'local' }]);
  //   })


  //   setTimeout(() => {
  //     console.log('message ---> ', { room: 'room1', username: 'Alice', message: 'Hello, everyone!' })
  //     socketService.sendMessage({ room: 'room1', username: 'Alice', message: 'Hello, everyone!' });
  //   }, 5 * 1000)

  //   setTimeout(() => {
  //     console.log('leaveRoom ---> ', { room: 'room1', username: 'Alice' })
  //     socketService.leaveRoom({ room: 'room1', username: 'Alice' });
  //   },15*1000)

  // }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => {
          const user = users.find((u) => u.id === message.sender)
          const isCurrentUser = user?.id === users[0].id
          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[70%]`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className={`rounded-lg p-3 ${isCurrentUser ? "bg-blue-100" : "bg-gray-100"}`}>
                    {message.type === "text" ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    ) : (
                      <img
                        src={message.content || "/placeholder.svg"}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded"
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(message.timestamp)}</div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={addMessage} language={language} translations={translations} />
      <EmailFeedback language={language} translations={translations} />
    </div>
  )
}

export default memo(ChatComponent);
