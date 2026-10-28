import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Clock3,
  Fan,
  Gauge,
  MapPin,
  Menu,
  Phone,
  Settings2,
  ShieldCheck,
  Snowflake,
  X,
  Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const whatsappMessage = 'Olá! Vi o site da Moriá e gostaria de solicitar um orçamento para o meu veículo.';
const whatsappUrl = `https://wa.me/5566996954476?text=${encodeURIComponent(whatsappMessage)}`;
const address = 'Avenida Lídio Magalhães, 492, Jardim Primavera, Rondonópolis - MT, CEP 78.725-250';
const mapQuery = encodeURIComponent(address);

const navItems = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#sobre', label: 'Sobre Nós' },
  { href: '#localizacao', label: 'Localização' },
  { href: '#contato', label: 'Contato' },
];

function WhatsAppLink({ children, className, testId }: { children: ReactNode; className: string; testId: string }) {
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-shell">
      <div className="container-wide header-inner flex min-h-[82px] items-center justify-between">
        <a href="#inicio" aria-label="Moriá Auto Elétrica — início" data-testid="link-logo-home">
          <img className="header-logo block w-[184px]" src="/moria-logo.jpeg" alt="Moriá Auto Elétrica e Ar Condicionado Automotivo" width={1024} height={512} />
        </a>
        <nav className="desktop-nav flex items-center gap-8" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a key={item.href} className="nav-link" href={item.href} data-testid={`link-nav-${item.href.slice(1)}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <WhatsAppLink className="header-cta btn-primary !min-h-[44px] !px-4 !text-[.82rem]" testId="link-header-whatsapp">
          <Phone size={16} aria-hidden="true" />
          Orçamento imediato
        </WhatsAppLink>
        <button
          type="button"
          className="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação móvel">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-testid={`link-mobile-${item.href.slice(1)}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <WhatsAppLink className="btn-primary mt-4" testId="link-mobile-whatsapp">
            <Phone size={16} aria-hidden="true" />
            Solicitar orçamento
          </WhatsAppLink>
        </nav>
      )}
    </header>
  );
}

const services = [
  {
    number: '01',
    icon: Snowflake,
    title: 'Ar-condicionado automotivo',
    description: 'Diagnóstico, detecção de vazamentos, limpeza de dutos e revisão completa do sistema.',
    foot: 'Conforto em cada trajeto',
  },
  {
    number: '02',
    icon: Fan,
    title: 'Recarga de gás e revisão',
    description: 'Recarga de fluido refrigerante e revisão do ar-condicionado para recuperar o desempenho.',
    foot: 'Sistema de climatização',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Motor de partida',
    description: 'Reparo e manutenção do motor de partida para uma partida segura e confiável.',
    foot: 'Partida sem surpresas',
  },
  {
    number: '04',
    icon: Gauge,
    title: 'Alternador',
    description: 'Manutenção e teste do alternador para verificar a geração e o carregamento elétrico.',
    foot: 'Energia para o veículo',
  },
  {
    number: '05',
    icon: Settings2,
    title: 'Elétrica automotiva completa',
    description: 'Revisão da injeção eletrônica, painel, chicotes e sistemas digitais em veículos leves e pesados.',
    foot: 'Diagnóstico preciso',
  },
];

function Home() {
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
    let keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
      keywords = document.createElement('meta');
      keywords.setAttribute('name', 'keywords');
      document.head.appendChild(keywords);
    }
    keywords.setAttribute('content', 'Auto elétrica em Rondonópolis, Ar condicionado automotivo Jardim Primavera Rondonópolis, elétrica automotiva, Rondonópolis MT');
  }, []);

  return (
    <div className="site-shell min-h-[100dvh]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3 focus:text-blue-900">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="container-wide hero-grid">
            <div className="reveal">
              <span className="hero-note">Moriá Auto Elétrica · Rondonópolis / MT</span>
              <h1 className="display" id="hero-title">
                Especialistas em Elétrica e Ar Condicionado Automotivo em Rondonópolis-MT.
              </h1>
              <p className="hero-lead">
                Manutenção, diagnóstico e reparos de alta precisão para veículos de linha leve e pesada. Qualidade, confiança e compromisso.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <WhatsAppLink className="btn-primary" testId="link-hero-whatsapp">
                  Solicitar orçamento no WhatsApp <ArrowRight size={18} aria-hidden="true" />
                </WhatsAppLink>
                <a className="btn-outline !border-white/40 !text-white hover:!bg-white/10" href="#servicos" data-testid="link-hero-services">
                  Conhecer nossos serviços <ArrowDownRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-visual" aria-label="Identidade visual da Moriá Auto Elétrica">
              <div className="hero-logo-wrap">
                <img src="/moria-logo.jpeg" alt="Logo Moriá Auto Elétrica e Ar Condicionado Automotivo" width={1024} height={512} />
              </div>
              <div className="hero-stamp">
                <ShieldCheck size={20} aria-hidden="true" />
                Leves e pesados
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="service-section section-pad" aria-labelledby="services-title">
          <div className="container-wide">
            <div className="section-heading">
              <span className="eyebrow">Serviços especializados</span>
              <h2 className="display" id="services-title">Cuidado técnico para seguir em frente.</h2>
              <p>Da falha elétrica ao ar que não gela: avaliamos cada sistema com atenção e explicamos o que o seu veículo precisa.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article className="service-card" key={service.number} data-testid={`card-service-${service.number}`}>
                    <span className="service-number">{service.number}</span>
                    <div className="service-icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-foot"><Check size={15} aria-hidden="true" />{service.foot}</div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="trust-band" aria-labelledby="trust-title">
          <div className="container-wide trust-inner">
            <div>
              <span className="eyebrow">Nosso jeito de trabalhar</span>
              <h2 className="display" id="trust-title">Diagnóstico claro. Serviço bem feito.</h2>
            </div>
            <div className="trust-list">
              <div className="trust-item"><Check size={18} aria-hidden="true" /><span>Atendimento especializado em elétrica e climatização automotiva</span></div>
              <div className="trust-item"><Check size={18} aria-hidden="true" /><span>Equipamentos modernos de diagnóstico</span></div>
              <div className="trust-item"><Check size={18} aria-hidden="true" /><span>Orçamentos explicados com clareza</span></div>
              <div className="trust-item"><Check size={18} aria-hidden="true" /><span>Agilidade e transparência em cada etapa</span></div>
            </div>
          </div>
        </section>

        <section id="sobre" className="about-section section-pad" aria-labelledby="about-title">
          <div className="container-wide about-grid">
            <div className="about-art" aria-hidden="true">
              <div className="art-mark"><Zap size={54} strokeWidth={1.4} /></div>
              <span className="art-label">Precisão que move</span>
            </div>
            <div className="about-copy">
              <span className="eyebrow">Sobre nós</span>
              <h2 className="display" id="about-title">Especialistas para cuidar do que faz seu veículo funcionar.</h2>
              <p>
                A Moriá Auto Elétrica e Ar Condicionado Automotivo atende Rondonópolis com foco em diagnóstico preciso e manutenção responsável. Cuidamos dos sistemas elétricos e de climatização de veículos de linha leve e pesada.
              </p>
              <p>
                Aqui, você recebe orientação objetiva, um orçamento claro e um serviço conduzido com agilidade e transparência.
              </p>
              <div className="about-points">
                <div className="about-point"><Check size={17} aria-hidden="true" /> Diagnóstico com equipamentos modernos</div>
                <div className="about-point"><Check size={17} aria-hidden="true" /> Atendimento para linha leve e pesada</div>
                <div className="about-point"><Check size={17} aria-hidden="true" /> Explicação clara antes do reparo</div>
              </div>
              <WhatsAppLink className="btn-primary" testId="link-about-whatsapp">
                Converse com a equipe <ArrowRight size={17} aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
        </section>

        <section className="contact-band" id="contato" aria-labelledby="contact-title">
          <div className="container-wide contact-inner">
            <div>
              <span className="eyebrow !text-[#91caff]">Vamos resolver?</span>
              <h2 className="display" id="contact-title">Conte com uma avaliação técnica.</h2>
              <p>Seu carro apresentou falhas na elétrica ou o ar-condicionado parou de gelar? Fale agora mesmo com nossa equipe técnica.</p>
            </div>
            <div className="contact-action">
              <WhatsAppLink className="btn-primary" testId="link-contact-whatsapp">
                <Phone size={18} aria-hidden="true" /> Falar com técnico via WhatsApp
              </WhatsAppLink>
              <p className="!mt-3 !text-sm">Atendimento direto pelo WhatsApp</p>
            </div>
          </div>
        </section>

        <section id="localizacao" className="location-section section-pad" aria-labelledby="location-title">
          <div className="container-wide location-grid">
            <div className="location-copy">
              <span className="eyebrow">Estamos por aqui</span>
              <h2 className="display" id="location-title">Visite a Moriá.</h2>
              <div className="info-block">
                <div className="info-icon"><MapPin size={21} aria-hidden="true" /></div>
                <div>
                  <strong>Endereço</strong>
                  <p>{address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" data-testid="link-open-map">
                    Abrir rota no Google Maps <ArrowRight size={14} className="inline" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="info-block">
                <div className="info-icon"><Clock3 size={21} aria-hidden="true" /></div>
                <div>
                  <strong>Horário de atendimento</strong>
                  <p>Segunda a Sexta-feira,<br />07:30 às 11:00 e 13:00 às 18:00.</p>
                </div>
              </div>
              <div className="info-block">
                <div className="info-icon"><Phone size={20} aria-hidden="true" /></div>
                <div>
                  <strong>Telefone e WhatsApp</strong>
                  <p><a href="tel:+5566996954476" data-testid="link-phone">(66) 99695-4476</a></p>
                </div>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                title="Mapa da Moriá Auto Elétrica na Avenida Lídio Magalhães, Jardim Primavera, Rondonópolis"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container-wide footer-main">
          <div>
            <a href="#inicio" aria-label="Voltar ao início" data-testid="link-footer-home">
              <img className="footer-logo" src="/moria-logo.jpeg" alt="Moriá Auto Elétrica" width={1024} height={512} loading="lazy" />
            </a>
            <p>Elétrica e ar-condicionado automotivo com diagnóstico, cuidado e transparência em Rondonópolis.</p>
          </div>
          <div>
            <h3>Navegue</h3>
            <nav className="footer-links" aria-label="Navegação do rodapé">
              {navItems.map((item) => <a key={item.href} href={item.href} data-testid={`link-footer-${item.href.slice(1)}`}>{item.label}</a>)}
            </nav>
          </div>
          <div>
            <h3>Encontre e fale conosco</h3>
            <div className="footer-contact"><MapPin size={17} aria-hidden="true" /><span>{address}</span></div>
            <div className="footer-contact"><Clock3 size={17} aria-hidden="true" /><span>Segunda a Sexta-feira, 07:30 às 11:00 e 13:00 às 18:00</span></div>
            <div className="footer-contact"><Phone size={17} aria-hidden="true" /><a href="tel:+5566996954476" data-testid="link-footer-phone">(66) 99695-4476</a></div>
          </div>
        </div>
        <div className="container-wide footer-bottom">
          <span>Moriá Auto Elétrica e Ar Condicionado Automotivo · Rondonópolis - MT</span>
          <a href="#inicio" data-testid="link-back-to-top">Voltar ao início ↑</a>
        </div>
      </footer>

      <WhatsAppLink className="whatsapp-float" testId="link-floating-whatsapp">
        <Phone size={20} aria-hidden="true" />
        <span>Fale pelo WhatsApp</span>
      </WhatsAppLink>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
