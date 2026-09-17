import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowRight, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Plus, 
  Eye, 
  ShieldCheck, 
  X, 
  MapPin, 
  User, 
  Wrench, 
  Cpu,
  Boxes,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  MovementRecord, 
  Equipment, 
  OldEquipmentCondition, 
  OldEquipmentDestination, 
  UserProfile 
} from '../types';
import { SignatureCanvas } from './SignatureCanvas';

interface MovementHistoryScreenProps {
  movements: MovementRecord[];
  equipments: Equipment[];
  currentUser: UserProfile;
  onAddMovement: (record: MovementRecord) => void;
  openNewTransferDirectly?: boolean;
}

export const MovementHistoryScreen: React.FC<MovementHistoryScreenProps> = ({
  movements,
  equipments,
  currentUser,
  onAddMovement,
  openNewTransferDirectly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(openNewTransferDirectly);
  const [selectedMovementForDetail, setSelectedMovementForDetail] = useState<MovementRecord | null>(null);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  // FORM STATE: Dados da Substituição (De -> Para)
  // Equipamento Antigo (Recolhido)
  const [oldTag, setOldTag] = useState('');
  const [oldSerial, setOldSerial] = useState('');
  const [oldCondition, setOldCondition] = useState<OldEquipmentCondition>('Defeito');
  const [oldDestination, setOldDestination] = useState<OldEquipmentDestination>('Devolução ao Almoxarifado');

  // Equipamento Novo (Entregue)
  const [newTag, setNewTag] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newBrandModel, setNewBrandModel] = useState('');
  const [newHostname, setNewHostname] = useState('');

  // Localização e Usuário
  const [sectorLocation, setSectorLocation] = useState('');
  const [userName, setUserName] = useState('');
  const [userRegistration, setUserRegistration] = useState('');

  // Validação Técnica e Procedimentos
  const [dataBackupDone, setDataBackupDone] = useState(true);
  const [domainAdJoined, setDomainAdJoined] = useState(true);
  const [printersMapped, setPrintersMapped] = useState(true);
  const [userProfileConfigured, setUserProfileConfigured] = useState(true);
  const [techResponsible, setTechResponsible] = useState(currentUser.matricula);

  // Encerramento e Auditoria
  const [acceptanceTermSigned, setAcceptanceTermSigned] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');

  // Quick picker from inventory for new equipment
  const handleSelectFromInventory = (eq: Equipment) => {
    setNewTag(eq.tag);
    setNewSerial(eq.serialNumber);
    setNewBrandModel(eq.brandModel);
    if (!newHostname) {
      setNewHostname('CORP-NB-' + eq.tag.replace(/[^0-9]/g, '').slice(-4));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptanceTermSigned) {
      alert('É necessário marcar o aceite do termo do usuário.');
      return;
    }

    if (!oldTag.trim() || !newTag.trim()) {
      alert('Informe os números de patrimônio do equipamento antigo e novo.');
      return;
    }

    if (!userName.trim() || !userRegistration.trim() || !sectorLocation.trim()) {
      alert('Preencha os dados do setor e do usuário responsável.');
      return;
    }

    // Timestamp gerado automaticamente no momento da conclusão do atendimento
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;

    const newRecord: MovementRecord = {
      id: 'mov-' + Date.now(),
      timestamp: formattedTimestamp,
      oldEquipment: {
        tag: oldTag.trim().toUpperCase(),
        serialNumber: oldSerial.trim().toUpperCase(),
        condition: oldCondition,
        destination: oldDestination,
      },
      newEquipment: {
        tag: newTag.trim().toUpperCase(),
        serialNumber: newSerial.trim().toUpperCase(),
        brandModel: newBrandModel.trim(),
        hostname: newHostname.trim().toUpperCase(),
      },
      locationUser: {
        sectorLocation: sectorLocation.trim(),
        userName: userName.trim(),
        userRegistration: userRegistration.trim().toUpperCase(),
      },
      checklist: {
        dataBackupDone,
        domainAdJoined,
        printersMapped,
        userProfileConfigured,
      },
      techResponsible: techResponsible.trim(),
      auditClosure: {
        acceptanceTermSigned,
        signatureDataUrl,
        signerName: userName.trim(),
        technicalNotes: technicalNotes.trim(),
      },
    };

    onAddMovement(newRecord);
    setIsModalOpen(false);

    // Reset fields
    setOldTag('');
    setOldSerial('');
    setNewTag('');
    setNewSerial('');
    setNewBrandModel('');
    setNewHostname('');
    setSectorLocation('');
    setUserName('');
    setUserRegistration('');
    setTechnicalNotes('');
    setAcceptanceTermSigned(false);
    setSignatureDataUrl('');
  };

  const filteredMovements = movements.filter((mov) => {
    const matchesSearch =
      mov.oldEquipment.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.newEquipment.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.locationUser.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.locationUser.sectorLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.techResponsible.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDestination =
      filterDestination === 'all' || mov.oldEquipment.destination === filterDestination;
    const matchesCondition =
      filterCondition === 'all' || mov.oldEquipment.condition === filterCondition;

    return matchesSearch && matchesDestination && matchesCondition;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Auditoria e Logística Reversa</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Histórico de Movimentação de Bens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rastreabilidade total: o que saiu, o que entrou, onde foi instalado, quem recebeu e qual técnico executou.
          </p>
        </div>

        <button
          id="btn-open-new-transfer"
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Fazer Nova Transferência (De ➔ Para)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-movements"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patrimônio, técnico, colaborador, setor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">Destino Antigo (Todos)</option>
            <option value="Estoque Reserva">Estoque Reserva</option>
            <option value="Descarte/Leilão">Descarte/Leilão</option>
            <option value="Devolução ao Almoxarifado">Devolução ao Almoxarifado</option>
          </select>

          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">Estado Antigo (Todos)</option>
            <option value="Funcional">Funcional</option>
            <option value="Defeito">Defeito</option>
            <option value="Sucata">Sucata</option>
          </select>
        </div>
      </div>

      {/* Movements Timeline Table / Card Grid */}
      <div className="space-y-4">
        {filteredMovements.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">Nenhum registro de movimentação encontrado</p>
            <p className="text-xs text-slate-400 mt-1">
              Cadastre uma nova substituição pelo botão acima para alimentar o histórico.
            </p>
          </div>
        ) : (
          filteredMovements.map((mov) => {
            const checklistCount = Object.values(mov.checklist).filter(Boolean).length;

            return (
              <div
                key={mov.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all overflow-hidden"
              >
                {/* Card Header with Timestamp and Tech */}
                <div className="bg-slate-50/80 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ID: {mov.id}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mov.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Técnico Executor:</span>
                    <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {mov.techResponsible}
                    </span>
                  </div>
                </div>

                {/* Card Body: De -> Para and Location/Receiver */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: O QUE SAIU vs O QUE ENTROU */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                    {/* O que saiu */}
                    <div className="sm:col-span-5 p-3.5 rounded-lg bg-red-50/40 border border-red-200/70">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                          ◀ O que saiu (Recolhido)
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            mov.oldEquipment.condition === 'Defeito'
                              ? 'bg-amber-100 text-amber-800'
                              : mov.oldEquipment.condition === 'Sucata'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {mov.oldEquipment.condition}
                        </span>
                      </div>
                      <p className="font-mono font-bold text-sm text-slate-900">
                        {mov.oldEquipment.tag}
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                        S/N: {mov.oldEquipment.serialNumber}
                      </p>
                      <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-slate-600">
                        <span className="text-slate-400 block text-[10px]">DESTINO LOGÍSTICO:</span>
                        <span className="font-medium text-slate-800">
                          {mov.oldEquipment.destination}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Divider */}
                    <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* O que entrou */}
                    <div className="sm:col-span-5 p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-200/70">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          ▶ O que entrou (Entregue)
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                          NOVO ATIVO
                        </span>
                      </div>
                      <p className="font-mono font-bold text-sm text-slate-900">
                        {mov.newEquipment.tag}
                      </p>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {mov.newEquipment.brandModel}
                      </p>
                      <div className="mt-2 pt-2 border-t border-emerald-100 text-[11px] text-slate-600">
                        <span className="text-slate-400 block text-[10px]">HOSTNAME / S/N:</span>
                        <span className="font-mono font-semibold text-blue-700">
                          {mov.newEquipment.hostname}
                        </span>{' '}
                        <span className="font-mono text-slate-500">
                          ({mov.newEquipment.serialNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Onde foi & Quem recebeu & Auditoria */}
                  <div className="lg:col-span-5 space-y-3 bg-slate-50/60 p-3.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> Onde foi instalado:
                      </span>
                      <p className="font-medium text-slate-800 mt-0.5">
                        {mov.locationUser.sectorLocation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" /> Quem recebeu:
                        </span>
                        <p className="font-semibold text-slate-900 mt-0.5">
                          {mov.locationUser.userName}
                        </p>
                        <p className="font-mono text-[10px] text-slate-500">
                          {mov.locationUser.userRegistration}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Checklist de Migração:
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              checklistCount === 4
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {checklistCount}/4 Validados
                          </span>
                        </div>
                      </div>
                    </div>

                    {mov.auditClosure.technicalNotes && (
                      <div className="pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">
                          Observações Técnicas:
                        </span>
                        <p className="text-[11px] text-slate-600 italic">
                          "{mov.auditClosure.technicalNotes}"
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Termo Assinado Digitalmente</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedMovementForDetail(mov)}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Termo Completo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: REGISTRO DE NOVA TRANSFERÊNCIA (DE -> PARA) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  Nova Movimentação e Substituição de Equipamento (De ➔ Para)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preencha os dados do equipamento recolhido, equipamento novo entregue e validações de entrega.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Quick Pick From Inventory */}
              {equipments.filter((e) => e.status === 'Disponível').length > 0 && (
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs">
                  <span className="font-semibold text-blue-900 block mb-1.5">
                    Preenchimento Rápido com Ativo Disponível no Inventário:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {equipments
                      .filter((e) => e.status === 'Disponível')
                      .slice(0, 4)
                      .map((eq) => (
                        <button
                          key={eq.id}
                          type="button"
                          onClick={() => handleSelectFromInventory(eq)}
                          className="px-2.5 py-1 bg-white hover:bg-blue-100 text-slate-800 border border-blue-200 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <span className="text-blue-700 font-bold">{eq.tag}</span>
                          <span className="text-slate-500 font-sans">({eq.brandModel})</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* SEÇÃO 1: Dados da Substituição (De -> Para) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Equipamento Antigo (Recolhido) */}
                <div className="p-4 rounded-xl bg-red-50/30 border border-red-200 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-red-200/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                      Equipamento Antigo (Recolhido)
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patrimônio Antigo *
                    </label>
                    <input
                      type="text"
                      required
                      value={oldTag}
                      onChange={(e) => setOldTag(e.target.value.toUpperCase())}
                      placeholder="PAT-001432"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de Série (S/N) *
                    </label>
                    <input
                      type="text"
                      required
                      value={oldSerial}
                      onChange={(e) => setOldSerial(e.target.value.toUpperCase())}
                      placeholder="HP49201991BB"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estado de Conservação *
                      </label>
                      <select
                        value={oldCondition}
                        onChange={(e) => setOldCondition(e.target.value as OldEquipmentCondition)}
                        className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Defeito">Defeito</option>
                        <option value="Funcional">Funcional</option>
                        <option value="Sucata">Sucata</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Destino do Item Antigo *
                      </label>
                      <select
                        value={oldDestination}
                        onChange={(e) => setOldDestination(e.target.value as OldEquipmentDestination)}
                        className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Devolução ao Almoxarifado">Devolução ao Almoxarifado</option>
                        <option value="Estoque Reserva">Estoque Reserva</option>
                        <option value="Descarte/Leilão">Descarte/Leilão</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Equipamento Novo (Entregue) */}
                <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Equipamento Novo (Entregue)
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patrimônio Novo *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value.toUpperCase())}
                        placeholder="PAT-004521"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Série *
                      </label>
                      <input
                        type="text"
                        required
                        value={newSerial}
                        onChange={(e) => setNewSerial(e.target.value.toUpperCase())}
                        placeholder="BR5492810X99"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marca e Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBrandModel}
                      onChange={(e) => setNewBrandModel(e.target.value)}
                      placeholder="Dell Latitude 3420"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hostname / Nome na Rede *
                    </label>
                    <input
                      type="text"
                      required
                      value={newHostname}
                      onChange={(e) => setNewHostname(e.target.value.toUpperCase())}
                      placeholder="ex.: CORP-NB-8821"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: Localização e Usuário */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Localização e Usuário
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Colaborador *
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Fernanda Vasconcelos"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Matrícula do Usuário *
                    </label>
                    <input
                      type="text"
                      required
                      value={userRegistration}
                      onChange={(e) => setUserRegistration(e.target.value.toUpperCase())}
                      placeholder="MAT-3391"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Setor / Lotação Exata *
                    </label>
                    <input
                      type="text"
                      required
                      value={sectorLocation}
                      onChange={(e) => setSectorLocation(e.target.value)}
                      placeholder="Financeiro - 3º Andar - Sala 304"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: Validação Técnica e Procedimentos */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Validação Técnica e Procedimentos (Checklist de Migração)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Técnico Responsável: <strong className="text-slate-800">{techResponsible}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={dataBackupDone}
                      onChange={(e) => setDataBackupDone(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Backup de dados realizado</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={domainAdJoined}
                      onChange={(e) => setDomainAdJoined(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Ingressada no domínio/AD</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={printersMapped}
                      onChange={(e) => setPrintersMapped(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Impressoras mapeadas</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={userProfileConfigured}
                      onChange={(e) => setUserProfileConfigured(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Perfil de usuário configurado</span>
                  </label>
                </div>
              </div>

              {/* SEÇÃO 4: Encerramento e Auditoria */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Encerramento e Auditoria
                  </h3>
                </div>

                {/* Observações Técnicas */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Observações Técnicas (Incidentes da troca)
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {technicalNotes.length}/150 caracteres
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={150}
                    value={technicalNotes}
                    onChange={(e) => setTechnicalNotes(e.target.value)}
                    placeholder="ex.: Cabo de rede crimpado novamente; migração concluída sem perda de dados."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Termo de Aceite Checkbox */}
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={acceptanceTermSigned}
                      onChange={(e) => setAcceptanceTermSigned(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900">
                        Termo de Aceite do Usuário / Responsável (Obrigatório) *
                      </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        Atesto que a máquina nova está 100% operacional, os dados foram validados e o
                        equipamento antigo foi entregue para a equipe de campo.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Interactive Signature Canvas */}
                <SignatureCanvas
                  signerName={userName || 'Colaborador'}
                  onSaveSignature={(dataUrl) => setSignatureDataUrl(dataUrl)}
                />
              </div>

              {/* Submit / Cancel Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>

                <button
                  id="btn-confirm-transfer"
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Movimentação e Gerar Termo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: VISUALIZADOR DE TERMO & AUDITORIA */}
      {selectedMovementForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Comprovante de Movimentação de Bens
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-xs text-slate-600 hover:text-blue-600 p-1.5 rounded hover:bg-slate-100 flex items-center gap-1"
                  title="Imprimir"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMovementForDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">TERMO DE SUBSTITUIÇÃO PATRIMONIAL</p>
                  <p className="text-slate-500">Registro ID: {selectedMovementForDetail.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-slate-700">{selectedMovementForDetail.timestamp}</p>
                  <p className="text-emerald-700 font-semibold">Status: Concluído e Auditado</p>
                </div>
              </div>

              {/* De -> Para Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 font-bold text-slate-700">Fluxo</th>
                      <th className="p-2.5 font-bold text-slate-700">Patrimônio</th>
                      <th className="p-2.5 font-bold text-slate-700">Serial S/N</th>
                      <th className="p-2.5 font-bold text-slate-700">Detalhe / Destino</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-red-50/30">
                      <td className="p-2.5 font-semibold text-red-700">SAIU (Recolhido)</td>
                      <td className="p-2.5 font-mono font-bold">
                        {selectedMovementForDetail.oldEquipment.tag}
                      </td>
                      <td className="p-2.5 font-mono">
                        {selectedMovementForDetail.oldEquipment.serialNumber}
                      </td>
                      <td className="p-2.5">
                        {selectedMovementForDetail.oldEquipment.condition} ➔ Destino:{' '}
                        <strong>{selectedMovementForDetail.oldEquipment.destination}</strong>
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/30">
                      <td className="p-2.5 font-semibold text-emerald-700">ENTROU (Entregue)</td>
                      <td className="p-2.5 font-mono font-bold">
                        {selectedMovementForDetail.newEquipment.tag}
                      </td>
                      <td className="p-2.5 font-mono">
                        {selectedMovementForDetail.newEquipment.serialNumber}
                      </td>
                      <td className="p-2.5">
                        {selectedMovementForDetail.newEquipment.brandModel} (Host:{' '}
                        <strong>{selectedMovementForDetail.newEquipment.hostname}</strong>)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Local e Colaborador */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Setor de Instalação:
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {selectedMovementForDetail.locationUser.sectorLocation}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Colaborador / Matrícula:
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {selectedMovementForDetail.locationUser.userName} (
                    {selectedMovementForDetail.locationUser.userRegistration})
                  </p>
                </div>
              </div>

              {/* Checklist Realizado */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-2">
                  Checklist Técnico Concluído:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Backup de dados realizado
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ingressada no domínio/AD
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Impressoras mapeadas
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perfil de usuário configurado
                  </span>
                </div>
              </div>

              {/* Assinatura / Aceite */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                  Assinatura do Recebedor / Aceite Digital:
                </span>
                {selectedMovementForDetail.auditClosure.signatureDataUrl ? (
                  <div className="border border-slate-200 rounded p-2 bg-slate-50 flex items-center justify-center">
                    <img
                      src={selectedMovementForDetail.auditClosure.signatureDataUrl}
                      alt="Assinatura"
                      className="max-h-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-slate-500 font-mono text-[11px]">
                    ACEITE DIGITAL CONFIRMADO POR{' '}
                    {selectedMovementForDetail.auditClosure.signerName.toUpperCase()}
                  </div>
                )}
                <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                  <span>Técnico Responsável: {selectedMovementForDetail.techResponsible}</span>
                  <span>Autenticação: TOKEN-SHA256-VERIFIED</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setSelectedMovementForDetail(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
