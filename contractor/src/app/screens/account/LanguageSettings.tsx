import { useState } from "react";
import { useNavigate } from "react-router";
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
      <ScreenHeader title="Language" onBack={() => navigate("/account")} />

      <div className="w-full max-w-lg mx-auto px-4 pt-5 pb-8 flex-1 flex flex-col">
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => {
            const active = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className="w-full flex items-center gap-3.5 rounded-[22px] bg-white p-4 cursor-pointer active:scale-[0.99] transition-transform"
                style={{
                  border: active ? "2px solid #1253FA" : "2px solid transparent",
                  boxShadow: active ? "0 2px 14px rgba(18,83,250,0.12)" : "0 2px 16px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: "26px" }}>{opt.flag}</span>
                <div className="flex-1 text-left" dir={opt.dir}>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{opt.title}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "1px" }}>{opt.subtitle}</p>
                </div>
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

        <div className="mt-8">
          <Button
            onClick={() => {
              setLanguage(selected);
              navigate("/account");
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
