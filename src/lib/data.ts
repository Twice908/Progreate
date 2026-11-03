/**
 * All site copy lives here, verbatim from the ClipCut template.
 * Edit this file to change text later — components only render what is defined here.
 */

export const brand = { name: "ClipCut" } as const;

export const nav = {
  links: [
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/all-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Get Started", href: "/contact" },
};

export const hero = {
  badge: "Trusted by 100+ creators & brands",
  title: "Short-form video editing that actually gets results",
  description:
    "We turn your raw clips into high-performing Reels, TikToks, and Shorts — designed to grab attention, boost engagement, and grow your audience faster.",
  primary: { label: "Start a Project", href: "/contact" },
  secondary: { label: "See Our Works", href: "/all-works" },
  tags: ["Short Video Editing", "Content Strategy", "Growth Optimization"],
};

export const problem = {
  badge: "The Problem",
  title: ["Great content,", "but no real growth?"],
  description:
    "You’re spending hours creating videos, but the results just don’t match the effort. The problem isn’t consistency — it’s what happens after people hit play.",
  cards: [
    {
      title: "Views that don’t convert",
      description: "Your videos get views, but no real engagement or business impact.",
    },
    {
      title: "Likes don't pay the bills",
      description: "Viral moments feel good, but they don’t build a sustainable audience.",
    },
    {
      title: "No system, no consistency",
      description:
        "Posting randomly without a system leads to inconsistent results and no real growth.",
    },
  ],
  views: { label: "Views", value: 120, suffix: "K", note: "-68% retention drop", tooltip: "50% Viewers dropped", months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"] },
  growth: { engagementLabel: "Engagement", engagement: 88, suffix: "K", growthLabel: "Growth", growth: 3, chips: ["Likes", "Growth"] },
  consistency: {
    label: "Consistency",
    title: "Inconsistent posting",
    activityLabel: "Posting Activity",
    days: ["TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON"],
    posted: [true, true, false, false, true, false, false],
    outputLabel: "CONTENT OUTPUT",
    outputValue: "3 / 10",
    outputNote: "posts this week",
    percent: 32,
  },
};

export const fix = {
  badge: "How We Fix It",
  title: "A done-for-you editing system that delivers results",
  description:
    "We don't just cut footage — we engineer each video for retention, reach, and results. You send the clips, we handle everything else.",
  cta: { label: "See Our Works", href: "/all-works" },
  stats: [
    { label: "Avg. Retention Rate", value: 68, suffix: "%", description: "Hook-driven edits that keep viewers watching past the first 3 seconds." },
    { label: "Videos Delivered", value: 500, suffix: "+", description: "From solo creators to full agencies — delivered on time, every time." },
    { label: "Avg. Engagement Increased", value: 3, suffix: "X", description: "More comments, shares, and saves — not just views." },
    { label: "Turnaround Time", value: 48, suffix: "hr", description: "Send clips today. Get your video back tomorrow." },
  ],
};

export const services = {
  badge: "What We Do",
  title: "Short-form editing-from raw clips to ready to post",
  description:
    "Whether you're an agency managing multiple clients or a solo editor building your brand — we give you the editing muscle to deliver more, faster.",
  cards: [
    { icon: "shorts", lead: "Youtube", accent: "Shots", description: "Hook-driven edits sized and optimized for Shorts' algorithm" },
    { icon: "reels", lead: "Instagram", accent: "Reels", description: "Trend-aware edits with captions, pacing, and hooks built for Reels reach" },
    { icon: "tiktok", lead: "TikTok", accent: "Videos", description: "Fast-cut edits built around trending sounds, formats, and native behaviors" },
  ],
  grow: {
    title: ["More content,", "Less chaos"],
    description:
      "Hand off the editing. We deliver polished, platform-ready videos while you focus on growing your business or serving your clients.",
    cta: { label: "Start Growing Today", href: "/contact" },
    cards: [
      { title: "Fast Delivery", description: "Fast Turnaround — Edited and delivered in 24–48 hours, every time" },
      { title: "Built for growth", description: "Built to Perform — Every edit is engineered for hooks, retention, and platform reach" },
      { title: "Expert Team", description: "Expert Editors — Work with editors who know what makes short-form content convert" },
    ],
  },
};

export type Work = {
  views: string;
  title: string;
  description: string;
  author: string;
  platform: "shorts" | "reels" | "tiktok";
};

export const clientResults = {
  badge: "Client Results",
  title: ["Real videos,", "Real numbers"],
  description:
    "Every video below was edited, optimized, and delivered by our team. The numbers speak for themselves.",
  cta: { label: "See More Works", href: "/all-works" },
  videos: [
    { views: "758K Views", title: "2.3x engagement growth", description: "Optimized content structure for better watch time", author: "wearnova", platform: "shorts" },
    { views: "1.2M Views", title: "+10K followers in 30 days", description: "Consistent reels strategy with high retention edits", author: "wearnova", platform: "reels" },
    { views: "487K Views", title: "2.3x engagement growth", description: "Optimized content structure for better watch time", author: "wearnova", platform: "shorts" },
    { views: "1.2M Views", title: "1M+ views on a single reel", description: "Hook-driven edits that boosted reach over the time", author: "productbrand", platform: "tiktok" },
    { views: "623K Views", title: "+5K followers in 1 month", description: "Content system built for consistency and growth", author: "wearnova", platform: "shorts" },
  ] satisfies Work[],
};

export const results = {
  badge: "Results",
  title: "We don't just make it look good - we make it work",
  description:
    "Here's what happens when editing meets strategy. Every result below came from a real client working with our team.",
  cta: { label: "Start a Project", href: "/contact" },
  cards: [
    { author: "nova.skincare", lead: "1.2M+ views on a single ", accent: "reel", description: "We created product-focused short videos with strong hooks and clean visuals, helping the brand reach a wider audience and increase engagement." },
    { author: "Williams.fast", lead: "+8K followers in ", accent: "30 days", description: "A consistent content strategy combined with high-retention edits helped grow their audience steadily and improve profile reach." },
    { author: "Khulna_para", lead: "3x engagement ", accent: "increase", description: "Better hooks and tighter storytelling pushed watch time up — and the algorithm noticed." },
    { author: "Urban_sun", lead: "2.5x leads from ", accent: "content", description: "Strategy-driven videos with clear messages and CTAs turned views into real business leads." },
    { author: "Cook.johans", lead: "2.8x increase in ", accent: "sales", description: "Conversion-focused edits with clear CTAs turned passive viewers into paying customers." },
  ],
};

export const process = {
  badge: "Process We  Follow",
  title: ["From raw clips to ready-to-post", "Here's how we do it"],
  description:
    "From editing to strategy, we handle everything you need to create high-performing reels, TikToks, and shorts.",
  steps: [
    { title: "Send your clips", description: "Share your footage and ideas. We review all with performance and platform in mind before" },
    { title: "We craft your videos", description: "We add scroll-stopping hooks, punchy captions  to keep viewers watching all the way through." },
    { title: "Watch your content online", description: "Share your footage and ideas. We review all with performance and platform in mind before" },
  ],
  slider: { before: "Before", after: "After", tag: "Hook Added", chips: ["Effects", "Caption", "Hook"] },
  published: [
    { views: "1.2M Views", author: "lifestyle_smma", platform: "shorts" },
    { views: "2.4M Views", author: "fitness_steve", platform: "tiktok" },
  ],
};

export const testimonials = {
  badge: "Testimonials",
  title: ["What creators say ", "after working with us"],
  description: "Real results from real clients. Here's what they said after working with us.",
  stats: [
    { value: 3, suffix: "x", label: "Engagement growth", icon: "trend" },
    { value: 2, suffix: "M+", label: "Engagement growth", icon: "eye" },
  ],
  author: "atlas.supply",
  quote:
    "“Before this, we were just posting randomly. Now every video has a purpose. Our reels started getting real reach, engagement went up, and we finally saw consistent growth.”",
  name: "Emma Watson",
  role: "Content Creator",
};

export const pricing = {
  badge: "Pricing",
  title: ["Simple plans built ", "to grow your content"],
  description:
    "Choose a plan that fits your content goals. We handle the editing, strategy, and consistency — you focus on growth.",
  plans: [
    {
      name: "Starter",
      description: "Perfect for creators just getting started",
      price: "$699",
      period: "/ month",
      features: [
        "Up to 8 short-form videos/month",
        "Basic editing + captions",
        "Max 60s video length",
        "Platform-ready formats (Reels, TikTok, Shorts)",
        "Standard export quality",
        "Email support",
      ],
      cta: "Get Started Now",
      featured: false,
    },
    {
      name: "Professional",
      description: "For creators & brands ready to grow consistently",
      price: "$1,499",
      period: "/ month",
      features: [
        "Up to 20 short-form videos/month",
        "Advanced editing + captions",
        "Hook & storytelling optimization",
        "Priority export (HD 1080p)",
        "Unlimited revisions",
        "Performance insights (monthly)",
      ],
      cta: "Get Started Now",
      featured: true,
    },
    {
      name: "Business",
      description: "Best for teams scaling content at volume",
      price: "$2799",
      period: "/ month",
      features: [
        "30+ short-form videos/month",
        "Full editing + content optimization",
        "Strategy support & content planning",
        "Priority delivery (48hr)",
        "Unlimited revisions",
        "Dedicated support",
      ],
      cta: "Get Started Now",
      featured: false,
    },
  ],
};

export const faq = {
  badge: "FAQ",
  title: ["Everything ", "you need to know"],
  description: "Questions before you commit? We've answered the most common ones below.",
  // The template ships an answer for the first question only. Add `answer` to the others to make them expandable.
  items: [
    {
      question: "What do you actually do?",
      answer:
        "We specialize in creating high-quality short-form video content for creators and brands. From editing to optimization, we turn raw footage into engaging videos that drive results.",
    },
    { question: "What is this service about?" },
    { question: "Do you only edit videos or help with strategy too?" },
    { question: "How fast is the delivery?" },
    { question: "Can I request revisions?" },
    { question: "Which platforms do you optimize for?" },
  ] as { question: string; answer?: string }[],
};

export const tools = {
  badge: "Platforms",
  title: "We're comfortable in every major editing tools",
  description: "Whatever tool you use, we already know it. No delays, no friction — just great edits.",
  items: [
    { label: "Fi", hue: 190 },
    { label: "Dv", hue: 12 },
    { label: "Ae", hue: 265 },
    { label: "Pr", hue: 268 },
    { label: "Fc", hue: 330 },
    { label: "Cc", hue: 200 },
  ],
};

export const cta = {
  title: ["Ready to turn your ", "content into real growth?"],
  description:
    "Stop guessing what works. Let’s turn your videos into consistent views, engagement, and results that actually matter.",
  button: { label: "Start Growing Today", href: "/contact" },
  note: "No contracts. Fast delivery. Results-focused.",
};

export const footer = {
  quickLinks: {
    title: "Quick Links",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Works", href: "/all-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  socials: {
    title: "Socials",
    links: [
      { label: "Facebook", href: "https://www.facebook.com" },
      { label: "Instagram", href: "https://www.instagram.com" },
      { label: "Youtube", href: "https://www.youtube.com/" },
      { label: "X", href: "https://x.com" },
    ],
  },
  copyright: "© 2026 ClipCut. All rights reserved",
  credit: { label: "Created by", name: "Sabbir Hossien", href: "https://x.com/sabbir_h_dm" },
  powered: { label: "Powered by", name: "Framer", href: "https://www.framer.com" },
};

export const works = {
  badge: "Our works",
  title: ["Work that actually", "drives growth"],
  description:
    "Explore real videos we’ve created for creators and brands — built to increase views, engagement, and measurable results.",
  videos: [
    { views: "758K Views", title: "2.3x engagement growth", description: "Optimized content structure for better watch time", author: "wearnova", platform: "shorts" },
    { views: "1.2M Views", title: "1M+ views on a single reel", description: "Hook-driven edits that boosted reach", author: "productbrand", platform: "tiktok" },
    { views: "1.2M Views", title: "+10K followers in 30 days", description: "Consistent reels strategy with high retention edits", author: "wearnova", platform: "reels" },
    { views: "623K Views", title: "+5K followers in 1 month", description: "Content system built for consistency and growth", author: "wearnova", platform: "shorts" },
    { views: "487K Views", title: "2.3x engagement growth", description: "Optimized content structure for better watch time", author: "wearnova", platform: "shorts" },
    { views: "487K Views", title: "2.3x engagement growth", description: "Optimized content structure for better watch time", author: "wearnova", platform: "shorts" },
  ] satisfies Work[],
};

export const contact = {
  title: "Tell us about your goals and content needs.",
  bubbles: { sent: "Let's talk", received: "Tell us your goal" },
  points: [
    "Get a custom content strategy",
    "Improve retention & engagement",
    "Turn views into real business results",
  ],
  email: "hello@clipcut.info",
  phone: "+ (212) 555-0198",
  form: {
    fields: [
      { name: "name", label: "Your Name", placeholder: "Your Name", type: "text" },
      { name: "email", label: "Your Work Email", placeholder: "joss@vidgenie.com", type: "email" },
      { name: "company", label: "Company Name", placeholder: "ClipCut", type: "text" },
      { name: "subject", label: "Subject of Message", placeholder: "Video Import", type: "text" },
    ],
    message: { label: "Message", placeholder: "Anything else you'd like to share with the Vidgenie team..." },
    submit: "Submit Message",
  },
};

export const notFound = {
  digits: ["4", "0", "4"],
  title: "Oops! Page Not Found",
  description: "You’re spending hours creating videos, but the results just don’t match the effort.",
  cta: { label: "Back to Homepage", href: "/" },
};
