import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const forumPosts = [
  {
    id: 1,
    title: "Help! My fish are acting strange",
    author: "AquaNewbie",
    category: "Help",
    content:
      "I've noticed my fish have been swimming erratically and hiding more than usual. The water parameters seem fine (pH 7.2, ammonia 0, nitrites 0, nitrates 20ppm). They were perfectly fine yesterday but today they seem stressed. Has anyone experienced this before? Could it be related to the new decoration I added?",
    replies: 24,
    upvotes: 45,
    downvotes: 3,
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Show off your newest additions",
    author: "TankMaster",
    category: "Showcase",
    content:
      "Just got some beautiful cardinal tetras to add to my planted tank! They're absolutely stunning with their vibrant red and blue colors. Took me weeks to find healthy specimens at my local fish store. Share your recent additions below!",
    replies: 56,
    upvotes: 89,
    downvotes: 2,
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Best filter for 20 gallon tank?",
    author: "FishLover99",
    category: "Equipment",
    content:
      "Looking for recommendations on the best filter for my 20 gallon community tank. Currently considering hang-on-back vs canister filters. Budget is around $50-80. What do you all use and recommend?",
    replies: 18,
    upvotes: 15,
    downvotes: 1,
    time: "1 day ago",
  },
  {
    id: 4,
    title: "Breeding success with my angelfish!",
    author: "AngelsRule",
    category: "Breeding",
    content:
      "After months of trying, my pair of angelfish finally laid eggs and they're hatching! I'm so excited. The parents are being very protective. Any tips for raising the fry would be greatly appreciated!",
    replies: 32,
    upvotes: 67,
    downvotes: 0,
    time: "1 day ago",
  },
  {
    id: 5,
    title: "Water parameter testing frequency?",
    author: "ChemistryPro",
    category: "Water Quality",
    content:
      "How often do you all test your water parameters? I've been doing it weekly but wondering if that's overkill for an established tank. Also, which test kit do you prefer - strips or liquid?",
    replies: 41,
    upvotes: 34,
    downvotes: 5,
    time: "2 days ago",
  },
  {
    id: 6,
    title: "My planted tank journey",
    author: "PlantGeek",
    category: "Plants",
    content:
      "Started my planted tank 6 months ago and wanted to share my progress. Started with just java fern and anubias, now I have a full carpet of monte carlo and various stem plants. CO2 injection really made a difference!",
    replies: 78,
    upvotes: 156,
    downvotes: 4,
    time: "3 days ago",
  },
];

const comments = [
  {
    id: 1,
    author: "FishExpert",
    content:
      "This sounds like it could be stress from the new decoration. Try removing it temporarily and see if they calm down.",
    time: "1 hour ago",
  },
  {
    id: 2,
    author: "AquaHelper",
    content:
      "Have you checked if the decoration is aquarium-safe? Some decorations can leach harmful substances.",
    time: "45 min ago",
  },
  {
    id: 3,
    author: "TankVeteran",
    content:
      "I had the same issue when I added a new cave. The fish were scared of it at first but got used to it after a few days.",
    time: "30 min ago",
  },
];

const ViewForum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const post = forumPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Forum post not found</h1>
        <Button onClick={() => navigate("/community-forum")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </div>
    );
  }

  const handleVote = (type: "up" | "down") => {
    setUserVote(userVote === type ? null : type);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/community-forum")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Post Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {post.time}
                </span>
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                {post.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted by {post.author}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{post.content}</p>

              {/* Vote Section */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant={userVote === "up" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVote("up")}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.upvotes + (userVote === "up" ? 1 : 0)}</span>
                </Button>
                <Button
                  variant={userVote === "down" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleVote("down")}
                  className="gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{post.downvotes + (userVote === "down" ? 1 : 0)}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[80px]"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4 border-t">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {comment.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Other Forums */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-base">Other Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {forumPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 5)
                .map((p) => (
                  <Link
                    key={p.id}
                    to={`/view/forum/${p.id}`}
                    className="block p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <p className="text-sm font-medium line-clamp-2 mb-1">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {p.category}
                      </Badge>
                      <span>{p.time}</span>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewForum;
