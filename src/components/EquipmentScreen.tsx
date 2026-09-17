import React, { useState, useEffect } from 'react';
import { 
  PackagePlus, 
  CheckCircle2, 
  Tag, 
  Barcode, 
  Laptop, 
  Calendar, 
  FileCheck, 
  Search, 
  ShieldAlert,
  SlidersHorizontal,
  PlusCircle,
  Monitor,
  Smartphone,
  Cpu,
  Keyboard,
  Boxes,
  ArrowLeftRight,
  User,
  MapPin,
  Clock,
  Check,
  Filter
} from 'lucide-react';
import { Equipment, EquipmentType } from '../types';

interface EquipmentScreenProps {
  equipments: Equipment[];
  onAddEquipment: (equipment: Equipment) => void;
  onInitiateTransfer?: (equipment: Equipment) => void;
  activeSubTab?: 'list' | 'register';
  onSubTabChange?: (subTab: 'list' | 'register') => void;
}

const EQUIPMENT_TYPES: EquipmentType[] = [
  'Notebook',
  'Monitor',
  'Desktop',
  'Celular/Smartphone',
  'Teclado/Mouse',
];

const DEFAULT_ACCESSORIES = [
  'Carregador/Fonte',
  'Adaptador de Vídeo',
  'Cabo de Força',
  'Mochila/Capa',
  'Cabo de Rede Patch Cord',
  'Trava Kensington',
];

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({
  equipments,
  onAddEquipment,
  onInitiateTransfer,
  activeSubTab: externalSubTab,
  onSubTabChange,
}) => {
  // Internal tab state with fallback
  const [internalTab, setInternalTab] = useState<'list' | 'register'>('list');
  const activeTab = externalSubTab || internalTab;

  const handleTabSwitch = (tab: 'list' | 'register') => {
    setInternalTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  useEffect(() => {
    if (externalSubTab) {
      setInternalTab(externalSubTab);
    }
  }, [externalSubTab]);

  // Form State
  const [type, setType] = useState<EquipmentType>('Notebook');
  const [tag, setTag] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'Carregador/Fonte',
    'Mochila/Capa',
  ]);
  const [conditionNotes, setConditionNotes] = useState('');
  // Data de Retirada padrão com o dia atual
  const [checkoutDate, setCheckoutDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [responsibilityTermAccepted, setResponsibilityTermAccepted] = useState(false);

  // Status & Feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [lastRegisteredTag, setLastRegisteredTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Input mask for PAT-000000 (10 to 12 chars)
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.toUpperCase();
    raw = raw.replace(/[^A-Z0-9-]/g, '');
    if (!raw.startsWith('PAT-') && raw.length > 0 && !raw.startsWith('P')) {
      raw = 'PAT-' + raw.replace(/[^0-9]/g, '');
    }
    if (raw.length <= 12) {
      setTag(raw);
    }
  };

  // Serial Number input (alphanumeric uppercase, max 25 chars)
  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (raw.length <= 25) {
      setSerialNumber(raw);
    }
  };

  const handleToggleAccessory = (acc: string) => {
    if (selectedAccessories.includes(acc)) {
      setSelectedAccessories(selectedAccessories.filter((item) => item !== acc));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!responsibilityTermAccepted) {
      alert('É obrigatório aceitar o Termo de Responsabilidade corporativo.');
      return;
    }

    if (!tag.trim()) {
      alert('Por favor, informe o Número de Patrimônio / Tag.');
      return;
    }

    if (!serialNumber.trim()) {
      alert('Por favor, informe o Número de Série (S/N).');
      return;
    }

    if (!brandModel.trim()) {
      alert('Por favor, informe a Marca e Modelo do equipamento.');
      return;
    }

    const newEquip: Equipment = {
      id: 'eq-' + Date.now(),
      type,
      tag: tag.trim(),
      serialNumber: serialNumber.trim(),
      brandModel: brandModel.trim(),
      accessories: selectedAccessories,
      conditionNotes: conditionNotes.trim(),
      checkoutDate,
      responsibilityTermAccepted,
      status: 'Disponível',
      createdAt: new Date().toISOString(),
    };

    onAddEquipment(newEquip);
    setLastRegisteredTag(newEquip.tag);

    setFeedbackMessage(`Equipamento ${newEquip.tag} (${newEquip.brandModel}) cadastrado com sucesso no inventário!`);

    // Reset form to defaults
    setTag('');
    setSerialNumber('');
    setBrandModel('');
    setConditionNotes('');
    setSelectedAccessories(['Carregador/Fonte']);
    setResponsibilityTermAccepted(false);
  };

  const filteredEquipments = equipments.filter((eq) => {
    const matchesSearch =
      eq.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq.assignedToUser && eq.assignedToUser.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || eq.type === filterType;
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (eqType: EquipmentType, className = "w-4 h-4") => {
    switch (eqType) {
      case 'Notebook':
        return <Laptop className={`${className} text-blue-600`} />;
      case 'Monitor':
        return <Monitor className={`${className} text-indigo-600`} />;
      case 'Desktop':
        return <Cpu className={`${className} text-emerald-600`} />;
      case 'Celular/Smartphone':
        return <Smartphone className={`${className} text-amber-600`} />;
      case 'Teclado/Mouse':
        return <Keyboard className={`${className} text-purple-600`} />;
    }
  };

  const availableCount = equipments.filter((e) => e.status === 'Disponível').length;
  const inUseCount = equipments.filter((e) => e.status === 'Em Uso').length;
  const maintenanceCount = equipments.filter((e) => e.status === 'Em Manutenção' || e.status === 'Recolhido').length;

  return (
    <div className="space-y-6">


      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleTabSwitch('list');
                setFeedbackMessage(null);
              }}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px]"
            >
              Ver na Lista de Cadastrados →
            </button>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium px-2 py-1 underline cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 1: EQUIPAMENTOS CADASTRADOS (INVENTÁRIO)                              */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Status Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
                Total Registrados
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 mt-1 block">{equipments.length}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 truncate block">Ativos no banco</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block truncate">
                Disponíveis
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 mt-1 block">{availableCount}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 truncate block">Prontos p/ entrega</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-700 uppercase tracking-wider block truncate">
                Em Uso
              </span>
              <span className="text-lg sm:text-xl font-bold text-blue-700 mt-1 block">{inUseCount}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 truncate block">Com colaboradores</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 uppercase tracking-wider block truncate">
                Manutenção / Recolh.
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-700 mt-1 block">{maintenanceCount}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 truncate block">Logística reversa</span>
            </div>
          </div>

          {/* Search, Filters & Action Bar */}
          <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="search-equipment-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por Patrimônio, Serial S/N, Marca..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[40px]"
                />
              </div>

              {/* Filters in 2 columns on mobile */}
              <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                <div className="w-full sm:w-44">
                  <select
                    id="filter-equipment-type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[40px]"
                  >
                    <option value="all">Tipos (Todos)</option>
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-40">
                  <select
                    id="filter-equipment-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[40px]"
                  >
                    <option value="all">Status (Todos)</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Em Uso">Em Uso</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                    <option value="Recolhido">Recolhido</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Direct CTA to Register Tab */}
            <button
              type="button"
              id="btn-goto-register-tab"
              onClick={() => handleTabSwitch('register')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 min-h-[40px]"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Novo Equipamento</span>
            </button>
          </div>

          {/* List of Registered Assets */}
          {filteredEquipments.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Nenhum equipamento encontrado</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Tente ajustar ou limpar os filtros de busca para visualizar os itens.'
                  : 'Nenhum equipamento cadastrado ainda no sistema.'}
              </p>
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Registrar Primeiro Equipamento</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredEquipments.map((eq) => (
                <div
                  key={eq.id}
                  className={`bg-white rounded-xl border transition-all p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    lastRegisteredTag === eq.tag ? 'border-emerald-400 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Type, Tag & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200/80">
                          {getTypeIcon(eq.type, "w-5 h-5")}
                        </div>
                        <div>
                          <span className="font-mono font-extrabold text-sm text-slate-900 tracking-tight block">
                            {eq.tag}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {eq.type}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          eq.status === 'Disponível'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : eq.status === 'Em Uso'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {eq.status}
                      </span>
                    </div>

                    {/* Brand & Model */}
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {eq.brandModel}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        S/N: {eq.serialNumber}
                      </p>
                    </div>

                    {/* Custody Info if Assigned */}
                    {eq.assignedToUser && (
                      <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{eq.assignedToUser}</span>
                        </div>
                        {eq.assignedLocation && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{eq.assignedLocation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Condition Notes */}
                    {eq.conditionNotes && (
                      <div className="mb-3">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Estado de Conservação:
                        </span>
                        <p className="text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 italic line-clamp-2">
                          "{eq.conditionNotes}"
                        </p>
                      </div>
                    )}

                    {/* Accessories */}
                    {eq.accessories && eq.accessories.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Acessórios Inclusos:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {eq.accessories.map((acc, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                            >
                              {acc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer with checkout date & action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Retirada: {eq.checkoutDate}</span>
                    </div>

                    {onInitiateTransfer && eq.status === 'Disponível' && (
                      <button
                        type="button"
                        onClick={() => onInitiateTransfer(eq)}
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        <span>Usar em Troca</span>
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: REGISTRAR NOVO EQUIPAMENTO (FORMULÁRIO DEDICADO)                   */}
      {/* ========================================================================= */}
      {activeTab === 'register' && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Ficha de Cadastro de Equipamento
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Todos os campos identificados com asterisco (*) são de preenchimento obrigatório para auditoria.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTabSwitch('list')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer shrink-0 min-h-[36px]"
            >
              <span className="hidden sm:inline">Ver Cadastrados</span>
              <Boxes className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* SEÇÃO 1: Identificação do Item */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  1. Identificação do Item (Obrigatórios)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Tipo de Equipamento */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Equipamento *
                  </label>
                  <select
                    id="select-equipment-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as EquipmentType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Classificação primária do item para inventário patrimonial.
                  </p>
                </div>

                {/* Número de Patrimônio / Tag */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Número de Patrimônio / Tag *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">10 a 12 chars</span>
                  </div>
                  <div className="relative">
                    <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="input-equipment-tag"
                      type="text"
                      required
                      value={tag}
                      onChange={handleTagChange}
                      placeholder="PAT-000000"
                      className="w-full pl-9 pr-3.5 py-2.5 font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Código colado na carcaça. Exemplo: <strong>PAT-001234</strong>
                  </p>
                </div>

                {/* Número de Série (S/N) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Número de Série (Serial Number / S/N) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {serialNumber.length}/25
                    </span>
                  </div>
                  <input
                    id="input-equipment-serial"
                    type="text"
                    required
                    maxLength={25}
                    value={serialNumber}
                    onChange={handleSerialChange}
                    placeholder="ex.: 5CD9284KZL ou R52N40AB92"
                    className="w-full px-3.5 py-2.5 font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Serial de fábrica gravado no chassi ou BIOS (alfanumérico maiúsculas).
                  </p>
                </div>

                {/* Marca e Modelo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Marca e Modelo *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {brandModel.length}/40
                    </span>
                  </div>
                  <input
                    id="input-equipment-model"
                    type="text"
                    required
                    maxLength={40}
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="ex.: Dell Latitude 3420 ou Samsung Galaxy A15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Identificação comercial do hardware (limite de ~40 caracteres).
                  </p>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: Condições e Acessórios */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  2. Condições e Acessórios
                </h3>
              </div>

              {/* Acessórios Inclusos */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Acessórios Inclusos (Seleção Múltipla)
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {DEFAULT_ACCESSORIES.map((acc) => {
                    const isChecked = selectedAccessories.includes(acc);
                    return (
                      <label
                        key={acc}
                        className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg border text-xs cursor-pointer transition-all min-h-[44px] ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAccessory(acc)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0"
                        />
                        <span className="leading-snug">{acc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Estado de Conservação / Avarias */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Estado de Conservação / Avarias Prévias
                  </label>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      conditionNotes.length >= 100 && conditionNotes.length <= 140
                        ? 'bg-emerald-100 text-emerald-800'
                        : conditionNotes.length > 0 && conditionNotes.length < 100
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {conditionNotes.length}/140 chars {conditionNotes.length < 100 && conditionNotes.length > 0 ? '(mín. 100 recomendados)' : ''}
                  </span>
                </div>
                <textarea
                  id="textarea-equipment-condition"
                  rows={3}
                  maxLength={140}
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="Descreva arranhões, trincas, estado da bateria ou desgastes na carcaça. (Recomendado entre 100 e 140 caracteres para auditoria precisa)"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Registros detalhados previnem disputas em devoluções ou auditorias patrimoniais.
                </p>
              </div>
            </div>

            {/* SEÇÃO 3: Controle da Movimentação */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  3. Controle da Movimentação & Termo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* Data de Retirada */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data de Retirada / Entrada *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="input-equipment-checkout-date"
                      type="date"
                      required
                      value={checkoutDate}
                      onChange={(e) => setCheckoutDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Preenchida automaticamente com o dia atual por padrão.
                  </p>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-0.5">Status Padrão de Entrada:</span>
                    O equipamento será disponibilizado como <span className="font-bold text-emerald-700">"Disponível"</span> no estoque pronto para entregas ou trocas.
                  </div>
                </div>
              </div>

              {/* Termo de Responsabilidade */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="checkbox-responsibility-term"
                    type="checkbox"
                    required
                    checked={responsibilityTermAccepted}
                    onChange={(e) => setResponsibilityTermAccepted(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0"
                  />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      Aceite do Termo de Responsabilidade Patrimonial *
                    </span>
                    Declaro para os devidos fins que o equipamento acima identificado foi vistoriado
                    e cadastrado conforme os padrões técnicos e patrimoniais da organização, ficando
                    sob custódia do almoxarifado/suporte de TI até sua entrega formal ao usuário requisitante.
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleTabSwitch('list')}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Cancelar
              </button>

              <button
                id="btn-submit-equipment"
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>Cadastrar Equipamento no Inventário</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
