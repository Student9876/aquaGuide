import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import speciesIcon from "@/assets/logo_dict.png";

const speciesCategories = [
  { name: "Aquatic Plants", position: "top-left" },
  { name: "Brackish Fish", position: "left" },
  { name: "Marine Fish", position: "bottom-left" },
  { name: "Freshwater Fish", position: "bottom" },
];

const careCategories = [
  { name: "Very Easy Care", position: "top-right" },
  { name: "Easy Care", position: "right-top" },
  { name: "Moderate Care", position: "right" },
  { name: "Difficult Care", position: "right-bottom" },
  { name: "Expert Care", position: "bottom-right" },
];

const species = [
  {
    id: 1,
    name: "Betta Fish",
    type: "Freshwater",
    ph: "6.5-7.5",
    care: "Easy",
    size: "2.5-3 inches",
    temp: "76-82°F",
    icon: "🐟",
  },
  {
    id: 2,
    name: "Neon Tetra",
    type: "Freshwater",
    ph: "6.0-7.0",
    care: "Easy",
    size: "1.5 inches",
    temp: "70-81°F",
    icon: "🐠",
  },
  {
    id: 3,
    name: "Clownfish",
    type: "Saltwater",
    ph: "8.0-8.4",
    care: "Moderate",
    size: "3-4 inches",
    temp: "75-82°F",
    icon: "🤡",
  },
  {
    id: 4,
    name: "Angelfish",
    type: "Freshwater",
    ph: "6.5-7.5",
    care: "Moderate",
    size: "6 inches",
    temp: "75-82°F",
    icon: "👼",
  },
  {
    id: 5,
    name: "Goldfish",
    type: "Coldwater",
    ph: "7.0-8.0",
    care: "Easy",
    size: "6-10 inches",
    temp: "65-72°F",
    icon: "🐡",
  },
  {
    id: 6,
    name: "Guppy",
    type: "Tropical",
    ph: "6.8-7.8",
    care: "Easy",
    size: "1.5-2 inches",
    temp: "72-82°F",
    icon: "🎨",
  },
  {
    id: 7,
    name: "Discus",
    type: "Freshwater",
    ph: "6.0-7.0",
    care: "Hard",
    size: "8-10 inches",
    temp: "82-86°F",
    icon: "💿",
  },
  {
    id: 8,
    name: "Tang Fish",
    type: "Saltwater",
    ph: "8.1-8.4",
    care: "Moderate",
    size: "10-12 inches",
    temp: "72-78°F",
    icon: "🐠",
  },
];

const SpeciesDictionary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpecies = species.filter((fish) => {
    const matchesCategory =
      !selectedCategory ||
      fish.type === selectedCategory ||
      fish.care === selectedCategory;
    const matchesSearch = fish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPositionClasses = (position: string) => {
    const baseClasses = "absolute";
    switch (position) {
      case "top-left":
        return `${baseClasses} top-[20%] left-0 sm:top-14 sm:left-44 lg:top-12 lg:left-52`;
      case "left":
        return `${baseClasses} top-[36%]  left-0 sm:left-36 lg:left-40`;
      case "bottom-left":
        return `${baseClasses} bottom-[34%] left-0 sm:bottom-[34%] sm:left-36 lg:bottom-[34%] lg:left-40`;
      case "bottom":
        return `${baseClasses} bottom-[18%] left-0 lg:left-52  sm:bottom-12 sm:left-44 lg:bottom-12`;
      case "top-right":
        return `${baseClasses} top-[12%] right-0 sm:top-8 sm:right-44 lg:top-12 lg:right-52`;
      case "right-top":
        return `${baseClasses} top-[27%] lg:top-[27%] right-0 sm:right-40 lg:right-44`;
      case "right":
        return `${baseClasses} top-[43%] lg:top-[43%]  right-0 sm:right-36 lg:right-40`;
      case "right-bottom":
        return `${baseClasses} bottom-[28%] lg:bottom-[30%] right-0 sm:right-40 lg:right-44`;
      case "bottom-right":
        return `${baseClasses} bottom-[12%] right-0 sm:bottom-10 sm:right-48 lg:bottom-12 lg:right-56`;
      default:
        return baseClasses;
    }
  };

  const getCareColor = (care: string) => {
    switch (care) {
      case "Easy":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "Moderate":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "Hard":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Species Dictionary
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-center">
          Explore our comprehensive database of aquatic species
        </p>

        {/* Circular Category Selector */}
        <div className="relative w-full max-w-5xl mx-auto mb-12">
          <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] flex items-center justify-center">
            {/* Central Image */}
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-background border-4 border-primary/20 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={speciesIcon}
                alt="Species Dictionary"
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain"
              />
            </div>

            {/* Species Type Categories (Left Side) */}
            {speciesCategories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className={`${getPositionClasses(
                  category.position
                )} whitespace-nowrap text-xs sm:text-lg px-3 py-2 sm:px-4 sm:py-2 z-20`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                {category.name}
              </Button>
            ))}

            {/* Care Level Categories (Right Side) */}
            {careCategories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className={`${getPositionClasses(
                  category.position
                )} whitespace-nowrap text-xs sm:text-lg px-3 py-2 sm:px-4 sm:py-2 z-20`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search species..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Active Filter Display */}
        {selectedCategory && (
          <div className="text-center mt-4">
            <Badge variant="secondary" className="text-sm">
              Filtering by: {selectedCategory}
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-2 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpecies.map((fish) => (
          <Card
            key={fish.id}
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
          >
            <CardHeader>
              <div className="text-5xl mb-4 text-center">{fish.icon}</div>
              <CardTitle className="text-center">{fish.name}</CardTitle>
              <CardDescription className="text-center">
                <Badge variant="secondary" className="mt-2">
                  {fish.type}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Care Level:</span>
                <Badge className={getCareColor(fish.care)}>{fish.care}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{fish.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">pH Range:</span>
                <span className="font-medium">{fish.ph}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Temperature:</span>
                <span className="font-medium">{fish.temp}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpeciesDictionary;
