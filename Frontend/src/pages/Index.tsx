import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Search, ShoppingCart, Star, Trophy, Upload } from "lucide-react";
import valorantPreview from "@/assets/valorant-preview.jpg";
import fortnitePreview from "@/assets/fortnite-preview.jpg";
import pubgPreview from "@/assets/pubg-preview.jpg";
import cs2Preview from "@/assets/cs2-preview.jpg";
import lolPreview from "@/assets/lol-preview.jpg";
import apexPreview from "@/assets/apex-preview.jpg";
import { useCurrency } from "@/hooks/use-currency";

// Mock gaming accounts data
const gamingAccounts = [
  {
    id: "1",
    game: "Valorant",
    image: valorantPreview,
    rank: "Immortal 2",
    level: 245,
    price: 299,
    description: "Premium account with rare skins and high rank",
    skins: 47,
    rating: 4.9
  },
  {
    id: "2", 
    game: "Fortnite",
    image: fortnitePreview,
    rank: "Champion League",
    level: 180,
    price: 199,
    description: "Exclusive skins from multiple seasons",
    skins: 89,
    rating: 4.8
  },
  {
    id: "3",
    game: "PUBG",
    image: pubgPreview,
    rank: "Conqueror",
    level: 78,
    price: 149,
    description: "High-tier ranking with exclusive items",
    skins: 23,
    rating: 4.9
  },
  {
    id: "4",
    game: "CS2",
    image: cs2Preview,
    rank: "Global Elite",
    level: 156,
    price: 399,
    description: "Legendary rank with knife collection",
    skins: 34,
    rating: 5.0
  },
  {
    id: "5",
    game: "League of Legends",
    image: lolPreview,
    rank: "Challenger",
    level: 467,
    price: 599,
    description: "Top-tier account with rare prestige skins",
    skins: 156,
    rating: 4.9
  },
  {
    id: "6",
    game: "Apex Legends",
    image: apexPreview,
    rank: "Predator",
    level: 234,
    price: 249,
    description: "Elite battle royale account with heirlooms",
    skins: 67,
    rating: 4.7
  }
];

const Index = () => {
  const { currency, toggleCurrency, convertPrice } = useCurrency();
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                GameVault
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={toggleCurrency}
                className="bg-muted/50 border-border"
              >
                {currency === 'USD' ? '₹' : '$'} {currency}
              </Button>
              <Link to="/upload">
                <Button variant="outline" className="bg-accent/10 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Item
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="bg-muted/50 border-border">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90 shadow-glow">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
            Premium Gaming Accounts
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover high-tier gaming accounts with rare skins, top rankings, and exclusive items. 
            Start dominating your favorite games today.
          </p>
          
          <div className="flex justify-center mb-8">
            <Link to="/upload">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                <Upload className="mr-2 h-5 w-5" />
                Sell Your Account
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search accounts..." 
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accounts Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Available Accounts</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{gamingAccounts.length} accounts available</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamingAccounts.map((account) => (
              <Link key={account.id} to={`/account/${account.id}`}>
                <Card className="gaming-card h-full cursor-pointer group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={account.image} 
                      alt={`${account.game} account`}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/80 text-white">
                        {account.game}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-gaming-orange" />
                        <span>{account.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{account.game}</CardTitle>
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {account.rank}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {account.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level {account.level}</span>
                      <span className="text-muted-foreground">{account.skins} skins</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {convertPrice(account.price).formatted}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-accent/10 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 GameVault. Secure gaming account marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;