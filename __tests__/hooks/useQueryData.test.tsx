import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryData } from "@/hooks/useQueryData";
import { ReactNode } from "react";

// Mock the logger
jest.mock("@/lib/services/LoggingService", () => ({
  useLogger: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

// Create a wrapper for the test
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useQueryData", () => {
  test("should fetch data successfully", async () => {
    // Arrange
    const mockData = { name: "Test Data" };
    const mockQueryFn = jest.fn().mockResolvedValue(mockData);
    
    // Act
    const { result } = renderHook(
      () => useQueryData("test-key", mockQueryFn),
      { wrapper: createWrapper() }
    );
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });
  
  test("should handle errors", async () => {
    // Arrange
    const mockError = new Error("Test error");
    const mockQueryFn = jest.fn().mockRejectedValue(mockError);
    
    // Act
    const { result } = renderHook(
      () => useQueryData("test-key", mockQueryFn),
      { wrapper: createWrapper() }
    );
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.error).toEqual(mockError);
  });
  
  test("should use custom options", async () => {
    // Arrange
    const mockData = { name: "Test Data" };
    const mockQueryFn = jest.fn().mockResolvedValue(mockData);
    const mockOptions = {
      staleTime: 1000,
      cacheTime: 2000,
    };
    
    // Act
    const { result } = renderHook(
      () => useQueryData("test-key", mockQueryFn, mockOptions),
      { wrapper: createWrapper() }
    );
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });
  
  test("should handle array query keys", async () => {
    // Arrange
    const mockData = { name: "Test Data" };
    const mockQueryFn = jest.fn().mockResolvedValue(mockData);
    const queryKey = ["test", { id: 1 }];
    
    // Act
    const { result } = renderHook(
      () => useQueryData(queryKey, mockQueryFn),
      { wrapper: createWrapper() }
    );
    
    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });
});
