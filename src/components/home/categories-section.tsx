"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/tools/categories";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export function CategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.span 
            className="inline-block text-xs md:text-sm font-semibold text-primary mb-2 md:mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            CATEGORIES
          </motion.span>
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-4 sm:px-0"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-4 sm:px-0"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Find the perfect tool for your needs across our organized categories.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
            >
              <Link href={`/tools/${category.slug}`}>
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group overflow-hidden relative hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="pb-2 relative p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <motion.div 
                        className="p-2 md:p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <category.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </motion.div>
                      <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative p-4 md:p-6 pt-0">
                    <CardDescription className="text-xs md:text-sm leading-relaxed line-clamp-2">
                      {category.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground font-medium">
                        {category.toolCount} tools
                      </p>
                      <motion.div
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -5 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
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
