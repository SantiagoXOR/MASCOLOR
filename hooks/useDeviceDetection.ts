"use client";

import { useState, useEffect, useCallback } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowPerformance: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: "portrait" | "landscape";
}

/**
 * Hook personalizado para detectar tipo de dispositivo y características
 * Incluye listeners para cambios de tamaño y orientación
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowPerformance: false,
    screenWidth: 1920,
    screenHeight: 1080,
    orientation: "landscape",
  });

  // Función para detectar características del dispositivo
  const detectDevice = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Detectar tipo de dispositivo basado en breakpoints
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    // Detectar orientación
    const orientation = width > height ? "landscape" : "portrait";

    // Detectar dispositivos de bajo rendimiento
    const isLowCPU = navigator.hardwareConcurrency <= 4;
    const deviceMemory = (navigator as any).deviceMemory;
    const isLowMemory = deviceMemory && deviceMemory < 4;
    const isLowPerformance = isMobile || isLowCPU || Boolean(isLowMemory);

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isLowPerformance,
      screenWidth: width,
      screenHeight: height,
      orientation,
    });
  }, []);

  // Función debounced para evitar re-renders excesivos
  const debouncedDetectDevice = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    const debounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectDevice, 150);
    };

    return debounced;
  }, [detectDevice]);

  useEffect(() => {
    // Detectar al montar el componente
    detectDevice();

    // Crear función debounced
    const debouncedHandler = debouncedDetectDevice();

    // Añadir listeners para cambios
    window.addEventListener("resize", debouncedHandler);
    window.addEventListener("orientationchange", debouncedHandler);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedHandler);
      window.removeEventListener("orientationchange", debouncedHandler);
    };
  }, [detectDevice, debouncedDetectDevice]);

  return deviceInfo;
}

/**
 * Hook simplificado para casos donde solo se necesita saber si es móvil
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}

/**
 * Hook para detectar si se debe mostrar la versión móvil del Hero
 */
export function useMobileHero(): boolean {
  const { isMobile, isTablet } = useDeviceDetection();
  // Mostrar versión móvil en móviles y tablets (hasta 1023px)
  return isMobile || isTablet;
}

/**
 * Hook para detectar si es un dispositivo táctil
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
}
