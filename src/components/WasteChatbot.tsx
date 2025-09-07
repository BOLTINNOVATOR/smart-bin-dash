import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatGPTService } from '@/services/chatgptService';
import { useAppStore } from '@/store/useAppStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface WasteChatbotProps {
  apiKey?: string;
}

export const WasteChatbot = ({ apiKey }: WasteChatbotProps) => {
  const { language } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: "EcoBot Assistant",
      placeholder: "Ask about waste disposal, recycling, composting...",
      send: "Send",
      welcome: "Hi! I'm EcoBot 🌱 Ask me anything about waste management and environmental sustainability!",
      apiKeyPlaceholder: "Enter your OpenAI API key",
      configure: "Configure API Key",
      examples: [
        "How to dispose of batteries?",
        "What items are compostable?",
        "Recycling guidelines for plastic",
        "How to reduce household waste?"
      ]
    },
    hi: {
      title: "इकोबॉट सहायक",
      placeholder: "अपशिष्ट निपटान, रीसाइक्लिंग, कंपोस्टिंग के बारे में पूछें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं इकोबॉट हूँ 🌱 अपशिष्ट प्रबंधन और पर्यावरणीय स्थिरता के बारे में कुछ भी पूछें!",
      apiKeyPlaceholder: "अपनी OpenAI API कुंजी दर्ज करें",
      configure: "API कुंजी कॉन्फ़िगर करें",
      examples: [
        "बैटरी का निपटान कैसे करें?",
        "कौन से आइटम कंपोस्ट योग्य हैं?",
        "प्लास्टिक के लिए रीसाइक्लिंग दिशानिर्देश",
        "घरेलू अपशिष्ट कैसे कम करें?"
      ]
    }
  };

  const t = content[language];

  useEffect(() => {
    if (localApiKey) {
      chatGPTService.setApiKey(localApiKey);
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: t.welcome,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [localApiKey, t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!localApiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatGPTService.chatWithBot(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg animate-pulse-glow"
          aria-label="Open waste management chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-[600px] max-h-[80vh]"
            >
              <Card className="h-full flex flex-col shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    {t.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4 pt-0">
                  {!localApiKey ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Configure your OpenAI API key to start chatting:
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder={t.apiKeyPlaceholder}
                          value={localApiKey}
                          onChange={(e) => setLocalApiKey(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => {
                            if (localApiKey) {
                              chatGPTService.setApiKey(localApiKey);
                            }
                          }}
                          disabled={!localApiKey}
                        >
                          {t.configure}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <ScrollArea className="flex-1 pr-4 mb-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`flex gap-3 ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {message.sender === 'bot' && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary" />
                                  </div>
                                </div>
                              )}
                              
                              <div
                                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                  message.sender === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                {message.text}
                              </div>
                              
                              {message.sender === 'user' && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-accent" />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {isLoading && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex gap-3 justify-start"
                            >
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                              <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Quick Examples */}
                      {messages.length <= 1 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-xs text-muted-foreground">Try asking:</p>
                          <div className="flex flex-wrap gap-2">
                            {t.examples.map((example, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent/10 text-xs"
                                onClick={() => handleExampleClick(example)}
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Input */}
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={t.placeholder}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isLoading}
                          size="sm"
                          aria-label={t.send}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};