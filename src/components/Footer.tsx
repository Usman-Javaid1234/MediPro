import { Phone, MessageCircle, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container-custom mx-auto section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">MediPro</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Your Online Health Partner in Pakistan. We are committed to providing safe, effective, and discreet health solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">WhatsApp</p>
                  <a href="https://wa.me/923146200998" className="font-semibold hover:underline">
                    +92 314 620 0998
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">Helpline</p>
                  <a href="tel:+923146200998" className="font-semibold hover:underline">
                    +92 314 620 0998
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} MediPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/60">Payment:</span>
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold">
              Cash on Delivery
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
