import React from 'react';
import Image from 'next/image';

export default function CustomPage() {
  return (
    <div className="custom-page">
      <header className="header">
        <div className="container header-content">
          <div className="logo relative h-8 w-32">
            <Image
              src="/images/logos/+colorsolo.svg"
              alt="Logo +COLOR"
              fill
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <nav className="nav">
            <a href="/" className="nav-link">Inicio</a>
            <a href="/productos" className="nav-link">Productos</a>
            <a href="/nosotros" className="nav-link">Nosotros</a>
            <a href="/contacto" className="nav-link">Contacto</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1 className="flex flex-wrap items-center justify-center gap-2">
            Transforma tus espacios con
            <span className="relative inline-flex h-10 w-32">
              <Image
                src="/images/logos/+colorsolo.svg"
                alt="Logo +COLOR"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>
          </h1>
          <p>Pinturas y revestimientos de alta calidad para tus proyectos de construcción y decoración</p>
          <div>
            <a href="/productos" className="button">Ver productos</a>
            <a href="/contacto" className="button button-outline">Contáctanos</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Nuestros Productos</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">Imagen del producto</div>
              <div className="product-content">
                <h3 className="product-title">Pintura Látex Interior</h3>
                <p className="product-description">Pintura de alta calidad para interiores con acabado mate.</p>
                <p className="product-price">$4,500</p>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">Imagen del producto</div>
              <div className="product-content">
                <h3 className="product-title">Pintura Látex Exterior</h3>
                <p className="product-description">Pintura resistente a la intemperie para exteriores.</p>
                <p className="product-price">$5,200</p>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">Imagen del producto</div>
              <div className="product-content">
                <h3 className="product-title">Revestimiento Texturado</h3>
                <p className="product-description">Revestimiento texturado para paredes exteriores.</p>
                <p className="product-price">$6,800</p>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">Imagen del producto</div>
              <div className="product-content">
                <h3 className="product-title">Esmalte al Agua</h3>
                <p className="product-description">Esmalte ecológico al agua sin olor.</p>
                <p className="product-price">$4,200</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container">
          <h2 className="section-title flex items-center justify-center gap-2">
            ¿Por qué elegir
            <span className="relative inline-flex h-8 w-24">
              <Image
                src="/images/logos/+colorsolo.svg"
                alt="Logo +COLOR"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>
            ?
          </h2>
          <div className="products-grid">
            <div className="product-card" style={{ backgroundColor: 'white' }}>
              <div className="product-content">
                <h3 className="product-title">Alta cobertura</h3>
                <p className="product-description">Nuestras pinturas ofrecen una excelente cobertura con menos capas, ahorrando tiempo y dinero.</p>
              </div>
            </div>
            <div className="product-card" style={{ backgroundColor: 'white' }}>
              <div className="product-content">
                <h3 className="product-title">Máxima durabilidad</h3>
                <p className="product-description">Productos resistentes a la intemperie, rayos UV y condiciones climáticas extremas.</p>
              </div>
            </div>
            <div className="product-card" style={{ backgroundColor: 'white' }}>
              <div className="product-content">
                <h3 className="product-title">Secado rápido</h3>
                <p className="product-description">Fórmulas de secado rápido que permiten terminar tus proyectos en menos tiempo.</p>
              </div>
            </div>
            <div className="product-card" style={{ backgroundColor: 'white' }}>
              <div className="product-content">
                <h3 className="product-title">Ecológicos</h3>
                <p className="product-description">Productos con bajo contenido de VOC, amigables con el medio ambiente y tu salud.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Contacto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <form>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                  <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e0e0e0' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e0e0e0' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mensaje</label>
                  <textarea style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e0e0e0', minHeight: '150px' }}></textarea>
                </div>
                <button type="submit" className="button" style={{ border: 'none', cursor: 'pointer', backgroundColor: '#FF5722' }}>Enviar mensaje</button>
              </form>
            </div>
            <div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Información de contacto</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Correo electrónico</h4>
                  <a href="mailto:info@mascolor.com" style={{ color: '#FF5722' }}>info@mascolor.com</a>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Teléfono</h4>
                  <a href="tel:+541112345678" style={{ color: '#FF5722' }}>+54 11 1234-5678</a>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Dirección</h4>
                  <p>Av. Siempreviva 742<br />Buenos Aires, Argentina</p>
                </div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Horario de atención</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Lunes - Viernes:</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Sábados:</span>
                  <span>9:00 - 13:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Domingos:</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-title relative h-10 w-36 mb-2">
                <Image
                  src="/images/logos/+color.svg"
                  alt="Logo +COLOR"
                  fill
                  className="object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p style={{ color: '#9E9E9E', marginBottom: '1rem' }}>Pinturas y revestimientos de alta calidad para tus proyectos de construcción y decoración.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'white' }}>FB</a>
                <a href="#" style={{ color: 'white' }}>IG</a>
                <a href="#" style={{ color: 'white' }}>TW</a>
              </div>
            </div>
            <div>
              <h3 className="footer-title">Enlaces rápidos</h3>
              <ul className="footer-links">
                <li className="footer-link"><a href="/">Inicio</a></li>
                <li className="footer-link"><a href="/productos">Productos</a></li>
                <li className="footer-link"><a href="/nosotros">Nosotros</a></li>
                <li className="footer-link"><a href="/contacto">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-title">Contacto</h3>
              <div style={{ color: '#9E9E9E' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#FF5722', marginRight: '0.5rem' }}>✉</span>
                  <a href="mailto:info@mascolor.com" style={{ color: '#9E9E9E' }}>info@mascolor.com</a>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#FF5722', marginRight: '0.5rem' }}>☎</span>
                  <a href="tel:+541112345678" style={{ color: '#9E9E9E' }}>+54 11 1234-5678</a>
                </div>
                <div>
                  <span style={{ color: '#FF5722', marginRight: '0.5rem' }}>📍</span>
                  <span>Av. Siempreviva 742<br />Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} +COLOR. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
