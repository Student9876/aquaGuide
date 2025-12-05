import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Video Guides", path: "/video-guides" },
  { name: "Text Guides", path: "/text-guides" },
  { name: "Species Dictionary", path: "/species-dictionary" },
  { name: "Community Forum", path: "/community-forum" },
  { name: "Community Chat", path: "/community-chat" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

const SecondaryNav = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-card flex ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                location.pathname === item.path
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;
