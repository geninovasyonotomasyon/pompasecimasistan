import React, { useState } from "react";
import { sknPumps, rn516Pumps, PumpModel, motorCatalog } from "../data/catalogData";
import { Info, Tag, Layers, Settings, Eye, Search, Filter } from "lucide-react";

export default function PumpCatalog() {
  const [selectedKuyuSize, setSelectedKuyuSize] = useState<string>("Tümü");
  const [searchTerm, setSearchModel] = useState<string>("");

  const allPumpsList = [...sknPumps, ...rn516Pumps];

  const filteredPumps = allPumpsList.filter((pump) => {
    const matchesKuyu =
      selectedKuyuSize === "Tümü" ||
      (selectedKuyuSize === "4\"" && pump.series.startsWith("SKN")) ||
      (selectedKuyuSize === "5\"-6\"" && pump.series.startsWith("RN"));
    const matchesSearch = pump.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKuyu && matchesSearch;
  });

  return (
    <div className="space-y-6" id="catalog-panel">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" id="catalog-filters">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-blue-600" size={20} />
            <span>IMPO Dalgıç Ekipman Kataloğu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Sadece katalogdaki gerçek modeller ve fiyatlar listelenmektedir.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto" id="filters-controls">
          <div className="relative flex-1 md:flex-initial">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Model ara..."
              value={searchTerm}
              onChange={(e) => setSearchModel(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700"
              id="input-catalog-search"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0" id="filter-tabs">
            {["Tümü", "4\"", "5\"-6\""].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedKuyuSize(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedKuyuSize === size ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
                id={`btn-filter-${size.replace('"', '')}`}
              >
                {size} Kuyu
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="catalog-grid">
        {filteredPumps.map((pump) => (
          <div
            key={pump.id}
            className="bg-white rounded-2xl border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            id={`pump-card-${pump.id}`}
          >
            {/* Header / Brand Accent */}
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full mb-1">
                  {pump.series.startsWith("SKN") ? "4\" Noril Fanlı" : "5\"-6\" Teknopolimer"}
                </span>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{pump.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Katalog Fiyatı</span>
                <span className="font-extrabold text-blue-600 text-base">${pump.priceUSD}</span>
              </div>
            </div>

            {/* Product parameters */}
            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Motor Gücü</span>
                  <span className="font-bold text-slate-800">{pump.powerHP} HP ({pump.powerKW} kW)</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Çıkış Çapı</span>
                  <span className="font-bold text-slate-800">{pump.outletInch}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Optimum Debi (Q)</span>
                  <span className="font-bold text-slate-800">{pump.bestFlow} m³/h</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Optimum Basma (H)</span>
                  <span className="font-bold text-slate-800">{pump.bestHead} metre (mSS)</span>
                </div>
              </div>

              {/* Performance description / Mini chart */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Karakteristik Eğri Değerleri (Q - H)</span>
                <div className="flex items-center gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 overflow-x-auto">
                  {pump.curveData.map((pt, idx) => (
                    <div key={idx} className="text-center shrink-0 min-w-[50px] border-r border-slate-100 last:border-r-0 pr-1">
                      <span className="text-[10px] text-slate-400 block">{pt.q} m³</span>
                      <span className="text-xs font-bold text-slate-700">{pt.h}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Specifications */}
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Pompa Boyu: {pump.boyMM} mm</span>
              <span>Ağırlık: {pump.weightKG} kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* Submersible Motors Segment */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="motors-catalog">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-blue-600" size={18} />
            <span>Katalogdaki Dalgıç Motorlar</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Coverco / Franklin Electric marka yüksek torklu sarılabilir motorlar.</p>
        </div>

        <div className="overflow-x-auto" id="motors-table-container">
          <table className="w-full text-xs text-left text-slate-600" id="motors-table">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Marka</th>
                <th className="px-4 py-3">Güç (HP)</th>
                <th className="px-4 py-3">Güç (kW)</th>
                <th className="px-4 py-3">Tip / Voltaj</th>
                <th className="px-4 py-3">Boy (mm)</th>
                <th className="px-4 py-3">Ağırlık (kg)</th>
                <th className="px-4 py-3 text-right">Katalog Fiyatı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {motorCatalog.slice(0, 10).map((motor) => (
                <tr key={motor.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{motor.brand}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{motor.powerHP} HP</td>
                  <td className="px-4 py-3">{motor.powerKW} kW</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      motor.type === "Monofaze" ? "bg-amber-50 text-amber-600" : "bg-teal-50 text-emerald-600"
                    }`}>
                      {motor.type} ({motor.voltage})
                    </span>
                  </td>
                  <td className="px-4 py-3">{motor.boyMM} mm</td>
                  <td className="px-4 py-3">{motor.weightKG} kg</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">${motor.priceUSD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
