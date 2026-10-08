import React from "react";
import { Info, HelpCircle, Activity, Settings, TrendingUp, ShieldCheck } from "lucide-react";

export default function TechnicalGuide() {
  return (
    <div className="space-y-6" id="guide-panel">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" id="guide-intro">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Info className="text-blue-600" size={20} />
          <span>Dalgıç Pompa Seçim ve Montaj Kılavuzu</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Gen İnovasyon Otomasyon mühendislik ekibinin 30 yıllık teknik birikimiyle derlenen, dalgıç pompa montajı ve işletmesinde dikkat edilmesi gereken kritik noktalar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="guide-grid">
        {/* Generator Selection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="generator-selection-guide">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="text-blue-600" size={16} />
            <span>Motor Gücüne Göre Jeneratör Seçimi</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dalgıç motorların kalkış anındaki yüksek demeraj (kalkış) akımını karşılamak üzere seçilmesi gereken jeneratör kVA güçleri.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-slate-600 text-left">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-3 py-2">Motor Gücü</th>
                  <th className="px-3 py-2">Direkt Kalkış (kVA)</th>
                  <th className="px-3 py-2">Yıldız Üçgen (kVA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">3 HP (2.2 kW)</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">7.5 kVA</td>
                  <td className="px-3 py-2 text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">5.5 HP (4 kW)</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">12.5 kVA</td>
                  <td className="px-3 py-2">10 kVA</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">7.5 HP (5.5 kW)</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">15.6 kVA</td>
                  <td className="px-3 py-2">13.5 kVA</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">10 HP (7.5 kW)</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">18.8 kVA</td>
                  <td className="px-3 py-2">17.5 kVA</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-slate-700">15 HP (11 kW)</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">28.0 kVA</td>
                  <td className="px-3 py-2">25.5 kVA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Protection Guidelines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="protection-guidelines">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="text-blue-600" size={16} />
            <span>Kritik Sistem Koruma Kuralları</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-600" id="protection-list">
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
              <span>
                <strong>Susuz Çalışma Koruması:</strong> Kuyu debisinin düşmesi veya tükenmesi durumunda motorun susuz kalarak yanmasını önlemek için sıvı seviye kontrol rölesi ve kuyuda en az 2 elektrot mutlaka kullanılmalıdır.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
              <span>
                <strong>Faz ve Voltaj Koruması:</strong> Trifaze motorlarda faz eksikliği, faz sırası hatası ve şebeke voltaj dalgalanmaları en sık yanma sebepleridir. Bu yüzden dijital kontrol panelleri tercih edilmelidir.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
              <span>
                <strong>Sürtünme Kaybı (TDH) Etkisi:</strong> Aşırı dar boru çapları sürtünmeyi artırarak motorun boş yere fazladan güç harcamasına ve elektrik tüketiminin artmasına sebep olur.
              </span>
            </li>
          </ul>
        </div>

        {/* Transformer & Real Electricity Bill Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-2 animate-fade-in" id="transformer-real-guide">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Settings className="text-amber-600" size={16} />
            <span>Tarımsal Sulama Elektrik Faturaları ve Özel Trafo Gerçeği</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dalgıç pompa işletmelerinde faturaların neden beklenenden çok farklı geldiğini anlamak, doğru bütçeleme için hayati önem taşır:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 mt-2">
            <div className="bg-amber-50/35 border border-amber-100 p-3.5 rounded-xl space-y-1.5">
              <strong className="text-amber-800 font-bold block">1. Trafo Boşta Çalışma Kaybı</strong>
              <p className="leading-relaxed text-[11px]">
                Eğer kendinize ait bir elektrik trafonuz varsa, dalgıç pompanız hiç çalışmasa bile trafo sargılarındaki sızıntı (demir kaybı) nedeniyle şebekeden sürekli elektrik çekilir. Bu kayıp aylık ortalama 150 - 250 kWh'tir ve faturanıza asgari sabit bedel olarak yansır. Dolayısıyla aktif bir tarımsal trafolu abonede 700-800 TL fatura gelmesi fiziksel olarak imkansızdır; sadece trafo boşta çalışma maliyeti bile bu seviyeleri aşar.
              </p>
            </div>
            <div className="bg-amber-50/35 border border-amber-100 p-3.5 rounded-xl space-y-1.5">
              <strong className="text-amber-800 font-bold block">2. Reaktif Güç ve Kompanzasyon</strong>
              <p className="leading-relaxed text-[11px]">
                Dalgıç motorlar yüksek oranda indüktif yük çekerler. Eğer trafonuzun yanında bulunan kompanzasyon panosundaki kondansatörler eskidiyse veya pano kapalıysa, elektrik dağıtım şirketi tarafından ağır bir <strong>reaktif güç cezası</strong> uygulanır. Bu durum elektrik faturasını normal tüketim bedelinin 2 ila 3 katına kadar yükseltebilir.
              </p>
            </div>
            <div className="bg-amber-50/35 border border-amber-100 p-3.5 rounded-xl space-y-1.5">
              <strong className="text-amber-800 font-bold block">3. Gerçekçi Tüketim Hesaplaması</strong>
              <p className="leading-relaxed text-[11px]">
                Örneğin 7.5 kW gücündeki bir pompayı günde 8 saat çalıştıran bir çiftçinin aylık tüketimi 1.800 kWh olur. Türkiye'deki güncel tarımsal sulama tarifesi (ortalama 3.8 - 4.5 TL/kWh) ile hesaplandığında, sadece aktif tüketim faturası 6.840 TL ila 8.100 TL arasında değişir. Bu nedenle, trafo güvence bedelleri ve diğer ek vergilerle birlikte gerçek sulama maliyetleri doğru analiz edilmelidir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
