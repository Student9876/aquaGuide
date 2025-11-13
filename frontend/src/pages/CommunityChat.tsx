import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users, Lock, Globe, MessageCircle } from "lucide-react";

const publicCommunities = [
  { id: 1, name: "Beginner's Corner", members: 1240, online: 89, description: "Perfect for those just starting out" },
  { id: 2, name: "Planted Tank Enthusiasts", members: 856, online: 45, description: "All about aquascaping and plants" },
  { id: 3, name: "Saltwater Specialists", members: 623, online: 32, description: "Marine aquarium discussions" },
  { id: 4, name: "Breeding Club", members: 445, online: 18, description: "Share breeding tips and success stories" },
];

const recentChats = [
  { id: 1, name: "John Aquarist", lastMessage: "Thanks for the help with my tank!", time: "5 min ago", unread: 2 },
  { id: 2, name: "Sarah Fish Lover", lastMessage: "Check out my new setup!", time: "1 hour ago", unread: 0 },
  { id: 3, name: "Mike Tank Master", lastMessage: "Let's discuss water parameters", time: "2 hours ago", unread: 1 },
];

const CommunityChat = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Community Chat</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Connect with fellow aquarists in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communities Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="ocean" className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
            <Button variant="outline" className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Browse Public Communities</span>
              <span className="sm:hidden">Browse</span>
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Public Communities</h2>
            <div className="space-y-4">
              {publicCommunities.map((community) => (
                <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                        </div>
                        <CardDescription>{community.description}</CardDescription>
                      </div>
                      <Button variant="secondary" size="sm" className="sm:mt-0">Join</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {community.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        {community.online} online
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Chats Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Personal Chats
              </CardTitle>
              <CardDescription>Your recent conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{chat.name}</span>
                    {chat.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{chat.time}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Start New Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Private Communities
              </CardTitle>
              <CardDescription>Invitation only</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join exclusive communities for specialized topics and advanced discussions.
              </p>
              <Button variant="outline" className="w-full">Browse Invitations</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
