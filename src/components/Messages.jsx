import { useRef, useEffect } from 'react';
import { Message } from './Message';
import { Sparkles } from 'lucide-react';

export function Messages({ messages, isLoading, isStreaming, handleSuggestion, streamingContent }) {
  const messagesEndRef = useRef(null);
  const suggestions = [
    'What rewards do token holders get?',
    'How does Nasdao ensure transparency?',
    'How can users participate in staking?',
    'What role do validator nodes play?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading ]);

  return (
    <div className="flex-1 flex justify-center overflow-y-auto py-2 my-3">
      <div className="w-full max-w-4xl px-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <div className="text-white">
              <Sparkles className="h-12 w-12" />
            </div>
            <h2 className="text-2xl text-white font-semibold">How can I help you today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl mt-10">
              {suggestions.map((text) => (
                <button
                  key={text}
                  onClick={() => handleSuggestion(text)}
                  className="suggestion-button text-left p-4 rounded-xl border transition-colors animate-in"
                >
                  <span className="font-medium block">{text.split('?')[0]}?</span>
                  {text.includes('?') && (
                    <span className="text-muted-foreground block mt-1">
                      {text.split('?')[1]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && !isStreaming && (
              <div className="flex items-start px-4 mb-4 animate-in">
                <div className="mr-3 mt-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <div className="text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div> 
              </div>
            )}
            {streamingContent && (
              <div className="flex items-start px-4 mb-4 animate-in">
                <div className="mr-3 mt-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <div className="text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
                  <pre className="whitespace-pre-wrap font-sans break-words overflow-hidden">
                    {streamingContent}
                  </pre>
                </div> 
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
       </div> 
    </div>
  );
}
