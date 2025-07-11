
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, Users } from "lucide-react";
import { chatService, ChatMessage } from "@/services/chatService";
import { toast } from "sonner";

interface ChatSystemProps {
  roomCode: string;
  userName: string;
  userRole?: 'teacher' | 'student';
}

export const ChatSystem = ({ roomCode, userName, userRole = 'student' }: ChatSystemProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    console.log('Setting up chat for room:', roomCode, 'user:', userName, 'role:', userRole);
    
    // Clear previous subscription if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    // Reset state when room changes
    setMessages([]);
    setIsLoading(true);
    
    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(roomCode, (newMessages) => {
      console.log('Received messages update:', newMessages.length, 'messages');
      setMessages([...newMessages]); // Force re-render with new array
      setIsLoading(false);
      if (newMessages.length > 0) {
        scrollToBottom();
      }
    });

    unsubscribeRef.current = unsubscribe;

    // Set a timeout to stop loading if no messages come through
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, stopping loading state');
      setIsLoading(false);
    }, 5000);

    // Cleanup subscription on unmount or room change
    return () => {
      console.log('Cleaning up chat subscription for room:', roomCode);
      clearTimeout(loadingTimeout);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [roomCode, userName, userRole]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (isSending) return;

    try {
      setIsSending(true);
      console.log('Sending message:', newMessage, 'from:', userName, 'role:', userRole);
      
      await chatService.sendMessage(roomCode, userName, newMessage.trim(), userRole);
      setNewMessage("");
      console.log('Message sent successfully');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return "Invalid time";
    }
  };

  console.log('Rendering ChatSystem with', messages.length, 'messages, loading:', isLoading);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Live Chat</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          Room: {roomCode}
        </div>
      </div>

      {/* Chat Messages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Messages ({messages.length})</span>
            {isLoading && <span className="text-sm text-gray-500">Loading messages...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4 p-2 min-h-[380px]">
              {isLoading ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={`${message.id}-${index}`}
                      className={`flex ${
                        message.userName === userName ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.userName === userName
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {message.userName !== userName && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.userName}
                            </span>
                            <Badge
                              variant={message.role === "teacher" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {message.role}
                            </Badge>
                          </div>
                        )}
                        <p className="text-sm break-words">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Guidelines */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Chat Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>Be respectful and kind to all participants</li>
                <li>Stay on topic and keep discussions educational</li>
                <li>Use clear and concise messages</li>
                <li>Ask questions if you need clarification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
