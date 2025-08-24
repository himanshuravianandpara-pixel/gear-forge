import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Plus, X, Star, Loader2 } from "lucide-react";
import { uploadItem, UploadItemData } from "@/services/api";
import { toast } from "sonner";


// Valorant agents data
const valorantAgents = [
  { id: "jett", name: "Jett", image: "/placeholder.svg?height=80&width=80&text=Jett", unlocked: false },
  { id: "raze", name: "Raze", image: "/placeholder.svg?height=80&width=80&text=Raze", unlocked: false },
  { id: "phoenix", name: "Phoenix", image: "/placeholder.svg?height=80&width=80&text=Phoenix", unlocked: false },
  { id: "sova", name: "Sova", image: "/placeholder.svg?height=80&width=80&text=Sova", unlocked: false },
  { id: "sage", name: "Sage", image: "/placeholder.svg?height=80&width=80&text=Sage", unlocked: false },
  { id: "cypher", name: "Cypher", image: "/placeholder.svg?height=80&width=80&text=Cypher", unlocked: false },
  { id: "reyna", name: "Reyna", image: "/placeholder.svg?height=80&width=80&text=Reyna", unlocked: false },
  { id: "killjoy", name: "Killjoy", image: "/placeholder.svg?height=80&width=80&text=Killjoy", unlocked: false },
  { id: "breach", name: "Breach", image: "/placeholder.svg?height=80&width=80&text=Breach", unlocked: false },
  { id: "omen", name: "Omen", image: "/placeholder.svg?height=80&width=80&text=Omen", unlocked: false },
  { id: "brimstone", name: "Brimstone", image: "/placeholder.svg?height=80&width=80&text=Brimstone", unlocked: false },
  { id: "skye", name: "Skye", image: "/placeholder.svg?height=80&width=80&text=Skye", unlocked: false },
  { id: "yoru", name: "Yoru", image: "/placeholder.svg?height=80&width=80&text=Yoru", unlocked: false },
  { id: "astra", name: "Astra", image: "/placeholder.svg?height=80&width=80&text=Astra", unlocked: false },
  { id: "kay-o", name: "KAY/O", image: "/placeholder.svg?height=80&width=80&text=KAY-O", unlocked: false },
  { id: "chamber", name: "Chamber", image: "/placeholder.svg?height=80&width=80&text=Chamber", unlocked: false },
  { id: "neon", name: "Neon", image: "/placeholder.svg?height=80&width=80&text=Neon", unlocked: false },
  { id: "fade", name: "Fade", image: "/placeholder.svg?height=80&width=80&text=Fade", unlocked: false },
  { id: "harbor", name: "Harbor", image: "/placeholder.svg?height=80&width=80&text=Harbor", unlocked: false },
  { id: "gekko", name: "Gekko", image: "/placeholder.svg?height=80&width=80&text=Gekko", unlocked: false },
  { id: "deadlock", name: "Deadlock", image: "/placeholder.svg?height=80&width=80&text=Deadlock", unlocked: false },
  { id: "iso", name: "Iso", image: "/placeholder.svg?height=80&width=80&text=Iso", unlocked: false },
  { id: "clove", name: "Clove", image: "/placeholder.svg?height=80&width=80&text=Clove", unlocked: false }
];

interface Skin {
  id: string;
  name: string;
  screenshot: File | null;
  previewUrl: string;
  screenshotUrl?: string; // Firebase Storage URL
}

const UploadItem = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    price: "",
    rank: "",
    region: ""
  });
  
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [newSkin, setNewSkin] = useState({ name: "", screenshot: null as File | null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const addSkin = () => {
    if (newSkin.name.trim() && newSkin.screenshot) {
      const previewUrl = URL.createObjectURL(newSkin.screenshot);
      setSkins(prev => [...prev, { 
        ...newSkin, 
        id: Date.now().toString(),
        screenshot: newSkin.screenshot,
        previewUrl 
      }]);
      setNewSkin({ name: "", screenshot: null });
    }
  };

  const removeSkin = (skinId: string) => {
    setSkins(prev => {
      const skinToRemove = prev.find(skin => skin.id === skinId);
      if (skinToRemove?.previewUrl) {
        URL.revokeObjectURL(skinToRemove.previewUrl);
      }
      return prev.filter(skin => skin.id !== skinId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      
      // Validate form data
      if (!formData.title || !formData.description || !formData.level || !formData.price || !formData.rank || !formData.region) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if (selectedAgents.length === 0) {
        toast.error("Please select at least one agent");
        return;
      }
      
      if (skins.length === 0) {
        toast.error("Please add at least one skin");
        return;
      }
      
      // Prepare data for backend API
      const uploadData: UploadItemData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        price: formData.price,
        rank: formData.rank,
        region: formData.region,
        selectedAgents: selectedAgents,
        skins: skins.map(skin => ({
          id: skin.id,
          name: skin.name,
          screenshotName: skin.screenshot ? skin.screenshot.name : ''
        }))
      };
      
      // Get all screenshot files
      const screenshotFiles = skins
        .filter(skin => skin.screenshot)
        .map(skin => skin.screenshot!)
        .filter(Boolean);
      
      console.log('Upload data:', uploadData);
      console.log('Screenshot files:', screenshotFiles);

      // Call backend API with files
      toast.info("Uploading images and saving item...");
      const response = await uploadItem(uploadData, screenshotFiles);
      console.log(response)
      
      if (response.success) {
        toast.success("Item uploaded successfully!");
        
        // Clean up file URLs to prevent memory leaks
        skins.forEach(skin => {
          if (skin.previewUrl) {
            URL.revokeObjectURL(skin.previewUrl);
          }
        });
        
        // Navigate back to marketplace
        navigate("/");
      } else {
        toast.error(response.message || "Failed to upload item");
      }
      
    } catch (error) {
      console.error('Error uploading item:', error);
      toast.error(error instanceof Error ? error.message : "Failed to upload item");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cleanup file URLs when component unmounts
  useEffect(() => {
    return () => {
      skins.forEach(skin => {
        if (skin.previewUrl) {
          URL.revokeObjectURL(skin.previewUrl);
        }
      });
    };
  }, [skins]);

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

        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="gaming-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Upload Valorant Account</CardTitle>
              <CardDescription>
                List your Valorant account for sale with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Account Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Premium Immortal Account with Rare Skins"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rank">Current Rank</Label>
                      <Input
                        id="rank"
                        placeholder="e.g., Immortal 2"
                        value={formData.rank}
                        onChange={(e) => handleInputChange("rank", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Account Level</Label>
                      <Input
                        id="level"
                        type="number"
                        placeholder="e.g., 245"
                        value={formData.level}
                        onChange={(e) => handleInputChange("level", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Server Region</Label>
                      <Input
                        id="region"
                        placeholder="e.g., NA, EU, AP"
                        value={formData.region}
                        onChange={(e) => handleInputChange("region", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your account, achievements, and what makes it special..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      maxLength={500}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        Provide detailed information about your account to attract buyers
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formData.description.length}/500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Unlocked Agents</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on agent images to select which ones are unlocked on your account
                  </p>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {valorantAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          selectedAgents.includes(agent.id)
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                            : 'hover:scale-105'
                        }`}
                        onClick={() => toggleAgent(agent.id)}
                      >
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className={`w-full h-20 object-cover rounded-lg ${
                            selectedAgents.includes(agent.id)
                              ? 'brightness-110'
                              : 'brightness-75'
                          }`}
                        />
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="text-xs text-white font-medium text-center bg-black/70 rounded px-1 py-0.5">
                            {agent.name}
                          </p>
                        </div>
                        {selectedAgents.includes(agent.id) && (
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              ✓
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAgents(valorantAgents.map(a => a.id))}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Select All Agents
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAgents([])}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Selection
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedAgents.length} / {valorantAgents.length} agents
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Tips for Agent Selection:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Select all agents that are unlocked on your account</li>
                      <li>More unlocked agents typically increase account value</li>
                      <li>Include both free and premium agents</li>
                    </ul>
                  </div>
                </div>

                {/* Skins Management */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Skins & Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the skins and items included with this account
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg mb-4">
                    <p className="font-medium mb-1">💡 Tips for Adding Skins:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Include high-value skins like Elderflame, Prime, and Reaver collections</li>
                      <li>Add screenshots to showcase the skins visually</li>
                      <li>Mention any exclusive or limited-time skins</li>
                    </ul>
                  </div>
                  
                  {/* Add New Skin */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <Label htmlFor="skinName">Skin Name</Label>
                      <Input
                        id="skinName"
                        placeholder="e.g., Phantom Elderflame"
                        value={newSkin.name}
                        onChange={(e) => setNewSkin(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skinScreenshot">Screenshot File</Label>
                      <Input
                        id="skinScreenshot"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewSkin(prev => ({ ...prev, screenshot: file }));
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload PNG, JPG, or JPEG files
                      </p>
                    </div>
                    <div className="md:col-span-2">
                                             <Button
                         type="button"
                         onClick={addSkin}
                         disabled={!newSkin.name.trim() || !newSkin.screenshot}
                         className="w-full"
                       >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Skin
                      </Button>
                    </div>
                  </div>

                  {/* Display Added Skins */}
                  {skins.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skins.map((skin) => (
                        <Card key={skin.id} className="gaming-card">
                          <CardContent className="p-4">
                            <div className="relative">
                                                             <img
                                 src={skin.previewUrl}
                                 alt={skin.name}
                                 className="w-full h-32 object-cover rounded-lg mb-3"
                                 onError={(e) => {
                                   e.currentTarget.src = "/placeholder.svg?height=128&width=300&text=Skin+Image";
                                 }}
                               />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={() => removeSkin(skin.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-medium text-sm text-center">{skin.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Pricing</h3>
                  <div>
                    <Label htmlFor="price">Price (INR)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 25415"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the price in Indian Rupees (₹)
                    </p>
                  </div>
                </div>

                {/* Preview Section */}
                {formData.title && (
                  <div className="space-y-4 p-6 bg-muted/20 rounded-lg border border-border/50">
                    <h3 className="text-xl font-semibold">Preview</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Account Summary</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Title:</span> {formData.title}</p>
                          <p><span className="font-medium">Rank:</span> {formData.rank}</p>
                          <p><span className="font-medium">Level:</span> {formData.level}</p>
                          <p><span className="font-medium">Region:</span> {formData.region}</p>
                          <p><span className="font-medium">Agents:</span> {selectedAgents.length} unlocked</p>
                          <p><span className="font-medium">Skins:</span> {skins.length} items</p>
                        </div>
                      </div>
                                             <div>
                         <h4 className="font-medium mb-2">Pricing</h4>
                         <div className="text-center p-4 bg-muted/30 rounded-lg">
                           <p className="text-sm text-muted-foreground mb-1">Price in INR</p>
                           <p className="text-3xl font-bold text-primary">
                             {formData.price ? `₹${parseFloat(formData.price).toLocaleString('en-IN')}` : '₹0'}
                           </p>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing upload...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow px-8"
                    disabled={!formData.title || !formData.price || selectedAgents.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadItem;
