
import { useState, useEffect } from "react";
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
  const [onlineUsers] = useState([
    { name: userName, role: userRole, active: true }
  ]);

  useEffect(() => {
    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(roomCode, (newMessages) => {
      setMessages(newMessages);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [roomCode]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage(roomCode, userName, newMessage, userRole);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          {onlineUsers.length} online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
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
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <Badge
                      variant={user.role === "teacher" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
