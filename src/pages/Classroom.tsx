
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, PenTool, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { TextBoard } from "@/components/TextBoard";
import { ChatSystem } from "@/components/ChatSystem";

const Classroom = () => {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const userName = searchParams.get("name");
  
  const [activeTab, setActiveTab] = useState<"canvas" | "text" | "chat">("canvas");
  const [participants] = useState([
    { name: userName || "User", role: role || "student" }
  ]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || "");
    toast("Room code copied to clipboard!");
  };

  const shareRoomLink = () => {
    const link = `${window.location.origin}/classroom/${roomCode}?role=student&name=`;
    navigator.clipboard.writeText(link);
    toast("Room link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Room: {roomCode}
              </h1>
              <Badge variant={role === "teacher" ? "default" : "secondary"}>
                {role === "teacher" ? "Teacher" : "Student"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyRoomCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              {role === "teacher" && (
                <Button variant="outline" size="sm" onClick={shareRoomLink}>
                  Share Link
                </Button>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {participants.length} participant{participants.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
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
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
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

        {activeTab === "chat" && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatSystem roomCode={roomCode || ""} userName={userName || ""} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Classroom;
