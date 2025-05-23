import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-manga-300 to-manga-500">
              MangaSphere
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your gateway to the world of manga. Discover, read, and connect
              with fellow manga enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-manga-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-manga-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-manga-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-manga-400 bg- transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/library"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Manga Library
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Genres
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Trending Manga
                </Link>
              </li>
              <li>
                <Link
                  href="/new-releases"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/forums"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Forums
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/creators"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Creators
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium mb-4">Help & Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-manga-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MangaSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
