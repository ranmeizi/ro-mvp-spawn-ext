import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { lang as en } from './en'
import { lang as zh } from './zh'
import type { allwords } from "./words";

const Context = createContext<{
    lang: 'zh' | 'en',
    t: (k: allwords) => string,
    setLang: React.Dispatch<React.SetStateAction<"zh" | "en">>
}>({
    lang: 'zh',
    t: () => '',
    setLang: () => { }
})

export function I18nProvider({ children }: PropsWithChildren) {
    const [lang, setLang] = useState<'zh' | 'en'>('zh')

    const wordMap = useMemo(() => {
        switch (lang) {
            case "zh":
                return zh
            case "en":
                return en
        }
    }, [lang])

    useEffect(() => {
        chrome.storage.local.get('lang').then(res => {
            if (res?.lang) {
                setLang(res.lang || 'zh')
            }
        })
    }, [])

    function t(k: allwords) {
        return wordMap[k]
    }
    return <Context.Provider value={{
        t, lang, setLang
    }}>{children}</Context.Provider>
}

export function useI18n() {
    return useContext(Context)
}

export function t(lang: 'zh' | 'en' = 'zh', k: allwords) {
    let wordMap = lang === 'zh' ? zh : en
    return wordMap[k]
}