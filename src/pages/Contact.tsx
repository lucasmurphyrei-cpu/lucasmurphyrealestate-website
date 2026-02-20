import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section className="container max-w-5xl py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Get In Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ready to start your real estate journey? Schedule a consultation or send us a message.
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="(414) 555-0123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Tell us about your real estate goals..." rows={5} required />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Schedule a Consultation"}
          </Button>
        </form>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl font-bold">Provision Properties Core Team</h3>
            <p className="text-sm text-muted-foreground">eXp Realty</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Service Areas</p>
                <p className="text-sm text-muted-foreground">Milwaukee, Waukesha, Washington & Ozaukee Counties, Wisconsin</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-sm text-muted-foreground">Contact us through the form and we'll respond promptly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-muted-foreground">Reach out anytime — we're here to help.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-6">
            <h4 className="font-display font-bold">Why Work With Us?</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✓ Deep knowledge of Milwaukee & Waukesha markets</li>
              <li>✓ First-time buyer specialists</li>
              <li>✓ Investor-friendly approach</li>
              <li>✓ Trusted network of contractors, lenders & inspectors</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
