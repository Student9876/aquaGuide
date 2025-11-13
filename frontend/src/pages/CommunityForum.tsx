import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

const forumPosts = [
  { id: 1, title: "Help! My fish are acting strange", author: "AquaNewbie", category: "Help", replies: 24, likes: 12, views: 340, time: "2 hours ago" },
  { id: 2, title: "Show off your newest additions", author: "TankMaster", category: "Showcase", replies: 56, likes: 89, views: 1200, time: "5 hours ago" },
  { id: 3, title: "Best filter for 20 gallon tank?", author: "FishLover99", category: "Equipment", replies: 18, likes: 15, views: 280, time: "1 day ago" },
  { id: 4, title: "Breeding success with my angelfish!", author: "AngelsRule", category: "Breeding", replies: 32, likes: 67, views: 890, time: "1 day ago" },
  { id: 5, title: "Water parameter testing frequency?", author: "ChemistryPro", category: "Water Quality", replies: 41, likes: 34, views: 650, time: "2 days ago" },
  { id: 6, title: "My planted tank journey", author: "PlantGeek", category: "Plants", replies: 78, likes: 156, views: 2100, time: "3 days ago" },
];

const categories = ["All Topics", "Help", "Showcase", "Equipment", "Breeding", "Water Quality", "Plants", "Species"];

const CommunityForum = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Community Forum</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6">
          Ask questions, share advice, and showcase your aquariums! Join discussions with other hobbyists – friendly, helpful, and all about fishkeeping.
        </p>
        <Button variant="ocean" size="lg" className="w-full sm:w-auto">Start a Discussion</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                >
                  {category}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {forumPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Posted by {post.author}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.replies} replies</span>
                    <span className="sm:hidden">{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.likes} likes</span>
                    <span className="sm:hidden">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.views} views</span>
                    <span className="sm:hidden">{post.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
