import { logger, LogLevel } from "@/lib/services/LoggingService";

// Mock console methods
const originalConsole = { ...console };
const mockConsole = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe("LoggingService", () => {
  beforeEach(() => {
    // Replace console methods with mocks
    console.debug = mockConsole.debug;
    console.info = mockConsole.info;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset logger configuration
    logger.configure({
      maxLogEntries: 100,
      logToConsole: true,
      mode: "minimal",
    });
    logger.setEnabled(true);
  });
  
  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
  
  test("should log messages with different levels", () => {
    // Act
    logger.debug("TestSource", "Debug message");
    logger.info("TestSource", "Info message");
    logger.warn("TestSource", "Warning message");
    logger.error("TestSource", "Error message");
    
    // Assert
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG] [TestSource] Debug message")
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining("[INFO] [TestSource] Info message")
    );
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.stringContaining("[WARN] [TestSource] Warning message")
    );
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining("[ERROR] [TestSource] Error message")
    );
  });
  
  test("should not log when disabled", () => {
    // Arrange
    logger.setEnabled(false);
    
    // Act
    logger.debug("TestSource", "Debug message");
    logger.info("TestSource", "Info message");
    logger.warn("TestSource", "Warning message");
    logger.error("TestSource", "Error message");
    
    // Assert
    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should not log to console when logToConsole is false", () => {
    // Arrange
    logger.configure({ logToConsole: false });
    
    // Act
    logger.debug("TestSource", "Debug message");
    logger.info("TestSource", "Info message");
    logger.warn("TestSource", "Warning message");
    logger.error("TestSource", "Error message");
    
    // Assert
    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should include data in detailed mode", () => {
    // Arrange
    const testData = { key: "value" };
    logger.setMode("detailed");
    
    // Act
    logger.debug("TestSource", "Debug message", testData);
    
    // Assert
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG] [TestSource] Debug message"),
      testData
    );
  });
  
  test("should not include data in minimal mode", () => {
    // Arrange
    const testData = { key: "value" };
    logger.setMode("minimal");
    
    // Act
    logger.debug("TestSource", "Debug message", testData);
    
    // Assert
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG] [TestSource] Debug message")
    );
    expect(mockConsole.debug).not.toHaveBeenCalledWith(
      expect.anything(),
      testData
    );
  });
  
  test("should limit the number of log entries", () => {
    // Arrange
    logger.configure({ maxLogEntries: 5 });
    
    // Act
    for (let i = 0; i < 10; i++) {
      logger.debug("TestSource", `Message ${i}`);
    }
    
    // Assert
    const logs = logger.getLogs();
    expect(logs.length).toBe(5);
    expect(logs[0].message).toBe("Message 5");
    expect(logs[4].message).toBe("Message 9");
  });
  
  test("should notify subscribers when logs change", () => {
    // Arrange
    const mockSubscriber = jest.fn();
    const unsubscribe = logger.subscribe(mockSubscriber);
    
    // Act
    logger.debug("TestSource", "Debug message");
    
    // Wait for throttled notification
    jest.advanceTimersByTime(300);
    
    // Assert
    expect(mockSubscriber).toHaveBeenCalledWith(expect.any(Array));
    
    // Cleanup
    unsubscribe();
  });
  
  test("should unsubscribe correctly", () => {
    // Arrange
    const mockSubscriber = jest.fn();
    const unsubscribe = logger.subscribe(mockSubscriber);
    
    // Act
    unsubscribe();
    logger.debug("TestSource", "Debug message");
    
    // Wait for throttled notification
    jest.advanceTimersByTime(300);
    
    // Assert
    expect(mockSubscriber).not.toHaveBeenCalled();
  });
  
  test("should clear logs", () => {
    // Arrange
    logger.debug("TestSource", "Debug message");
    
    // Act
    logger.clearLogs();
    
    // Assert
    expect(logger.getLogs()).toHaveLength(0);
  });
});
