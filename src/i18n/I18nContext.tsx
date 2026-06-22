import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { translations } from "./translations";
import type { Locale } from "./translations";

interface I18nCtx {
  locale: Locale;
  t: typeof translations[Locale];
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nCtx>({
  locale: "pt",
  t: translations.pt,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    return saved === "en" ? "en" : "pt";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
