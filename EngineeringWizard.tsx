import React, { useState, useEffect } from "react";
import { performPumpSelection, SelectionInput, SelectionResult } from "../data/expertEngine";
import { 
  Droplets, Calculator, HelpCircle, FileText, Settings, Shield, Award, 
  CheckCircle, AlertTriangle, ArrowRight, Gauge, Info, Activity, MapPin, Zap, Disc
} from "lucide-react";

interface EngineeringWizardProps {
  onUpdateInput: (input: SelectionInput, result: SelectionResult | null) => void;
  activeInput: SelectionInput;
  onNavigateToProposal: () => void;
}

export default function EngineeringWizard({ onUpdateInput, activeInput, onNavigateToProposal }: EngineeringWizardProps) {
  // 15 Parameter States
  const [kuyuDerinligi, setKuyuDerinligi] = useState<number | null>(activeInput.kuyuDerinligi || null);
  const [statikSuSeviyesi, setStatikSuSeviyesi] = useState<number | null>(activeInput.statikSuSeviyesi || null);
  const [dinamikSuSeviyesi, setDinamikSuSeviyesi] = useState<number | null>(activeInput.dinamikSuSeviyesi || null);
  const [kuyuCapi, setKuyuCapi] = useState<string>(activeInput.kuyuCapi || "");
  const [elektrikTipi, setElektrikTipi] = useState<"Monofaze" | "Trifaze" | null>(activeInput.elektrikTipi || null);
  const [sulamaYontemi, setSulamaYontemi] = useState<string>(activeInput.sulamaYontemi || "");
  const [kullanimAmaci, setKullanimAmaci] = useState<string>(activeInput.kullanimAmaci || "");
  const [saatlikSuIhtiyaci, setSaatlikSuIhtiyaci] = useState<number | null>(activeInput.saatlikSuIhtiyaci || null);
  const [fiskiyeSayisi, setFiskiyeSayisi] = useState<number | null>(activeInput.fiskiyeSayisi || null);
  const [fiskiyeBasiSuIhtiyaci, setFiskiyeBasiSuIhtiyaci] = useState<number | null>(activeInput.fiskiyeBasiSuIhtiyaci || null);
  const [anaBoruUzunlugu, setAnaBoruUzunlugu] = useState<number | null>(activeInput.anaBoruUzunlugu || null);
  const [boruCapi, setBoruCapi] = useState<number | null>(activeInput.boruCapi || null);
  const [kotFarki, setKotFarki] = useState<number | null>(activeInput.kotFarki || null);
  const [basilacakEnUzakNokta, setBasilacakEnUzakNokta] = useState<string>(activeInput.basilacakEnUzakNokta || "");
  const [gunlukCalismaSuresi, setGunlukCalismaSuresi] = useState<number | null>(activeInput.gunlukCalismaSuresi || null);

  // Flow Calculator States
  const [showCalcHelper, setShowCalcHelper] = useState<boolean>(false);
  const [calcMethod, setCalcMethod] = useState<"sprinkler" | "drip" | "tank">("sprinkler");
  const [sprinklerCount, setSprinklerCount] = useState<number>(12);
  const [sprinklerFlow, setSprinklerFlow] = useState<number>(1.8);
  const [dripLineLength, setDripLineLength] = useState<number>(1500);
  const [dripperSpacing, setDripperSpacing] = useState<number>(33);
  const [dripperFlow, setDripperFlow] = useState<number>(2.0);
  const [tankVolume, setTankVolume] = useState<number>(30);
  const [tankFillTime, setTankFillTime] = useState<number>(5);

  const [result, setResult] = useState<SelectionResult | null>(null);

  // Sync state when reset globally or updated from chat
  useEffect(() => {
    if (!activeInput.kuyuDerinligi || activeInput.kuyuDerinligi === 0) {
      setKuyuDerinligi(null);
      setStatikSuSeviyesi(null);
      setDinamikSuSeviyesi(null);
      setKuyuCapi("");
      setElektrikTipi(null);
      setSulamaYontemi("");
      setKullanimAmaci("");
      setSaatlikSuIhtiyaci(null);
      setFiskiyeSayisi(null);
      setFiskiyeBasiSuIhtiyaci(null);
      setAnaBoruUzunlugu(null);
      setBoruCapi(null);
      setKotFarki(null);
      setBasilacakEnUzakNokta("");
      setGunlukCalismaSuresi(null);
      setResult(null);
    } else {
      setKuyuDerinligi(activeInput.kuyuDerinligi);
      setStatikSuSeviyesi(activeInput.statikSuSeviyesi || null);
      setDinamikSuSeviyesi(activeInput.dinamikSuSeviyesi || null);
      setKuyuCapi(activeInput.kuyuCapi || "");
      setElektrikTipi(activeInput.elektrikTipi || null);
      setSulamaYontemi(activeInput.sulamaYontemi || "");
      setKullanimAmaci(activeInput.kullanimAmaci || "");
      setSaatlikSuIhtiyaci(activeInput.saatlikSuIhtiyaci || null);
      setFiskiyeSayisi(activeInput.fiskiyeSayisi || null);
      setFiskiyeBasiSuIhtiyaci(activeInput.fiskiyeBasiSuIhtiyaci || null);
      setAnaBoruUzunlugu(activeInput.anaBoruUzunlugu || null);
      setBoruCapi(activeInput.boruCapi || null);
      setKotFarki(activeInput.kotFarki || null);
      setBasilacakEnUzakNokta(activeInput.basilacakEnUzakNokta || "");
      setGunlukCalismaSuresi(activeInput.gunlukCalismaSuresi || null);
    }
  }, [
    activeInput.kuyuDerinligi,
    activeInput.statikSuSeviyesi,
    activeInput.dinamikSuSeviyesi,
    activeInput.kuyuCapi,
    activeInput.elektrikTipi,
    activeInput.sulamaYontemi,
    activeInput.kullanimAmaci,
    activeInput.saatlikSuIhtiyaci,
    activeInput.fiskiyeSayisi,
    activeInput.fiskiyeBasiSuIhtiyaci,
    activeInput.anaBoruUzunlugu,
    activeInput.boruCapi,
    activeInput.kotFarki,
    activeInput.basilacakEnUzakNokta,
    activeInput.gunlukCalismaSuresi
  ]);

  // Recalculate on input changes
  useEffect(() => {
    if (kuyuDerinligi && kuyuDerinligi > 0 && saatlikSuIhtiyaci && saatlikSuIhtiyaci > 0 && elektrikTipi && kuyuCapi && sulamaYontemi) {
      const input: SelectionInput = {
        kuyuDerinligi,
        statikSuSeviyesi: statikSuSeviyesi || Math.round(kuyuDerinligi * 0.3),
        dinamikSuSeviyesi: dinamikSuSeviyesi || Math.round(kuyuDerinligi * 0.45),
        kuyuCapi,
        elektrikTipi,
        sulamaYontemi,
        kullanimAmaci: kullanimAmaci || "Tarımsal Sulama",
        saatlikSuIhtiyaci,
        fiskiyeSayisi: fiskiyeSayisi || 0,
        fiskiyeBasiSuIhtiyaci: fiskiyeBasiSuIhtiyaci || 0,
        anaBoruUzunlugu: anaBoruUzunlugu || 100,
        boruCapi: boruCapi || 50,
        kotFarki: kotFarki || 15,
        basilacakEnUzakNokta: basilacakEnUzakNokta || "Depo",
        gunlukCalismaSuresi: gunlukCalismaSuresi || 6
      };

      const res = performPumpSelection(input);
      setResult(res);
      onUpdateInput(input, res);
    } else {
      setResult(null);
    }
  }, [
    kuyuDerinligi,
    statikSuSeviyesi,
    dinamikSuSeviyesi,
    kuyuCapi,
    elektrikTipi,
    sulamaYontemi,
    kullanimAmaci,
    saatlikSuIhtiyaci,
    fiskiyeSayisi,
    fiskiyeBasiSuIhtiyaci,
    anaBoruUzunlugu,
    boruCapi,
    kotFarki,
    basilacakEnUzakNokta,
    gunlukCalismaSuresi
  ]);

  const isAllRequiredFilled = 
    (kuyuDerinligi || 0) > 0 && 
    (saatlikSuIhtiyaci || 0) > 0 && 
    !!kuyuCapi && 
    !!elektrikTipi && 
    !!sulamaYontemi &&
    (dinamikSuSeviyesi || 0) > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="wizard-panel">
      
      {/* Parameters Panel */}
      <div className="lg:col-span-2 space-y-6" id="wizard-parameters">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Mühendislik Sihirbazı (15 Parametre Girişi)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sondaj, arazi tesisatı, boru çapları ve sulama yöntemi verilerini tam dürüstlükle girin.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="params-form">
            
            {/* 1. Sondaj Kuyu Verileri */}
            <div className="col-span-1 md:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Kuyu Yapısı & Hidrolik Seviyeler
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Kuyu Toplam Derinliği (metre)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={kuyuDerinligi || ""}
                      placeholder="Örn: 120"
                      onChange={(e) => setKuyuDerinligi(Math.max(0, parseInt(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Kuyu Borusu İç Çapı</label>
                  <select
                    value={kuyuCapi}
                    onChange={(e) => setKuyuCapi(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="4">4 inç (100-110 mm)</option>
                    <option value="5">5 inç (125-140 mm)</option>
                    <option value="6">6 inç (150-165 mm)</option>
                    <option value="8">8 inç (200 mm)</option>
                    <option value="10">10 inç (250 mm)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Statik Su Seviyesi (Metre)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={statikSuSeviyesi || ""}
                      placeholder="Örn: 30"
                      onChange={(e) => setStatikSuSeviyesi(Math.max(0, parseInt(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block font-medium">Motor çalışmıyorken ölçülen su durgun dikey derinliği.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Dinamik Su Seviyesi (Metre)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={dinamikSuSeviyesi || ""}
                      placeholder="Örn: 45"
                      onChange={(e) => setDinamikSuSeviyesi(Math.max(0, parseInt(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block font-medium">Motor sürekli çalışırken suyun geri çekildiği dikey seviye.</span>
                </div>
              </div>
            </div>

            {/* 2. Elektrik, Sulama ve Amacı */}
            <div className="col-span-1 md:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Elektrik Şebekesi & Sulama Amacı
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Şebeke Elektrik Tipi</label>
                  <select
                    value={elektrikTipi || ""}
                    onChange={(e) => setElektrikTipi(e.target.value as "Monofaze" | "Trifaze" || null)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="Monofaze">Monofaze (220V - Ev / Şehir Hattı)</option>
                    <option value="Trifaze">Trifaze (380V - Tarım / Sanayi Hattı)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Kullanım Amacı</label>
                  <select
                    value={kullanimAmaci}
                    onChange={(e) => setKullanimAmaci(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="Tarımsal Sulama">Tarımsal Sulama</option>
                    <option value="İçme Suyu Temini">İçme Suyu Temini</option>
                    <option value="Hayvancılık / Mandıra">Hayvancılık / Mandıra</option>
                    <option value="Sanayi / Fabrika Tesisleri">Sanayi / Fabrika Tesisleri</option>
                    <option value="Bahçe / Peyzaj Sulama">Bahçe / Peyzaj Sulama</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Sulama / İşletme Yöntemi</label>
                  <select
                    value={sulamaYontemi}
                    onChange={(e) => setSulamaYontemi(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="Damlama">Damlama Sulama (Asgari 1.5 bar deşarj basıncı)</option>
                    <option value="Yağmurlama">Yağmurlama / Fıskiye (Asgari 2.5 bar deşarj basıncı)</option>
                    <option value="Salma Sulama">Salma Sulama (Serbest döküş - 0 bar)</option>
                    <option value="Depo Dolumu">Depo / Havuz Dolumu (Serbest - 0 bar)</option>
                    <option value="Ev/Villa">Ev / Villa Şebekesi (Asgari 3.0 bar basınç)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Günlük Çalışma Süresi (Saat)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={gunlukCalismaSuresi || ""}
                      placeholder="Örn: 6"
                      onChange={(e) => setGunlukCalismaSuresi(Math.max(1, Math.min(24, parseInt(e.target.value) || 0)) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">saat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Arazi Tesisatı & Borular */}
            <div className="col-span-1 md:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Arazi Yatay Tesisat & Boru Verileri
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Ana Boru Uzunluğu (Yatay - metre)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={anaBoruUzunlugu !== null ? anaBoruUzunlugu : ""}
                      placeholder="Örn: 100"
                      onChange={(e) => setAnaBoruUzunlugu(Math.max(0, parseInt(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Basma Borusu Dış Çapı (mm)</label>
                  <select
                    value={boruCapi || ""}
                    onChange={(e) => setBoruCapi(parseInt(e.target.value) || null)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    <option value="25">25 mm (1\")</option>
                    <option value="32">32 mm (1 1/4\")</option>
                    <option value="40">40 mm (1 1/2\")</option>
                    <option value="50">50 mm (2\")</option>
                    <option value="63">63 mm (2 1/2\")</option>
                    <option value="75">75 mm (3\")</option>
                    <option value="90">90 mm (4\")</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Kot Dikey Farkı (Metre)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={kotFarki !== null ? kotFarki : ""}
                      placeholder="Örn: 15"
                      onChange={(e) => setKotFarki(Math.max(0, parseInt(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block font-medium">Kuyu başı ile deşarj noktası arasındaki dikey rakım farkı.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Basılacak En Uzak Nokta Tanımı</label>
                  <input
                    type="text"
                    value={basilacakEnUzakNokta}
                    placeholder="Örn: Tepe Depo, 5. Parsel Tarla, vb."
                    onChange={(e) => setBasilacakEnUzakNokta(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 4. Debi ve Fıskiye Özelleştirmeleri */}
            <div className="col-span-1 md:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Akış (Debi Q) & Yağmurlama Fıskiye Özellikleri
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 block">Saatlik İstenen Debi Akışı (m³/h)</label>
                    <button
                      type="button"
                      onClick={() => setShowCalcHelper(!showCalcHelper)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md border border-blue-100 transition-colors"
                    >
                      {showCalcHelper ? "Yardımcıyı Kapat" : "İhtiyacıma Göre Hesapla"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={saatlikSuIhtiyaci || ""}
                      placeholder="Örn: 5.5"
                      onChange={(e) => setSaatlikSuIhtiyaci(Math.max(0, parseFloat(e.target.value) || 0) || null)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-lg">m³/h</span>
                  </div>
                </div>

                {/* Optional Calculator Helper */}
                {showCalcHelper && (
                  <div className="col-span-1 sm:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-inner space-y-4 animate-fade-in" id="wizard-calc-helper">
                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1 text-[10px] font-bold" id="wizard-calc-tabs">
                      {[
                        { id: "sprinkler", label: "Yağmurlama Tabanca" },
                        { id: "drip", label: "Damlama Hatları" },
                        { id: "tank", label: "Açık Depo / Havuz" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCalcMethod(tab.id as "sprinkler" | "drip" | "tank")}
                          className={`flex-1 py-1 rounded-md transition-all ${
                            calcMethod === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {calcMethod === "sprinkler" && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Aktif Fıskiye Sayısı</span>
                          <input
                            type="number"
                            value={sprinklerCount}
                            onChange={(e) => setSprinklerCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Fıskiye Başı Debi (m³/saat)</span>
                          <input
                            type="number"
                            step="0.1"
                            value={sprinklerFlow}
                            onChange={(e) => setSprinklerFlow(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {calcMethod === "drip" && (
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Damla Hortum Boyu (m)</span>
                          <input
                            type="number"
                            value={dripLineLength}
                            onChange={(e) => setDripLineLength(Math.max(10, parseInt(e.target.value) || 10))}
                            className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold text-[10px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Meme Mesafesi (cm)</span>
                          <input
                            type="number"
                            value={dripperSpacing}
                            onChange={(e) => setDripperSpacing(Math.max(10, parseInt(e.target.value) || 10))}
                            className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold text-[10px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Meme Akışı (L/saat)</span>
                          <input
                            type="number"
                            step="0.1"
                            value={dripperFlow}
                            onChange={(e) => setDripperFlow(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                            className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold text-[10px]"
                          />
                        </div>
                      </div>
                    )}

                    {calcMethod === "tank" && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Depo Dolum Hacmi (m³)</span>
                          <input
                            type="number"
                            value={tankVolume}
                            onChange={(e) => setTankVolume(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Hedef Süre (Saat)</span>
                          <input
                            type="number"
                            value={tankFillTime}
                            onChange={(e) => setTankFillTime(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-bold"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-blue-50 rounded-xl flex justify-between items-center text-xs border border-blue-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Önerilen Saatlik Debi Akışı:</span>
                        <span className="font-extrabold text-blue-800">
                          {(() => {
                            let flow = 0;
                            if (calcMethod === "sprinkler") flow = sprinklerCount * sprinklerFlow;
                            else if (calcMethod === "drip") flow = (dripLineLength / (dripperSpacing / 100)) * (dripperFlow / 1000);
                            else if (calcMethod === "tank") flow = tankVolume / tankFillTime;
                            return (Math.round(flow * 10) / 10).toFixed(1);
                          })()} m³/h
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          let flow = 0;
                          if (calcMethod === "sprinkler") {
                            flow = sprinklerCount * sprinklerFlow;
                            setFiskiyeSayisi(sprinklerCount);
                            setFiskiyeBasiSuIhtiyaci(sprinklerFlow * 1000);
                          } else if (calcMethod === "drip") {
                            flow = (dripLineLength / (dripperSpacing / 100)) * (dripperFlow / 1000);
                          } else if (calcMethod === "tank") {
                            flow = tankVolume / tankFillTime;
                          }
                          setSaatlikSuIhtiyaci(Math.round(flow * 10) / 10);
                          setShowCalcHelper(false);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle size={11} />
                        Sihirbaza Aktar
                      </button>
                    </div>
                  </div>
                )}

                {sulamaYontemi === "Yağmurlama" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 block">Fıskiye/Tabanca Sayısı (Adet)</label>
                      <input
                        type="number"
                        min="0"
                        value={fiskiyeSayisi !== null ? fiskiyeSayisi : ""}
                        placeholder="Örn: 12"
                        onChange={(e) => setFiskiyeSayisi(Math.max(0, parseInt(e.target.value) || 0) || null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 block">Fıskiye Başı Su İhtiyacı (Litre/Saat)</label>
                      <input
                        type="number"
                        min="0"
                        value={fiskiyeBasiSuIhtiyaci !== null ? fiskiyeBasiSuIhtiyaci : ""}
                        placeholder="Örn: 1800"
                        onChange={(e) => setFiskiyeBasiSuIhtiyaci(Math.max(0, parseInt(e.target.value) || 0) || null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Math Breakdown */}
        {result && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-fade-in" id="math-breakdown">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-blue-500" />
                  Mühendislik Hesaplama Detayı
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Dinamik seviye ve boru çapı sürtünme kayıpları dahil edilmiştir.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" id="math-grid">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Sürtünme Kaybı (Hf)</span>
                <span className="font-extrabold text-slate-800 text-sm">{result.frictionLoss} mSS</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Çıkış Basınç Kaybı</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {sulamaYontemi === "Damlama" ? "15" : sulamaYontemi === "Yağmurlama" ? "25" : sulamaYontemi === "Ev/Villa" ? "30" : "2"} m
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Su Derinliği + Kot</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {(dinamikSuSeviyesi || statikSuSeviyesi || 0) + (kotFarki || 0)} m
                </span>
              </div>
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200">
                <span className="text-blue-600 block font-bold mb-0.5">Toplam Yükseklik (TDH)</span>
                <span className="font-extrabold text-blue-800 text-base">{result.tdh} mSS</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schematic & Action Column */}
      <div className="space-y-6" id="wizard-schematic-column">
        
        {/* Schematic Well Diagram */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden h-[330px]" id="well-schematic">
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hidrolik Kuyu Şeması</span>
            <span className="text-[11px] font-bold text-blue-600 mt-0.5 block">H: {result?.tdh || 0} mSS | Q: {saatlikSuIhtiyaci || 0} m³/h</span>
          </div>

          <div className="w-full flex-1 flex items-stretch gap-6 relative mt-12" id="schematic-visualization">
            <div className="w-1/3 bg-slate-50 border border-slate-100 rounded-xl relative flex flex-col items-center justify-between p-2">
              <span className="text-[9px] text-slate-400 font-bold block text-center">YERÜSTÜ</span>
              <div className="w-2 bg-blue-300 absolute top-6 bottom-16 left-1/2 -translate-x-1/2"></div>
              
              <div className="w-6 h-16 bg-blue-600 rounded border border-blue-800 z-10 flex flex-col justify-between p-1 absolute bottom-12 left-1/2 -translate-x-1/2 shadow">
                <div className="w-full h-1 bg-white/40 rounded-full"></div>
                <span className="text-[8px] text-white font-extrabold text-center block leading-none">POMPA</span>
                <div className="w-full h-1 bg-white/40 rounded-full"></div>
              </div>

              <span className="text-[9px] text-slate-400 font-bold block text-center">TABAN ({kuyuDerinligi || 0}m)</span>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3 text-[11px]" id="schematic-details">
              <div className="border-l-2 border-blue-400 pl-3">
                <span className="text-slate-400 block text-[10px]">Statik Su Seviyesi</span>
                <span className="font-bold text-slate-800">{statikSuSeviyesi || "Boş"} m</span>
              </div>
              <div className="border-l-2 border-blue-600 pl-3">
                <span className="text-slate-400 block text-[10px]">Dinamik Su Seviyesi</span>
                <span className="font-bold text-slate-800">{dinamikSuSeviyesi || "Boş"} m</span>
              </div>
              <div className="border-l-2 border-amber-400 pl-3">
                <span className="text-slate-400 block text-[10px]">Kot Yükseklik Farkı</span>
                <span className="font-bold text-slate-800">{kotFarki || "Boş"} m</span>
              </div>
              <div className="border-l-2 border-slate-400 pl-3">
                <span className="text-slate-400 block text-[10px]">Yatay Boru / Çap</span>
                <span className="font-bold text-slate-800">{anaBoruUzunlugu || "Boş"} m / {boruCapi || "Boş"} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="wizard-actions">
          {isAllRequiredFilled ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex gap-2.5 text-xs text-emerald-800">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <strong className="block font-bold">Tüm Veriler Girildi!</strong>
                  <span>Gerekli 15 parametreniz tutarlı şekilde analiz edildi ve 3 farklı alternatif teklif hazırlandı.</span>
                </div>
              </div>

              <button
                onClick={onNavigateToProposal}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText size={15} />
                3 Farklı Sistem Teklifi Raporuna Geç 🚀
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-slate-500" id="wizard-pending-state">
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-center space-y-2">
                <Info size={20} className="mx-auto text-slate-400" />
                <p className="font-bold text-slate-700">Analiz Tamamlanmadı</p>
                <p className="text-[11px] leading-relaxed">
                  "Hızlı Seçim" sistem teklifinin ve performans grafiklerinin üretilebilmesi için asgari olarak; 
                  <strong className="text-slate-700"> Kuyu Derinliği, Dinamik Seviye, Debi, Elektrik Tipi, Kuyu Çapı ve Sulama Yöntemi </strong> 
                  girilmelidir.
                </p>
              </div>

              <button
                disabled
                className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
              >
                Teklif Hazırlanıyor... (Veri Eksik)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
