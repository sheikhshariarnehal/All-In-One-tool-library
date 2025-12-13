"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toolsMetadata } from "@/lib/tools/metadata";
import { useRef } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function PopularToolsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const popularTools = toolsMetadata.slice(0, 8);

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">TRENDING</span>
            </motion.div>
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Popular Tools
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-base md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Most-used tools by our community
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="group" asChild>
              <Link href="/tools">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {popularTools.map((tool, index) => (
            <motion.div
              key={tool.slug}
              variants={itemVariants}
            >
              <Link href={`/tools/${tool.category}/${tool.slug}`}>
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group overflow-hidden relative hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rank indicator */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {index + 1}
                  </div>
                  
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center justify-between pr-8">
                      <CardTitle className="text-base group-hover:text-primary transition-colors duration-300 line-clamp-1">
                        {tool.name}
                      </CardTitle>
                      {tool.isPremium && (
                        <Badge variant="secondary" className="text-xs shrink-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-0">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-sm line-clamp-2 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <motion.div 
                      className="flex items-center mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span>Try now</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
