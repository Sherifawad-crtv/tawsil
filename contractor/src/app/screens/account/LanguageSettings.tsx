import { useState } from "react";
import { useNavigate } from "react-router";
import TranslateRounded from "@mui/icons-material/TranslateRounded";
import ScreenHeader from "../../components/ScreenHeader";
import { Button } from "../../components/Button";
import { useDataStore } from "../../lib/store";
import type { Language } from "../../lib/types";

const OPTIONS: { value: Language; flag: string; title: string; subtitle: string; dir: "ltr" | "rtl" }[] = [
  { value: "en", flag: "🇺🇸", title: "English", subtitle: "United States", dir: "ltr" },
  { value: "ar", flag: "🇪🇬", title: "العربية", subtitle: "جمهورية مصر العربية", dir: "rtl" },
];

export default function LanguageSettings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useDataStore();
  const [selected, setSelected] = useState<Language>(language);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="" onBack={() => navigate("/account")} />

      <div className="w-full max-w-lg mx-auto px-6 pb-8 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#EAF0FE" }}>
            <TranslateRounded sx={{ fontSize: 26, color: "#1253FA" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>Select Language</h1>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "16px", color: "#040033", marginTop: "2px" }} dir="rtl">
              اختر اللغة
            </p>
          </div>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>Choose your language to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => {
            const active = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className="w-full flex items-center gap-3 rounded-[20px] bg-white p-4 cursor-pointer active:scale-[0.99] transition-transform"
                style={{ border: active ? "2px solid #1253FA" : "1px solid #E8E8E5" }}
              >
                <span style={{ fontSize: "26px" }}>{opt.flag}</span>
                <div className="flex-1 text-left" dir={opt.dir}>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033" }}>{opt.title}</p>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "12px", color: "#9CA3AF" }}>{opt.subtitle}</p>
                </div>
                {/* Radio stays on the same side for every row - only the text above reflects each language's own script direction. */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: active ? "none" : "2px solid #D8D9D4", backgroundColor: active ? "#1253FA" : "transparent" }}
                >
                  {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "white" }} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center gap-3 mt-8">
          <Button
            onClick={() => {
              setLanguage(selected);
              navigate("/account");
            }}
          >
            Continue
          </Button>
          <button
            onClick={() => navigate("/account")}
            className="cursor-pointer"
            style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#9CA3AF" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
