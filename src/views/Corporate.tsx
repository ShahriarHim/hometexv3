"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Truck, CreditCard, Handshake, Mail, Phone } from "lucide-react";

const Corporate = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-sage-light/20 py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-sage text-white">B2B Solutions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Corporate & Institutional Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted partner for businesses, hotels, institutions, and corporate gifting needs
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Bulk Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Special pricing for large quantity orders
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Corporate Gifting</h3>
                <p className="text-sm text-muted-foreground">
                  Premium gift solutions for clients and employees
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Dedicated Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Priority shipping and logistics support
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Flexible Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Credit terms and EMI options available
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Handshake className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Account Manager</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support for your business needs
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Custom Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored products and branding options
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Get a Quote */}
            <Card>
              <CardHeader>
                <CardTitle>Get a Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Person</label>
                    <Input placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Requirements</label>
                    <Textarea
                      placeholder="Tell us about your requirements (product types, quantities, timeline, etc.)"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="premium">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Hometex?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    ✓ Premium quality textiles from trusted manufacturers
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✓ Competitive pricing for bulk orders
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✓ Reliable delivery across Bangladesh
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✓ 10+ years serving corporate clients
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✓ Custom branding and packaging available
                  </p>
                  <p className="text-sm text-muted-foreground">✓ Dedicated account management</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">corporate@hometex.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+880 1234-567890</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p className="text-sm text-muted-foreground">Sat - Thu: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
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

export default Corporate;
