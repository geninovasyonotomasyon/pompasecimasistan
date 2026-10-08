import { allPumps, motorCatalog, panels, getFrictionLoss, getCableRecommendation, PumpModel, MotorModel, PanelModel } from "./catalogData";

export interface SelectionInput {
  kuyuDerinligi: number;          // m
  statikSuSeviyesi: number;       // m
  dinamikSuSeviyesi: number;      // m
  kuyuCapi: string;               // "4" | "5" | "6" | "8" | "10" (inç)
  elektrikTipi: "Monofaze" | "Trifaze";
  sulamaYontemi: string;          // "Damlama" | "Yağmurlama" | "Salma Sulama" | "Depo Dolumu" | "Ev/Villa"
  kullanimAmaci: string;          // "Tarımsal Sulama" | "Bahçe Sulama" | "Hayvancılık" | "Evsel Tüketim" vb.
  saatlikSuIhtiyaci: number;      // m3/h
  fiskiyeSayisi: number;          // adet
  fiskiyeBasiSuIhtiyaci: number;  // L/h
  anaBoruUzunlugu: number;        // m
  boruCapi: number;               // mm
  kotFarki: number;               // m
  basilacakEnUzakNokta: string;   // "Tarla" | "Depo" | "Ev"
  gunlukCalismaSuresi: number;    // saat
}

export interface SystemAlternative {
  type: "economic" | "perf" | "efficient";
  title: string;
  selectedPump: PumpModel;
  selectedMotor: MotorModel & { warrantyYears: number; desc: string };
  selectedPanel: PanelModel;
  recommendedCable: { section: string; maxLen: number };
  totalPriceUSD: number;
  tdh: number;
  frictionLoss: number;
  dailyWaterM3: number;
  monthlyWaterM3: number;
  dailyKWh: number;
  monthlyKWh: number;
  monthlyCostTL: number;
  advantages: string[];
  disadvantages: string[];
  prefConditions: string;
  explanation: string;
}

export interface SelectionResult {
  debi: number;
  tdh: number;
  alternatives: SystemAlternative[];
  warnings: string[];
  calculationSteps: string[];
}

export function performPumpSelection(input: SelectionInput): SelectionResult | null {
  const {
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
  } = input;

  // If critical parameters are not provided, do not perform selection (returns null)
  const isInputIncomplete =
    !kuyuDerinligi || kuyuDerinligi <= 0 ||
    !statikSuSeviyesi || statikSuSeviyesi <= 0 ||
    !dinamikSuSeviyesi || dinamikSuSeviyesi <= 0 ||
    !kuyuCapi ||
    !elektrikTipi ||
    !kullanimAmaci ||
    !sulamaYontemi ||
    !saatlikSuIhtiyaci || saatlikSuIhtiyaci <= 0 ||
    anaBoruUzunlugu === null || anaBoruUzunlugu < 0 ||
    kotFarki === null || kotFarki < 0 ||
    !basilacakEnUzakNokta ||
    !gunlukCalismaSuresi || gunlukCalismaSuresi <= 0 ||
    (sulamaYontemi === "Yağmurlama" && (!fiskiyeSayisi || fiskiyeSayisi <= 0 || !fiskiyeBasiSuIhtiyaci || fiskiyeBasiSuIhtiyaci <= 0));

  if (isInputIncomplete) {
    return null;
  }

  const warnings: string[] = [];

  // --- 1. Engineering Consistency Checks ---
  if (kuyuDerinligi > 0) {
    if (statikSuSeviyesi > kuyuDerinligi) {
      warnings.push(`Statik su seviyesi (${statikSuSeviyesi} m), kuyu derinliğinden (${kuyuDerinligi} m) daha fazla olamaz!`);
    }
    if (dinamikSuSeviyesi > kuyuDerinligi) {
      warnings.push(`Dinamik su seviyesi (${dinamikSuSeviyesi} m), kuyu derinliğinden (${kuyuDerinligi} m) daha fazla olamaz!`);
    }
    if (statikSuSeviyesi > 0 && dinamikSuSeviyesi > 0 && dinamikSuSeviyesi < statikSuSeviyesi) {
      warnings.push(`Dinamik su seviyesi (${dinamikSuSeviyesi} m), statik su seviyesinden (${statikSuSeviyesi} m) daha yüksekte (az derinlikte) olamaz! Pompa çalışırken su aşağı doğru çekilir ve dinamik seviye derinleşir.`);
    }
  }

  if (anaBoruUzunlugu > 0 && kotFarki > anaBoruUzunlugu) {
    warnings.push(`Kot farkı (${kotFarki} m), ana boru uzunluğundan (${anaBoruUzunlugu} m) daha büyük olamaz! Borunun fiziksel uzunluğu dikey kot farkını kapsamalıdır.`);
  }

  const diameterNum = parseInt(kuyuCapi) || 6;
  if (diameterNum === 4 && saatlikSuIhtiyaci > 3.5) {
    warnings.push(`4 inç kuyu kılıf borusunda saatlik ${saatlikSuIhtiyaci} m³ su çekilmesi, dar boru içi sürtünmeleri nedeniyle yüksek debi kaybına ve pompanın aşırı ısınmasına yol açabilir. 4 inç kuyulardan maksimum 3 - 3.5 m³/h çekilmesi önerilir.`);
  }

  // --- 2. Determine Flow Rate (Debi - Q) ---
  const debi = saatlikSuIhtiyaci;

  // Determine standard pipe diameter based on flow rate if not explicitly specified
  let calculatedBoruCapi = boruCapi || 50;
  if (!boruCapi) {
    if (debi <= 2.0) calculatedBoruCapi = 32; // 1"
    else if (debi <= 4.0) calculatedBoruCapi = 40; // 1 1/4"
    else if (debi <= 7.0) calculatedBoruCapi = 50; // 1 1/2"
    else if (debi <= 12.0) calculatedBoruCapi = 63; // 2"
    else calculatedBoruCapi = 75; // 2 1/2"
  }

  // --- 3. Calculate Total Dynamic Head (TDH - H) ---
  // Determine pressure demand based on irrigation/discharge method
  let pressureDemandBar = 0;
  if (sulamaYontemi === "Damlama") {
    pressureDemandBar = 1.5; // bar
  } else if (sulamaYontemi === "Yağmurlama") {
    pressureDemandBar = 2.5; // bar
  } else if (sulamaYontemi === "Ev/Villa" || basilacakEnUzakNokta === "Ev") {
    pressureDemandBar = 3.0; // bar
  } else {
    pressureDemandBar = 0.2; // bar
  }
  const pressureDemandM = pressureDemandBar * 10; // 1 bar = 10 mSS

  // Friction loss calculation
  const totalPipeLength = kuyuDerinligi + (anaBoruUzunlugu || 0);
  const singleLengthFrictionLoss = getFrictionLoss(debi, calculatedBoruCapi);
  const totalFrictionLoss = (singleLengthFrictionLoss * totalPipeLength) / 100;

  // Use dynamic water level if available
  const effectiveDrawdownSeviyesi = dinamikSuSeviyesi > 0 
    ? dinamikSuSeviyesi 
    : (statikSuSeviyesi > 0 ? Math.min(kuyuDerinligi, statikSuSeviyesi + 15) : Math.round(kuyuDerinligi * 0.45));

  const calculatedTDH = effectiveDrawdownSeviyesi + (kotFarki || 0) + totalFrictionLoss + pressureDemandM;
  const tdh = Math.ceil(calculatedTDH || 30);

  // --- 4. Pump Selection Logic for Alternatives ---
  let availablePumps = allPumps;
  if (diameterNum === 4) {
    availablePumps = allPumps.filter(p => p.series.startsWith("SKN"));
  } else if (diameterNum === 5 || diameterNum === 6) {
    if (debi >= 5) {
      availablePumps = allPumps.filter(p => p.series.startsWith("RN"));
    }
  }

  // Find pumps that can achieve TDH at target Q
  const candidatePumps: PumpModel[] = [];
  for (const pump of availablePumps) {
    const sortedCurve = [...pump.curveData].sort((a, b) => a.q - b.q);
    const minQPoint = sortedCurve[0];
    const maxQPoint = sortedCurve[sortedCurve.length - 1];

    if (debi > maxQPoint.q || debi < minQPoint.q) {
      continue;
    }

    let headAtDebi = 0;
    for (let i = 0; i < sortedCurve.length - 1; i++) {
      const p1 = sortedCurve[i];
      const p2 = sortedCurve[i + 1];
      if (debi >= p1.q && debi <= p2.q) {
        const ratio = (debi - p1.q) / (p2.q - p1.q);
        headAtDebi = p1.h + ratio * (p2.h - p1.h);
        break;
      }
    }

    if (headAtDebi >= tdh) {
      candidatePumps.push(pump);
    }
  }

  // If no candidates, fallback to entire filtered pumps
  const finalCandidates = candidatePumps.length > 0 ? candidatePumps : (availablePumps.length > 0 ? availablePumps : allPumps);

  // Sort candidates by price to help choose Economic vs Premium
  const sortedCandidates = [...finalCandidates].sort((a, b) => a.priceUSD - b.priceUSD);

  // Determine the 3 Pump options
  const econPump = sortedCandidates[0] || allPumps[0];
  
  // Price performance pump (middle of candidates or best score)
  let perfPump = econPump;
  let bestScore = Infinity;
  for (const pump of finalCandidates) {
    const bepCloseness = Math.abs(debi - pump.bestFlow);
    const score = bepCloseness * 10 + pump.powerHP * 3;
    if (score < bestScore) {
      bestScore = score;
      perfPump = pump;
    }
  }

  // High efficiency pump (best alignment with BEP, or higher stage premium model)
  let effPump = perfPump;
  const efficientCandidates = [...finalCandidates].sort((a, b) => {
    const devA = Math.abs(debi - a.bestFlow);
    const devB = Math.abs(debi - b.bestFlow);
    return devA - devB; // closest to BEP is more efficient
  });
  effPump = efficientCandidates[0] || perfPump;

  // Let's build the three Alternatives
  const createAlternative = (
    type: "economic" | "perf" | "efficient",
    pump: PumpModel
  ): SystemAlternative => {
    const targetHP = pump.powerHP;

    // Motor lookup
    let matchingMotors = motorCatalog.filter(m => m.type === elektrikTipi && m.powerHP >= targetHP);
    if (matchingMotors.length === 0) {
      matchingMotors = motorCatalog.filter(m => m.type === "Trifaze" && m.powerHP >= targetHP);
    }
    matchingMotors.sort((a, b) => a.powerHP - b.powerHP);
    const baseMotor = matchingMotors[0] || motorCatalog[0];

    // Determine Motor and Panel based on Alternative type
    let finalMotor: MotorModel & { warrantyYears: number; desc: string };
    let finalPanel: PanelModel;
    let advantages: string[] = [];
    let disadvantages: string[] = [];
    let prefConditions = "";
    let explanation = "";

    if (type === "economic") {
      finalMotor = {
        ...baseMotor,
        brand: "Coverco (Econ)",
        warrantyYears: 2,
        desc: "Avrupa standartlarında imal edilmiş, hobi ve hafif tarımsal kullanımlara uygun, bütçe dostu sızdırmaz motor."
      };
      
      // Standard panel
      let matchingPanels = panels.filter(p => p.type === baseMotor.type);
      finalPanel = matchingPanels[0];
      if (baseMotor.type === "Monofaze") {
        finalPanel = panels.find(p => p.id === "m18b_mini") || matchingPanels[0];
      }

      advantages = [
        "En düşük ilk yatırım maliyeti sunar.",
        "Yedek parça ve bakım giderleri ekonomiktir.",
        "Sezonluk ve kısa süreli sulama ihtiyaçları için mükemmel amortisman süresi."
      ];
      disadvantages = [
        "Premium motorlara göre elektrik tüketimi %5-10 daha fazladır.",
        "Uzun süreli aralıksız yoğun çalışmalarda aşınma direnci daha düşüktür.",
        "Elektriksel koruma özellikleri panonun temel yapısıyla sınırlıdır."
      ];
      prefConditions = "Günlük çalışma süresinin 4 saati geçmediği hobi bahçeleri, depo dolum işlemleri ve bütçenin öncelikli olduğu projelerde tercih edilmelidir.";
      explanation = `${pump.name} dalgıç pompa ve ${finalMotor.powerHP} HP Coverco motor kombinasyonu, projenizi en ekonomik bütçe ile hayata geçirmek için tasarlanmıştır. Temel güvenlik korumaları mevcuttur.`;

    } else if (type === "perf") {
      finalMotor = {
        ...baseMotor,
        brand: "Coverco Pro",
        warrantyYears: 2,
        desc: "Yüksek demeraj dayanımlı, dahili kondansatör ve termik korumalı profesyonel Coverco dalgıç motor."
      };

      // Electronic panel
      let matchingPanels = panels.filter(p => p.type === baseMotor.type);
      finalPanel = panels.find(p => p.id === "pcs11_elek" || p.id === "pcs31_elek_5" || p.id === "pcs31_elek_10") || matchingPanels[0];

      advantages = [
        "Fiyat ve çalışma verimliliği dengesi kusursuzdur.",
        "Gelişmiş elektronik pano ile susuz çalışma ve faz hatası korumaları tamdır.",
        "Sıvı seviye elektrotları sayesinde kuyu su durumunu anlık takip eder."
      ];
      disadvantages = [
        "En ekonomik seçeneğe göre yaklaşık %15-20 daha yüksek başlangıç bütçesi gerektirir.",
        "Garanti süresi 2 yıldır (premium seçenekteki gibi 3 yıl değildir)."
      ];
      prefConditions = "Standart tarımsal damlama ve yağmurlama sulamalarında, orta ölçekli ticari çiftliklerde ve her gün düzenli çalıştırılan kuyularda en akıllıca seçimdir.";
      explanation = `Mühendis ekibimizin önerisi olan bu sistem, ${pump.name} pompanın optimum verim aralığını elektronik korumalı ${finalMotor.powerHP} HP profesyonel motorla birleştirerek hem güvenliği hem de cebinizi korur.`;

    } else {
      // Premium High Efficiency with Franklin Electric
      const premiumPriceUSD = Math.round((baseMotor.priceUSD || 300) * 1.35);
      finalMotor = {
        ...baseMotor,
        brand: "Franklin Electric Premium",
        priceUSD: premiumPriceUSD,
        warrantyYears: 3,
        desc: "Sınıfının en yüksek elektrik verimliliğine sahip, aşındırıcı kumlara dayanıklı özel rotorlu Franklin dalgıç motor."
      };

      // Premium Panel
      let matchingPanels = panels.filter(p => p.type === baseMotor.type);
      finalPanel = panels.find(p => p.id === "pcs31_elek_10" || p.id === "pcs31_elek_15" || p.id === "pcs31_elek_5") || matchingPanels[0];

      advantages = [
        "Maksimum enerji tasarrufu sağlar, elektrik faturasını kayda değer ölçüde düşürür.",
        "3 Yıl uzatılmış tam mühendislik garantisi.",
        "Aşındırıcı kum ve mil içeren kuyularda üstün sızdırmazlık ve gövde dayanımı."
      ];
      disadvantages = [
        "İlk yatırım bütçesi diğer alternatiflere göre daha yüksektir."
      ];
      prefConditions = "Günlük 8 saati aşan yoğun tarımsal sulamalar, jeneratör ile çalıştırma koşulları, derin sondajlar ve uzun vadeli işletme maliyetini en aza indirmek isteyen büyük işletmeler.";
      explanation = `Endüstriyel standartta ${pump.name} paslanmaz pompa ile Franklin Electric motorun eşsiz uyumu. Bu sistem, sağladığı elektrik tasarrufu sayesinde ilk yatırım farkını 1-2 sezonda amorti eder.`;
    }

    // Recommended Cable
    const totalCableLength = kuyuDerinligi + 20; // vertical depth + 20m surface lead
    const recommendedCable = getCableRecommendation(finalMotor.powerHP, totalCableLength, finalMotor.type);

    // Calculate dynamic stats
    const dailyWaterM3 = debi * gunlukCalismaSuresi;
    const monthlyWaterM3 = dailyWaterM3 * 30;
    const dailyKWh = finalMotor.powerKW * gunlukCalismaSuresi;
    const monthlyKWh = dailyKWh * 30;

    // Estimate Turkish Electricity tariff
    const tariff = 3.8; // TL/kWh
    const monthlyCostTL = Math.round(monthlyKWh * tariff);

    // Calculate Total Price USD
    const pumpPrice = pump.priceUSD;
    const motorPrice = finalMotor.priceUSD || 250;
    const panelPrice = finalPanel.priceUSD;
    const cableCostPerMeter = 2.5;
    const cablePrice = totalCableLength * cableCostPerMeter;
    const accessoriesPrice = type === "economic" ? 90 : (type === "perf" ? 140 : 190);

    const totalPriceUSD = Math.round(pumpPrice + motorPrice + panelPrice + cablePrice + accessoriesPrice);

    return {
      type,
      title: type === "economic" ? "En Ekonomik Çözüm" : (type === "perf" ? "Fiyat / Performans Dengesi" : "En Yüksek Verimli Çözüm"),
      selectedPump: pump,
      selectedMotor: finalMotor,
      selectedPanel: finalPanel,
      recommendedCable,
      totalPriceUSD,
      tdh,
      frictionLoss: Math.round(totalFrictionLoss * 10) / 10,
      dailyWaterM3,
      monthlyWaterM3,
      dailyKWh,
      monthlyKWh,
      monthlyCostTL,
      advantages,
      disadvantages,
      prefConditions,
      explanation
    };
  };

  const alternatives: SystemAlternative[] = [
    createAlternative("economic", econPump),
    createAlternative("perf", perfPump),
    createAlternative("efficient", effPump)
  ];

  // Motor vs Phase Limitation check for alternatives
  if (elektrikTipi === "Monofaze") {
    const hasOversizedHP = alternatives.some(alt => alt.selectedMotor.powerHP > 3.0);
    if (hasOversizedHP) {
      warnings.push(`Uyarı: Seçilen sistem motorlarından bazılarının gücü Monofaze (220V) teknik sınırını (Maksimum 3.0 HP) aşmaktadır. Monofaze elektrik ile 3.0 HP üstü motorlar sağlıklı kalkış yapamaz.`);
    }
  }

  // Generate detailed calculation steps text
  const steps: string[] = [
    `1. Dikey Seviye Hesabı: Dinamik su derinliği (${effectiveDrawdownSeviyesi} m) ve yüzey kot farkı (${kotFarki || 0} m) toplanarak dikey basma mesafesi ${effectiveDrawdownSeviyesi + (kotFarki || 0)} m olarak bulunmuştur.`,
    `2. Sürtünme Kaybı (Hf): Toplam boru hattı uzunluğu (${totalPipeLength} m) boyunca saatlik ${debi.toFixed(1)} m³/h akış için ${calculatedBoruCapi} mm çapındaki boruda oluşan sürtünme kaybı ${Math.round(totalFrictionLoss * 10) / 10} mSS (metre su sütunu) olarak hesaplanmıştır.`,
    `3. Çıkış Basınç İhtiyacı: ${sulamaYontemi} yöntemi için çıkış noktasında asgari ${pressureDemandBar} bar basınç sağlanması amacıyla sisteme +${pressureDemandM} metre ek basma yükü eklenmiştir.`,
    `4. Toplam Manometrik Yükseklik (TDH): Dikey Basma (${effectiveDrawdownSeviyesi + (kotFarki || 0)} m) + Sürtünme Kaybı (${Math.round(totalFrictionLoss * 10) / 10} m) + Çıkış Basıncı (${pressureDemandM} m) = ${tdh} mSS toplam basma yüksekliği bulunmuştur.`,
    `5. Kablo Gerilim Düşümü: ${kuyuDerinligi + 20} metre hat boyu için %3'ün altında enerji kaybı sağlayacak bakır kablo kesiti optimize edilmiştir.`
  ];

  return {
    debi,
    tdh,
    alternatives,
    warnings,
    calculationSteps: steps
  };
}
