import Button from './ui/Button';
import { useState } from 'react';
import { Sparkles, Clipboard,Check } from 'lucide-react';

export function Message({ message }) {
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      {message.role === 'assistant' && (
        <div className="mr-3 mt-2 shrink-0">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <div className="text-secondary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>  
          </div>
        </div>
      )}
      <div
        className={`max-w-3xl rounded-2xl p-4 relative ${
          message.role === 'user' 
            ? 'message-glass-user text-primary-foreground'  
            : 'message-glass-assistant text-secondary-foreground'
        } shadow-lg`}
      >
        <div className="flex flex-col px-2 gap-4">
          <pre className="whitespace-pre-wrap font-sans break-words overflow-hidden">
            {message.content}
          </pre>
          {message.role === 'assistant' && (
            <div className="relative mr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8 ml-2 bg-accent hover:bg-accent/80"
                title="Copy to clipboard"
              >
                {showCopied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Clipboard className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
