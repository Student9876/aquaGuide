import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import { useCreateCommunityForum } from "@/hooks/useCommunityForumPublic";

const config = {
  readonly: false,
  height: 300,
  toolbarSticky: false,
};

const CreateForum = () => {
  const [open, setOpen] = useState(true);
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
          setOpen(false);
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
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) navigate("/community-forum"); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Forum</DialogTitle>
          <DialogDescription>
            Start a new discussion with the community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Forum Title</Label>
            <Input
              id="forum-title"
              placeholder="Enter forum title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Forum Content</Label>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || !title.trim()}>
            {loading ? "Posting..." : "Post Forum"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForum;
