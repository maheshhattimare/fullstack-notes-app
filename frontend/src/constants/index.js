import { Search, Shield, Zap, Cloud, Lightbulb, Share2 } from "lucide-react";
export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "NoteEase has revolutionized how I organize my thoughts. The search functionality is incredible - I can find any note from months ago in seconds.",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "StartupXYZ",
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "As a developer, I need to jot down ideas quickly. NoteEase's clean interface and fast performance make it perfect for my workflow.",
  },
  {
    name: "Emily Rodriguez",
    role: "Content Writer",
    company: "Creative Agency",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The organization features are game-changing. I can manage hundreds of article ideas and research notes effortlessly.",
  },
];

export const features = [
  {
    icon: Lightbulb,
    title: "Smart Organization",
    description:
      "AI-powered categorization and tagging system that automatically organizes your notes for easy retrieval.",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Find any note instantly with our advanced search that looks through titles, content, and tags.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "Access your notes anywhere, anytime. Seamless synchronization across all your devices.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "End-to-end encryption ensures your thoughts and ideas remain completely private and secure.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance means your notes load instantly, no matter how many you have.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Collaborate seamlessly with team members or share individual notes with anyone.",
  },
];

export const stats = [
  { number: "50", label: "Active Users" },
  { number: "10k", label: "Notes Created" },
  { number: "99.9%", label: "Uptime" },
  { number: "4.9/5", label: "User Rating" },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal use",
    features: [
      "Up to 100 notes",
      "Basic search",
      "Mobile app access",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For power users and professionals",
    features: [
      "Unlimited notes",
      "Advanced search & filters",
      "Cloud sync across devices",
      "Priority support",
      "Export to PDF/Word",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$19",
    period: "per user/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Admin controls",
      "Advanced security",
      "API access",
      "Custom integrations",
    ],
    popular: false,
  },
];
