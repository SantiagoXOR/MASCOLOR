"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface ProductCarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children: React.ReactNode;
}

export function ProductCarousel({
  opts,
  plugins,
  orientation = "horizontal",
  setApi,
  className,
  children,
}: ProductCarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      align: "start",
      loop: false,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    if (setApi) {
      setApi(api);
    }

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect, setApi]);

  return (
    <div className={cn("relative", className)}>
      <div ref={carouselRef} className="overflow-hidden">
        <div className="flex">{children}</div>
      </div>
      <div className="flex justify-center gap-3 mt-3">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-mascolor-gray-200 shadow-sm hover:bg-mascolor-primary/10 transition-all duration-300",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          <ArrowLeft className="h-5 w-5 text-mascolor-primary" />
          <span className="sr-only">Anterior</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-mascolor-gray-200 shadow-sm hover:bg-mascolor-primary/10 transition-all duration-300",
            !canScrollNext && "opacity-50 cursor-not-allowed"
          )}
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight className="h-5 w-5 text-mascolor-primary" />
          <span className="sr-only">Siguiente</span>
        </Button>
      </div>
    </div>
  );
}

export function ProductCarouselItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn("min-w-0 flex-shrink-0 flex-grow-0 w-full", className)}
      initial={{ opacity: 0.8, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
