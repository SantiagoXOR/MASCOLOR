"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";

// Preguntas frecuentes predefinidas
const frequentQuestions = [
  "¿Dónde puedo comprar productos +COLOR?",
  "¿Qué pintura necesito para exterior?",
  "¿Cuánto rinde un litro de pintura?",
  "¿Tienen servicio de envío a domicilio?",
];

// Tipo para los mensajes del chat
type ChatMessage = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Detectar scroll para mostrar el chat y abrirlo automáticamente
  useEffect(() => {
    const handleScroll = () => {
      // Obtener la altura de la primera sección (hero)
      const heroSection = document.querySelector("main > div:first-child");
      const heroHeight = heroSection?.clientHeight || 500;

      // Mostrar el chat cuando el usuario haya scrolleado más allá de la primera sección
      if (window.scrollY > heroHeight) {
        setIsVisible(true);

        // Abrir el chat automáticamente solo una vez
        if (!hasAutoOpened && !isOpen) {
          setTimeout(() => {
            setIsOpen(true);
            setHasAutoOpened(true);
          }, 1500); // Pequeño retraso para que no sea inmediato
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, hasAutoOpened]);

  // Agregar mensaje de bienvenida cuando se abre el chat por primera vez
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      // Agregar mensaje de bienvenida con un pequeño retraso para la animación
      setTimeout(() => {
        addMessage(
          "Hola!, soy Leandro de +Color, ¿cómo te puedo ayudar?",
          false
        );
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enfocar el input cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isOpen]);

  // Función para agregar un mensaje al chat
  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Manejar envío de mensaje
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    addMessage(inputMessage, true);
    setInputMessage("");

    // Simular respuesta automática después de un breve retraso
    setTimeout(() => {
      let response =
        "Gracias por tu mensaje. Un asesor se pondrá en contacto contigo pronto.";

      // Respuestas específicas para preguntas frecuentes
      if (
        inputMessage.toLowerCase().includes("comprar") ||
        inputMessage.toLowerCase().includes("venden")
      ) {
        response =
          "Puedes comprar nuestros productos en ferreterías y tiendas especializadas. También puedes visitar nuestra página de 'Dónde comprar' para encontrar el punto de venta más cercano.";
      } else if (
        inputMessage.toLowerCase().includes("exterior") ||
        inputMessage.toLowerCase().includes("afuera")
      ) {
        response =
          "Para exteriores recomendamos nuestra línea PREMIUM de látex exterior, que ofrece alta resistencia a la intemperie y durabilidad.";
      } else if (
        inputMessage.toLowerCase().includes("rinde") ||
        inputMessage.toLowerCase().includes("rendimiento")
      ) {
        response =
          "El rendimiento depende del producto y la superficie. En general, un litro rinde entre 10-12 m² por mano. Puedes usar nuestra calculadora de pintura para obtener una estimación más precisa.";
      } else if (
        inputMessage.toLowerCase().includes("envío") ||
        inputMessage.toLowerCase().includes("delivery")
      ) {
        response =
          "El servicio de envío depende del punto de venta. Te recomendamos consultar directamente con la tienda donde realices tu compra.";
      }

      addMessage(response, false);
    }, 1000);
  };

  // Manejar selección de pregunta frecuente
  const handleQuestionClick = (question: string) => {
    addMessage(question, true);

    // Simular respuesta automática
    setTimeout(() => {
      let response = "";

      switch (question) {
        case "¿Dónde puedo comprar productos +COLOR?":
          response =
            "Puedes comprar nuestros productos en ferreterías y tiendas especializadas. Visita nuestra página de 'Dónde comprar' para encontrar el punto de venta más cercano.";
          break;
        case "¿Qué pintura necesito para exterior?":
          response =
            "Para exteriores recomendamos nuestra línea PREMIUM de látex exterior, que ofrece alta resistencia a la intemperie y durabilidad.";
          break;
        case "¿Cuánto rinde un litro de pintura?":
          response =
            "El rendimiento depende del producto y la superficie. En general, un litro rinde entre 10-12 m² por mano. Puedes usar nuestra calculadora de pintura para obtener una estimación más precisa.";
          break;
        case "¿Tienen servicio de envío a domicilio?":
          response =
            "El servicio de envío depende del punto de venta. Te recomendamos consultar directamente con la tienda donde realices tu compra.";
          break;
        default:
          response =
            "Gracias por tu pregunta. Un asesor se pondrá en contacto contigo pronto.";
      }

      addMessage(response, false);
    }, 1000);
  };

  // Manejar tecla Enter para enviar mensaje
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[24px] left-[24px] z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Tooltip con tag de Leandro - Versión clickable */}
          {!isOpen && (
            <motion.div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer animate-fadeIn"
              style={{
                animationDelay: "0.5s",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="bg-mascolor-primary text-white px-4 py-2 rounded-lg shadow-md"
                style={{ minWidth: "150px" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      Leandro
                    </div>
                    <div className="text-white/80 text-xs">
                      Asesor de +COLOR
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-3 h-3 bg-mascolor-primary transform rotate-45"
                style={{ position: "absolute", bottom: "-6px", left: "24px" }}
              ></div>
            </motion.div>
          )}

          {/* Ventana de chat */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={chatContainerRef}
                className="absolute bottom-0 left-0 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Encabezado del chat */}
                <div className="bg-mascolor-primary p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Leandro</h3>
                      <p className="text-white/80 text-xs">Asesor de +COLOR</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Cerrar chat"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Contenido del chat */}
                <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? "bg-mascolor-primary text-white rounded-tr-none"
                            : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block text-right">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Preguntas frecuentes */}
                {messages.length <= 2 && (
                  <div className="p-3 bg-gray-100 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      Preguntas frecuentes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {frequentQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                          className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-mascolor-primary/10 hover:border-mascolor-primary/30 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input para escribir mensaje */}
                <div className="p-3 border-t border-gray-200 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-mascolor-primary/50 focus:border-mascolor-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-mascolor-primary text-white px-4 py-2 rounded-r-md hover:bg-mascolor-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
