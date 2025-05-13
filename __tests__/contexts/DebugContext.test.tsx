import { render, screen, fireEvent } from '@testing-library/react';
import { DebugProvider, useDebug } from '@/contexts/DebugContext';
import React from 'react';

// Componente de prueba que usa el contexto
const TestComponent = () => {
  const { 
    debugMode, 
    isDebugEnabled, 
    activeDebuggers,
    setDebugMode,
    toggleDebugger,
    enableDebugger,
    disableDebugger,
    disableAllDebuggers,
    logDebug
  } = useDebug();
  
  return (
    <div>
      <div data-testid="debug-mode">{debugMode}</div>
      <div data-testid="is-enabled">{isDebugEnabled.toString()}</div>
      <div data-testid="active-debuggers">{activeDebuggers.join(',')}</div>
      
      <button 
        data-testid="toggle-mode" 
        onClick={() => setDebugMode(debugMode === 'disabled' ? 'minimal' : 'disabled')}
      >
        Toggle Mode
      </button>
      
      <button 
        data-testid="toggle-debugger" 
        onClick={() => toggleDebugger('test-debugger')}
      >
        Toggle Debugger
      </button>
      
      <button 
        data-testid="enable-debugger" 
        onClick={() => enableDebugger('enabled-debugger')}
      >
        Enable Debugger
      </button>
      
      <button 
        data-testid="disable-debugger" 
        onClick={() => disableDebugger('enabled-debugger')}
      >
        Disable Debugger
      </button>
      
      <button 
        data-testid="disable-all" 
        onClick={() => disableAllDebuggers()}
      >
        Disable All
      </button>
      
      <button 
        data-testid="log-debug" 
        onClick={() => logDebug('Test log message', { test: 'data' })}
      >
        Log Debug
      </button>
    </div>
  );
};

describe('DebugContext', () => {
  // Espiar console.log para verificar los logs
  let consoleLogSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });
  
  it('should provide default context values', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Verificar valores por defecto
    expect(screen.getByTestId('debug-mode').textContent).toBe(
      process.env.NODE_ENV === 'production' ? 'disabled' : 'minimal'
    );
    expect(screen.getByTestId('is-enabled').textContent).toBe(
      (process.env.NODE_ENV !== 'production').toString()
    );
    expect(screen.getByTestId('active-debuggers').textContent).toBe('');
  });
  
  it('should toggle debug mode', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Obtener el estado inicial
    const initialMode = screen.getByTestId('debug-mode').textContent;
    
    // Cambiar el modo
    fireEvent.click(screen.getByTestId('toggle-mode'));
    
    // Verificar que cambió
    expect(screen.getByTestId('debug-mode').textContent).not.toBe(initialMode);
  });
  
  it('should toggle debugger', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Verificar que inicialmente no hay depuradores activos
    expect(screen.getByTestId('active-debuggers').textContent).toBe('');
    
    // Activar un depurador
    fireEvent.click(screen.getByTestId('toggle-debugger'));
    
    // Verificar que se activó
    expect(screen.getByTestId('active-debuggers').textContent).toBe('test-debugger');
    
    // Desactivar el depurador
    fireEvent.click(screen.getByTestId('toggle-debugger'));
    
    // Verificar que se desactivó
    expect(screen.getByTestId('active-debuggers').textContent).toBe('');
  });
  
  it('should enable and disable debuggers', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Activar un depurador
    fireEvent.click(screen.getByTestId('enable-debugger'));
    
    // Verificar que se activó
    expect(screen.getByTestId('active-debuggers').textContent).toBe('enabled-debugger');
    
    // Desactivar el depurador
    fireEvent.click(screen.getByTestId('disable-debugger'));
    
    // Verificar que se desactivó
    expect(screen.getByTestId('active-debuggers').textContent).toBe('');
  });
  
  it('should disable all debuggers', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Activar varios depuradores
    fireEvent.click(screen.getByTestId('toggle-debugger'));
    fireEvent.click(screen.getByTestId('enable-debugger'));
    
    // Verificar que se activaron
    expect(screen.getByTestId('active-debuggers').textContent).toBe('test-debugger,enabled-debugger');
    
    // Desactivar todos los depuradores
    fireEvent.click(screen.getByTestId('disable-all'));
    
    // Verificar que se desactivaron todos
    expect(screen.getByTestId('active-debuggers').textContent).toBe('');
  });
  
  it('should log debug messages when enabled', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Asegurarse de que el modo de depuración está habilitado
    if (screen.getByTestId('debug-mode').textContent === 'disabled') {
      fireEvent.click(screen.getByTestId('toggle-mode'));
    }
    
    // Registrar un mensaje de depuración
    fireEvent.click(screen.getByTestId('log-debug'));
    
    // Verificar que se llamó a console.log
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG: Test log message')
    );
  });
  
  it('should not log debug messages when disabled', () => {
    render(
      <DebugProvider>
        <TestComponent />
      </DebugProvider>
    );
    
    // Asegurarse de que el modo de depuración está deshabilitado
    if (screen.getByTestId('debug-mode').textContent !== 'disabled') {
      fireEvent.click(screen.getByTestId('toggle-mode'));
    }
    
    // Intentar registrar un mensaje de depuración
    fireEvent.click(screen.getByTestId('log-debug'));
    
    // Verificar que no se llamó a console.log
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
