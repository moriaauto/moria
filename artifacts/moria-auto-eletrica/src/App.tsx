import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import AdminPage from '@/pages/admin';
import { GallerySlider } from '@/components/gallery-slider';
import { SiteProvider, useSiteData } from '@/lib/site-context';
import {
  ArrowRight,
  BatteryCharging,
  Check,
  Clock3,
  Fan,
  Gauge,
  Lock,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  Snowflake,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  Snowflake,
  Fan,
  Zap,
  Gauge,
  Settings2,
  Wrench,
  BatteryCharging,
  ShieldCheck,
  Check,
};

const navItems = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#sobre', label: 'Sobre Nós' },
  { href: '#localizacao', label: 'Localização' },
  { href: '#contato', label: 'Contato' },
];

function WhatsAppLink({
  children,
  className,
  testId,
  whatsappNumber,
  whatsappMessage,
}: {
  children: ReactNode;
  className: string;
  testId: string;
  whatsappNumber: string;
  whatsappMessage: string;
}) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-testid={testId}
      aria-label={`${whatsappMessage} Abrir WhatsApp em nova aba`}
    >
      {children}
    </a>
  );
}

function Home() {
  const { settings, services } = useSiteData();
  const [logoGlow, setLogoGlow] = useState(false);
  const [heroGlow, setHeroGlow] = useState(false);
  const mapQuery = encodeURIComponent(settings.googleMapsQuery || settings.address);

  useEffect(() => {
    document.title = 'Moriá Auto Elétrica | Auto elétrica em Rondonópolis';
    document.documentElement.lang = 'pt-BR';
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute(
      'content',
      'Auto elétrica em Rondonópolis e ar condicionado automotivo Jardim Primavera Rondonópolis. Diagnóstico, manutenção e reparos para veículos leves e pesados.',
    );
  }, []);

  return (
    <div className="site-shell min-h-[100dvh]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3 focus:text-blue-900">
        Pular para o conteúdo
      </a>

      <main id="conteudo">
        {/* SEÇÃO INÍCIO (HERO) */}
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="container-wide hero-grid">
            <div className="reveal">
              <h1 className="display" id="hero-title">
                {settings.heroTitle}
              </h1>
              <p className="hero-lead">
                {settings.heroLead}
              </p>
            </div>
            <div className="hero-visual" aria-label="Identidade visual da Moriá Auto Elétrica">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setHeroGlow((prev) => !prev)}
                onKeyDown={(e) => e.key === 'Enter' && setHeroGlow((prev) => !prev)}
                className="hero-logo-link"
                aria-label="Logo Moriá Auto Elétrica"
              >
                <img
                  src="/moria-logo-clean.png"
                  alt="Logo Moriá Auto Elétrica e Ar Condicionado Automotivo"
                  className={`hero-logo-pure${heroGlow ? ' glow-active' : ''}`}
                  width={1024}
                  height={512}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO SERVIÇOS (DINÂMICA) */}
        <section id="servicos" className="service-section section-pad" aria-labelledby="services-title">
          <div className="container-wide">
            <div className="section-heading">
              <span className="eyebrow">{settings.servicesEyebrow}</span>
              <h2 className="display" id="services-title">{settings.servicesTitle}</h2>
              <p>{settings.servicesSubtitle}</p>
            </div>
            <div className="service-grid">
              {services.map((service, index) => {
                const IconComponent = ICON_MAP[service.icon] || Wrench;
                return (
                  <article
                    className="service-card"
                    key={service.id || index}
                    data-testid={`card-service-${index}`}
                  >
                    <div className="service-icon">
                      <IconComponent size={24} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    {service.foot && (
                      <div className="service-foot">
                        <Check size={15} aria-hidden="true" />
                        {service.foot}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEÇÃO CONFIANÇA */}
        <section className="trust-band" aria-labelledby="trust-title">
          <div className="container-wide trust-inner">
            <div>
              <span className="eyebrow">{settings.trustEyebrow}</span>
              <h2 className="display" id="trust-title">{settings.trustTitle}</h2>
            </div>
            <div className="trust-list">
              {settings.trustItems.map((item, idx) => (
                <div className="trust-item" key={idx}>
                  <Check size={18} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO SOBRE NÓS COM MOLDURA DE SLIDER DE FOTOS */}
        <section id="sobre" className="about-section section-pad" aria-labelledby="about-title">
          <div className="container-wide about-grid">
            {/* Moldura de Galeria com Slider Automático */}
            <div className="about-visual" aria-label="Galeria da oficina Moriá">
              <GallerySlider />
            </div>

            <div className="about-copy">
              <span className="eyebrow">{settings.aboutEyebrow}</span>
              <h2 className="display" id="about-title">{settings.aboutTitle}</h2>
              <p>{settings.aboutParagraph1}</p>
              {settings.aboutParagraph2 && <p>{settings.aboutParagraph2}</p>}
              <div className="about-points">
                {settings.aboutPoints.map((point, idx) => (
                  <div className="about-point" key={idx}>
                    <Check size={17} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO CONTATO */}
        <section className="contact-band" id="contato" aria-labelledby="contact-title">
          <div className="container-wide contact-inner">
            <div>
              <span className="eyebrow !text-[#91caff]">{settings.contactEyebrow}</span>
              <h2 className="display" id="contact-title">{settings.contactTitle}</h2>
              <p>{settings.contactSubtitle}</p>
            </div>
            <div className="contact-action">
              <WhatsAppLink
                className="btn-primary"
                testId="link-contact-whatsapp"
                whatsappNumber={settings.whatsappNumber}
                whatsappMessage={settings.whatsappMessage}
              >
                <Phone size={18} aria-hidden="true" />
                {settings.contactActionText}
              </WhatsAppLink>
              <p className="!mt-3 !text-sm">Atendimento direto pelo WhatsApp</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO LOCALIZAÇÃO */}
        <section id="localizacao" className="location-section section-pad" aria-labelledby="location-title">
          <div className="container-wide location-grid">
            <div className="location-copy">
              <span className="eyebrow">{settings.locationEyebrow}</span>
              <h2 className="display" id="location-title">{settings.locationTitle}</h2>
              <div className="info-block">
                <div className="info-icon"><MapPin size={21} aria-hidden="true" /></div>
                <div>
                  <strong>Endereço</strong>
                  <p>{settings.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-open-map"
                  >
                    Abrir rota no Google Maps <ArrowRight size={14} className="inline" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="info-block">
                <div className="info-icon"><Clock3 size={21} aria-hidden="true" /></div>
                <div>
                  <strong>Horário de atendimento</strong>
                  <p>{settings.openingHours}</p>
                </div>
              </div>
              <div className="info-block">
                <div className="info-icon"><Phone size={20} aria-hidden="true" /></div>
                <div>
                  <strong>Telefone e WhatsApp</strong>
                  <p>
                    <WhatsAppLink
                      className="hover:text-blue-600 transition"
                      testId="link-phone"
                      whatsappNumber={settings.whatsappNumber}
                      whatsappMessage={settings.whatsappMessage}
                    >
                      {settings.phone}
                    </WhatsAppLink>
                  </p>
                </div>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                title="Mapa da Moriá Auto Elétrica"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      {/* RODAPÉ COM LINK DISCRETO PARA ÁREA ADM */}
      <footer className="footer">
        <div className="container-wide footer-main">
          <div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setLogoGlow((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setLogoGlow((prev) => !prev);
              }}
              className="footer-logo-link"
              aria-label="Logo Moriá Auto Elétrica"
              title="Toque ou passe o mouse para iluminar"
            >
              <img
                className={`footer-logo-pure ${logoGlow ? 'glow-active' : ''}`}
                src="/moria-logo-clean.png"
                alt="Moriá Auto Elétrica"
                width={1024}
                height={551}
                loading="lazy"
              />
            </div>
            <p>Elétrica e ar-condicionado automotivo com diagnóstico, cuidado e transparência em Rondonópolis.</p>
          </div>
          <div>
            <h3>Navegue</h3>
            <nav className="footer-links" aria-label="Navegação do rodapé">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} data-testid={`link-footer-${item.href.slice(1)}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h3>Encontre e fale conosco</h3>
            <div className="footer-contact">
              <MapPin size={17} aria-hidden="true" />
              <span>{settings.address}</span>
            </div>
            <div className="footer-contact">
              <Clock3 size={17} aria-hidden="true" />
              <span>{settings.openingHours}</span>
            </div>
            <div className="footer-contact">
              <Phone size={17} aria-hidden="true" />
              <WhatsAppLink
                className="hover:text-white transition"
                testId="link-footer-phone"
                whatsappNumber={settings.whatsappNumber}
                whatsappMessage={settings.whatsappMessage}
              >
                {settings.phone}
              </WhatsAppLink>
            </div>
          </div>
        </div>

        <div className="container-wide footer-bottom flex flex-wrap items-center justify-between gap-4">
          <span>Moriá Auto Elétrica e Ar Condicionado Automotivo · Rondonópolis - MT</span>
          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 opacity-40 hover:opacity-100 transition text-[11px] text-slate-300"
              title="Acesso restrito para administradores"
            >
              <Lock size={12} aria-hidden="true" />
              Área ADM
            </a>
            <a href="#inicio" data-testid="link-back-to-top">
              Voltar ao início ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </SiteProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
