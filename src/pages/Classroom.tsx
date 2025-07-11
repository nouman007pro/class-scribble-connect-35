
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, PenTool, FileText, MessageSquare, Trash2, Home } from "lucide-react";
import { toast } from "sonner";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { TextBoard } from "@/components/TextBoard";
import { ChatSystem } from "@/components/ChatSystem";
import { chatService } from "@/services/chatService";

const Classroom = () => {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") as 'teacher' | 'student' || 'student';
  const userName = searchParams.get("name");
  
  const [activeTab, setActiveTab] = useState<"canvas" | "text" | "chat">("chat");
  const [roomExists, setRoomExists] = useState<boolean | null>(null);

  // Check if room exists when component mounts
  useEffect(() => {
    const checkRoom = async () => {
      if (roomCode) {
        try {
          const exists = await chatService.checkRoomExists(roomCode);
          setRoomExists(exists);
          if (!exists) {
            toast.error("This room doesn't exist or is no longer active");
          }
        } catch (error) {
          console.error("Error checking room:", error);
          setRoomExists(false);
        }
      }
    };

    checkRoom();
  }, [roomCode]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || "");
    toast.success("Room code copied to clipboard!");
  };

  const shareRoomLink = () => {
    const link = `${window.location.origin}/classroom/${roomCode}?role=student&name=`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied to clipboard!");
  };

  const deleteRoom = async () => {
    if (!roomCode) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this room? All messages and data will be lost permanently.");
    
    if (confirmed) {
      try {
        await chatService.deleteRoom(roomCode);
        toast.success("Room deleted successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete room");
        console.error("Error deleting room:", error);
      }
    }
  };

  const goHome = () => {
    navigate("/");
  };

  // Show loading state while checking room
  if (roomExists === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking room...</p>
        </div>
      </div>
    );
  }

  // Show error state if room doesn't exist
  if (roomExists === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Room Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              This room doesn't exist or is no longer active. Please check the room code or ask the teacher to create a new room.
            </p>
            <Button onClick={goHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={goHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Room: {roomCode}
              </h1>
              <Badge variant={role === "teacher" ? "default" : "secondary"}>
                {role === "teacher" ? "Teacher" : "Student"}
              </Badge>
              <Badge variant="outline">
                {userName}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyRoomCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              {role === "teacher" && (
                <>
                  <Button variant="outline" size="sm" onClick={shareRoomLink}>
                    Share Link
                  </Button>
                  <Button variant="destructive" size="sm" onClick={deleteRoom}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Room
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab("canvas")}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "canvas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <PenTool className="w-4 h-4" />
              Drawing Canvas
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "text"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Text Board
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "chat" && (
          <Card className="bg-white">
            <CardContent className="p-6">
              <ChatSystem 
                roomCode={roomCode || ""} 
                userName={userName || ""} 
                userRole={role}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "canvas" && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Drawing Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <DrawingCanvas roomCode={roomCode || ""} userName={userName || ""} />
            </CardContent>
          </Card>
        )}

        {activeTab === "text" && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Collaborative Text Board</CardTitle>
            </CardHeader>
            <CardContent>
              <TextBoard roomCode={roomCode || ""} userName={userName || ""} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Classroom;
