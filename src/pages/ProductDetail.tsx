import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Package, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProduct, getSettings } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    setSelectedImageIndex(0);
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [productData, settingsData] = await Promise.all([
        getProduct(id),
        getSettings(),
      ]);
      
      setProduct(productData);
      if (settingsData) {
        setWhatsappNumber(settingsData.whatsapp_number);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    try {
      const productLink = `${window.location.origin}/products/${id}`;
      const link = generateWhatsAppLink(
        whatsappNumber,
        product.name,
        product.code,
        product.color,
        productLink
      );
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate WhatsApp link.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Product not found</p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gradient-to-b from-hero-from/20 to-background">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link to="/products">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Button>
          </Link>

          {/* Product Content */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Images Gallery */}
            {(() => {
              const images = product.image_urls || (product.image_url ? [product.image_url] : []);
              const displayImages = images
                .map((img: string) => {
                  if (!img) return "";
                  if (img.startsWith("http")) return img;
                  const { data } = supabase.storage.from("product-images").getPublicUrl(img);
                  return data.publicUrl || "";
                })
                .filter((u: string) => !!u);

              // Ensure selected index is within bounds
              const safeIndex = selectedImageIndex >= 0 && selectedImageIndex < displayImages.length ? selectedImageIndex : 0;
              const mainImage = displayImages[safeIndex] || displayImages[0];

              return (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hero-from to-hero-to">
                        <span className="text-9xl text-muted-foreground/20">🎨</span>
                      </div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-6 py-2">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {displayImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {displayImages.map((img: string, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            safeIndex === index
                              ? "border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="object-center object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Details */}
            <div className="space-y-6">
              {product.category && (
                <Badge variant="secondary" className="text-sm">
                  {product.category.name}
                </Badge>
              )}
              
              <h1 className="text-4xl font-bold">{product.name}</h1>
              
              {product.price && (
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
              )}

              <div className="space-y-4 py-4 border-y border-border">
                {product.code && (
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Product Code</p>
                      <p className="font-medium">{product.code}</p>
                    </div>
                  </div>
                )}

                {product.brand && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🏢</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Brand</p>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                  </div>
                )}

                {product.color && (
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-medium">{product.color}</p>
                    </div>
                  </div>
                )}

                {product.size && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📏</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Status</p>
                    <p className={`font-medium ${inStock ? "text-green-600" : "text-destructive"}`}>
                      {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
                    </p>
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground text-lg py-6 group"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Buy on WhatsApp
              </Button>

              {!inStock && (
                <p className="text-sm text-muted-foreground text-center">
                  This product is currently out of stock, but you can still inquire about availability via WhatsApp.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
