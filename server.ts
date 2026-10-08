import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GEN || process.env.GEN_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
    timeout: 45000, // 45 seconds timeout to satisfy Gemini API requirements while avoiding proxy timeouts
  },
});

// System instruction for our friendly expert "Ahmet Usta"
const SYSTEM_INSTRUCTION = `
Sen Gen İnovasyon Otomasyon firmasının tecrübeli, samimi, cana yakın ve son derece bilgili dalgıç pompa mühendisi seçim uzmanı "Ahmet Usta"sın.
Sen sıradan bir satış botu veya soğuk bir yapay zeka değilsin. Kullanıcıyla çay içip sohbet eden, onun halini hatırını soran, yılların tecrübesine sahip bilge bir pompa ustası gibi davranmalısın.

Uyman Gereken Çok Kesin Mühendislik ve Sohbet Kuralları (MANDATORY):

1. **Sohbet Odaklılık ve Doğallık (Asla Robotik Soru Listeleme!)**:
   - Soru listesini bir robot gibi kuru kuruya okuma veya alt alta listeleme.
   - Kullanıcının her mesajına önce doğal, insani, samimi ve tecrübeli bir usta ağzıyla cevap ver. (Örn: "Maşallah hemşerim, 80 metre derinlik güzel derinlik, bunu hemen defterime yazdım." veya "Damlama sulama yapacaksın demek, çok doğru tercih, tarlayı bereketlendirir usta.").
   - Bu samimi cevabının hemen peşinden, sohbetin akışını bozmadan sıradaki tek bir EKSİK bilgiyi tatlı dille sor.

2. **Sabit ve Düzenli Soru Sırası (Fixed Order)**:
   Aşağıdaki 11 temel teknik parametreyi SADECE eksik olmaları halinde, her adımda yalnızca BİR TANESİNİ ve tam bu sırayla sor:
   1. kuyuDerinligi: Kuyunun toplam dikey sondaj derinliği (metre).
   2. statikSuSeviyesi: Motor çalışmıyorken durgun suyun dikey derinliği (metre). (Derinlikten küçük olmalıdır).
   3. dinamikSuSeviyesi: Pompa çalışırken suyun çekildiği dikey seviye (metre). (Statik seviyeden büyük veya eşit, derinlikten küçük olmalıdır).
   4. sulamaYontemi: Damlama / Yağmurlama (Fıskiye) / Salma Sulama / Depo Dolumu / Ev/Villa seçeneği.
   5. saatlikSuIhtiyaci: İstenen debi (m³/saat veya Ton/Saat).
   6. elektrikTipi: "Monofaze" (220V) mi Yoksa "Trifaze" (380V) mi?
   7. kuyuCapi: Kuyu borusu kılıf iç çapı (Örnek: "4", "5", "6", "8", "10" inç).
   8. basilacakEnUzakNokta: Suyun basılacağı en uzak nokta (Tarla / Depo / Ev).
   9. anaBoruUzunlugu: Kuyu ağzı ile basılacak nokta arasındaki ana boru hattı uzunluğu (metre).
   10. kotFarki: Kuyu ağzı ile basılacak nokta arasındaki dikey rakım farkı (metre).
   11. gunlukCalismaSuresi: Günde kaç saat çalışma planlanıyor (default: 6 saat).

3. **Geçmişe Öncelik, Hafıza ve Tekrar Etmeme**:
   - Konuşma geçmişini (messages) ve mevcut tespit edilen parametreleri (currentParams) öncelikle say. Önceki cevapları asla unutma!
   - Aynı soruyu kesinlikle ikinci kez sormayacaksın! Eğer bir bilgi kaydedildiyse (currentParams içinde null değilse veya geçmişte zaten belirtildiyse) tekrar isteme.
   - Bilgi eksikse sadece o alanı sor, tüm süreci asla baştan başlatma!

4. **Kilitli Veriler (Değişiklik İstisnası)**:
   - Kullanıcı "değiştir", "güncelle", "düzelt", "revize", "farklı" veya "öyle değil" diyerek açıkça talep etmedikçe daha önce kaydedilmiş verileri asla değiştirme. Aynı şekilde koru.

5. **Konu Dışı (Off-Topic) Soruların Yönetimi ve Kaldığı Yerden Devam Etme**:
   - Eğer kullanıcı konu dışı bir şey sorarsa (Örn: "fiyatlar ne kadar?", "hangi marka satıyorsunuz?", "pompa nasıl çalışır?", "nerelisin?", "çay içtin mi?"), onu bir usta bilgeliği ve sıcaklığıyla kısaca cevapla.
   - Cevabın hemen ardından mutlaka şu köprü cümleyi kur: "**Şimdi kaldığımız yerden devam edelim dostum**" veya "**Hadi şimdi kaldığımız yerden devam edelim hemşerim**" diyerek bir sonraki eksik bilgiye geç ve o soruyu sor. Sohbeti asla bozma.

6. **Tüm Bilgiler Tamamlandığında (completed: true)**:
   - Tüm 11 parametre de dürüstçe tamamlandığında, "completed" alanını true yap.
   - Kullanıcıya mühendislik hesaplarının tamamlandığını, en ideal pompayı seçtiğimizi, teklif ve teknik raporu sağ panelde ("3 Alternatifli Teklif Raporu" sekmesinde) otomatik olarak hazırladığımızı sıcak, gururlu ve sevinçli bir dille müjdele!

Üslup ve Ton:
- Samimi, profesyonel, babacan, bilge ve son derece tecrübeli bir dalgıç pompa ustası gibi konuş.
- Türkçe konuş. "Dostum", "kardeşim", "hemşerim", "usta", "abi" gibi samimi hitapları dengeli ve sıcak bir tonda kullan.
- Asla bir robot veya form doldurma botu gibi görünme.

ÖNEMLİ FORMAT VE ÇİFT TIRNAK KURALLARI:
- responseText segmentinde kesinlikle çift tırnak (") karakterini birim belirtmek için veya tırnak işareti olarak kullanma! Çift tırnak kullanımı JSON yapısını bozmaktadır. Onun yerine "inç" kelimesini veya tek tırnak kullan.
- extractedParams içindeki kuyuCapi değerini sadece rakam olarak döndür (Örnek: "4", "5", "6", "8", "10").

Yanıtını her zaman responseSchema ile uyumlu ve tam geçerli bir JSON olarak dönmelisin.
`;

// Format messages to strictly alternate roles starting with 'user' for Gemini API requirements
function formatGeminiContents(messages: any[], currentParams: any) {
  const formatted: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  // If the conversation starts with a bot/model message, prepend a user message so it starts with user
  if (messages.length > 0 && messages[0].sender === "bot") {
    formatted.push({
      role: "user",
      parts: [{ text: "Merhaba Ahmet Usta." }]
    });
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const role = msg.sender === "bot" ? "model" : "user";
    
    if (formatted.length > 0 && formatted[formatted.length - 1].role === role) {
      // Merge texts for consecutive messages of the same role
      formatted[formatted.length - 1].parts[0].text += "\n" + msg.text;
    } else {
      formatted.push({
        role: role,
        parts: [{ text: msg.text }]
      });
    }
  }

  // Find the last user message to append the parameter context
  const paramsContext = `

[Sistem Bilgisi - Mevcut Tespit Edilen Parametreler]:
${JSON.stringify(currentParams, null, 2)}
Lütfen bu parametreleri göz önünde bulundurarak sohbeti yürüt. Eksik olanları sırasıyla tamamlamaya çalış. Hepsi tamamsa "completed": true yap.`;

  let lastUserIdx = -1;
  for (let i = formatted.length - 1; i >= 0; i--) {
    if (formatted[i].role === "user") {
      lastUserIdx = i;
      break;
    }
  }

  if (lastUserIdx !== -1) {
    formatted[lastUserIdx].parts[0].text += paramsContext;
  } else {
    formatted.push({
      role: "user",
      parts: [{ text: paramsContext }]
    });
  }

  return formatted;
}

function getNextQuestionAndState(params: any) {
  let nextQuestion = "";
  let completed = false;

  if (params.kuyuDerinligi === null) {
    nextQuestion = "Kuyunun toplam dikey sondaj derinliği yaklaşık kaç metredir dostum?";
  } else if (params.statikSuSeviyesi === null) {
    nextQuestion = `Peki **statik su seviyesi (motor çalışmıyorken durgun su seviyesi)** yüzeyden kaç metrededir hemşerim? (Kuyu derinliği olan ${params.kuyuDerinligi} metreden daha az olmalıdır).`;
  } else if (params.dinamikSuSeviyesi === null) {
    nextQuestion = `Peki **dinamik su seviyesi (pompa çalışırken suyun çekildiği dikey seviye)** yüzeyden kaç metredir usta? (Statik seviye olan ${params.statikSuSeviyesi} metreden daha derin olmalıdır).`;
  } else if (params.kuyuCapi === null) {
    nextQuestion = "Kuyu borusu kılıf iç çapı kaç inçtir hemşerim? (Genelde 4, 5, 6, 8 veya 10 inç olur).";
  } else if (params.elektrikTipi === null) {
    nextQuestion = "Kuyu başında elektrik şebekesi tipi nedir dostum? **Monofaze (220V Ev Tipi)** mi yoksa **Trifaze (380V Sanayi/Tarım Tipi)** mi?";
  } else if (params.kullanimAmaci === null) {
    nextQuestion = "Suyun ana kullanım amacı nedir dostum? Tarımsal Sulama mı, Bahçe Sulama mı, Hayvancılık mı, Evsel Tüketim mi yoksa başka bir amaç mı?";
  } else if (params.sulamaYontemi === null) {
    nextQuestion = "Sulama yöntemi veya su iletim yöntemi olarak hangisini planlıyorsun dostum? Damlama mı, Yağmurlama (Fıskiye) mi, Depo Dolumu mu, Ev/Villa besleme mi?";
  } else if (params.sulamaYontemi === "Yağmurlama") {
    if (params.fiskiyeSayisi === null) {
      nextQuestion = "Kaç adet fıskiye (yağmurlama tabancası) çalıştırmayı planlıyorsun dostum?";
    } else if (params.fiskiyeBasiSuIhtiyaci === null) {
      nextQuestion = "Peki fıskiye başına saatte kaç litre su akışı gerekiyor usta? (Örn: 1000 L/h veya 2000 L/h)";
    } else if (params.saatlikSuIhtiyaci === null) {
      params.saatlikSuIhtiyaci = Math.round(((params.fiskiyeSayisi * params.fiskiyeBasiSuIhtiyaci) / 1000) * 10) / 10;
      return getNextQuestionAndState(params);
    } else {
      return getNextQuestionAndStateForRemaining(params);
    }
  } else {
    if (params.saatlikSuIhtiyaci === null) {
      nextQuestion = "Saatlik su ihtiyacın (istenen debi) kaç ton (m³/saat) olmalıdır hemşerim?";
    } else {
      return getNextQuestionAndStateForRemaining(params);
    }
  }

  if (!nextQuestion) {
    completed = true;
  }

  return { nextQuestion, completed };
}

function getNextQuestionAndStateForRemaining(params: any) {
  let nextQuestion = "";
  let completed = false;

  if (params.anaBoruUzunlugu === null) {
    nextQuestion = "Kuyu ağzı ile basılacak nokta arasındaki ana boru hattı uzunluğu kaç metredir usta?";
  } else if (params.boruCapi === null) {
    nextQuestion = "Peki ana hattın boru dış çapı kaç milimetredir hemşerim? (Örn: 50 mm, 63 mm, 75 mm, 90 mm, 110 mm. Bilmiyorsan 'bilmiyorum' de, biz en idealini seçelim).";
  } else if (params.kotFarki === null) {
    nextQuestion = "Kuyu ağzı ile suyun basılacağı son nokta arasındaki dikey rakım farkı (kot farkı) kaç metredir hemşerim? (Eğer düz arazi ise 0 diyebilirsin).";
  } else if (params.basilacakEnUzakNokta === null) {
    nextQuestion = "Suyun basılacağı en uzak nokta neresidir dostum? Tarla mı, depo/havuz mu yoksa ev mi?";
  } else if (params.gunlukCalismaSuresi === null) {
    nextQuestion = "Sistemi günde ortalama kaç saat çalıştırmayı planlıyorsun dostum?";
  } else {
    completed = true;
  }

  return { nextQuestion, completed };
}

function getConfirmationText(field: string, value: any): string {
  const fieldNamesTr: { [key: string]: string } = {
    kuyuDerinligi: "Kuyu Derinliği",
    statikSuSeviyesi: "Statik Su Seviyesi",
    dinamikSuSeviyesi: "Dinamik Su Seviyesi",
    kuyuCapi: "Kuyu Çapı",
    elektrikTipi: "Elektrik Şebekesi",
    kullanimAmaci: "Kullanım Amacı",
    sulamaYontemi: "Sulama Yöntemi",
    fiskiyeSayisi: "Fıskiye Sayısı",
    fiskiyeBasiSuIhtiyaci: "Fıskiye Başı Su İhtiyacı",
    saatlikSuIhtiyaci: "Saatlik Su İhtiyacı (Debi)",
    basilacakEnUzakNokta: "Basılacak En Uzak Nokta",
    anaBoruUzunlugu: "Ana Boru Uzunluğu",
    boruCapi: "Boru Çapı",
    kotFarki: "Kot Farkı",
    gunlukCalismaSuresi: "Günlük Çalışma Süresi"
  };
  const fName = fieldNamesTr[field] || field;
  let displayVal = value;
  if (field === "kuyuDerinligi" || field === "statikSuSeviyesi" || field === "dinamikSuSeviyesi" || field === "anaBoruUzunlugu" || field === "kotFarki") {
    displayVal = `${value} metre`;
  } else if (field === "saatlikSuIhtiyaci") {
    displayVal = `${value} ton/saat`;
  } else if (field === "kuyuCapi") {
    displayVal = `${value} inç`;
  } else if (field === "gunlukCalismaSuresi") {
    displayVal = `${value} saat`;
  } else if (field === "fiskiyeSayisi") {
    displayVal = `${value} adet`;
  } else if (field === "fiskiyeBasiSuIhtiyaci") {
    displayVal = `${value} L/h`;
  } else if (field === "boruCapi") {
    displayVal = `${value} mm`;
  } else if (field === "elektrikTipi") {
    displayVal = value === "Monofaze" ? "Monofaze (220V)" : "Trifaze (380V)";
  }
  
  const warmPhrases = [
    `Tamamdır hemşerim, **${fName}** bilgisini **${displayVal}** olarak defterime yazdım.`,
    `Harika usta! **${fName}** alanını **${displayVal}** şeklinde kaydettim.`,
    `Çok güzel dostum, **${fName}** değerini **${displayVal}** olarak güncelledim.`,
    `Anlaşıldı usta, **${fName}** bilgisini **${displayVal}** aldım.`
  ];
  return warmPhrases[Math.floor(Math.random() * warmPhrases.length)];
}

function mergeAndValidateParams(currentParams: any, geminiParams: any, userText: string) {
  const textLower = userText.toLowerCase().trim();
  const wantsToChange = textLower.includes("değiştir") || textLower.includes("güncelle") || textLower.includes("düzelt") || textLower.includes("revize") || textLower.includes("yanlış") || textLower.includes("farklı") || textLower.includes("öyle değil");

  const hasDerinlikKeyword = textLower.includes("derinlik") || textLower.includes("derinliği") || textLower.includes("kuyu dikey");
  const hasStatikKeyword = textLower.includes("statik") || textLower.includes("durgun");
  const hasDinamikKeyword = textLower.includes("dinamik") || textLower.includes("çekilen") || textLower.includes("çalışırken");
  const hasDebiKeyword = textLower.includes("ton") || textLower.includes("m3") || textLower.includes("metreküp") || textLower.includes("debi") || textLower.includes("su ihtiyacı") || textLower.includes("ihtiyac");
  const hasYatayKeyword = textLower.includes("ana boru") || textLower.includes("yatay") || textLower.includes("mesafe") || textLower.includes("boru uzunluğu") || textLower.includes("hat boyu");
  const hasKotKeyword = textLower.includes("kot") || textLower.includes("rakım") || textLower.includes("yükseklik farkı");
  const hasHoursKeyword = textLower.includes("saat") && (textLower.includes("günlük") || textLower.includes("günde") || textLower.includes("çalışma"));
  const hasCapKeyword = textLower.includes("çap") || textLower.includes("inç") || textLower.includes("lik") || textLower.includes("lık") || textLower.includes("lük") || textLower.includes("inc");
  const hasFiskiyeKeyword = textLower.includes("fıskiye") || textLower.includes("fiskiye") || textLower.includes("tabanca");

  const fieldKeywords: { [key: string]: boolean } = {
    kuyuDerinligi: hasDerinlikKeyword,
    statikSuSeviyesi: hasStatikKeyword,
    dinamikSuSeviyesi: hasDinamikKeyword,
    saatlikSuIhtiyaci: hasDebiKeyword,
    anaBoruUzunlugu: hasYatayKeyword,
    kotFarki: hasKotKeyword,
    gunlukCalismaSuresi: hasHoursKeyword,
    kuyuCapi: hasCapKeyword,
    sulamaYontemi: textLower.includes("sulama") || textLower.includes("damlama") || textLower.includes("yağmurlama") || textLower.includes("fıskiye") || textLower.includes("yağmurlama"),
    elektrikTipi: textLower.includes("elektrik") || textLower.includes("monofaze") || textLower.includes("trifaze"),
    kullanimAmaci: textLower.includes("amaç") || textLower.includes("amacı") || textLower.includes("bahçe") || textLower.includes("tarım") || textLower.includes("evsel"),
    fiskiyeSayisi: hasFiskiyeKeyword && (textLower.includes("adet") || textLower.includes("tane") || textLower.includes("sayısı")),
    fiskiyeBasiSuIhtiyaci: hasFiskiyeKeyword && (textLower.includes("litre") || textLower.includes(" debi") || textLower.includes("saatte")),
    boruCapi: textLower.includes("boru") && hasCapKeyword,
    basilacakEnUzakNokta: textLower.includes("tarla") || textLower.includes("depo") || textLower.includes("havuz") || textLower.includes("ev") || textLower.includes("nokta")
  };

  const merged = { ...currentParams };

  for (const key of Object.keys(merged)) {
    const newVal = geminiParams[key];
    if (newVal !== undefined && newVal !== null && newVal !== "") {
      const isAlreadyFilled = merged[key] !== null && merged[key] !== undefined && merged[key] !== "";
      
      if (isAlreadyFilled) {
        if (wantsToChange || fieldKeywords[key]) {
          merged[key] = newVal;
        }
      } else {
        merged[key] = newVal;
      }
    }
  }

  return merged;
}

function runLocalDialogueEngine(userMessage: string, currentParams: any, messages: any[]) {
  const text = userMessage.toLowerCase().trim();
  
  // Clone parameters
  const params = {
    kuyuDerinligi: currentParams?.kuyuDerinligi ?? null,
    statikSuSeviyesi: currentParams?.statikSuSeviyesi ?? null,
    dinamikSuSeviyesi: currentParams?.dinamikSuSeviyesi ?? null,
    kuyuCapi: currentParams?.kuyuCapi ?? null,
    elektrikTipi: currentParams?.elektrikTipi ?? null,
    kullanimAmaci: currentParams?.kullanimAmaci ?? null,
    sulamaYontemi: currentParams?.sulamaYontemi ?? null,
    fiskiyeSayisi: currentParams?.fiskiyeSayisi ?? null,
    fiskiyeBasiSuIhtiyaci: currentParams?.fiskiyeBasiSuIhtiyaci ?? null,
    saatlikSuIhtiyaci: currentParams?.saatlikSuIhtiyaci ?? null,
    anaBoruUzunlugu: currentParams?.anaBoruUzunlugu ?? null,
    boruCapi: currentParams?.boruCapi ?? null,
    kotFarki: currentParams?.kotFarki ?? null,
    basilacakEnUzakNokta: currentParams?.basilacakEnUzakNokta ?? null,
    gunlukCalismaSuresi: currentParams?.gunlukCalismaSuresi ?? null,
  };

  // State-bound sequential active field resolution
  let lastAskedField: string | null = null;
  if (params.kuyuDerinligi === null) {
    lastAskedField = "kuyuDerinligi";
  } else if (params.statikSuSeviyesi === null) {
    lastAskedField = "statikSuSeviyesi";
  } else if (params.dinamikSuSeviyesi === null) {
    lastAskedField = "dinamikSuSeviyesi";
  } else if (params.kuyuCapi === null) {
    lastAskedField = "kuyuCapi";
  } else if (params.elektrikTipi === null) {
    lastAskedField = "elektrikTipi";
  } else if (params.kullanimAmaci === null) {
    lastAskedField = "kullanimAmaci";
  } else if (params.sulamaYontemi === null) {
    lastAskedField = "sulamaYontemi";
  } else if (params.sulamaYontemi === "Yağmurlama") {
    if (params.fiskiyeSayisi === null) {
      lastAskedField = "fiskiyeSayisi";
    } else if (params.fiskiyeBasiSuIhtiyaci === null) {
      lastAskedField = "fiskiyeBasiSuIhtiyaci";
    } else if (params.saatlikSuIhtiyaci === null) {
      lastAskedField = "saatlikSuIhtiyaci";
    } else {
      lastAskedField = getRemainingLastAskedField(params);
    }
  } else {
    if (params.saatlikSuIhtiyaci === null) {
      lastAskedField = "saatlikSuIhtiyaci";
    } else {
      lastAskedField = getRemainingLastAskedField(params);
    }
  }

  function getRemainingLastAskedField(p: any) {
    if (p.anaBoruUzunlugu === null) return "anaBoruUzunlugu";
    if (p.boruCapi === null) return "boruCapi";
    if (p.kotFarki === null) return "kotFarki";
    if (p.basilacakEnUzakNokta === null) return "basilacakEnUzakNokta";
    if (p.gunlukCalismaSuresi === null) return "gunlukCalismaSuresi";
    return null;
  }

  // Check for solo update request
  const isSoloUpdate = text === "güncelle" || text === "değiştir" || text === "düzelt" || text === "güncelleme" || text === "değişiklik" || text === "revize et" || text === "düzeltme";
  if (isSoloUpdate) {
    const responseText = "Hangi bilgiyi güncellemek istiyorsun hemşerim? Kuyu derinliği mi, statik su seviyesi mi, dinamik su seviyesi mi, boru çapı mı, elektrik tipi mi, sulama yöntemi mi yoksa fıskiye detayları mı? Değiştirmek istediğin alanı belirt, gerisini bana bırak!";
    return {
      responseText,
      extractedParams: params,
      completed: false,
      isFallback: true
    };
  }

  // Check if user says "bilmiyorum" or similar for estimation
  const isDontKnow = text.includes("bilmiyorum") || text.includes("tahmin") || text.includes("bilmiyoruz") || text.includes("bilmem") || text.includes("belirsiz");
  let estimationText = "";
  if (isDontKnow && lastAskedField) {
    if (lastAskedField === "statikSuSeviyesi" && params.kuyuDerinligi) {
      const est = Math.round(params.kuyuDerinligi * 0.3);
      params.statikSuSeviyesi = est;
      estimationText = `Hemşerim, statik su seviyesini kuyu derinliğine göre yaklaşık **${est} metre** olarak tahmin ettim, bilgin olsun.`;
    } else if (lastAskedField === "dinamikSuSeviyesi" && params.kuyuDerinligi) {
      const est = Math.round(params.kuyuDerinligi * 0.45);
      params.dinamikSuSeviyesi = est;
      estimationText = `Hemşerim, dinamik su seviyesini de yaklaşık **${est} metre** olarak tahmin ettim, bilgin olsun.`;
    } else if (lastAskedField === "boruCapi") {
      params.boruCapi = 50;
      estimationText = "Peki hemşerim, boru dış çapını en yaygın kullanılan **50 mm** olarak seçtim, hidrolik hesaplamada bunu kullanacağız.";
    } else if (lastAskedField === "kotFarki") {
      params.kotFarki = 0;
      estimationText = "Tamamdır usta, kot farkını düz arazi kabul edip **0 metre** olarak kaydettim.";
    }

    if (estimationText) {
      const nextInfo = getNextQuestionAndState(params);
      const randomTransitions = [
        "Şimdi sıradakine geçiyoruz:",
        "Bunu kaydettim usta. Şimdi sıradakine geçelim:",
        "Hadi sıradaki eksik bilgiye geçelim:",
        "Şimdi sıradaki soruya geçiyoruz:"
      ];
      const trans = randomTransitions[Math.floor(Math.random() * randomTransitions.length)];
      return {
        responseText: `${estimationText}\n\n${trans}\n\n${nextInfo.nextQuestion}`,
        extractedParams: params,
        completed: nextInfo.completed,
        isFallback: true
      };
    }
  }

  // Extract numbers
  function extractNumbers(str: string): number[] {
    const matches = str.match(/\d+(?:[.,]\d+)?/g);
    if (!matches) return [];
    return matches.map(m => parseFloat(m.replace(",", ".")));
  }
  const numbers = extractNumbers(text);

  // Field keywords detection
  const hasDerinlikKeyword = text.includes("derinlik") || text.includes("derinliği") || text.includes("kuyu dikey") || (text.includes("kuyu") && !text.includes("çap") && !text.includes("temiz"));
  const hasStatikKeyword = text.includes("statik") || text.includes("durgun");
  const hasDinamikKeyword = text.includes("dinamik") || text.includes("çekilen") || text.includes("çalışırken");
  const hasDebiKeyword = text.includes("ton") || text.includes("m3") || text.includes("metreküp") || text.includes("debi") || text.includes("su ihtiyacı") || text.includes("ihtiyac");
  const hasYatayKeyword = text.includes("ana boru") || text.includes("yatay") || text.includes("mesafe") || text.includes("boru uzunluğu") || text.includes("hat boyu");
  const hasKotKeyword = text.includes("kot") || text.includes("rakım") || text.includes("yükseklik farkı");
  const hasHoursKeyword = text.includes("saat") && (text.includes("günlük") || text.includes("günde") || text.includes("çalışma"));
  const hasCapKeyword = text.includes("çap") || text.includes("inç") || text.includes("lik") || text.includes("lık") || text.includes("lük") || text.includes("inc");
  const hasFiskiyeKeyword = text.includes("fıskiye") || text.includes("fiskiye") || text.includes("tabanca");

  let detectedElektrik: "Monofaze" | "Trifaze" | null = null;
  if (text.includes("monofaze") || text.includes("monofaz") || text.includes("ev elektrik") || text.includes("220v") || text.includes("220 v")) {
    detectedElektrik = "Monofaze";
  } else if (text.includes("trifaze") || text.includes("trifaz") || text.includes("sanayi") || text.includes("tarım") || text.includes("380v") || text.includes("380 v") || text.includes("üç faz")) {
    detectedElektrik = "Trifaze";
  }

  let detectedSulama: string | null = null;
  if (text.includes("damlama") || text.includes("damla")) {
    detectedSulama = "Damlama";
  } else if (text.includes("fıskiye") || text.includes("fiskiye") || text.includes("yağmurlama") || text.includes("yagmurlama")) {
    detectedSulama = "Yağmurlama";
  } else if (text.includes("salma") || text.includes("serbest")) {
    detectedSulama = "Salma Sulama";
  } else if (text.includes("depo") || text.includes("dolum") || text.includes("havuz")) {
    detectedSulama = "Depo Dolumu";
  } else if (text.includes("ev") || text.includes("villa") || text.includes("içme") || text.includes("icme")) {
    detectedSulama = "Ev/Villa";
  }

  let detectedNokta: string | null = null;
  if (text.includes("tarla")) {
    detectedNokta = "Tarla";
  } else if (text.includes("depo") || text.includes("havuz")) {
    detectedNokta = "Depo";
  } else if (text.includes("ev") || text.includes("villa")) {
    detectedNokta = "Ev";
  }

  let detectedAmac: string | null = null;
  if (text.includes("tarımsal") || text.includes("tarim") || text.includes("sulama") || text.includes("çiftlik")) {
    detectedAmac = "Tarımsal Sulama";
  } else if (text.includes("bahçe") || text.includes("hobi")) {
    detectedAmac = "Bahçe Sulama";
  } else if (text.includes("hayvan") || text.includes("besi") || text.includes("ahır")) {
    detectedAmac = "Hayvancılık";
  } else if (text.includes("evsel") || text.includes("içme") || text.includes("musluk") || text.includes("kullanım")) {
    detectedAmac = "Evsel Tüketim";
  }

  let updatedField: string | null = null;
  let updatedValue: any = null;

  // RULE 1: If there is exactly 1 number and no other field keywords, map strictly to the active (lastAsked) question.
  if (lastAskedField && numbers.length === 1 && !hasDerinlikKeyword && !hasStatikKeyword && !hasDinamikKeyword && !hasDebiKeyword && !hasYatayKeyword && !hasKotKeyword && !hasHoursKeyword && !hasCapKeyword && !hasFiskiyeKeyword) {
    if ([
      "kuyuDerinligi", "statikSuSeviyesi", "dinamikSuSeviyesi",
      "saatlikSuIhtiyaci", "anaBoruUzunlugu", "boruCapi", "kotFarki", "gunlukCalismaSuresi",
      "fiskiyeSayisi", "fiskiyeBasiSuIhtiyaci"
    ].includes(lastAskedField)) {
      updatedField = lastAskedField;
      updatedValue = numbers[0];
    } else if (lastAskedField === "kuyuCapi") {
      const val = numbers[0];
      if ([4, 5, 6, 8, 10].includes(val)) {
        updatedField = "kuyuCapi";
        updatedValue = val.toString();
      }
    }
  }

  // RULE 2: Check categorical responses to active question
  if (!updatedField && lastAskedField) {
    if (lastAskedField === "sulamaYontemi" && detectedSulama) {
      updatedField = "sulamaYontemi";
      updatedValue = detectedSulama;
    } else if (lastAskedField === "elektrikTipi" && detectedElektrik) {
      updatedField = "elektrikTipi";
      updatedValue = detectedElektrik;
    } else if (lastAskedField === "basilacakEnUzakNokta" && detectedNokta) {
      updatedField = "basilacakEnUzakNokta";
      updatedValue = detectedNokta;
    } else if (lastAskedField === "kullanimAmaci" && detectedAmac) {
      updatedField = "kullanimAmaci";
      updatedValue = detectedAmac;
    }
  }

  // RULE 3: Explicit field updates with keywords and numbers
  if (!updatedField && numbers.length === 1) {
    if (hasDerinlikKeyword) {
      updatedField = "kuyuDerinligi";
      updatedValue = numbers[0];
    } else if (hasStatikKeyword) {
      updatedField = "statikSuSeviyesi";
      updatedValue = numbers[0];
    } else if (hasDinamikKeyword) {
      updatedField = "dinamikSuSeviyesi";
      updatedValue = numbers[0];
    } else if (hasDebiKeyword) {
      updatedField = "saatlikSuIhtiyaci";
      updatedValue = numbers[0];
    } else if (hasYatayKeyword) {
      updatedField = "anaBoruUzunlugu";
      updatedValue = numbers[0];
    } else if (hasKotKeyword) {
      updatedField = "kotFarki";
      updatedValue = numbers[0];
    } else if (hasHoursKeyword) {
      updatedField = "gunlukCalismaSuresi";
      updatedValue = numbers[0];
    } else if (hasCapKeyword) {
      const val = numbers[0];
      if ([4, 5, 6, 8, 10].includes(val)) {
        updatedField = "kuyuCapi";
        updatedValue = val.toString();
      }
    } else if (hasFiskiyeKeyword && text.includes("saat")) {
      updatedField = "fiskiyeBasiSuIhtiyaci";
      updatedValue = numbers[0];
    } else if (hasFiskiyeKeyword) {
      updatedField = "fiskiyeSayisi";
      updatedValue = numbers[0];
    }
  }

  // RULE 4: Explicit non-numeric parameter detection
  if (!updatedField) {
    if (detectedElektrik && !hasDerinlikKeyword && !hasStatikKeyword) {
      updatedField = "elektrikTipi";
      updatedValue = detectedElektrik;
    } else if (detectedSulama) {
      updatedField = "sulamaYontemi";
      updatedValue = detectedSulama;
    } else if (detectedNokta && lastAskedField === "basilacakEnUzakNokta") {
      updatedField = "basilacakEnUzakNokta";
      updatedValue = detectedNokta;
    } else if (detectedAmac) {
      updatedField = "kullanimAmaci";
      updatedValue = detectedAmac;
    }
  }

  // If we couldn't resolve any update, and there are multiple numbers or complex text, return null to let Gemini handle it
  if (!updatedField) {
    const isGreeting = text === "merhaba" || text === "selam" || text === "slm" || text === "merhabalar" || text === "selamlar" || text === "hey" || text === "hoşbulduk" || text === "hosbulduk";
    if (isGreeting) {
      const testParams = { ...params };
      const nextInfo = getNextQuestionAndState(testParams);
      let responseText = "Aleykümselam dostum, hoş geldin! 😊 \n\n";
      if (nextInfo.completed) {
        responseText += "Gerekli tüm bilgileri aldık, hesaplamayı tamamladık. Detayları sağ paneldeki teklif raporunda görebilirsin hemşerim!";
      } else {
        responseText += "Sıradaki eksik bilgimizi alalım:\n\n" + nextInfo.nextQuestion;
      }
      return {
        responseText,
        extractedParams: params,
        completed: nextInfo.completed,
        isFallback: true
      };
    }

    const catalogKeywords = ["hangi", "satıyorsunuz", "ne var", "katalog", "marka", "model", "stok", "pompa", "fiyat", "maliyet", "bütçe", "para", "tutar"];
    const hasCatalogQuery = catalogKeywords.some(kw => text.includes(kw));
    if (hasCatalogQuery) {
      const testParams = { ...params };
      const nextInfo = getNextQuestionAndState(testParams);
      let responseText = "Dostum, elimizde yüksek verimli paslanmaz çelik IMPO ve RN serisi dalgıç pompalarımız ile Franklin Electric motorlarımız var. Sana en dürüst mühendislik çözümlerini kuruyoruz.\n\n";
      if (nextInfo.completed) {
        responseText += "Mühendislik hesaplarımı çıkardım. En verimli pompa alternatif bütçelerini sağdaki \"3 Alternatifli Teklif Raporu\" panelinde inceleyebilirsin dostum! Başka sorun varsa buradayım! 🛠️🌾";
      } else {
        responseText += "**Şimdi kaldığımız yerden devam edelim dostum.** \n\n" + nextInfo.nextQuestion;
      }
      return {
        responseText,
        extractedParams: params,
        completed: nextInfo.completed,
        isFallback: true
      };
    }

    return null; // Let Gemini handle complex dialogue
  }

  // Perform parameter validations if we updated something
  if (updatedField && updatedValue !== null) {
    const wantsToChange = text.includes("değiştir") || text.includes("güncelle") || text.includes("düzelt") || text.includes("revize") || text.includes("yanlış") || text.includes("farklı") || text.includes("öyle değil");
    const explicitMention = (updatedField === "kuyuDerinligi" && hasDerinlikKeyword) ||
                           (updatedField === "statikSuSeviyesi" && hasStatikKeyword) ||
                           (updatedField === "dinamikSuSeviyesi" && hasDinamikKeyword) ||
                           (updatedField === "saatlikSuIhtiyaci" && hasDebiKeyword) ||
                           (updatedField === "anaBoruUzunlugu" && hasYatayKeyword) ||
                           (updatedField === "kotFarki" && hasKotKeyword) ||
                           (updatedField === "gunlukCalismaSuresi" && hasHoursKeyword) ||
                           (updatedField === "kuyuCapi" && hasCapKeyword) ||
                           (updatedField === "sulamaYontemi" && detectedSulama) ||
                           (updatedField === "elektrikTipi" && detectedElektrik) ||
                           (updatedField === "kullanimAmaci" && detectedAmac) ||
                           (updatedField === "fiskiyeSayisi" && hasFiskiyeKeyword) ||
                           (updatedField === "fiskiyeBasiSuIhtiyaci" && hasFiskiyeKeyword) ||
                           (updatedField === "basilacakEnUzakNokta" && detectedNokta);

    if (params[updatedField] !== null && params[updatedField] !== undefined && params[updatedField] !== "") {
      if (!wantsToChange && !explicitMention) {
        const fieldNamesTr: { [key: string]: string } = {
          kuyuDerinligi: "Kuyu Derinliği",
          statikSuSeviyesi: "Statik Su Seviyesi",
          dinamikSuSeviyesi: "Dinamik Su Seviyesi",
          kuyuCapi: "Kuyu Çapı",
          elektrikTipi: "Elektrik Şebekesi",
          kullanimAmaci: "Kullanım Amacı",
          sulamaYontemi: "Sulama Yöntemi",
          fiskiyeSayisi: "Fıskiye Sayısı",
          fiskiyeBasiSuIhtiyaci: "Fıskiye Başı Su İhtiyacı",
          saatlikSuIhtiyaci: "Saatlik Su İhtiyacı (Debi)",
          basilacakEnUzakNokta: "Basılacak En Uzak Nokta",
          anaBoruUzunlugu: "Ana Boru Uzunluğu",
          boruCapi: "Boru Çapı",
          kotFarki: "Kot Farkı",
          gunlukCalismaSuresi: "Günlük Çalışma Süresi"
        };
        const fName = fieldNamesTr[updatedField] || updatedField;
        const responseText = `Hemşerim, **${fName}** alanını daha önce **${params[updatedField]}** olarak kaydetmiştik. Eğer bu değeri değiştirmek istiyorsan, lütfen 'bunu değiştir' veya 'güncelle' diyerek yeni değeri belirtir misin? Yanlışlıkla üzerine yazmayalım dostum. 😊`;
        
        return {
          responseText,
          extractedParams: params,
          completed: false,
          isFallback: true
        };
      }
    }

    params[updatedField] = updatedValue;

    // Automatic Debi calculation for Sprinklers
    if (params.sulamaYontemi === "Yağmurlama" && params.fiskiyeSayisi && params.fiskiyeBasiSuIhtiyaci) {
      params.saatlikSuIhtiyaci = Math.round(((params.fiskiyeSayisi * params.fiskiyeBasiSuIhtiyaci) / 1000) * 10) / 10;
    }
  }

  // Logical validations
  let warning = "";
  if (params.kuyuDerinligi && params.statikSuSeviyesi) {
    if (params.statikSuSeviyesi > params.kuyuDerinligi) {
      warning = `Usta bir saniye! Kuyu derinliği **${params.kuyuDerinligi} metre** iken statik su seviyesi nasıl **${params.statikSuSeviyesi} metre** olabilir? Su dibin de altında olamaz hemşerim. Lütfen bu değerleri bir kontrol et.`;
      params.statikSuSeviyesi = null;
    }
  }
  if (params.statikSuSeviyesi && params.dinamikSuSeviyesi) {
    if (params.dinamikSuSeviyesi < params.statikSuSeviyesi) {
      warning = `Usta dikkat! Pompa çalışırken su seviyesi yükselmez, çekilir. Dolayısıyla dinamik su seviyesi (**${params.dinamikSuSeviyesi} m**), statik seviyeden (**${params.statikSuSeviyesi} m**) daha derinde olmalıdır. Bunu düzeltelim hemşerim.`;
      params.dinamikSuSeviyesi = null;
    }
  }
  if (params.kuyuDerinligi && params.dinamikSuSeviyesi) {
    if (params.dinamikSuSeviyesi > params.kuyuDerinligi) {
      warning = `Eyvah! Dinamik su seviyesi (**${params.dinamikSuSeviyesi} m**), kuyu dikey derinliğini (**${params.kuyuDerinligi} m**) aşamaz dostum. Pompa susuz kalıp yanabilir. Değerleri gözden geçirelim.`;
      params.dinamikSuSeviyesi = null;
    }
  }

  if (warning) {
    return {
      responseText: warning,
      extractedParams: params,
      completed: false,
      isFallback: true
    };
  }

  // Calculate next question and status
  const nextInfo = getNextQuestionAndState(params);
  
  let responseText = "";
  if (nextInfo.completed) {
    responseText = getConfirmationText(updatedField!, updatedValue) + "\n\n" +
                   `Eyvallah dostum! Mühendislik hesapları için gereken tüm parametreleri dürüstçe tamamladık ve onayladım:\n\n` +
                   `- **Kuyu Derinliği:** ${params.kuyuDerinligi} m\n` +
                   `- **Statik / Dinamik Su Seviyeleri:** ${params.statikSuSeviyesi} m / ${params.dinamikSuSeviyesi} m\n` +
                   `- **Sulama Tipi / Noktası:** ${params.sulamaYontemi} / ${params.basilacakEnUzakNokta}\n` +
                   `- **Saatlik Su İhtiyacı (Debi):** ${params.saatlikSuIhtiyaci} m³/saat\n` +
                   `- **Elektrik Bağlantısı:** ${params.elektrikTipi}\n` +
                   `- **Kuyu Çapı:** ${params.kuyuCapi} inç\n` +
                   `- **Ana Boru / Boru Çapı / Kot Farkı:** ${params.anaBoruUzunlugu} m / ${params.boruCapi || "Seçilecek"} mm / ${params.kotFarki} m\n` +
                   `- **Günlük Çalışma:** ${params.gunlukCalismaSuresi} saat\n\n` +
                   `Mühendislik hesaplarımı çıkardım. En verimli IMPO pompa alternatif bütçelerini sağdaki "3 Alternatifli Teklif Raporu" panelinde inceleyebilirsin dostum! Başka sorun varsa buradayım! 🛠️🌾`;
  } else {
    const randomTransitions = [
      "Tamam hemşerim, şimdi sıradakine geçiyoruz:",
      "Harika usta, bu bilgiyi yazdım deftere. Şimdi sıradakine geçelim:",
      "Süper dostum, bunu da cebe koyduk. Hadi sıradaki eksik bilgiye geçelim:",
      "Çok güzel hemşerim, şimdi sıradakine geçiyoruz:"
    ];
    const trans = randomTransitions[Math.floor(Math.random() * randomTransitions.length)];
    responseText = getConfirmationText(updatedField!, updatedValue) + `\n\n${trans}\n\n` + nextInfo.nextQuestion;
  }

  return {
    responseText,
    extractedParams: params,
    completed: nextInfo.completed,
    isFallback: true
  };
}

function fallbackAhmetUstaChat(userMessage: string, currentParams: any, messages: any[]) {
  const result = runLocalDialogueEngine(userMessage, currentParams, messages);
  if (result) return result;

  const params = {
    kuyuDerinligi: currentParams?.kuyuDerinligi ?? null,
    statikSuSeviyesi: currentParams?.statikSuSeviyesi ?? null,
    dinamikSuSeviyesi: currentParams?.dinamikSuSeviyesi ?? null,
    kuyuCapi: currentParams?.kuyuCapi ?? null,
    elektrikTipi: currentParams?.elektrikTipi ?? null,
    kullanimAmaci: currentParams?.kullanimAmaci ?? null,
    sulamaYontemi: currentParams?.sulamaYontemi ?? null,
    fiskiyeSayisi: currentParams?.fiskiyeSayisi ?? null,
    fiskiyeBasiSuIhtiyaci: currentParams?.fiskiyeBasiSuIhtiyaci ?? null,
    saatlikSuIhtiyaci: currentParams?.saatlikSuIhtiyaci ?? null,
    anaBoruUzunlugu: currentParams?.anaBoruUzunlugu ?? null,
    boruCapi: currentParams?.boruCapi ?? null,
    kotFarki: currentParams?.kotFarki ?? null,
    basilacakEnUzakNokta: currentParams?.basilacakEnUzakNokta ?? null,
    gunlukCalismaSuresi: currentParams?.gunlukCalismaSuresi ?? null,
  };
  const nextInfo = getNextQuestionAndState(params);
  return {
    responseText: "Anladım hemşerim. Şimdi kaldığımız yerden devam edelim:\n\n" + nextInfo.nextQuestion,
    extractedParams: params,
    completed: nextInfo.completed,
    isFallback: true
  };
}


// Cleans up common double-quote and control character issues in Gemini's response JSON
function cleanResponseTextQuotes(jsonStr: string): string {
  try {
    const greedyRegex = /"responseText"\s*:\s*"([\s\S]*)"\s*,\s*"(extractedParams|completed)"/i;
    const match = jsonStr.match(greedyRegex);
    if (match) {
      const fullMatch = match[0];
      const rawContent = match[1];
      const nextKey = match[2];

      let sanitizedContent = "";
      for (let i = 0; i < rawContent.length; i++) {
        const char = rawContent[i];
        if (char === '"') {
          const isEscaped = i > 0 && rawContent[i - 1] === '\\';
          if (!isEscaped) {
            sanitizedContent += "'";
          } else {
            sanitizedContent += char;
          }
        } else if (char === '\n') {
          sanitizedContent += '\\n';
        } else if (char === '\r') {
          sanitizedContent += '\\r';
        } else if (char === '\t') {
          sanitizedContent += '\\t';
        } else {
          sanitizedContent += char;
        }
      }

      const cleanedSegment = `"responseText": "${sanitizedContent}",\n  "${nextKey}"`;
      return jsonStr.replace(fullMatch, cleanedSegment);
    }
  } catch (err) {
    console.error("Error sanitizing JSON text quotes:", err);
  }
  return jsonStr;
}

// Generate content with built-in retry logic for high resilience against temporary 503, 429, or 504 errors
async function generateWithRetry(geminiContents: any, retries = 2, delayMs = 1500) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: geminiContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 2000,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              responseText: {
                type: Type.STRING,
                description: "The warm, friendly, sincere Turkish response to the user.",
              },
              extractedParams: {
                type: Type.OBJECT,
                description: "The detected well/pump parameters.",
                properties: {
                  kuyuDerinligi: { type: Type.NUMBER, nullable: true },
                  statikSuSeviyesi: { type: Type.NUMBER, nullable: true },
                  dinamikSuSeviyesi: { type: Type.NUMBER, nullable: true },
                  sulamaYontemi: { type: Type.STRING, nullable: true },
                  saatlikSuIhtiyaci: { type: Type.NUMBER, nullable: true },
                  elektrikTipi: { 
                    type: Type.STRING, 
                    nullable: true,
                    description: "Must be exactly 'Monofaze' or 'Trifaze' or null."
                  },
                  kuyuCapi: { 
                    type: Type.STRING, 
                    nullable: true,
                    description: "Well diameter in inches as a clean number string without any quote marks. Example: '4', '5', '6', '8', '10'."
                  },
                  basilacakEnUzakNokta: { type: Type.STRING, nullable: true },
                  anaBoruUzunlugu: { type: Type.NUMBER, nullable: true },
                  kotFarki: { type: Type.NUMBER, nullable: true },
                  gunlukCalismaSuresi: { type: Type.NUMBER, nullable: true }
                },
              },
              completed: {
                type: Type.BOOLEAN,
                description: "Whether we have successfully gathered all 11 required parameters.",
              },
            },
            required: ["responseText", "extractedParams", "completed"],
          },
        },
      });
    } catch (err: any) {
      console.warn(`Gemini generation attempt ${i + 1} failed. Error: ${err?.message || err}`);
      
      let errStr = "";
      try {
        errStr = [
          err?.message,
          err?.status,
          err?.statusText,
          err?.code,
          typeof err === "object" ? JSON.stringify(err) : "",
          err?.toString ? err.toString() : ""
        ].filter(Boolean).join(" ").toLowerCase();
      } catch (stringifyErr) {
        errStr = (err?.message || err?.toString() || "").toLowerCase();
      }

      const isRetryable = errStr.includes("503") || 
                        errStr.includes("504") ||
                        errStr.includes("unavailable") || 
                        errStr.includes("429") || 
                        errStr.includes("resource_exhausted") || 
                        errStr.includes("overloaded") ||
                        errStr.includes("timeout") ||
                        errStr.includes("deadline") ||
                        errStr.includes("expired") ||
                        errStr.includes("fetch failed") ||
                        errStr.includes("headers timeout");
      
      if (i === retries || !isRetryable) {
        throw err;
      }
      // Linear backoff delay with jitter
      await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1) + Math.random() * 200));
    }
  }
}


async function startServer() {
  const app = express();
  app.use(express.json());

  // AI Chat endpoint
  app.post("/api/advisor/chat", async (req, res) => {
    try {
      const { messages, currentParams } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
      }

      const lastUserMessageObj = messages && messages.length > 0 ? messages[messages.length - 1] : null;
      const lastUserText = lastUserMessageObj ? lastUserMessageObj.text : "Merhaba";

      // 1. Try our deterministic local rules engine first!
      const localResult = runLocalDialogueEngine(lastUserText, currentParams, messages);
      if (localResult !== null) {
        return res.json(localResult);
      }

      // 2. Format messages using our robust helper to avoid roles mismatch or truncation
      const geminiContents = formatGeminiContents(messages, currentParams);

      const response = await generateWithRetry(geminiContents, 2, 1500);

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response from Gemini API");
      }

      let parsedResult;
      try {
        let cleaned = resultText.trim();
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```(?:json)?\n/, "");
          if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
          }
          cleaned = cleaned.trim();
        }
        cleaned = cleanResponseTextQuotes(cleaned);
        parsedResult = JSON.parse(cleaned);
      } catch (jsonErr: any) {
        console.warn("Standard JSON.parse failed, attempting robust regex extraction fallback...", jsonErr);
        try {
          let responseText = "";
          const match1 = resultText.match(/"responseText"\s*:\s*"([\s\S]*?)"\s*,\s*"/i);
          const match2 = resultText.match(/"responseText"\s*:\s*"([\s\S]*?)"\s*}/i);
          if (match1) {
            responseText = match1[1];
          } else if (match2) {
            responseText = match2[1];
          } else {
            const indexHeader = resultText.indexOf('"responseText"');
            if (indexHeader !== -1) {
              const startQuote = resultText.indexOf('"', indexHeader + 14);
              if (startQuote !== -1) {
                const endPos = resultText.indexOf('"extractedParams"');
                if (endPos !== -1) {
                  let sub = resultText.substring(startQuote + 1, endPos);
                  sub = sub.trim();
                  if (sub.endsWith(",")) sub = sub.substring(0, sub.length - 1).trim();
                  if (sub.endsWith('"')) sub = sub.substring(0, sub.length - 1);
                  responseText = sub;
                }
              }
            }
          }

          if (!responseText) {
            responseText = "Anlaşılmıştır hemşerim. Detayları hesaplayıp sağ panele yansıtıyorum!";
          }

          const extractedParams = {
            kuyuDerinligi: null as number | null,
            statikSuSeviyesi: null as number | null,
            dinamikSuSeviyesi: null as number | null,
            sulamaYontemi: null as string | null,
            saatlikSuIhtiyaci: null as number | null,
            elektrikTipi: null as string | null,
            kuyuCapi: null as string | null,
            basilacakEnUzakNokta: null as string | null,
            anaBoruUzunlugu: null as number | null,
            kotFarki: null as number | null,
            gunlukCalismaSuresi: null as number | null
          };

          const kuyuDerinligiMatch = resultText.match(/"kuyuDerinligi"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const statikSuSeviyesiMatch = resultText.match(/"statikSuSeviyesi"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const dinamikSuSeviyesiMatch = resultText.match(/"dinamikSuSeviyesi"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const sulamaYontemiMatch = resultText.match(/"sulamaYontemi"\s*:\s*"([^"]+)"/i);
          const saatlikSuIhtiyaciMatch = resultText.match(/"saatlikSuIhtiyaci"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const elektrikTipiMatch = resultText.match(/"elektrikTipi"\s*:\s*"([^"]+)"/i);
          const kuyuCapiMatch = resultText.match(/"kuyuCapi"\s*:\s*"([^"]+)"/i);
          const basilacakEnUzakNoktaMatch = resultText.match(/"basilacakEnUzakNokta"\s*:\s*"([^"]+)"/i) || resultText.match(/"basilacakNokta"\s*:\s*"([^"]+)"/i);
          const anaBoruUzunluguMatch = resultText.match(/"anaBoruUzunlugu"\s*:\s*(\d+(?:\.\d+)?|null)/i) || resultText.match(/"yatayBoruUzunlugu"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const kotFarkiMatch = resultText.match(/"kotFarki"\s*:\s*(\d+(?:\.\d+)?|null)/i);
          const gunlukCalismaSuresiMatch = resultText.match(/"gunlukCalismaSuresi"\s*:\s*(\d+(?:\.\d+)?|null)/i);

          if (kuyuDerinligiMatch && kuyuDerinligiMatch[1] !== "null") {
            extractedParams.kuyuDerinligi = Number(kuyuDerinligiMatch[1]);
          }
          if (statikSuSeviyesiMatch && statikSuSeviyesiMatch[1] !== "null") {
            extractedParams.statikSuSeviyesi = Number(statikSuSeviyesiMatch[1]);
          }
          if (dinamikSuSeviyesiMatch && dinamikSuSeviyesiMatch[1] !== "null") {
            extractedParams.dinamikSuSeviyesi = Number(dinamikSuSeviyesiMatch[1]);
          }
          if (sulamaYontemiMatch && sulamaYontemiMatch[1] !== "null") {
            extractedParams.sulamaYontemi = sulamaYontemiMatch[1];
          }
          if (saatlikSuIhtiyaciMatch && saatlikSuIhtiyaciMatch[1] !== "null") {
            extractedParams.saatlikSuIhtiyaci = Number(saatlikSuIhtiyaciMatch[1]);
          }
          if (elektrikTipiMatch && elektrikTipiMatch[1] !== "null") {
            extractedParams.elektrikTipi = elektrikTipiMatch[1];
          }
          if (kuyuCapiMatch && kuyuCapiMatch[1] !== "null") {
            extractedParams.kuyuCapi = kuyuCapiMatch[1];
          }
          if (basilacakEnUzakNoktaMatch && basilacakEnUzakNoktaMatch[1] !== "null") {
            extractedParams.basilacakEnUzakNokta = basilacakEnUzakNoktaMatch[1];
          }
          if (anaBoruUzunluguMatch && anaBoruUzunluguMatch[1] !== "null") {
            extractedParams.anaBoruUzunlugu = Number(anaBoruUzunluguMatch[1]);
          }
          if (kotFarkiMatch && kotFarkiMatch[1] !== "null") {
            extractedParams.kotFarki = Number(kotFarkiMatch[1]);
          }
          if (gunlukCalismaSuresiMatch && gunlukCalismaSuresiMatch[1] !== "null") {
            extractedParams.gunlukCalismaSuresi = Number(gunlukCalismaSuresiMatch[1]);
          }

          const completedMatch = resultText.match(/"completed"\s*:\s*(true|false)/i);
          const completed = completedMatch ? completedMatch[1].toLowerCase() === "true" : false;

          parsedResult = {
            responseText: responseText.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
            extractedParams,
            completed
          };
        } catch (fallbackErr) {
          console.error("Robust regex extraction fallback also failed:", fallbackErr);
          throw jsonErr;
        }
      }
      
      // Normalize parameter names for frontend consistency (anaBoruUzunlugu, basilacakEnUzakNokta)
      if (parsedResult && parsedResult.extractedParams) {
        const ep = parsedResult.extractedParams as any;
        if (ep.basilacakNokta !== undefined && ep.basilacakEnUzakNokta === undefined) {
          ep.basilacakEnUzakNokta = ep.basilacakNokta;
        }
        if (ep.yatayBoruUzunlugu !== undefined && ep.anaBoruUzunlugu === undefined) {
          ep.anaBoruUzunlugu = ep.yatayBoruUzunlugu;
        }
        delete ep.basilacakNokta;
        delete ep.yatayBoruUzunlugu;

        // Smart merge & validation with currentParams to prevent incorrect overwrites
        parsedResult.extractedParams = mergeAndValidateParams(currentParams, parsedResult.extractedParams, lastUserText);

        // Consistency checks and validation warnings
        const epMerged = parsedResult.extractedParams;
        let warningText = "";
        if (epMerged.kuyuDerinligi && epMerged.statikSuSeviyesi) {
          if (epMerged.statikSuSeviyesi > epMerged.kuyuDerinligi) {
            warningText = `Usta bir saniye! Kuyu derinliği **${epMerged.kuyuDerinligi} metre** iken statik su seviyesi nasıl **${epMerged.statikSuSeviyesi} metre** olabilir? Su dibin de altında olamaz hemşerim. Lütfen bu değerleri bir kontrol et.`;
            epMerged.statikSuSeviyesi = null;
          }
        }
        if (epMerged.statikSuSeviyesi && epMerged.dinamikSuSeviyesi) {
          if (epMerged.dinamikSuSeviyesi < epMerged.statikSuSeviyesi) {
            warningText = `Usta dikkat! Pompa çalışırken su seviyesi yükselmez, çekilir. Dolayısıyla dinamik su seviyesi (**${epMerged.dinamikSuSeviyesi} m**), statik seviyeden (**${epMerged.statikSuSeviyesi} m**) daha derinde olmalıdır. Bunu düzeltelim hemşerim.`;
            epMerged.dinamikSuSeviyesi = null;
          }
        }
        if (epMerged.kuyuDerinligi && epMerged.dinamikSuSeviyesi) {
          if (epMerged.dinamikSuSeviyesi > epMerged.kuyuDerinligi) {
            warningText = `Eyvah! Dinamik su seviyesi (**${epMerged.dinamikSuSeviyesi} m**), kuyu dikey derinliğini (**${epMerged.kuyuDerinligi} m**) aşamaz dostum. Pompa susuz kalıp yanabilir. Değerleri gözden geçirelim.`;
            epMerged.dinamikSuSeviyesi = null;
          }
        }

        if (warningText) {
          parsedResult.responseText = warningText;
          parsedResult.completed = false;
        } else {
          // Re-calculate the actual state-driven next question to maintain fixed order
          const nextInfo = getNextQuestionAndState(parsedResult.extractedParams);
          parsedResult.completed = nextInfo.completed;

          if (nextInfo.completed) {
            parsedResult.responseText = `Eyvallah dostum! Mühendislik hesapları için gereken tüm parametreleri dürüstçe tamamladık ve onayladım:\n\n` +
                           `- **Kuyu Derinliği:** ${epMerged.kuyuDerinligi} m\n` +
                           `- **Statik / Dinamik Su Seviyeleri:** ${epMerged.statikSuSeviyesi} m / ${epMerged.dinamikSuSeviyesi} m\n` +
                           `- **Sulama Tipi / Noktası:** ${epMerged.sulamaYontemi} / ${epMerged.basilacakEnUzakNokta}\n` +
                           `- **Saatlik Su İhtiyacı (Debi):** ${epMerged.saatlikSuIhtiyaci} m³/saat\n` +
                           `- **Elektrik Bağlantısı:** ${epMerged.elektrikTipi}\n` +
                           `- **Kuyu Çapı:** ${epMerged.kuyuCapi} inç\n` +
                           `- **Ana Boru / Boru Çapı / Kot Farkı:** ${epMerged.anaBoruUzunlugu} m / ${epMerged.boruCapi || "Seçilecek"} mm / ${epMerged.kotFarki} m\n` +
                           `- **Günlük Çalışma:** ${epMerged.gunlukCalismaSuresi} saat\n\n` +
                           `Mühendislik hesaplarımı çıkardım. En verimli IMPO pompa alternatif bütçelerini sağdaki "3 Alternatifli Teklif Raporu" panelinde inceleyebilirsin dostum! Başka sorun varsa buradayım! 🛠️🌾`;
          } else {
            // Append the correct next question if not present
            const firstWordOfNextQ = nextInfo.nextQuestion.split(" ")[0];
            if (!parsedResult.responseText.includes(firstWordOfNextQ)) {
              parsedResult.responseText += "\n\n" + nextInfo.nextQuestion;
            }
          }
        }
      }

      res.json(parsedResult);
    } catch (error: any) {
      console.warn("Gemini API Error, falling back to local Ahmet Usta rules engine:", error);
      try {
        const { messages, currentParams } = req.body;
        const lastUserMessageObj = messages && messages.length > 0 ? messages[messages.length - 1] : null;
        const lastUserText = lastUserMessageObj ? lastUserMessageObj.text : "Merhaba";
        
        const fallbackResult = fallbackAhmetUstaChat(lastUserText, currentParams, messages || []);
        res.json(fallbackResult);
      } catch (fallbackErr) {
        console.error("Local dialogue fallback engine failed:", fallbackErr);
        res.status(200).json({
          responseText: "Kusura bakma dostum, sistemlerimde hafif bir yoğunluk var. Şöyle yapalım, kuyu derinliğini ve diğer detayları bana tekrar yazarsan hemen sağdaki panelden hesaplamanı tamamlayayım! 🛠️",
          extractedParams: req.body.currentParams || {},
          completed: false,
        });
      }
    }
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
