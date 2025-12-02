import { Link } from "react-router-dom";
import { MessageCircle, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  imageUrls?: string[];
  stockQuantity: number;
  category?: { name: string };
  code?: string;
  color?: string;
  whatsappNumber?: string;
}

const ProductCard = ({ id, name, description, price, imageUrl, imageUrls, stockQuantity, category, code, color, whatsappNumber }: ProductCardProps) => {
  const inStock = stockQuantity > 0;

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return;
    const productLink = `${window.location.origin}/products/${id}`;
    const link = generateWhatsAppLink(whatsappNumber, name, code, color, productLink);
    window.open(link, "_blank", "noopener,noreferrer");
  };
  
  // Get the first image from imageUrls array, or fallback to imageUrl for backward compatibility
  const displayImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : imageUrl;
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <div className="relative overflow-hidden aspect-square bg-muted">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="object-center object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hero-from to-hero-to">
            <span className="text-4xl text-muted-foreground/20">🎨</span>
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        )}
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        {price && (
          <p className="text-xl font-bold text-primary">RS. {price.toFixed(2)}</p>
        )}
        {inStock ? (
          <p className="text-xs text-muted-foreground">{stockQuantity} in stock</p>
        ) : (
          <p className="text-xs text-destructive">Out of stock</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Link to={`/products/${id}`} className="flex-1">
          <Button variant="outline" className="w-full group/btn">
            <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View Details
          </Button>
        </Link>
        <Button 
          onClick={handleWhatsAppClick}
          disabled={!whatsappNumber}
          className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground group/btn" 
        >
          <MessageCircle className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
