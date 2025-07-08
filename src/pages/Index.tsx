
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PenTool, MessageSquare, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/classroom/${newRoomCode}?role=teacher&name=${encodeURIComponent(userName || "Teacher")}`);
  };

  const joinRoom = () => {
    if (roomCode && userName) {
      navigate(`/classroom/${roomCode}?role=student&name=${encodeURIComponent(userName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Drawing & Text Tool
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
                placeholder="Your name (optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button onClick={createRoom} className="w-full" size="lg">
                Create Room
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
              />
              <Input
                placeholder="Room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              />
              <Button
                onClick={joinRoom}
                className="w-full"
                size="lg"
                disabled={!roomCode || !userName}
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
