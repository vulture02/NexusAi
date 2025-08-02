import { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.chat === "function"
      ) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const addMessage = (mesg, isUser) => {
    setMessages((pre) => [
      ...pre,
      { content: mesg, isUser, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;
    if (!aiReady) {
      addMessage("AI is not ready yet, please wait...", false);
      return;
    }
    addMessage(message, true);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await window.puter.ai.chat(message);
      const reply =
        typeof response === "string"
          ? response
          : response.message?.content || "Sorry, I didn't understand that.";
      addMessage(reply, false);
    } catch (error) {
      console.error("Error during AI chat:", error);
      addMessage("An error occurred while chatting with AI.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 relative overflow-hidden">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-400/10 to-violet-600/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-screen p-8">
        {/* Header Section */}
        <div className="text-center space-y-3 flex-shrink-0 mb-4">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
              NEXUS AI
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-300 font-light tracking-wide">
            Experience the future of conversation
          </p>
        </div>

        {/* Status Indicator */}
        <div className="relative flex-shrink-0 mb-6">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl border-2 transition-all duration-500 ${
              aiReady 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-400/25 shadow-lg animate-pulse" 
                : "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-400/25 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${aiReady ? 'bg-emerald-400' : 'bg-amber-400'} animate-ping`}></div>
              {aiReady ? "🚀 AI Neural Network Online" : "⚡ Initializing Neural Pathways..."}
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="w-full max-w-4xl relative flex-1 flex flex-col min-h-0 mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col min-h-0">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-6 p-5 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm scrollbar-hide min-h-0"
                 style={{
                   scrollbarWidth: 'none',
                   msOverflowStyle: 'none'
                 }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="text-4xl animate-bounce">🤖</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    Ready to Chat!
                  </div>
                  <p className="text-gray-400 text-sm">
                    Start your conversation with our advanced AI assistant
                  </p>
                </div>
              )}
              
              {messages.map((mesg) => (
                <div
                  key={mesg.id}
                  className={`flex mb-4 ${mesg.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-500`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-lg ${
                      mesg.isUser
                        ? "bg-gradient-to-r from-cyan-500/80 to-purple-600/80 text-white border-cyan-400/30 shadow-cyan-400/25"
                        : "bg-gradient-to-r from-indigo-500/80 to-pink-600/80 text-white border-indigo-400/30 shadow-indigo-400/25"
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {mesg.isUser ? "You" : "NEXUS AI"}
                    </div>
                    <div className="whitespace-pre-wrap font-medium text-sm leading-relaxed">
                      {mesg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4 animate-in slide-in-from-bottom duration-500">
                  <div className="max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500/80 to-pink-600/80 text-white border border-indigo-400/30 shadow-lg shadow-indigo-400/25 backdrop-blur-xl">
                    <div className="text-xs opacity-70 mb-1">NEXUS AI</div>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-sm font-medium">Processing your request...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Section */}
            <div className="flex gap-3 items-end flex-shrink-0">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={aiReady ? "Type your message and press Enter..." : "Waiting for AI initialization..."}
                  disabled={!aiReady || isLoading}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl text-white text-sm rounded-2xl border border-white/20 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 pointer-events-none"></div>
              </div>
              <button 
                onClick={sendMessage} 
                disabled={!aiReady || isLoading || !inputValue.trim()} 
                className="relative group px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/50 hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs flex-shrink-0">
          <p>Powered by advanced neural networks • Built for the future</p>
        </div>
      </div>
    </div>
  );
}

export default App;