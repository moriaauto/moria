import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  foot: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
}

export interface SiteSettings {
  heroNote: string;
  heroTitle: string;
  heroLead: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  trustEyebrow: string;
  trustTitle: string;
  trustItems: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutPoints: string[];
  contactEyebrow: string;
  contactTitle: string;
  contactSubtitle: string;
  contactActionText: string;
  locationEyebrow: string;
  locationTitle: string;
  address: string;
  openingHours: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  googleMapsQuery: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroNote: 'Moriá Auto Elétrica · Rondonópolis / MT',
  heroTitle: 'Especialistas em Elétrica e Ar Condicionado Automotivo em Rondonópolis-MT.',
  heroLead: 'Manutenção, diagnóstico e reparos de alta precisão para veículos de linha leve e pesada. Qualidade, confiança e compromisso.',
  servicesEyebrow: 'Serviços especializados',
  servicesTitle: 'Cuidado técnico para seguir em frente.',
  servicesSubtitle: 'Da falha elétrica ao ar que não gela: avaliamos cada sistema com atenção e explicamos o que o seu veículo precisa.',
  trustEyebrow: 'Nosso jeito de trabalhar',
  trustTitle: 'Diagnóstico claro. Serviço bem feito.',
  trustItems: [
    'Atendimento especializado em elétrica e climatização automotiva',
    'Equipamentos modernos de diagnóstico',
    'Orçamentos explicados com clareza',
    'Agilidade e transparência em cada etapa',
  ],
  aboutEyebrow: 'Sobre nós',
  aboutTitle: 'Especialistas para cuidar do que faz seu veículo funcionar.',
  aboutParagraph1: 'A Moriá Auto Elétrica e Ar Condicionado Automotivo atende Rondonópolis com foco em diagnóstico preciso e manutenção responsável. Cuidamos dos sistemas elétricos e de climatização de veículos de linha leve e pesada.',
  aboutParagraph2: 'Aqui, você recebe orientação objetiva, um orçamento claro e um serviço conduzido com agilidade e transparência.',
  aboutPoints: [
    'Diagnóstico com equipamentos modernos',
    'Atendimento para linha leve e pesada',
    'Explicação clara antes do reparo',
  ],
  contactEyebrow: 'Vamos resolver?',
  contactTitle: 'Conte com uma avaliação técnica.',
  contactSubtitle: 'Seu carro apresentou falhas na elétrica ou o ar-condicionado parou de gelar? Fale agora mesmo com nossa equipe técnica.',
  contactActionText: 'Falar com técnico via WhatsApp',
  locationEyebrow: 'Estamos por aqui',
  locationTitle: 'Visite a Moriá.',
  address: 'Avenida Lídio Magalhães, 492, Jardim Primavera, Rondonópolis - MT, CEP 78.725-250',
  openingHours: 'Segunda a Sexta-feira, 07:30 às 11:00 e 13:00 às 18:00.',
  phone: '(66) 99695-4476',
  whatsappNumber: '5566996954476',
  whatsappMessage: 'Olá! Vi o site da Moriá e gostaria de solicitar um orçamento para o meu veículo.',
  googleMapsQuery: 'Avenida Lídio Magalhães, 492, Jardim Primavera, Rondonópolis - MT, CEP 78.725-250',
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    icon: 'Snowflake',
    title: 'Ar-condicionado automotivo',
    description: 'Diagnóstico, detecção de vazamentos, limpeza de dutos e revisão completa do sistema.',
    foot: 'Conforto em cada trajeto',
  },
  {
    id: 'srv-2',
    icon: 'Fan',
    title: 'Recarga de gás e revisão',
    description: 'Recarga de fluido refrigerante e revisão do ar-condicionado para recuperar o desempenho.',
    foot: 'Sistema de climatização',
  },
  {
    id: 'srv-3',
    icon: 'Zap',
    title: 'Motor de partida',
    description: 'Reparo e manutenção do motor de partida para uma partida segura e confiável.',
    foot: 'Partida sem surpresas',
  },
  {
    id: 'srv-4',
    icon: 'Gauge',
    title: 'Alternador',
    description: 'Manutenção e teste do alternador para verificar a geração e o carregamento elétrico.',
    foot: 'Energia para o veículo',
  },
  {
    id: 'srv-5',
    icon: 'Settings2',
    title: 'Elétrica automotiva completa',
    description: 'Revisão da injeção eletrônica, painel, chicotes e sistemas digitais em veículos leves e pesados.',
    foot: 'Diagnóstico preciso',
  },
];

const DEFAULT_GALLERY: GalleryImage[] = [];

const STORAGE_KEY_SETTINGS = 'moria_site_settings';
const STORAGE_KEY_SERVICES = 'moria_site_services';
const STORAGE_KEY_GALLERY = 'moria_site_gallery';

interface SiteContextType {
  settings: SiteSettings;
  services: ServiceItem[];
  gallery: GalleryImage[];
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addGalleryImage: (image: { url: string; title?: string }) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  resetToDefaults: () => void;
  isSyncing: boolean;
  syncStatus: 'idle' | 'success' | 'fallback';
  supabaseWriteError: string | null;
  clearSupabaseError: () => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'fallback'>('idle');
  const [supabaseWriteError, setSupabaseWriteError] = useState<string | null>(null);

  const clearSupabaseError = () => setSupabaseWriteError(null);

  // Tenta sincronizar com Supabase ao iniciar
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: dbSettings, error: errSettings } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'main')
          .single();

        if (!errSettings && dbSettings?.content) {
          setSettings(dbSettings.content);
          localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(dbSettings.content));
        }

        const { data: dbServices, error: errServices } = await supabase
          .from('site_services')
          .select('*')
          .order('order_index', { ascending: true });

        if (!errServices && dbServices && dbServices.length > 0) {
          const mapped = dbServices.map((s) => ({
            id: s.id,
            icon: s.icon,
            title: s.title,
            description: s.description,
            foot: s.foot,
          }));
          setServices(mapped);
          localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(mapped));
        }

        const { data: dbGallery, error: errGallery } = await supabase
          .from('site_gallery')
          .select('*')
          .order('order_index', { ascending: true });

        if (!errGallery && dbGallery) {
          const mapped = dbGallery.map((g) => ({
            id: g.id,
            url: g.url,
            title: g.title,
          }));
          setGallery(mapped);
          localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(mapped));
        }

        setSyncStatus('success');
      } catch {
        setSyncStatus('fallback');
      }
    }

    loadFromSupabase();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setIsSyncing(true);
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'main', content: updated, updated_at: new Date().toISOString() });
      if (error) setSupabaseWriteError('Erro ao salvar textos no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const addService = async (item: Omit<ServiceItem, 'id'>) => {
    setIsSyncing(true);
    const newService: ServiceItem = {
      ...item,
      id: 'srv-' + Date.now(),
    };
    const updated = [...services, newService];
    setServices(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
      const { error } = await supabase.from('site_services').insert({
        id: newService.id,
        icon: newService.icon,
        title: newService.title,
        description: newService.description,
        foot: newService.foot,
        order_index: updated.length,
      });
      if (error) setSupabaseWriteError('Erro ao salvar serviço no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const updateService = async (id: string, partial: Partial<ServiceItem>) => {
    setIsSyncing(true);
    const updated = services.map((s) => (s.id === id ? { ...s, ...partial } : s));
    setServices(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
      const { error } = await supabase.from('site_services').update(partial).eq('id', id);
      if (error) setSupabaseWriteError('Erro ao atualizar serviço no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteService = async (id: string) => {
    setIsSyncing(true);
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
      const { error } = await supabase.from('site_services').delete().eq('id', id);
      if (error) setSupabaseWriteError('Erro ao excluir serviço no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const addGalleryImage = async (item: { url: string; title?: string }) => {
    setIsSyncing(true);
    const newImage: GalleryImage = {
      id: 'gal-' + Date.now(),
      url: item.url,
      title: item.title || '',
    };
    const updated = [...gallery, newImage];
    setGallery(updated);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(updated));
      const { error } = await supabase.from('site_gallery').insert({
        id: newImage.id,
        url: newImage.url,
        title: newImage.title,
        order_index: updated.length,
      });
      if (error) setSupabaseWriteError('Erro ao salvar foto no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    setIsSyncing(true);
    const updated = gallery.filter((img) => img.id !== id);
    setGallery(updated);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(updated));
      const { error } = await supabase.from('site_gallery').delete().eq('id', id);
      if (error) setSupabaseWriteError('Erro ao excluir foto no Supabase: ' + error.message);
    } catch (e: any) {
      setSupabaseWriteError('Sem conexão com o Supabase: ' + (e?.message || 'erro desconhecido'));
    } finally {
      setIsSyncing(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setServices(DEFAULT_SERVICES);
    setGallery(DEFAULT_GALLERY);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_GALLERY);
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        services,
        gallery,
        updateSettings,
        addService,
        updateService,
        deleteService,
        addGalleryImage,
        deleteGalleryImage,
        resetToDefaults,
        isSyncing,
        syncStatus,
        supabaseWriteError,
        clearSupabaseError,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
}
