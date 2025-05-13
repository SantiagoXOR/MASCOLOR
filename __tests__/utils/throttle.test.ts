import { throttle, debounce, createTaskQueue } from "@/lib/utils/throttle";

// Mock timers
jest.useFakeTimers();

describe("throttle", () => {
  test("should execute function immediately on first call", () => {
    // Arrange
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);
    
    // Act
    throttledFn();
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("should not execute function again within throttle period", () => {
    // Arrange
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);
    
    // Act
    throttledFn();
    throttledFn();
    throttledFn();
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("should execute function again after throttle period", () => {
    // Arrange
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);
    
    // Act
    throttledFn();
    jest.advanceTimersByTime(101);
    throttledFn();
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
  
  test("should execute function with the latest arguments after throttle period", () => {
    // Arrange
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);
    
    // Act
    throttledFn("first");
    throttledFn("second");
    throttledFn("third");
    jest.advanceTimersByTime(101);
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, "first");
    expect(mockFn).toHaveBeenNthCalledWith(2, "third");
  });
});

describe("debounce", () => {
  test("should not execute function immediately", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    // Act
    debouncedFn();
    
    // Assert
    expect(mockFn).not.toHaveBeenCalled();
  });
  
  test("should execute function after wait period", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    // Act
    debouncedFn();
    jest.advanceTimersByTime(101);
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("should reset timer on subsequent calls", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    // Act
    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);
    
    // Assert
    expect(mockFn).not.toHaveBeenCalled();
    
    // Advance timer to complete the wait period
    jest.advanceTimersByTime(51);
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("should execute function with the latest arguments", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    // Act
    debouncedFn("first");
    debouncedFn("second");
    debouncedFn("third");
    jest.advanceTimersByTime(101);
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third");
  });
  
  test("should execute function immediately when immediate=true", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, true);
    
    // Act
    debouncedFn();
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("should not execute function again until wait period has passed when immediate=true", () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100, true);
    
    // Act
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("createTaskQueue", () => {
  test("should process tasks in order", async () => {
    // Arrange
    const queue = createTaskQueue();
    const results: number[] = [];
    
    const task1 = jest.fn().mockImplementation(async () => {
      results.push(1);
      return 1;
    });
    
    const task2 = jest.fn().mockImplementation(async () => {
      results.push(2);
      return 2;
    });
    
    const task3 = jest.fn().mockImplementation(async () => {
      results.push(3);
      return 3;
    });
    
    // Act
    queue.enqueue(task1);
    queue.enqueue(task2);
    queue.enqueue(task3);
    
    // Wait for all tasks to complete
    await jest.runAllTimersAsync();
    
    // Assert
    expect(task1).toHaveBeenCalledTimes(1);
    expect(task2).toHaveBeenCalledTimes(1);
    expect(task3).toHaveBeenCalledTimes(1);
    expect(results).toEqual([1, 2, 3]);
  });
  
  test("should clear the queue", async () => {
    // Arrange
    const queue = createTaskQueue();
    const task1 = jest.fn().mockImplementation(async () => 1);
    const task2 = jest.fn().mockImplementation(async () => 2);
    
    // Act
    queue.enqueue(task1);
    queue.enqueue(task2);
    queue.clear();
    
    // Wait for all tasks to complete
    await jest.runAllTimersAsync();
    
    // Assert
    expect(task1).toHaveBeenCalledTimes(1); // First task starts immediately
    expect(task2).not.toHaveBeenCalled(); // Second task is cleared
    expect(queue.length).toBe(0);
  });
});
