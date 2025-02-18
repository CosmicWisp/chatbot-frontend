import { useRef } from 'react';
import { Textarea } from './ui/TextArea';
import Button from './ui/Button';
import { ArrowUp, Loader2, CircleStop } from 'lucide-react';

export function Input({ input, setInput, isLoading, isStreaming, handleSubmit, handleStop }) {
  const textareaRef = useRef(null);

  const adjustHeight = (reset = false) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = reset ? '56px' : 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSubmitWrapper = (e) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      handleSubmit(e);
      setTimeout(() => adjustHeight(true), 0); 
    }
  };

  return (
    <div className="relative px-2 pb-6 transparent">
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-2 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Send a message..."
            className="flex w-full border-2 border-gray-600 px-4 py-3 text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-black/50 focus-visible:ring-offset-2 resize-none rounded-3xl bg-white/80 backdrop-blur-sm min-h-[56px] max-h-[200px] pr-20 shadow-lg"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isStreaming &&!isLoading) {
                handleSubmitWrapper(e);
              }
            }}
          />
          <Button
            size="icon"
            className="absolute bottom-3 right-5 bg-black/60 hover:bg-black rounded-2xl shadow-lg"
            onClick={(e) => {
              if (isLoading || isStreaming) {
                handleStop();
              } else {
                handleSubmitWrapper(e);
              }
            }}

            disabled={!input.trim() && !(isLoading || isStreaming)}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : isStreaming ? (
              <CircleStop className="h-6 w-6 text-white" />
            ) : (
              <ArrowUp className="h-6 w-6 text-white" />
            )}
          </Button>
          </div>
      </div>
    </div>
  );
}