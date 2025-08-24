import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Star, Trophy, Zap } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

// Mock data - in a real app, this would come from an API
const mockAccounts = {
  "1": {
    id: "1",
    game: "Valorant",
    rank: "Immortal 2",
    level: 245,
    price: 299,
    description: "Premium Valorant account with rare skins and high rank. Perfect for competitive players.",
    skins: ["Phantom Elderflame", "Vandal Prime", "Knife Reaver"],
    region: "NA",
    wins: 892,
    bannerImage: "/placeholder.svg?height=300&width=800&text=Valorant+Banner"
  },
  "2": {
    id: "2",
    game: "Fortnite",
    rank: "Champion League",
    level: 180,
    price: 199,
    description: "Exclusive Fortnite account with rare skins from multiple seasons.",
    skins: ["Black Knight", "Renegade Raider", "Skull Trooper"],
    region: "EU",
    wins: 456,
    bannerImage: "/placeholder.svg?height=300&width=800&text=Fortnite+Banner"
  },
  "3": {
    id: "3",
    game: "PUBG",
    rank: "Conqueror",
    level: 78,
    price: 149,
    description: "High-tier PUBG account with exclusive items and top-tier ranking.",
    skins: ["Ghillie Suit", "M416 Glacier", "AKM Redline"],
    region: "AS",
    wins: 234,
    bannerImage: "/placeholder.svg?height=300&width=800&text=PUBG+Banner"
  }
};

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency, toggleCurrency, convertPrice } = useCurrency();
  
  const account = id ? mockAccounts[id as keyof typeof mockAccounts] : null;

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="gaming-card p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Account Not Found</h2>
            <p className="text-muted-foreground mb-4">The account you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            className="bg-muted/50 border-border"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleCurrency}
            className="bg-muted/50 border-border"
          >
            {currency === 'USD' ? '₹' : '$'} {currency}
          </Button>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 mb-8">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{account.game}</h1>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {account.rank}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl">Account Details</CardTitle>
                <CardDescription>{account.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Trophy className="h-8 w-8 text-accent" />
                    <div>
                      <p className="font-semibold">Rank</p>
                      <p className="text-sm text-muted-foreground">{account.rank}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Zap className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Level</p>
                      <p className="text-sm text-muted-foreground">{account.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Star className="h-8 w-8 text-gaming-orange" />
                    <div>
                      <p className="font-semibold">Wins</p>
                      <p className="text-sm text-muted-foreground">{account.wins}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-8 w-8 text-gaming-cyan" />
                    <div>
                      <p className="font-semibold">Region</p>
                      <p className="text-sm text-muted-foreground">{account.region}</p>
                    </div>
                  </div>
                </div>

                {/* Skins/Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Included Items & Skins</h3>
                  <div className="flex flex-wrap gap-2">
                    {account.skins.map((skin, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 border-primary/30">
                        {skin}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="gaming-card sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Purchase Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{convertPrice(account.price).formatted}</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
                  size="lg"
                >
                  Buy Now
                </Button>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Account verification included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;