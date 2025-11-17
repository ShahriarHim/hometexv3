import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GiftSomeone = () => {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    message: "",
    senderName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    toast.success("Gift card sent successfully!");
    setFormData({ recipientName: "", recipientEmail: "", message: "", senderName: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Send a Gift</h1>
            <p className="text-muted-foreground text-lg">
              Share the joy of premium home textiles with your loved ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      placeholder="John Doe"
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientEmail: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderName">Your Name</Label>
                    <Input
                      id="senderName"
                      placeholder="Jane Doe"
                      value={formData.senderName}
                      onChange={(e) =>
                        setFormData({ ...formData, senderName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Personal Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write a heartfelt message..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Send Gift Card
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <Heart className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Perfect for Any Occasion</h3>
                  <p className="text-muted-foreground">
                    Whether it's a birthday, wedding, or housewarming, our gift cards are the
                    perfect way to show you care.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-secondary/5 border-secondary/20">
                <CardContent className="p-6">
                  <Sparkles className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
                  <p className="text-muted-foreground">
                    Gift cards are delivered instantly via email with your personalized message.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-semibold text-foreground">1.</span>
                      Fill in recipient details and your message
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-foreground">2.</span>
                      Choose gift card amount
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-foreground">3.</span>
                      Complete payment
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-foreground">4.</span>
                      Recipient receives email instantly
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftSomeone;
