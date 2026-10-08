import React, { useState, useRef, useEffect } from "react";
import { performPumpSelection, SelectionInput, SelectionResult } from "../data/expertEngine";
import { 
  Bot, User, Send, Droplets, RotateCcw, CheckCircle2, Zap, 
  ArrowUpDown, Disc, ClipboardList, Loader2, Sparkles, AlertCircle,
  Volume2, VolumeX, Mic, MicOff, MessageSquareText, ShieldCheck, MapPin, Gauge
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

interface AIPumpAdvisorProps {
  onUpdateInput: (input: SelectionInput, result: SelectionResult | null) => void;
  activeInput: SelectionInput;
  onNavigateToProposal?: () => void;
}

export default function AIPumpAdvisor({ onUpdateInput, activeInput, onNavigateToProposal }: AIPumpAdvisorProps) {
  // 15 Parameters State
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

  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("Ahmet Usta hesap defterini açıyor...");
  const [completed, setCompleted] = useState(false);

  // Dynamic cycling waiting messages effect while waiting for Ahmet Usta
  useEffect(() => {
    if (!isTyping) {
      setTypingMessage("Ahmet Usta hesap defterini açıyor...");
      return;
    }

    const lastUserMsg = [...messages].reverse().find(m => m.sender === "user")?.text || "";
    const text = lastUserMsg.toLowerCase().trim();
    
    let waitingMessages = [
      "Ahmet Usta projenizi dikkatle düşünüyor, hemen yanıt hazırlıyor...",
      "Usta çayından bir yudum alıp mühendislik hesaplarını inceliyor...",
      "Ahmet Usta hesap defterine tüm parametreleri kaydediyor...",
      "Hemen yardımcı oluyorum usta, azıcık bekletiyorum..."
    ];

    if (
      text.includes("fiyat") || text.includes("tutar") || text.includes("para") || text.includes("maliyet")
    ) {
      waitingMessages = [
        "Ahmet Usta pompa ve motor fiyat teklifini hesaplıyor...",
        "Franklin motorlu sistem bütçesini kontrol ediyorum hemşerim...",
        "Kablo kesiti ve kontrol panosu bütçesini derliyorum, azıcık sabret...",
        "Sana en uygun maliyet teklifini çıkarmak için sayfaları karıştırıyorum..."
      ];
    } else if (
      text.includes("metre") || text.includes("seviye") || text.includes("debi") || text.includes("çap")
    ) {
      waitingMessages = [
        "Ahmet Usta manometrik yüksekliği (TDH) çıkarıyor...",
        "Sürtünme kayıplarını ve boru mukavemetini hesaplıyorum, az kaldı...",
        "Dikey döküş yüksekliği ve kot farkına göre pompa kademesini seçiyorum...",
        "Gen İnovasyon uzman mühendislik tablolarını eşleştiriyorum..."
      ];
    }

    setTypingMessage(waitingMessages[0]);

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % waitingMessages.length;
      setTypingMessage(waitingMessages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isTyping, messages.length]);
  
  // Voice Synthesis (Text-to-Speech) state
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Voice Recognition (Speech-to-Text) states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync states when updated externally from the wizard or manual inputs
  useEffect(() => {
    if (activeInput.kuyuDerinligi > 0) {
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
    } else if (activeInput.kuyuDerinligi === 0) {
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
      setCompleted(false);
      setMessages([
        {
          id: `msg_greet_reset_${Date.now()}`,
          sender: "bot",
          text: "Sohbeti sıfırladık dostum, baştan tertemiz ve dürüstçe başlayalım! 😊\n\nKuyunun toplam dikey derinliğini metre olarak söyler misin? Oradan başlayalım.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
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

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "msg_greet",
            sender: "bot",
            text: "Selamlar dostum! 😊 Ben Ahmet Usta. Kuyun için en ideal ve verimli dalgıç pompa sistemini birlikte dürüstçe seçelim. Kuyunun toplam dikey derinliği yaklaşık kaç metre? Oradan dürüstçe başlayalım.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "tr-TR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? prev + " " + speechToText : speechToText));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech Synthesis player function
  const speakText = (text: string, msgId: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Maalesef tarayıcınız ses sentezini desteklemiyor.");
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "tr-TR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.startsWith("tr"));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = (err) => {
      console.error("Speech Synthesis Error:", err);
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Tarayıcınız sesli mikrofon girişini (Speech Recognition) desteklemiyor. Google Chrome veya MS Edge kullanmanızı tavsiye ederim!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    if (!textToSend) {
      setInputVal("");
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newUserMessage: Message = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text,
      timestamp,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const fetchWithBackoff = async (
        url: string,
        bodyData: any,
        maxRetries = 3,
        baseDelay = 1000
      ): Promise<any> => {
        let delay = baseDelay;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyData),
            });

            if (!res.ok) {
              const isRetryable = [408, 429, 500, 502, 503, 504].includes(res.status);
              if (attempt < maxRetries && isRetryable) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
                continue;
              }
              throw new Error(`HTTP_STATUS_ERROR_${res.status}`);
            }

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("INVALID_JSON_RESPONSE");
            }

            return await res.json();
          } catch (err: any) {
            if (attempt < maxRetries && err.message !== "INVALID_JSON_RESPONSE" && !err.message?.startsWith("HTTP_STATUS_ERROR_4")) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= 2;
              continue;
            }
            throw err;
          }
        }
        throw new Error("MAX_RETRIES_EXCEEDED");
      };

      const data = await fetchWithBackoff("/api/advisor/chat", {
        messages: updatedMessages,
        currentParams: {
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
        },
      });

      // Local State Update
      if (data.extractedParams) {
        const ep = data.extractedParams;
        if (ep.kuyuDerinligi !== undefined && ep.kuyuDerinligi !== null) setKuyuDerinligi(ep.kuyuDerinligi);
        if (ep.statikSuSeviyesi !== undefined && ep.statikSuSeviyesi !== null) setStatikSuSeviyesi(ep.statikSuSeviyesi);
        if (ep.dinamikSuSeviyesi !== undefined && ep.dinamikSuSeviyesi !== null) setDinamikSuSeviyesi(ep.dinamikSuSeviyesi);
        if (ep.kuyuCapi !== undefined && ep.kuyuCapi !== null) setKuyuCapi(ep.kuyuCapi);
        if (ep.elektrikTipi !== undefined && ep.elektrikTipi !== null) setElektrikTipi(ep.elektrikTipi);
        if (ep.sulamaYontemi !== undefined && ep.sulamaYontemi !== null) setSulamaYontemi(ep.sulamaYontemi);
        if (ep.kullanimAmaci !== undefined && ep.kullanimAmaci !== null) setKullanimAmaci(ep.kullanimAmaci);
        if (ep.saatlikSuIhtiyaci !== undefined && ep.saatlikSuIhtiyaci !== null) setSaatlikSuIhtiyaci(ep.saatlikSuIhtiyaci);
        if (ep.fiskiyeSayisi !== undefined && ep.fiskiyeSayisi !== null) setFiskiyeSayisi(ep.fiskiyeSayisi);
        if (ep.fiskiyeBasiSuIhtiyaci !== undefined && ep.fiskiyeBasiSuIhtiyaci !== null) setFiskiyeBasiSuIhtiyaci(ep.fiskiyeBasiSuIhtiyaci);
        if (ep.anaBoruUzunlugu !== undefined && ep.anaBoruUzunlugu !== null) setAnaBoruUzunlugu(ep.anaBoruUzunlugu);
        if (ep.boruCapi !== undefined && ep.boruCapi !== null) setBoruCapi(ep.boruCapi);
        if (ep.kotFarki !== undefined && ep.kotFarki !== null) setKotFarki(ep.kotFarki);
        if (ep.basilacakEnUzakNokta !== undefined && ep.basilacakEnUzakNokta !== null) setBasilacakEnUzakNokta(ep.basilacakEnUzakNokta);
        if (ep.gunlukCalismaSuresi !== undefined && ep.gunlukCalismaSuresi !== null) setGunlukCalismaSuresi(ep.gunlukCalismaSuresi);
      }

      if (data.completed) {
        setCompleted(true);
      }

      // Check final parameters for calculation trigger
      const finalKuyuDerinligi = data.extractedParams?.kuyuDerinligi ?? kuyuDerinligi;
      const finalStatikSuSeviyesi = data.extractedParams?.statikSuSeviyesi ?? statikSuSeviyesi;
      const finalDinamikSuSeviyesi = data.extractedParams?.dinamikSuSeviyesi ?? dinamikSuSeviyesi;
      const finalKuyuCapi = data.extractedParams?.kuyuCapi ?? kuyuCapi;
      const finalElektrikTipi = data.extractedParams?.elektrikTipi ?? elektrikTipi;
      const finalSulamaYontemi = data.extractedParams?.sulamaYontemi ?? sulamaYontemi;
      const finalKullanimAmaci = data.extractedParams?.kullanimAmaci ?? kullanimAmaci;
      const finalSaatlikSuIhtiyaci = data.extractedParams?.saatlikSuIhtiyaci ?? saatlikSuIhtiyaci;
      const finalFiskiyeSayisi = data.extractedParams?.fiskiyeSayisi ?? fiskiyeSayisi;
      const finalFiskiyeBasiSuIhtiyaci = data.extractedParams?.fiskiyeBasiSuIhtiyaci ?? fiskiyeBasiSuIhtiyaci;
      const finalAnaBoruUzunlugu = data.extractedParams?.anaBoruUzunlugu ?? anaBoruUzunlugu;
      const finalBoruCapi = data.extractedParams?.boruCapi ?? boruCapi;
      const finalKotFarki = data.extractedParams?.kotFarki ?? kotFarki;
      const finalBasilacakEnUzakNokta = data.extractedParams?.basilacakEnUzakNokta ?? basilacakEnUzakNokta;
      const finalGunlukCalismaSuresi = data.extractedParams?.gunlukCalismaSuresi ?? gunlukCalismaSuresi;

      // Trigger automatic calculation if minimum core data is provided
      if (finalKuyuDerinligi && finalSaatlikSuIhtiyaci && finalElektrikTipi && finalKuyuCapi && finalSulamaYontemi) {
        const input: SelectionInput = {
          kuyuDerinligi: finalKuyuDerinligi,
          statikSuSeviyesi: finalStatikSuSeviyesi || Math.round(finalKuyuDerinligi * 0.3),
          dinamikSuSeviyesi: finalDinamikSuSeviyesi || Math.round(finalKuyuDerinligi * 0.45),
          kuyuCapi: finalKuyuCapi,
          elektrikTipi: finalElektrikTipi,
          sulamaYontemi: finalSulamaYontemi,
          kullanimAmaci: finalKullanimAmaci || "Tarımsal Sulama",
          saatlikSuIhtiyaci: finalSaatlikSuIhtiyaci,
          fiskiyeSayisi: finalFiskiyeSayisi || 0,
          fiskiyeBasiSuIhtiyaci: finalFiskiyeBasiSuIhtiyaci || 0,
          anaBoruUzunlugu: finalAnaBoruUzunlugu || 100,
          boruCapi: finalBoruCapi || 50,
          kotFarki: finalKotFarki || 15,
          basilacakEnUzakNokta: finalBasilacakEnUzakNokta || "Depo",
          gunlukCalismaSuresi: finalGunlukCalismaSuresi || 6
        };

        const result = performPumpSelection(input);
        onUpdateInput(input, result);
      } else {
        // Not enough data yet - keep pump selection empty
        onUpdateInput({
          kuyuDerinligi: finalKuyuDerinligi || 0,
          statikSuSeviyesi: finalStatikSuSeviyesi || 0,
          dinamikSuSeviyesi: finalDinamikSuSeviyesi || 0,
          kuyuCapi: finalKuyuCapi || "",
          elektrikTipi: finalElektrikTipi || null as any,
          sulamaYontemi: finalSulamaYontemi || "",
          kullanimAmaci: finalKullanimAmaci || "",
          saatlikSuIhtiyaci: finalSaatlikSuIhtiyaci || 0,
          fiskiyeSayisi: finalFiskiyeSayisi || 0,
          fiskiyeBasiSuIhtiyaci: finalFiskiyeBasiSuIhtiyaci || 0,
          anaBoruUzunlugu: finalAnaBoruUzunlugu || 0,
          boruCapi: finalBoruCapi || 0,
          kotFarki: finalKotFarki || 0,
          basilacakEnUzakNokta: finalBasilacakEnUzakNokta || "",
          gunlukCalismaSuresi: finalGunlukCalismaSuresi || 0
        }, null);
      }

      const botMsgId = `msg_bot_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "bot",
          text: data.responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);

    } catch (error: any) {
      console.error("Advisor chat error:", error);
      let errorMsg = "Usta, internet bağlantısında veya sunucuda küçük bir dalgalanma oldu. Ama sorun değil, ben buradayım! Sen sağ panelden bilgileri doldurarak hesaplamaları kesintisiz yapabilirsin. 🛠️";
      
      if (error.message?.includes("503")) {
        errorMsg = "Usta, şu an sunucu yoğunluğundan dolayı geçici bir kesinti yaşıyoruz (Hata: 503). Ancak Ahmet Usta olarak yanındayım! Sağ panelden kuyu bilgilerini girerek hesaplamanı sürdürebilirsin. 🛠️";
      } else if (error.message?.includes("429")) {
        errorMsg = "Kısa sürede çok istek aldık dostum (Hata: 429). Lütfen birkaç saniye bekleyip tekrar yaz. Ben sağ paneldeki hesapları güncel tutuyorum! ⏳";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_bot_err_${Date.now()}`,
          sender: "bot",
          text: errorMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
    setCompleted(false);
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `msg_greet_reset_${Date.now()}`,
        sender: "bot",
        text: "Sohbeti sıfırladık dostum, baştan dürüstçe başlayalım! 😊\n\nKuyunun toplam dikey derinliğini metre olarak söyler misin? Oradan başlayalım.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);

    const clearedInput: SelectionInput = {
      kuyuDerinligi: 0,
      statikSuSeviyesi: 0,
      dinamikSuSeviyesi: 0,
      kuyuCapi: "",
      elektrikTipi: null as any,
      sulamaYontemi: "",
      kullanimAmaci: "",
      saatlikSuIhtiyaci: 0,
      fiskiyeSayisi: 0,
      fiskiyeBasiSuIhtiyaci: 0,
      anaBoruUzunlugu: 0,
      boruCapi: 0,
      kotFarki: 0,
      basilacakEnUzakNokta: "",
      gunlukCalismaSuresi: 0
    };
    onUpdateInput(clearedInput, null);
  };

  const getQuickReplies = () => {
    if (kuyuDerinligi === null) {
      return [
        { label: "50 metre", value: "50" },
        { label: "100 metre", value: "100" },
        { label: "150 metre", value: "150" },
        { label: "Nasıl Çalışır?", value: "Sistem nasıl çalışıyor, hangi marka dalgıç pompaları satıyorsunuz usta?" }
      ];
    }
    if (statikSuSeviyesi === null) {
      return [
        { label: "20 metre", value: "20" },
        { label: "35 metre", value: "35" },
        { label: "Bilmiyorum (Tahmin Et)", value: "bilmiyorum" }
      ];
    }
    if (dinamikSuSeviyesi === null) {
      return [
        { label: "40 metre", value: "40" },
        { label: "55 metre", value: "55" },
        { label: "Bilmiyorum (Tahmin Et)", value: "bilmiyorum" }
      ];
    }
    if (kuyuCapi === "") {
      return [
        { label: "4 İnç", value: "4" },
        { label: "5 İnç", value: "5" },
        { label: "6 İnç", value: "6" },
        { label: "8 İnç", value: "8" }
      ];
    }
    if (elektrikTipi === null) {
      return [
        { label: "Monofaze (220V Ev Tipi)", value: "Monofaze" },
        { label: "Trifaze (380V Sanayi)", value: "Trifaze" }
      ];
    }
    if (kullanimAmaci === "") {
      return [
        { label: "Tarımsal Sulama", value: "Tarımsal Sulama" },
        { label: "Bahçe Sulama", value: "Bahçe Sulama" },
        { label: "Evsel Tüketim", value: "Evsel Tüketim" }
      ];
    }
    if (sulamaYontemi === "") {
      return [
        { label: "Damlama Sulama", value: "Damlama" },
        { label: "Yağmurlama (Fıskiye)", value: "Yağmurlama" },
        { label: "Depo Dolumu", value: "Depo Dolumu" },
        { label: "Ev/Villa Besleme", value: "Ev/Villa" }
      ];
    }
    if (sulamaYontemi === "Yağmurlama") {
      if (fiskiyeSayisi === null) {
        return [
          { label: "10 Adet fıskiye", value: "10" },
          { label: "20 Adet fıskiye", value: "20" },
          { label: "30 Adet fıskiye", value: "30" }
        ];
      }
      if (fiskiyeBasiSuIhtiyaci === null) {
        return [
          { label: "1000 Litre/saat", value: "1000" },
          { label: "1500 Litre/saat", value: "1500" },
          { label: "2000 Litre/saat", value: "2000" }
        ];
      }
    } else {
      if (saatlikSuIhtiyaci === null) {
        return [
          { label: "3 ton/saat", value: "3" },
          { label: "5 ton/saat", value: "5" },
          { label: "10 ton/saat", value: "10" }
        ];
      }
    }
    if (anaBoruUzunlugu === null) {
      return [
        { label: "50 metre", value: "50" },
        { label: "100 metre", value: "100" },
        { label: "200 metre", value: "200" }
      ];
    }
    if (boruCapi === null) {
      return [
        { label: "50 mm", value: "50" },
        { label: "63 mm", value: "63" },
        { label: "75 mm", value: "75" },
        { label: "Bilmiyorum", value: "bilmiyorum" }
      ];
    }
    if (kotFarki === null) {
      return [
        { label: "0 metre (Düz)", value: "0" },
        { label: "10 metre", value: "10" },
        { label: "25 metre", value: "25" },
        { label: "Bilmiyorum", value: "bilmiyorum" }
      ];
    }
    if (basilacakEnUzakNokta === "") {
      return [
        { label: "Tarla", value: "Tarla" },
        { label: "Depo/Havuz", value: "Depo" },
        { label: "Ev/Yazlık", value: "Ev" }
      ];
    }
    if (gunlukCalismaSuresi === null) {
      return [
        { label: "4 saat/gün", value: "4" },
        { label: "6 saat/gün", value: "6" },
        { label: "8 saat/gün", value: "8" }
      ];
    }
    return [
      { label: "Teklif Detayları", value: "Bana bu sistem için kuruşu kuruşuna bütçe teklifini göster usta" },
      { label: "Enerji Tüketimi Nedir?", value: "Günlük ve aylık elektrik enerjisi tüketimi ne kadar olur?" },
      { label: "Hangi markalar var?", value: "Elinizde satılık hangi marka pompa motor sistemleri var usta?" }
    ];
  };

  const getParamProgress = () => {
    let count = 0;
    if (kuyuDerinligi !== null && kuyuDerinligi > 0) count++;
    if (statikSuSeviyesi !== null && statikSuSeviyesi > 0) count++;
    if (dinamikSuSeviyesi !== null && dinamikSuSeviyesi > 0) count++;
    if (kuyuCapi) count++;
    if (elektrikTipi) count++;
    if (sulamaYontemi) count++;
    if (kullanimAmaci) count++;
    if (saatlikSuIhtiyaci !== null && saatlikSuIhtiyaci > 0) count++;
    if (sulamaYontemi === "Yağmurlama" ? (fiskiyeSayisi !== null && fiskiyeSayisi >= 0) : true) count++;
    if (sulamaYontemi === "Yağmurlama" ? (fiskiyeBasiSuIhtiyaci !== null && fiskiyeBasiSuIhtiyaci >= 0) : true) count++;
    if (anaBoruUzunlugu !== null && anaBoruUzunlugu >= 0) count++;
    if (boruCapi !== null && boruCapi > 0) count++;
    if (kotFarki !== null && kotFarki >= 0) count++;
    if (basilacakEnUzakNokta) count++;
    if (gunlukCalismaSuresi !== null && gunlukCalismaSuresi > 0) count++;
    return Math.min(15, count);
  };

  const progressCount = getParamProgress();
  const totalRequired = sulamaYontemi === "Yağmurlama" ? 15 : 13;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="ai-pump-advisor-grid">
      
      {/* Parameter Discovery Panel */}
      <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between" id="ai-parameter-panel">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600 animate-pulse shrink-0" />
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Mühendislik Defteri</h4>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-extrabold border border-blue-100">
              {progressCount} / {totalRequired} Veri
            </span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${(progressCount / totalRequired) * 100}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ahmet Usta bir mühendis samimiyetiyle projenizin 15 hidrolik verisini analiz eder, tutarlılığını onaylar ve sistemi seçer.
          </p>

          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1" id="param-tracking-list">
            {[
              { label: "1. Kuyu Derinliği", val: kuyuDerinligi ? `${kuyuDerinligi} m` : null, icon: <ArrowUpDown size={13} /> },
              { label: "2. Statik Su Seviyesi", val: statikSuSeviyesi ? `${statikSuSeviyesi} m` : null, icon: <Droplets size={13} /> },
              { label: "3. Dinamik Su Seviyesi", val: dinamikSuSeviyesi ? `${dinamikSuSeviyesi} m` : null, icon: <Gauge size={13} /> },
              { label: "4. Kuyu Çapı (İç)", val: kuyuCapi ? `${kuyuCapi} inç` : null, icon: <Disc size={13} /> },
              { label: "5. Elektrik Şebekesi", val: elektrikTipi || null, icon: <Zap size={13} /> },
              { label: "6. Sulama Yöntemi", val: sulamaYontemi || null, icon: <ClipboardList size={13} /> },
              { label: "7. Kullanım Amacı", val: kullanimAmaci || null, icon: <ClipboardList size={13} /> },
              { label: "8. İstenen Debi (Q)", val: saatlikSuIhtiyaci ? `${saatlikSuIhtiyaci} m³/h` : null, icon: <Droplets size={13} /> },
              ...(sulamaYontemi === "Yağmurlama" ? [
                { label: "9. Fıskiye Sayısı", val: fiskiyeSayisi !== null ? `${fiskiyeSayisi} adet` : null, icon: <ClipboardList size={13} /> },
                { label: "10. Fıskiye Başı Su", val: fiskiyeBasiSuIhtiyaci !== null ? `${fiskiyeBasiSuIhtiyaci} L/h` : null, icon: <Droplets size={13} /> }
              ] : []),
              { label: "11. Ana Boru Uzunluğu", val: anaBoruUzunlugu !== null ? `${anaBoruUzunlugu} m` : null, icon: <ArrowUpDown size={13} /> },
              { label: "12. Boru Dış Çapı (mm)", val: boruCapi !== null ? `${boruCapi} mm` : null, icon: <Disc size={13} /> },
              { label: "13. Kot Farkı (Dikey)", val: kotFarki !== null ? `${kotFarki} m` : null, icon: <ArrowUpDown size={13} /> },
              { label: "14. Basılacak En Uzak Nokta", val: basilacakEnUzakNokta || null, icon: <MapPin size={13} /> },
              { label: "15. Günlük Çalışma Süresi", val: gunlukCalismaSuresi ? `${gunlukCalismaSuresi} saat/gün` : null, icon: <ClipboardList size={13} /> }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                  item.val ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${item.val ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-400"}`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold text-[11px]">{item.label}</span>
                </div>
                <span className="font-extrabold text-[11px] text-right">
                  {item.val || <span className="text-[10px] text-slate-400 font-bold animate-pulse">Eksik</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ready status callout */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          progressCount >= 6
            ? "bg-blue-50 border-blue-100 text-blue-800"
            : "bg-slate-50 border-slate-200/50 text-slate-500"
        }`}>
          <div className="flex items-start gap-2 text-[11px]">
            {progressCount >= 6 ? (
              <>
                <ShieldCheck className="text-blue-600 mt-0.5 shrink-0" size={15} />
                <div>
                  <strong className="block font-bold">Mühendislik Analizi Hazır!</strong>
                  <span>Gerekli veriler alındı. Detaylı Teklif Raporunuzu ve 3 farklı alternatif sistemi görmek için yandaki sekmeye geçebilirsiniz.</span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-slate-400 mt-0.5 shrink-0" size={15} />
                <span>Gerçekçi dürüst hesaplamalar ve 3 farklı alternatif bütçe için kuyu bilgilerini sohbette tamamlayın.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modern Conversational Area */}
      <div className="lg:col-span-2 flex flex-col h-[580px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="chat-container">
        
        {/* Advisor Header */}
        <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-slate-100" id="chat-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Bot size={20} className="text-blue-600 shrink-0" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm leading-tight">Dalgıç Pompa Mühendisi (Ahmet Usta)</h3>
              <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                Gerçek Mühendislik ve Dürüst Analiz Sesi Aktif
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            id="btn-reset-chat"
          >
            <RotateCcw size={13} />
            <span>Sıfırla</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30" id="chat-history-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user" ? "bg-slate-200 text-slate-700" : "bg-blue-600 text-white shadow-sm"
                }`}
              >
                {msg.sender === "user" ? <User size={13} /> : <Bot size={13} />}
              </div>
              <div className="space-y-1 w-full">
                <div className="flex items-start gap-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm border flex-1 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white border-blue-500 rounded-tr-none font-medium"
                        : "bg-white text-slate-700 border-slate-100 rounded-tl-none font-medium"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "bot" && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`p-1.5 rounded-lg border transition-all shrink-0 mt-1 cursor-pointer ${
                        speakingMsgId === msg.id
                          ? "bg-amber-100 border-amber-300 text-amber-700 animate-pulse"
                          : "bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300"
                      }`}
                    >
                      {speakingMsgId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between px-1 text-[9px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "bot" && speakingMsgId === msg.id && (
                    <span className="text-amber-600 font-extrabold animate-pulse">Ahmet Usta konuşuyor...</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%]" id="typing-indicator">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={13} />
              </div>
              <div className="bg-blue-50/50 border border-blue-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={13} className="text-blue-600 animate-spin shrink-0" />
                <span className="text-xs font-bold text-slate-600 animate-pulse">{typingMessage}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Voice listening waves */}
        {isListening && (
          <div className="bg-rose-50 border-t border-rose-100 px-5 py-2.5 flex items-center justify-between text-xs text-rose-700 font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>Sizi Dinliyorum... Konuşun (Türkçe)</span>
            </span>
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-0.5 bg-rose-600 animate-bounce h-2" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-0.5 bg-rose-600 animate-bounce h-3" style={{ animationDelay: "0.3s" }}></div>
              <div className="w-0.5 bg-rose-600 animate-bounce h-1" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
        )}

        {/* Navigation Button on Completion */}
        {completed && onNavigateToProposal && (
          <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in" id="completion-navigation-banner">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="text-xs font-bold leading-relaxed">Tüm parametreler tamamlandı! Ahmet Usta 3 farklı alternatif teklifinizi hazırladı.</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToProposal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 uppercase tracking-wider"
              id="btn-goto-proposal-report"
            >
              <span>Teklif Raporuna Git</span>
              <ClipboardList size={14} />
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        {!isTyping && (
          <div className="px-5 py-2 bg-slate-50 border-t border-slate-100/60 flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Usta Önerisi:</span>
            {getQuickReplies().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.value)}
                className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 px-2.5 py-1 rounded-full transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Message Area */}
        <div className="p-4 bg-white border-t border-slate-100" id="chat-input-area">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={isListening ? "Dinleniyor..." : "Ahmet Usta'ya mesaj yazın..."}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-semibold"
              disabled={isTyping}
            />

            <button
              type="button"
              onClick={toggleListening}
              disabled={isTyping}
              className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 border cursor-pointer ${
                isListening
                  ? "bg-rose-100 border-rose-300 text-rose-600 animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-600"
              }`}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
