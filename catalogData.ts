// real catalog data extracted from IMPO & Franklin Electric July 2025 Catalog

export interface PumpModel {
  id: string;
  series: string; // e.g., "SKN 401", "SKN 402", "RN 516"
  name: string;   // e.g., "SKN 401/13"
  powerKW: number;
  powerHP: number;
  outletInch: string;
  minFlow: number; // m3/h
  maxFlow: number; // m3/h
  bestFlow: number; // best efficiency point flow rate m3/h
  bestHead: number; // best efficiency point head m
  curveData: { q: number; h: number }[]; // m3/h -> head (m)
  boyMM: number;
  weightKG: number;
  priceUSD: number;
}

export interface MotorModel {
  id: string;
  type: "Monofaze" | "Trifaze";
  voltage: string; // "220V" | "380V"
  powerHP: number;
  powerKW: number;
  boyMM: number;
  weightKG: number;
  priceEUR?: number;
  priceUSD?: number;
  brand: string; // "Coverco" | "Franklin Electric" | "impo"
}

export interface PanelModel {
  id: string;
  name: string;
  type: "Monofaze" | "Trifaze";
  powerRange: string;
  desc: string;
  priceUSD: number;
}

// 4" SKN Noril Fanlı Pump Series (Page 13, 14)
export const sknPumps: PumpModel[] = [
  // SKN 401 Series (Best Flow around 1.0 m3/h)
  {
    id: "skn401_06",
    series: "SKN 401",
    name: "SKN 401/06",
    powerKW: 0.37,
    powerHP: 0.5,
    outletInch: "1 1/4\"",
    minFlow: 0.3,
    maxFlow: 1.8,
    bestFlow: 1.0,
    bestHead: 35,
    curveData: [
      { q: 0, h: 49 },
      { q: 0.3, h: 45 },
      { q: 0.6, h: 42 },
      { q: 1.0, h: 35 },
      { q: 1.5, h: 19 },
      { q: 1.8, h: 7 }
    ],
    boyMM: 307,
    weightKG: 2.7,
    priceUSD: 155
  },
  {
    id: "skn401_09",
    series: "SKN 401",
    name: "SKN 401/09",
    powerKW: 0.37,
    powerHP: 0.5,
    outletInch: "1 1/4\"",
    minFlow: 0.3,
    maxFlow: 1.8,
    bestFlow: 1.0,
    bestHead: 54,
    curveData: [
      { q: 0, h: 73 },
      { q: 0.3, h: 68 },
      { q: 0.6, h: 64 },
      { q: 1.0, h: 54 },
      { q: 1.5, h: 29 },
      { q: 1.8, h: 11 }
    ],
    boyMM: 369,
    weightKG: 3.2,
    priceUSD: 172
  },
  {
    id: "skn401_13",
    series: "SKN 401",
    name: "SKN 401/13",
    powerKW: 0.55,
    powerHP: 0.75,
    outletInch: "1 1/4\"",
    minFlow: 0.3,
    maxFlow: 1.8,
    bestFlow: 1.0,
    bestHead: 79,
    curveData: [
      { q: 0, h: 105 },
      { q: 0.3, h: 99 },
      { q: 0.6, h: 94 },
      { q: 1.0, h: 79 },
      { q: 1.5, h: 43 },
      { q: 1.8, h: 17 }
    ],
    boyMM: 453,
    weightKG: 3.9,
    priceUSD: 195
  },
  {
    id: "skn401_17",
    series: "SKN 401",
    name: "SKN 401/17",
    powerKW: 0.75,
    powerHP: 1.0,
    outletInch: "1 1/4\"",
    minFlow: 0.3,
    maxFlow: 1.8,
    bestFlow: 1.0,
    bestHead: 104,
    curveData: [
      { q: 0, h: 137 },
      { q: 0.3, h: 130 },
      { q: 0.6, h: 123 },
      { q: 1.0, h: 104 },
      { q: 1.5, h: 56 },
      { q: 1.8, h: 22 }
    ],
    boyMM: 536,
    weightKG: 4.7,
    priceUSD: 218
  },
  {
    id: "skn401_26",
    series: "SKN 401",
    name: "SKN 401/26",
    powerKW: 1.1,
    powerHP: 1.5,
    outletInch: "1 1/4\"",
    minFlow: 0.3,
    maxFlow: 1.8,
    bestFlow: 1.0,
    bestHead: 160,
    curveData: [
      { q: 0, h: 209 },
      { q: 0.3, h: 200 },
      { q: 0.6, h: 190 },
      { q: 1.0, h: 160 },
      { q: 1.5, h: 87 },
      { q: 1.8, h: 34 }
    ],
    boyMM: 776,
    weightKG: 6.6,
    priceUSD: 290
  },

  // SKN 402 Series (Best Flow around 2.1 m3/h)
  {
    id: "skn402_05",
    series: "SKN 402",
    name: "SKN 402/05",
    powerKW: 0.37,
    powerHP: 0.5,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 29,
    curveData: [
      { q: 0, h: 36 },
      { q: 0.9, h: 34 },
      { q: 1.5, h: 32 },
      { q: 2.1, h: 29 },
      { q: 2.8, h: 22 },
      { q: 3.5, h: 14 }
    ],
    boyMM: 287,
    weightKG: 2.8,
    priceUSD: 121
  },
  {
    id: "skn402_09",
    series: "SKN 402",
    name: "SKN 402/09",
    powerKW: 0.55,
    powerHP: 0.75,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 53,
    curveData: [
      { q: 0, h: 65 },
      { q: 0.9, h: 63 },
      { q: 1.5, h: 59 },
      { q: 2.1, h: 53 },
      { q: 2.8, h: 42 },
      { q: 3.5, h: 25 }
    ],
    boyMM: 387,
    weightKG: 3.4,
    priceUSD: 131
  },
  {
    id: "skn402_12",
    series: "SKN 402",
    name: "SKN 402/12",
    powerKW: 0.75,
    powerHP: 1.0,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 71,
    curveData: [
      { q: 0, h: 86 },
      { q: 0.9, h: 84 },
      { q: 1.5, h: 79 },
      { q: 2.1, h: 71 },
      { q: 2.8, h: 56 },
      { q: 3.5, h: 30 }
    ],
    boyMM: 462,
    weightKG: 4.4,
    priceUSD: 139
  },
  {
    id: "skn402_18",
    series: "SKN 402",
    name: "SKN 402/18",
    powerKW: 1.1,
    powerHP: 1.5,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 107,
    curveData: [
      { q: 0, h: 129 },
      { q: 0.9, h: 126 },
      { q: 1.5, h: 119 },
      { q: 2.1, h: 107 },
      { q: 2.8, h: 83 },
      { q: 3.5, h: 54 }
    ],
    boyMM: 644,
    weightKG: 5.4,
    priceUSD: 166
  },
  {
    id: "skn402_25",
    series: "SKN 402",
    name: "SKN 402/25",
    powerKW: 1.5,
    powerHP: 2.0,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 145,
    curveData: [
      { q: 0, h: 177 },
      { q: 0.9, h: 174 },
      { q: 1.5, h: 163 },
      { q: 2.1, h: 145 },
      { q: 2.8, h: 113 },
      { q: 3.5, h: 73 }
    ],
    boyMM: 819,
    weightKG: 6.9,
    priceUSD: 210
  },
  {
    id: "skn402_36",
    series: "SKN 402",
    name: "SKN 402/36",
    powerKW: 2.2,
    powerHP: 3.0,
    outletInch: "1 1/4\"",
    minFlow: 0.9,
    maxFlow: 3.5,
    bestFlow: 2.1,
    bestHead: 212,
    curveData: [
      { q: 0, h: 256 },
      { q: 0.9, h: 255 },
      { q: 1.5, h: 237 },
      { q: 2.1, h: 212 },
      { q: 2.8, h: 165 },
      { q: 3.5, h: 104 }
    ],
    boyMM: 1159,
    weightKG: 9.5,
    priceUSD: 275
  },

  // SKN 403 Series (Best Flow around 2.4 m3/h)
  {
    id: "skn403_10",
    series: "SKN 403",
    name: "SKN 403/10",
    powerKW: 0.75,
    powerHP: 1.0,
    outletInch: "1 1/4\"",
    minFlow: 1.2,
    maxFlow: 4.8,
    bestFlow: 2.4,
    bestHead: 61,
    curveData: [
      { q: 0, h: 74 },
      { q: 1.2, h: 67 },
      { q: 2.4, h: 61 },
      { q: 3.6, h: 48 },
      { q: 4.8, h: 26 }
    ],
    boyMM: 424,
    weightKG: 3.7,
    priceUSD: 133
  },
  {
    id: "skn403_14",
    series: "SKN 403",
    name: "SKN 403/14",
    powerKW: 1.1,
    powerHP: 1.5,
    outletInch: "1 1/4\"",
    minFlow: 1.2,
    maxFlow: 4.8,
    bestFlow: 2.4,
    bestHead: 85,
    curveData: [
      { q: 0, h: 102 },
      { q: 1.2, h: 94 },
      { q: 2.4, h: 85 },
      { q: 3.6, h: 67 },
      { q: 4.8, h: 37 }
    ],
    boyMM: 561,
    weightKG: 4.6,
    priceUSD: 147
  },
  {
    id: "skn403_20",
    series: "SKN 403",
    name: "SKN 403/20",
    powerKW: 1.5,
    powerHP: 2.0,
    outletInch: "1 1/4\"",
    minFlow: 1.2,
    maxFlow: 4.8,
    bestFlow: 2.4,
    bestHead: 121,
    curveData: [
      { q: 0, h: 145 },
      { q: 1.2, h: 134 },
      { q: 2.4, h: 121 },
      { q: 3.6, h: 96 },
      { q: 4.8, h: 52 }
    ],
    boyMM: 718,
    weightKG: 5.9,
    priceUSD: 163
  },
  {
    id: "skn403_28",
    series: "SKN 403",
    name: "SKN 403/28",
    powerKW: 2.2,
    powerHP: 3.0,
    outletInch: "1 1/4\"",
    minFlow: 1.2,
    maxFlow: 4.8,
    bestFlow: 2.4,
    bestHead: 169,
    curveData: [
      { q: 0, h: 200 },
      { q: 1.2, h: 187 },
      { q: 2.4, h: 169 },
      { q: 3.6, h: 133 },
      { q: 4.8, h: 74 }
    ],
    boyMM: 960,
    weightKG: 7.7,
    priceUSD: 212
  },

  // SKN 404 Series (Best Flow around 3.3 m3/h)
  {
    id: "skn404_13",
    series: "SKN 404",
    name: "SKN 404/13",
    powerKW: 1.1,
    powerHP: 1.5,
    outletInch: "1 1/4\"",
    minFlow: 1.8,
    maxFlow: 6.0,
    bestFlow: 3.3,
    bestHead: 75,
    curveData: [
      { q: 0, h: 92 },
      { q: 1.8, h: 85 },
      { q: 3.3, h: 75 },
      { q: 4.8, h: 52 },
      { q: 6.0, h: 20 }
    ],
    boyMM: 574,
    weightKG: 4.7,
    priceUSD: 149
  },
  {
    id: "skn404_18",
    series: "SKN 404",
    name: "SKN 404/18",
    powerKW: 1.5,
    powerHP: 2.0,
    outletInch: "1 1/4\"",
    minFlow: 1.8,
    maxFlow: 6.0,
    bestFlow: 3.3,
    bestHead: 105,
    curveData: [
      { q: 0, h: 128 },
      { q: 1.8, h: 119 },
      { q: 3.3, h: 105 },
      { q: 4.8, h: 73 },
      { q: 6.0, h: 27 }
    ],
    boyMM: 720,
    weightKG: 6.0,
    priceUSD: 171
  },
  {
    id: "skn404_26",
    series: "SKN 404",
    name: "SKN 404/26",
    powerKW: 2.2,
    powerHP: 3.0,
    outletInch: "1 1/4\"",
    minFlow: 1.8,
    maxFlow: 6.0,
    bestFlow: 3.3,
    bestHead: 151,
    curveData: [
      { q: 0, h: 183 },
      { q: 1.8, h: 171 },
      { q: 3.3, h: 151 },
      { q: 4.8, h: 105 },
      { q: 6.0, h: 39 }
    ],
    boyMM: 986,
    weightKG: 8.1,
    priceUSD: 210
  }
];

// 5"-6" RN Series Technopolymer (Page 31 of the catalog)
export const rn516Pumps: PumpModel[] = [
  {
    id: "rn516_10",
    series: "RN 516",
    name: "RN 516/10",
    powerKW: 4.0,
    powerHP: 5.5,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 60,
    curveData: [
      { q: 0, h: 79 },
      { q: 7.0, h: 71 },
      { q: 10.1, h: 67 },
      { q: 16.0, h: 60 },
      { q: 20.0, h: 38 },
      { q: 22.0, h: 26 }
    ],
    boyMM: 755,
    weightKG: 10,
    priceUSD: 488
  },
  {
    id: "rn516_14",
    series: "RN 516",
    name: "RN 516/14",
    powerKW: 5.5,
    powerHP: 7.5,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 87,
    curveData: [
      { q: 0, h: 109 },
      { q: 7.0, h: 98 },
      { q: 10.1, h: 91 },
      { q: 16.0, h: 87 },
      { q: 20.0, h: 49 },
      { q: 22.0, h: 31 }
    ],
    boyMM: 935,
    weightKG: 12,
    priceUSD: 572
  },
  {
    id: "rn516_19",
    series: "RN 516",
    name: "RN 516/19",
    powerKW: 7.5,
    powerHP: 10.0,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 115,
    curveData: [
      { q: 0, h: 146 },
      { q: 7.0, h: 129 },
      { q: 10.1, h: 122 },
      { q: 16.0, h: 115 },
      { q: 20.0, h: 66 },
      { q: 22.0, h: 42 }
    ],
    boyMM: 1161,
    weightKG: 14,
    priceUSD: 678
  },
  {
    id: "rn516_24",
    series: "RN 516",
    name: "RN 516/24",
    powerKW: 9.2,
    powerHP: 12.5,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 145,
    curveData: [
      { q: 0, h: 184 },
      { q: 7.0, h: 163 },
      { q: 10.1, h: 155 },
      { q: 16.0, h: 145 },
      { q: 20.0, h: 92 },
      { q: 22.0, h: 50 }
    ],
    boyMM: 1435,
    weightKG: 18,
    priceUSD: 818
  },
  {
    id: "rn516_29",
    series: "RN 516",
    name: "RN 516/29",
    powerKW: 11.0,
    powerHP: 15.0,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 179,
    curveData: [
      { q: 0, h: 226 },
      { q: 7.0, h: 200 },
      { q: 10.1, h: 188 },
      { q: 16.0, h: 179 },
      { q: 20.0, h: 110 },
      { q: 22.0, h: 65 }
    ],
    boyMM: 1660,
    weightKG: 20,
    priceUSD: 922
  },
  {
    id: "rn516_34",
    series: "RN 516",
    name: "RN 516/34",
    powerKW: 13.0,
    powerHP: 17.5,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 210,
    curveData: [
      { q: 0, h: 269 },
      { q: 7.0, h: 239 },
      { q: 10.1, h: 225 },
      { q: 16.0, h: 210 },
      { q: 20.0, h: 127 },
      { q: 22.0, h: 71 }
    ],
    boyMM: 1880,
    weightKG: 22,
    priceUSD: 1045
  },
  {
    id: "rn516_38",
    series: "RN 516",
    name: "RN 516/38",
    powerKW: 15.0,
    powerHP: 20.0,
    outletInch: "2 1/2\"",
    minFlow: 7.0,
    maxFlow: 22.0,
    bestFlow: 16.0,
    bestHead: 226,
    curveData: [
      { q: 0, h: 290 },
      { q: 7.0, h: 255 },
      { q: 10.1, h: 234 },
      { q: 16.0, h: 226 },
      { q: 20.0, h: 137 },
      { q: 22.0, h: 73 }
    ],
    boyMM: 2115,
    weightKG: 25,
    priceUSD: 1146
  }
];

// Combine all pumps
export const allPumps: PumpModel[] = [...sknPumps, ...rn516Pumps];

// Submersible Motors (Page 25)
export const motorCatalog: MotorModel[] = [
  // Monofaze 220V Motors (impo / Coverco)
  { id: "motor_m_05", type: "Monofaze", voltage: "220V", powerHP: 0.5, powerKW: 0.37, boyMM: 364, weightKG: 8.1, priceUSD: 187, brand: "Coverco" },
  { id: "motor_m_075", type: "Monofaze", voltage: "220V", powerHP: 0.75, powerKW: 0.55, boyMM: 389, weightKG: 9.2, priceUSD: 199, brand: "Coverco" },
  { id: "motor_m_10", type: "Monofaze", voltage: "220V", powerHP: 1.0, powerKW: 0.75, boyMM: 411, weightKG: 10.3, priceUSD: 209, brand: "Coverco" },
  { id: "motor_m_15", type: "Monofaze", voltage: "220V", powerHP: 1.5, powerKW: 1.1, boyMM: 434, weightKG: 11.4, priceUSD: 223, brand: "Coverco" },
  { id: "motor_m_20", type: "Monofaze", voltage: "220V", powerHP: 2.0, powerKW: 1.5, boyMM: 467, weightKG: 12.8, priceUSD: 260, brand: "Coverco" },
  { id: "motor_m_30", type: "Monofaze", voltage: "220V", powerHP: 3.0, powerKW: 2.2, boyMM: 565, weightKG: 17.4, priceUSD: 311, brand: "Coverco" },

  // Trifaze 380V Motors
  { id: "motor_t_10", type: "Trifaze", voltage: "380V", powerHP: 1.0, powerKW: 0.75, boyMM: 384, weightKG: 8.6, priceUSD: 203, brand: "Coverco" },
  { id: "motor_t_15", type: "Trifaze", voltage: "380V", powerHP: 1.5, powerKW: 1.1, boyMM: 411, weightKG: 10.6, priceUSD: 216, brand: "Coverco" },
  { id: "motor_t_20", type: "Trifaze", voltage: "380V", powerHP: 2.0, powerKW: 1.5, boyMM: 428, weightKG: 10.8, priceUSD: 233, brand: "Coverco" },
  { id: "motor_t_30", type: "Trifaze", voltage: "380V", powerHP: 3.0, powerKW: 2.2, boyMM: 467, weightKG: 12.5, priceUSD: 285, brand: "Coverco" },
  { id: "motor_t_40", type: "Trifaze", voltage: "380V", powerHP: 4.0, powerKW: 3.0, boyMM: 522, weightKG: 15.0, priceUSD: 396, brand: "Coverco" },
  { id: "motor_t_55", type: "Trifaze", voltage: "380V", powerHP: 5.5, powerKW: 4.0, boyMM: 587, weightKG: 18.3, priceUSD: 501, brand: "Coverco" },
  { id: "motor_t_75", type: "Trifaze", voltage: "380V", powerHP: 7.5, powerKW: 5.5, boyMM: 687, weightKG: 24.3, priceUSD: 611, brand: "Coverco" },
  { id: "motor_t_100", type: "Trifaze", voltage: "380V", powerHP: 10.0, powerKW: 7.5, boyMM: 768, weightKG: 28.3, priceUSD: 714, brand: "Coverco" },
  { id: "motor_t_125", type: "Trifaze", voltage: "380V", powerHP: 12.5, powerKW: 9.2, boyMM: 820, weightKG: 32.0, priceUSD: 821, brand: "Coverco" },
  { id: "motor_t_150", type: "Trifaze", voltage: "380V", powerHP: 15.0, powerKW: 11.0, boyMM: 911, weightKG: 38.0, priceUSD: 966, brand: "Coverco" },
  { id: "motor_t_175", type: "Trifaze", voltage: "380V", powerHP: 17.5, powerKW: 13.0, boyMM: 980, weightKG: 42.0, priceUSD: 1045, brand: "Coverco" },
  { id: "motor_t_200", type: "Trifaze", voltage: "380V", powerHP: 20.0, powerKW: 15.0, boyMM: 1080, weightKG: 46.0, priceUSD: 1146, brand: "Coverco" }
];

// Control Panels (Page 78, 79)
export const panels: PanelModel[] = [
  { id: "m18b_mini", name: "iMPO-M18B Mini", type: "Monofaze", powerRange: "0.75 - 3 HP", desc: "Mini Tip Kondansatörlü ve Termikli Dalgıç Pompa Panosu, 220V", priceUSD: 35 },
  { id: "m18b_kf", name: "iMPO-M18B-KF", type: "Monofaze", powerRange: "0.75 - 3 HP", desc: "Mini Tip Kondansatörlü ve Termikli, 50cm Kablolu Fişli, 220V", priceUSD: 41 },
  { id: "pcs11_elek", name: "PCS11 Elektronik", type: "Monofaze", powerRange: "0.5 - 3 HP", desc: "Yüksek Teknolojili LCD Ekranlı Elektronik Kontrol Panosu, Seviye Kontrolü, Susuz Çalışma Koruması, 220V", priceUSD: 141 },
  { id: "pcs31_elek_5", name: "PCS31 Elektronik (Büyük)", type: "Trifaze", powerRange: "1 - 5.5 HP", desc: "Trifaze Dijital LCD Ekranlı Elektronik Kontrol Panosu, Seviye Problu, Faz Sırası Koruma, 380V", priceUSD: 178 },
  { id: "pcs31_elek_10", name: "PCS31 Elektronik (Ultra)", type: "Trifaze", powerRange: "7.5 - 10 HP", desc: "Trifaze Dijital LCD Ekranlı Elektronik Kontrol Panosu, Seviye Problu, Faz Sırası Koruma, 380V", priceUSD: 196 },
  { id: "pcs31_elek_15", name: "PCS31 Elektronik (Pro)", type: "Trifaze", powerRange: "12.5 - 15 HP", desc: "Trifaze Dijital LCD Ekranlı Elektronik Kontrol Panosu, Seviye Problu, Faz Sırası Koruma, 380V", priceUSD: 227 }
];

// Helper to calculate total dynamic head friction loss based on Page 204
export function getFrictionLoss(flowRateM3H: number, outerDiameterMM: number): number {
  // friction loss in meters per 100 meters of plastic pipe
  // approximate values based on Page 204
  const flow = Math.max(0.1, flowRateM3H);
  if (outerDiameterMM <= 25) {
    return (flow * flow * 8.5); // high friction in small pipe
  } else if (outerDiameterMM <= 32) {
    return (flow * flow * 2.8);
  } else if (outerDiameterMM <= 40) {
    return (flow * flow * 0.95);
  } else if (outerDiameterMM <= 50) {
    return (flow * flow * 0.32);
  } else if (outerDiameterMM <= 63) {
    return (flow * flow * 0.12);
  } else if (outerDiameterMM <= 75) {
    return (flow * flow * 0.05);
  } else if (outerDiameterMM <= 90) {
    return (flow * flow * 0.02);
  } else {
    return (flow * flow * 0.008);
  }
}

// Cable cross-section selection lookup based on Page 205
export function getCableRecommendation(powerHP: number, distanceMeters: number, type: "Monofaze" | "Trifaze"): { section: string; maxLen: number } {
  // lookup tables for max length before > 3% voltage drop
  if (type === "Monofaze") {
    if (powerHP <= 0.5) {
      if (distanceMeters <= 80) return { section: "3 x 1.5 mm²", maxLen: 80 };
      return { section: "3 x 2.5 mm²", maxLen: 130 };
    } else if (powerHP <= 1.0) {
      if (distanceMeters <= 40) return { section: "3 x 1.5 mm²", maxLen: 40 };
      if (distanceMeters <= 80) return { section: "3 x 2.5 mm²", maxLen: 80 };
      if (distanceMeters <= 105) return { section: "3 x 4.0 mm²", maxLen: 105 };
      return { section: "3 x 6.0 mm²", maxLen: 160 };
    } else if (powerHP <= 2.0) {
      if (distanceMeters <= 20) return { section: "3 x 1.5 mm²", maxLen: 20 };
      if (distanceMeters <= 35) return { section: "3 x 2.5 mm²", maxLen: 35 };
      if (distanceMeters <= 60) return { section: "3 x 4.0 mm²", maxLen: 60 };
      if (distanceMeters <= 90) return { section: "3 x 6.0 mm²", maxLen: 90 };
      if (distanceMeters <= 145) return { section: "3 x 10.0 mm²", maxLen: 145 };
      return { section: "3 x 16.0 mm²", maxLen: 235 };
    } else {
      if (distanceMeters <= 30) return { section: "3 x 2.5 mm²", maxLen: 30 };
      if (distanceMeters <= 50) return { section: "3 x 4.0 mm²", maxLen: 50 };
      if (distanceMeters <= 70) return { section: "3 x 6.0 mm²", maxLen: 70 };
      if (distanceMeters <= 120) return { section: "3 x 10.0 mm²", maxLen: 120 };
      return { section: "3 x 16.0 mm²", maxLen: 185 };
    }
  } else {
    // Trifaze 380V
    if (powerHP <= 2.0) {
      if (distanceMeters <= 135) return { section: "3 x 1.5 mm²", maxLen: 135 };
      if (distanceMeters <= 225) return { section: "3 x 2.5 mm²", maxLen: 225 };
      return { section: "3 x 4.0 mm²", maxLen: 360 };
    } else if (powerHP <= 4.0) {
      if (distanceMeters <= 110) return { section: "3 x 1.5 mm²", maxLen: 110 };
      if (distanceMeters <= 170) return { section: "3 x 2.5 mm²", maxLen: 170 };
      if (distanceMeters <= 260) return { section: "3 x 4.0 mm²", maxLen: 260 };
      return { section: "3 x 6.0 mm²", maxLen: 450 };
    } else if (powerHP <= 7.5) {
      if (distanceMeters <= 60) return { section: "3 x 1.5 mm²", maxLen: 60 };
      if (distanceMeters <= 100) return { section: "3 x 2.5 mm²", maxLen: 100 };
      if (distanceMeters <= 150) return { section: "3 x 4.0 mm²", maxLen: 150 };
      if (distanceMeters <= 230) return { section: "3 x 6.0 mm²", maxLen: 230 };
      return { section: "3 x 10.0 mm²", maxLen: 340 };
    } else if (powerHP <= 15.0) {
      if (distanceMeters <= 50) return { section: "3 x 2.5 mm²", maxLen: 50 };
      if (distanceMeters <= 80) return { section: "3 x 4.0 mm²", maxLen: 80 };
      if (distanceMeters <= 120) return { section: "3 x 6.0 mm²", maxLen: 120 };
      if (distanceMeters <= 205) return { section: "3 x 10.0 mm²", maxLen: 205 };
      return { section: "3 x 16.0 mm²", maxLen: 330 };
    } else {
      // 15 - 30 HP
      if (distanceMeters <= 80) return { section: "3 x 6.0 mm²", maxLen: 80 };
      if (distanceMeters <= 130) return { section: "3 x 10.0 mm²", maxLen: 130 };
      if (distanceMeters <= 210) return { section: "3 x 16.0 mm²", maxLen: 210 };
      if (distanceMeters <= 330) return { section: "3 x 25.0 mm²", maxLen: 330 };
      return { section: "3 x 35.0 mm²", maxLen: 460 };
    }
  }
}
