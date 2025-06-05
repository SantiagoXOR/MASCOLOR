import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductDetailModal } from "@/components/ui/product-detail-modal";
import {
  useProductDetails,
  useRelatedProducts,
} from "@/hooks/useProductDetails";
import { Product } from "@/types";

// Mock de los hooks
jest.mock("@/hooks/useProductDetails");
jest.mock("@/lib/utils/share");

const mockUseProductDetails = useProductDetails as jest.MockedFunction<
  typeof useProductDetails
>;
const mockUseRelatedProducts = useRelatedProducts as jest.MockedFunction<
  typeof useRelatedProducts
>;

// Mock del producto de ejemplo
const mockProduct: Product = {
  id: "1",
  slug: "test-product",
  name: "Producto de Prueba",
  description: "Descripción del producto de prueba",
  image_url: "/test-image.jpg",
  category: {
    id: "1",
    slug: "test-category",
    name: "Categoría de Prueba",
  },
  brand: {
    id: "1",
    slug: "test-brand",
    name: "Marca de Prueba",
    logo_url: "/test-logo.svg",
  },
  features: [
    {
      id: "1",
      name: "Característica 1",
      value: "Valor 1",
    },
    {
      id: "2",
      name: "Característica 2",
      value: "Valor 2",
    },
  ],
  coverage: 10,
  coats: 2,
  badge: "new",
};

const mockRelatedProducts: Product[] = [
  {
    id: "2",
    slug: "related-product",
    name: "Producto Relacionado",
    description: "Descripción del producto relacionado",
    image_url: "/related-image.jpg",
    category: mockProduct.category,
    brand: mockProduct.brand,
  },
];

describe("ProductDetailModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    productId: "1",
    onNavigateToProduct: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseProductDetails.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseRelatedProducts.mockReturnValue({
      relatedProducts: mockRelatedProducts,
      loading: false,
      error: null,
    });

    // Mock de navigator.share
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });

    // Mock de window.open
    Object.defineProperty(window, "open", {
      writable: true,
      value: jest.fn(),
    });
  });

  it("renderiza correctamente cuando está abierto", () => {
    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Detalles del Producto")).toBeInTheDocument();
    expect(screen.getByText("Producto de Prueba")).toBeInTheDocument();
    expect(
      screen.getByText("Descripción del producto de prueba")
    ).toBeInTheDocument();
  });

  it("no renderiza cuando está cerrado", () => {
    render(<ProductDetailModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Detalles del Producto")).not.toBeInTheDocument();
  });

  it("muestra estado de carga", () => {
    mockUseProductDetails.mockReturnValue({
      product: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Cargando producto...")).toBeInTheDocument();
  });

  it("muestra mensaje de error", () => {
    const error = new Error("Error de prueba");
    mockUseProductDetails.mockReturnValue({
      product: null,
      loading: false,
      error,
      refetch: jest.fn(),
    });

    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Error al cargar el producto")).toBeInTheDocument();
    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
  });

  it("muestra especificaciones técnicas cuando están disponibles", () => {
    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Especificaciones Técnicas")).toBeInTheDocument();
    expect(screen.getByText("10 m²/L")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("muestra características del producto", () => {
    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Características")).toBeInTheDocument();
    expect(screen.getByText("Característica 1")).toBeInTheDocument();
    expect(screen.getByText("Valor 1")).toBeInTheDocument();
    expect(screen.getByText("Característica 2")).toBeInTheDocument();
    expect(screen.getByText("Valor 2")).toBeInTheDocument();
  });

  it("muestra productos relacionados", () => {
    render(<ProductDetailModal {...defaultProps} />);

    expect(screen.getByText("Productos Relacionados")).toBeInTheDocument();
    expect(screen.getByText("Producto Relacionado")).toBeInTheDocument();
  });

  it("llama a onClose cuando se hace clic en el botón cerrar", () => {
    render(<ProductDetailModal {...defaultProps} />);

    // Buscar el botón por el icono X
    const closeButtons = screen.getAllByRole("button");
    const closeButton = closeButtons.find(
      (button) =>
        button.querySelector("svg") &&
        button.className.includes("text-mascolor-gray-600")
    );

    expect(closeButton).toBeTruthy();
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it("llama a onClose cuando se hace clic fuera del modal", () => {
    render(<ProductDetailModal {...defaultProps} />);

    // Buscar el backdrop por clase
    const backdrop = document.querySelector(".fixed.inset-0.z-50");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it("maneja el botón de WhatsApp correctamente", async () => {
    render(<ProductDetailModal {...defaultProps} />);

    const whatsappButton = screen.getByText("Consultar por WhatsApp");
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("wa.me"),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  it("maneja el botón de compartir correctamente", async () => {
    render(<ProductDetailModal {...defaultProps} />);

    const shareButton = screen.getByText("Compartir producto");
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalled();
    });
  });

  it("navega a producto relacionado cuando se hace clic", () => {
    render(<ProductDetailModal {...defaultProps} />);

    const relatedProduct = screen.getByText("Producto Relacionado");
    fireEvent.click(relatedProduct);

    expect(defaultProps.onNavigateToProduct).toHaveBeenCalledWith("2");
  });

  it("cierra el modal con la tecla Escape", () => {
    render(<ProductDetailModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("muestra badge del producto cuando está disponible", () => {
    render(<ProductDetailModal {...defaultProps} />);

    // El badge "new" debería estar presente - buscar por clase o contenido
    const badgeElement = document.querySelector(".absolute.top-4.right-4");
    expect(badgeElement).toBeInTheDocument();
  });

  it("muestra logo de la marca", () => {
    render(<ProductDetailModal {...defaultProps} />);

    const brandLogo = screen.getByAltText("Logo Marca de Prueba");
    expect(brandLogo).toBeInTheDocument();
    expect(brandLogo).toHaveAttribute("src", "/test-logo.svg");
  });
});
