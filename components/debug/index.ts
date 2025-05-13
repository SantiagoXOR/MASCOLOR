// Este archivo exporta todos los componentes de debug como NoopComponent
// para evitar errores de hidratación y referencias rotas

import { NoopComponent, NoopComponentWithProps } from './NoopComponent';
import { DEBUG_CONFIG } from '@/lib/config/debug';

// Si el debug está habilitado, importar los componentes reales
// De lo contrario, usar NoopComponent
export const DebugPanel = NoopComponent;
export const ProductsDebug = NoopComponentWithProps;
export const SupabaseDebug = NoopComponent;
export const SupabaseClientDebug = NoopComponent;
export const ImageDebug = NoopComponentWithProps;
export const ProductImageDebug = NoopComponent;
export const RouteDebug = NoopComponent;
export const DebugTools = NoopComponent;
export const BrandLogoDebug = NoopComponentWithProps;
export const ProductImageDebugger = NoopComponent;
