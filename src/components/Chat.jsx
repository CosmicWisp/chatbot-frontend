import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { Messages } from './Messages';
import { Input } from './Input';

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [abortController, setAbortController] = useState(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const contentRef = useRef('');
  const indexRef = useRef(0);

  useEffect(() => {
    return () => {
      abortController?.abort();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [abortController]);

  const handleSuggestion = (text) => {
    handleSendMessage(text);
  };

  const handleSendMessage = async (message) => {
    try {
      const trimmedMessage = message.trim();

      const controller = new AbortController();
      setAbortController(controller);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const userMessage = { 
        id: Date.now(), 
        role: 'user', 
        content: trimmedMessage 
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      
      // const botResponse = { 
      //   id: Date.now(), 
      //   role: 'assistant', 
      //   // content: data.response 
      //   content: data.candidates[0]?.content?.parts[0]?.text
      // };
      // setMessages((prev) => [...prev, botResponse]);

      const response = await fetch('http://ENDPOINT-URL-HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trimmedMessage }), // Add additional fields as needed
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request Failed! status: ${response.status}`);
      }

      const data = await response.json();

      const responseContent = data.response // API response structure.

      setIsLoading(false);
      setIsStreaming(true);
      contentRef.current = responseContent;
      indexRef.current = 0;
      startTimeRef.current = Date.now();

      const streamChunk = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const targetIndex = Math.min(
          Math.floor(elapsed / 5),
          contentRef.current.length
        );

        if (indexRef.current < targetIndex) {
          const chunk = contentRef.current.slice(indexRef.current, targetIndex);
          setStreamingContent(prev => prev + chunk);
          indexRef.current = targetIndex;
        }

        if (indexRef.current < contentRef.current.length) {
          animationRef.current = requestAnimationFrame(streamChunk);
        } else {

          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: contentRef.current
          }]);
          setStreamingContent('');
          setIsStreaming(false);
        }
      };

      animationRef.current = requestAnimationFrame(streamChunk);


    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: error.message.includes('aborted') 
            ? 'Request cancelled' 
            : 'Sorry, an error occurred'
        }]);
      }
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleStopStreaming = () => {
    if (isLoading) abortController?.abort();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    if (indexRef.current > 0) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: contentRef.current.slice(0, indexRef.current)
      }]);
    }

    setStreamingContent('');
    setIsLoading(false);
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <Messages
        messages={messages}
        isLoading={isLoading}
        handleSuggestion={handleSuggestion}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
      />
      <Input
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isStreaming = {isStreaming}
        handleSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
          setInput('');
        }}
        handleStop={handleStopStreaming}
      />
    </div>
  );
}
