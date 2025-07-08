
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Users, Clock } from "lucide-react";
import { toast } from "sonner";

interface TextBoardProps {
  roomCode: string;
  userName: string;
}

export const TextBoard = ({ roomCode, userName }: TextBoardProps) => {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collaborators] = useState([
    { name: userName, color: "#3B82F6", active: true }
  ]);

  const saveContent = () => {
    // In a real app, this would save to a backend
    setLastSaved(new Date());
    toast("Content saved successfully!");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Collaborative Text Board</h3>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {collaborators.length} collaborator{collaborators.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last saved: {formatTime(lastSaved)}
            </div>
          )}
          <Button onClick={saveContent} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Active Collaborators */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Active now:</span>
            {collaborators.map((collaborator, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
                style={{ backgroundColor: `${collaborator.color}20`, color: collaborator.color }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: collaborator.color }}
                />
                {collaborator.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Text Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shared Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing here... Everyone in the room can see and edit this text in real-time."
            className="min-h-[400px] resize-none"
          />
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Room: {roomCode}</span>
            <span>{content.length} characters</span>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to use the Text Board:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Type anywhere to add or edit text</li>
                <li>Changes are saved automatically as you type</li>
                <li>All participants can see edits in real-time</li>
                <li>Use this for taking notes, brainstorming, or collaborative writing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
