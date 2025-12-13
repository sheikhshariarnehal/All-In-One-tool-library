"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wrench, FileText, Brain, BookOpen, Sparkles, Star, Zap } from "lucide-react";
import { useRef } from "react";

const platformSections = [
  {
    icon: Wrench,
    title: "Online Tools",
    description: "PDF editors, converters, image compressors, and developer utilities",
    href: "/tools",
    count: "50+",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: FileText,
    title: "Templates",
    description: "Academic papers, resumes, business documents, and more",
    href: "/templates",
    count: "100+",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Brain,
    title: "AI Tools",
    description: "Essay writer, paraphraser, grammar checker, and summarizer",
    href: "/ai-tools",
    count: "10+",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: BookOpen,
    title: "Blog & Guides",
    description: "Tutorials, tips, and resources for students and professionals",
    href: "/blog",
    count: "50+",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/20 to-red-500/20",
  },
];

const floatingElements = [
  { icon: Star, delay: 0, x: "10%", y: "20%", size: 20 },
  { icon: Zap, delay: 0.5, x: "85%", y: "15%", size: 24 },
  { icon: Sparkles, delay: 1, x: "5%", y: "70%", size: 18 },
  { icon: Star, delay: 1.5, x: "90%", y: "75%", size: 22 },
  { icon: Zap, delay: 2, x: "15%", y: "45%", size: 16 },
  { icon: Sparkles, delay: 2.5, x: "80%", y: "50%", size: 20 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1 + 0.5,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-500" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                               linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20 hidden md:block"
          style={{ left: element.x, top: element.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.icon size={element.size} />
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 container px-4 sm:px-6 lg:px-8 mx-auto py-16 sm:py-20 md:py-32 pb-24 sm:pb-32 md:pb-40"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Badge 
              variant="secondary" 
              className="mb-4 md:mb-6 px-3 py-1.5 text-xs md:text-sm font-medium backdrop-blur-sm bg-secondary/80 border border-border/50"
            >
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5 md:mr-2 inline" />
              <span className="hidden sm:inline">Your All-in-One Academic & Professional Toolkit</span>
              <span className="sm:hidden">All-in-One Toolkit</span>
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 md:mb-6 px-2 sm:px-0"
          >
            <span className="inline-block">
              Tools, Templates & AI
            </span>
            <br />
            <motion.span 
              className="inline-block bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              All in One Place
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4 sm:px-0"
          >
            Free online tools for PDF editing, writing assistance, and file conversion. 
            Download academic and professional templates. Access AI-powered writing tools. 
            Read helpful guides and tutorials.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base group shadow-lg shadow-primary/25" asChild>
                <Link href="/tools">
                  Explore All Tools
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base backdrop-blur-sm" asChild>
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base backdrop-blur-sm" asChild>
                <Link href="/ai-tools">
                  <Brain className="w-4 h-4 mr-2" />
                  Try AI Tools
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {platformSections.map((section, index) => (
              <motion.div
                key={section.href}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <Link href={section.href} className="block h-full">
                  <Card className="h-full relative overflow-hidden group border-border/50 backdrop-blur-sm bg-card/80 hover:bg-card transition-all duration-300">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardHeader className="relative pb-2 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <motion.div 
                          className={`p-2 sm:p-2.5 rounded-lg bg-gradient-to-br ${section.gradient}`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <section.icon className="h-5 w-5 text-white" />
                        </motion.div>
                        <Badge 
                          variant="secondary" 
                          className="font-semibold bg-background/80 backdrop-blur-sm text-xs px-2 py-0.5"
                        >
                          {section.count}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg font-semibold text-left group-hover:text-primary transition-colors">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                      <CardDescription className="text-xs sm:text-sm text-left leading-snug">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V120H0V50Z"
            className="fill-muted/30"
            initial={{ d: "M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V120H0V50Z" }}
            animate={{
              d: [
                "M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V120H0V50Z",
                "M0 30C240 0 480 80 720 30C960 0 1200 80 1440 30V120H0V30Z",
                "M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V120H0V50Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </section>
  );
}
