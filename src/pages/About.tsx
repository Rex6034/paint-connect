import { Award, Users, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gradient-to-b from-hero-from/20 to-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">About Colour House</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner in quality paints and coatings since 2010
            </p>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto mb-16 space-y-6 text-lg leading-relaxed">
            <p>
              Founded in 2010, Colour House Paints has been serving the community with premium quality paints
              and coatings for over a decade. What started as a small local paint shop has grown into
              a trusted destination for both homeowners and professional contractors.
            </p>
            <p>
              We pride ourselves on offering a carefully curated selection of products from leading brands,
              combined with expert advice and exceptional customer service. Whether you're refreshing a
              single room or tackling a major renovation project, our team is here to help you achieve
              the perfect finish.
            </p>
            <p>
              At Colour House Paints, we understand that choosing the right paint can transform your space.
              That's why we're committed to providing not just products, but solutions that bring your
              vision to life.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-8 rounded-2xl bg-muted/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Quality First</h3>
              <p className="text-muted-foreground">
                We source only the finest paints and coatings, ensuring lasting results and customer satisfaction.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-muted/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Expert Service</h3>
              <p className="text-muted-foreground">
                Our knowledgeable team provides personalized advice and support for every project.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-muted/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Your Vision</h3>
              <p className="text-muted-foreground">
                We're dedicated to helping you achieve the exact look and feel you envision.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
