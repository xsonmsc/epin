import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ExternalLink, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { GoogleGenAI } from "@google/genai";

const ChatWidget = () => {
  const { siteSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'menu' | 'ai'>('menu');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const whatsappLink = siteSettings.socials?.whatsapp || `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeMode]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [
                { role: 'user', parts: [{ text: userMsg }] }
            ],
            config: {
                tools: [{ googleSearch: {} }], // Enable grounding
                systemInstruction: `You are a helpful AI assistant for GamePay AZ, a digital marketplace for gaming currencies (UC, VP), licenses, and accounts. 
                Your goal is to help users with their orders, explain how to buy, and provide info about games. 
                The currency is AZN (Manat). 
                If asked about live support, direct them to WhatsApp.`
            }
        });

        const aiResponse = response.text || "Bağışlayın, hazırda cavab verə bilmirəm.";
        
        // Handle grounding chunks if available (append links)
        let finalText = aiResponse;
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (grounding && grounding.length > 0) {
            finalText += "\n\nReferanslar:";
            grounding.forEach((chunk: any) => {
                if(chunk.web?.uri) {
                    finalText += `\n- ${chunk.web.title}: ${chunk.web.uri}`;
                }
            });
        }

        setMessages(prev => [...prev, { role: 'model', text: finalText }]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'model', text: "Xəta baş verdi. Zəhmət olmasa WhatsApp vasitəsilə əlaqə saxlayın." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const closeChat = () => {
      setIsOpen(false);
      setActiveMode('menu'); // Reset to menu on close
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-gaming-card border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[500px]">
            
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    {activeMode === 'ai' ? <Bot className="w-5 h-5 text-gaming-neon"/> : <MessageCircle className="w-5 h-5 text-green-500"/>}
                    {activeMode === 'ai' ? 'GamePay AI' : 'Dəstək Mərkəzi'}
                </h3>
                <div className="flex gap-2">
                    {activeMode === 'ai' && (
                        <button onClick={() => setActiveMode('menu')} className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800">
                            Menyu
                        </button>
                    )}
                    <button onClick={closeChat} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content - MENU MODE */}
            {activeMode === 'menu' && (
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-gray-400 text-center text-sm mb-2">Salam! Sizə necə kömək edə bilərik?</p>
                    
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-6 h-6" />
                            <div className="text-left">
                                <p className="font-bold">WhatsApp</p>
                                <p className="text-xs text-green-100">Canlı Operatorla Danış</p>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </a>

                    <button 
                        onClick={() => setActiveMode('ai')}
                        className="bg-gaming-accent hover:bg-purple-700 text-white p-4 rounded-xl flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Bot className="w-6 h-6" />
                            <div className="text-left">
                                <p className="font-bold">AI Asistan</p>
                                <p className="text-xs text-purple-200">Sualını ver, anında cavab al</p>
                            </div>
                        </div>
                        <Sparkles className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </button>
                </div>
            )}

            {/* Content - AI MODE */}
            {activeMode === 'ai' && (
                <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 text-sm mt-10">
                                <Bot className="w-10 h-10 mx-auto mb-3 opacity-50"/>
                                <p>Mənə istənilən sualı verə bilərsiniz.</p>
                                <p className="text-xs mt-1">Məsələn: "PUBG UC qiymətləri neçədir?"</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                                    msg.role === 'user' 
                                    ? 'bg-gaming-neon text-black rounded-tr-none' 
                                    : 'bg-slate-800 text-gray-200 rounded-tl-none border border-gray-700'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 rounded-2xl p-3 rounded-tl-none border border-gray-700">
                                    <Loader2 className="w-5 h-5 animate-spin text-gaming-neon" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleAiSubmit} className="p-3 bg-slate-900 border-t border-gray-800 flex gap-2">
                        <input 
                            className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gaming-neon"
                            placeholder="Sualınızı yazın..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-gaming-neon p-2 rounded-full text-black hover:bg-cyan-400 disabled:opacity-50">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'} text-white p-4 rounded-full shadow-lg shadow-black/50 transition-all transform hover:scale-110 flex items-center justify-center`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatWidget;