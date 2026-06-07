import { useState } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { aiService, AISuggestionProduct } from '@/services'
import { Link } from '@tanstack/react-router'

interface Message {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: Date
  products?: AISuggestionProduct[]
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you? Feel free to ask me about the product you are looking for.',
      sender: 'admin',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const query = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiService.suggestProducts(query)
      
      if (response.success && response.data) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.suggestions,
          sender: 'admin',
          timestamp: new Date(),
          products: response.data.products,
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I am unable to process your request at this time. Please try again later.',
          sender: 'admin',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorResponse])
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, an error occurred. Please try again later.',
        sender: 'admin',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarFallback className="bg-blue-500 text-white">CS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-blue-100">Trực tuyến</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                {/* Product Suggestions */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 max-w-[70%] space-y-2">
                    <p className="text-xs text-gray-600 font-semibold mb-2">
                      Sản phẩm gợi ý:
                    </p>
                    {message.products.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        to="/products/$productId"
                        params={{ productId: product.id }}
                        className="block bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex gap-2">
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-blue-600 font-semibold">
                              {product.price.toLocaleString('vi-VN')} đ
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">Searching for products...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || inputMessage.trim() === ''}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 group"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <>
            <MessageCircle size={24} className="transition-transform duration-300 group-hover:scale-110" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
              1
            </span>
          </>
        )}
      </button>
    </>
  )
}
