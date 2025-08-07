
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PenTool, MessageSquare, FileText, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { chatService } from "@/services/chatService";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

const Index = () => {
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await chatService.createRoom(newRoomCode, userName);
      toast.success("Room created successfully!");
      navigate(`/classroom/${newRoomCode}?role=teacher&name=${encodeURIComponent(userName)}`);
    } catch (error) {
      toast.error("Failed to create room");
      console.error("Error creating room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim() || !userName.trim()) {
      toast.error("Please enter both your name and room code");
      return;
    }

    setIsLoading(true);
    try {
      const roomExists = await chatService.checkRoomExists(roomCode);
      if (!roomExists) {
        toast.error("Room not found or no longer active. Please check the room code.");
        setIsLoading(false);
        return;
      }

      toast.success("Joining room...");
      navigate(`/classroom/${roomCode}?role=student&name=${encodeURIComponent(userName)}`);
    } catch (error) {
      toast.error("Failed to join room");
      console.error("Error joining room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userId.trim() || !message.trim()) {
      toast.error("Please enter both User ID and message");
      return;
    }

    setIsSending(true);
    try {
      console.log("Attempting to send message to Firebase...");
      console.log("Database instance:", db);
      
      const docRef = await addDoc(collection(db, "messages"), {
        userId: userId,
        message: message,
        timestamp: Timestamp.now(),
        created: new Date().toISOString()
      });
      
      console.log("Document written with ID: ", docRef.id);
      toast.success(`Message sent! Document ID: ${docRef.id}`);
      setMessage("");
      setUserId("");
    } catch (error) {
      console.error("Error sending message: ", error);
      console.error("Error details:", error.message);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Classroom
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            🏫 Perfect for online classes, tutoring, and collaborative learning
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <PenTool className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle>Live Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Draw and sketch together in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <CardTitle>Text Board</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Collaborate on text and notes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Communicate with participants</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Create New Room
              </CardTitle>
              <CardDescription>
                Start a new classroom session as a teacher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={createRoom} 
                className="w-full" 
                size="lg"
                disabled={!userName.trim() || isLoading}
              >
                {isLoading ? "Creating Room..." : "Create Room"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join Room
              </CardTitle>
              <CardDescription>
                Join an existing classroom session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isLoading}
              />
              <Input
                placeholder="Room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                disabled={isLoading}
              />
              <Button
                onClick={joinRoom}
                className="w-full"
                size="lg"
                disabled={!roomCode || !userName || isLoading}
              >
                {isLoading ? "Joining Room..." : "Join Room"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Firebase Message Testing Section */}
        <div className="mt-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Firebase Message Test
              </CardTitle>
              <CardDescription>
                Test Firebase message storage functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isSending}
              />
              <Input
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
              />
              <Button
                onClick={sendMessage}
                className="w-full"
                size="lg"
                disabled={!userId.trim() || !message.trim() || isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
