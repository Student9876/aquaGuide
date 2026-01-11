import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import { useCreateCommunityForum } from "@/hooks/useCommunityForumPublic";

const config = {
  readonly: false,
  height: 300,
  toolbarSticky: false,
};

const CreateForum = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const editor = useRef(null);
  const navigate = useNavigate();

  const createForumMutation = useCreateCommunityForum();

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    createForumMutation.mutate(
      { title, content },
      {
        onSuccess: () => {
          navigate("/community-forum");
        },
        onError: () => {
          alert("Failed to create forum post");
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Create Guide Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Create New Forum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guide-title">Forum Title</Label>
            <Input
              id="guide-title"
              placeholder="Enter forum title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-content">Forum Content</Label>
            <div className="text-black">
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={setContent}
                className="text-black"
              />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto" disabled={loading}>
            {loading ? "Posting..." : "Post Forum"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateForum;
