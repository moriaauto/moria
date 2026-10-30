import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Database,
  FileText,
  Image as ImageIcon,
  KeyRound,
  LogOut,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
  Upload,
  Wrench,
  Snowflake,
  Fan,
  Zap,
  Gauge,
  BatteryCharging,
  ShieldCheck,
  Clock,
  Phone,
  X,
} from 'lucide-react';
import { useSiteData, ServiceItem } from '@/lib/site-context';

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const {
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
    supabaseWriteError,
    clearSupabaseError,
  } = useSiteData();

  // Autenticação simples com PIN/senha
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('moria_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Abas
  const [activeTab, setActiveTab] = useState<'gallery' | 'services' | 'texts' | 'contact' | 'database'>('gallery');

  // Estado local para edição de textos
  const [formSettings, setFormSettings] = useState(settings);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Estado para adicionar serviço
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    foot: '',
    icon: 'Wrench',
  });

  // Estado para upload de fotos
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'Moria2026ON') {
      sessionStorage.setItem('moria_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('moria_admin_auth');
    setIsAuthenticated(false);
  };

  const showToast = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  // Upload de arquivo de imagem (converte para base64 WebP compactado)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar mantendo proporção com max 1280px para otimização
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1280;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          addGalleryImage({
            url: compressedDataUrl,
            title: newPhotoTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
          });

          setNewPhotoTitle('');
          showToast('Foto adicionada com sucesso à galeria!');
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddUrlPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    addGalleryImage({
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || 'Foto da oficina',
    });
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    showToast('Foto adicionada com sucesso!');
  };

  const handleSaveTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formSettings);
    showToast('Textos e informações atualizados com sucesso!');
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.description.trim()) {
      alert('Preencha pelo menos o título e a descrição do serviço.');
      return;
    }
    await addService(newService);
    setNewService({
      title: '',
      description: '',
      foot: '',
      icon: 'Wrench',
    });
    setIsAddingService(false);
    showToast('Novo serviço adicionado com sucesso!');
  };

  // Se não estiver autenticado, exibe login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-500 mb-4 border border-blue-500/30">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
            <p className="text-slate-400 text-sm mt-1">Moriá Auto Elétrica & Climatização</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                autoFocus
              />
              {loginError && <p className="text-red-400 text-xs mt-2">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2"
            >
              Entrar no Painel ADM
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setLocation('/')}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft size={14} /> Voltar para o site público
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Feedback */}
      {saveFeedback && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-4">
          <Check size={18} />
          {saveFeedback}
        </div>
      )}

      {/* Banner de erro Supabase */}
      {supabaseWriteError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold max-w-xl w-full mx-4 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle size={18} className="shrink-0" />
          <span className="flex-1">{supabaseWriteError}</span>
          <button
            type="button"
            onClick={clearSupabaseError}
            className="p-1 hover:bg-red-600 rounded transition"
            aria-label="Fechar erro"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header do ADM */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLocation('/')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Voltar ao site"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Painel Administrativo
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Moriá Auto Elétrica
                </span>
              </h1>
              <p className="text-xs text-slate-400">Edição em tempo real do site e galeria de fotos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocation('/')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Visualizar Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-xs font-medium rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 transition flex items-center gap-1.5"
              title="Encerrar sessão"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navegação de Abas */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon size={16} />
            Moldura & Galeria ({gallery.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wrench size={16} />
            Cards de Serviços ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'texts'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText size={16} />
            Textos do Site
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Phone size={16} />
            Contatos & Local
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database size={16} />
            Supabase & Backup
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* ABA: GALERIA DE FOTOS */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-500" />
                Moldura da Seção Sobre Nós (Slider Automático)
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Adicione fotos da oficina, serviços e equipe. As fotos passam automaticamente no quadrado da seção Sobre Nós do site. Suporta arquivos PNG e JPG.
              </p>

              {/* Upload Box */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Upload do Arquivo */}
                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-6 text-center transition bg-slate-950/40 flex flex-col items-center justify-center">
                  <Upload size={32} className="text-blue-400 mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-white">Carregar foto do computador</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Arquivos PNG ou JPG (otimizados automaticamente)</p>

                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="Legenda da foto (opcional)"
                    className="w-full max-w-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 mb-3"
                  />

                  <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition inline-flex items-center gap-2">
                    {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                    {isUploading ? 'Processando imagem...' : 'Selecionar arquivo PNG / JPG'}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Inserir URL Direta */}
                <form
                  onSubmit={handleAddUrlPhoto}
                  className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Ou adicione por link de imagem (URL)</h3>
                    <p className="text-xs text-slate-400 mb-4">Caso sua foto já esteja hospedada na web ou no Supabase Storage.</p>

                    <div className="space-y-3">
                      <div>
                        <input
                          type="url"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="https://exemplo.com/foto-oficina.png"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          placeholder="Legenda da foto (opcional)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newPhotoUrl.trim()}
                    className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} /> Adicionar por Link
                  </button>
                </form>
              </div>
            </div>

            {/* Lista de Fotos Ativas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Fotos Ativas no Slider ({gallery.length})</h3>
                <span className="text-xs text-slate-400">Passam a cada 4 segundos no site</span>
              </div>

              {gallery.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Nenhuma foto na galeria. Use o formulário acima para adicionar sua primeira foto!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((img, idx) => (
                    <div
                      key={img.id}
                      className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={img.url}
                          alt={img.title || `Foto ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="p-3 flex items-center justify-between gap-2 flex-1">
                        <span className="text-xs text-slate-300 truncate font-medium">
                          {img.title || `Foto ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Deseja remover esta foto do slide?')) {
                              deleteGalleryImage(img.id);
                              showToast('Foto removida da galeria.');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                          title="Excluir foto"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: CARDS DE SERVIÇOS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Wrench size={20} className="text-blue-500" />
                    Gerenciador de Serviços ({services.length})
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Adicione quantos serviços quiser. Todos são exibidos automaticamente com o mesmo layout moderno do site.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingService(!isAddingService)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  <Plus size={16} /> Novo Serviço
                </button>
              </div>

              {/* Formulário de Adicionar Serviço */}
              {isAddingService && (
                <form
                  onSubmit={handleCreateService}
                  className="bg-slate-950/70 border border-blue-500/40 rounded-xl p-5 mb-6 space-y-4 animate-in fade-in"
                >
                  <h3 className="text-sm font-bold text-blue-400">Cadastrar Novo Serviço</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Título do Serviço</label>
                      <input
                        type="text"
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        placeholder="Ex: Injeção Eletrônica"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Destaque do Rodapé do Card</label>
                      <input
                        type="text"
                        value={newService.foot}
                        onChange={(e) => setNewService({ ...newService, foot: e.target.value })}
                        placeholder="Ex: Diagnóstico Rápido"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Descrição Detalhada</label>
                    <textarea
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Explique o que o serviço cobre e os benefícios para o cliente..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Ícone do Card</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Snowflake', label: 'Ar / Clima' },
                        { name: 'Fan', label: 'Ventilação' },
                        { name: 'Zap', label: 'Elétrica' },
                        { name: 'Gauge', label: 'Medição' },
                        { name: 'Settings2', label: 'Configurações' },
                        { name: 'Wrench', label: 'Mecânica' },
                        { name: 'BatteryCharging', label: 'Bateria' },
                        { name: 'ShieldCheck', label: 'Garantia' },
                      ].map((ic) => (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => setNewService({ ...newService, icon: ic.name })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                            newService.icon === ic.name
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ic.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingService(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500"
                    >
                      Salvar Serviço
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Serviços */}
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Deseja excluir o serviço "${item.title}"?`)) {
                              deleteService(item.id);
                              showToast('Serviço excluído.');
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition"
                          title="Excluir serviço"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-blue-400">
                      <span>✓ {item.foot}</span>
                      <span className="text-slate-500 font-mono text-[10px]">Ícone: {item.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA: TEXTOS DO SITE */}
        {activeTab === 'texts' && (
          <form onSubmit={handleSaveTexts} className="space-y-6">
            {/* Hero / Início */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText size={18} className="text-blue-500" />
                Seção Início (Hero Principal)
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subtítulo / Nota no Topo</label>
                <input
                  type="text"
                  value={formSettings.heroNote}
                  onChange={(e) => setFormSettings({ ...formSettings, heroNote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título Principal do Site</label>
                <textarea
                  rows={2}
                  value={formSettings.heroTitle}
                  onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Texto de Apresentação (Lead)</label>
                <textarea
                  rows={2}
                  value={formSettings.heroLead}
                  onChange={(e) => setFormSettings({ ...formSettings, heroLead: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            {/* Seção Sobre Nós */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText size={18} className="text-blue-500" />
                Seção Sobre Nós (ao lado da moldura do slide)
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título da Seção Sobre Nós</label>
                <textarea
                  rows={2}
                  value={formSettings.aboutTitle}
                  onChange={(e) => setFormSettings({ ...formSettings, aboutTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primeiro Parágrafo</label>
                <textarea
                  rows={3}
                  value={formSettings.aboutParagraph1}
                  onChange={(e) => setFormSettings({ ...formSettings, aboutParagraph1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Segundo Parágrafo</label>
                <textarea
                  rows={2}
                  value={formSettings.aboutParagraph2}
                  onChange={(e) => setFormSettings({ ...formSettings, aboutParagraph2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tópicos com Checkmarks</label>
                <div className="space-y-2">
                  {formSettings.aboutPoints.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500 text-xs">✓</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formSettings.aboutPoints];
                          updated[idx] = e.target.value;
                          setFormSettings({ ...formSettings, aboutPoints: updated });
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção de Confiança / Jeito de Trabalhar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText size={18} className="text-blue-500" />
                Faixa de Confiança ("Nosso Jeito de Trabalhar")
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título da Faixa</label>
                <input
                  type="text"
                  value={formSettings.trustTitle}
                  onChange={(e) => setFormSettings({ ...formSettings, trustTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Itens de Confiança</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {formSettings.trustItems.map((item, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...formSettings.trustItems];
                        updated[idx] = e.target.value;
                        setFormSettings({ ...formSettings, trustItems: updated });
                      }}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end sticky bottom-6 z-30">
              <button
                type="submit"
                disabled={isSyncing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-2xl shadow-blue-600/50"
              >
                <Save size={18} />
                {isSyncing ? 'Salvando...' : 'Salvar Alterações de Texto'}
              </button>
            </div>
          </form>
        )}

        {/* ABA: CONTATOS & LOCAL */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveTexts} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Phone size={18} className="text-blue-500" />
                Canais de Atendimento & Horário
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Telefone Exibido</label>
                  <input
                    type="text"
                    value={formSettings.phone}
                    onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Número do WhatsApp (com DDI e DDD, ex: 5566996954476)
                  </label>
                  <input
                    type="text"
                    value={formSettings.whatsappNumber}
                    onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mensagem Inicial do WhatsApp</label>
                <input
                  type="text"
                  value={formSettings.whatsappMessage}
                  onChange={(e) => setFormSettings({ ...formSettings, whatsappMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Horário de Atendimento</label>
                <input
                  type="text"
                  value={formSettings.openingHours}
                  onChange={(e) => setFormSettings({ ...formSettings, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin size={18} className="text-blue-500" />
                Endereço & Mapa
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Endereço Completo</label>
                <textarea
                  rows={2}
                  value={formSettings.address}
                  onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Busca do Google Maps (endereço ou coordenadas)
                </label>
                <input
                  type="text"
                  value={formSettings.googleMapsQuery}
                  onChange={(e) => setFormSettings({ ...formSettings, googleMapsQuery: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end sticky bottom-6 z-30">
              <button
                type="submit"
                disabled={isSyncing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-2xl shadow-blue-600/50"
              >
                <Save size={18} />
                {isSyncing ? 'Salvando...' : 'Salvar Informações de Contato'}
              </button>
            </div>
          </form>
        )}

        {/* ABA: SUPABASE & DADOS */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database size={20} className="text-blue-500" />
                Integração com Supabase
              </h2>
              <p className="text-xs text-slate-400">
                Seu projeto está conectado com as credenciais fornecidas:
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Projeto URL:</span>{' '}
                  <span className="text-blue-400">https://blpmzlapnewxqdvdpsyby.supabase.co</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <span className="text-emerald-400">Conectado (com cache local de alta disponibilidade)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-2">Estrutura SQL para o Supabase (Opcional)</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Se você desejar que o banco de dados armazene as tabelas diretamente na nuvem, execute o código abaixo no SQL Editor do seu Supabase Dashboard:
                </p>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto select-all">
{`-- Criar tabelas da Moriá Auto Elétrica
create table if not exists site_settings (
  id text primary key,
  content jsonb,
  updated_at timestamp with time zone default now()
);

create table if not exists site_services (
  id text primary key,
  icon text,
  title text,
  description text,
  foot text,
  order_index int
);

create table if not exists site_gallery (
  id text primary key,
  url text,
  title text,
  order_index int
);

-- Habilitar leitura pública para os visitantes do site
alter table site_settings enable row level security;
alter table site_services enable row level security;
alter table site_gallery enable row level security;

create policy "Permitir leitura pública settings" on site_settings for select using (true);
create policy "Permitir leitura pública services" on site_services for select using (true);
create policy "Permitir leitura pública gallery" on site_gallery for select using (true);

create policy "Permitir escrita total settings" on site_settings for all using (true);
create policy "Permitir escrita total services" on site_services for all using (true);
create policy "Permitir escrita total gallery" on site_gallery for all using (true);`}
                </pre>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Restaurar Informações de Fábrica</h4>
                  <p className="text-xs text-slate-400">Limpa todas as edições locais e volta ao conteúdo inicial.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja restaurar os dados originais?')) {
                      resetToDefaults();
                      setFormSettings(settings);
                      showToast('Configurações originais restauradas!');
                    }
                  }}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-xl text-xs font-semibold transition"
                >
                  Restaurar Padrão
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
