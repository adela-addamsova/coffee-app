import { JSX, useEffect } from "react";
import CzFlag from "@assets/components/cz-flag.png";
import EnFlag from "@assets/components/en-flag.png";
import { useTranslation } from "react-i18next";

/**
 * LanguageSwitcher component
 *
 * Renders language switch buttons with flag icons
 * - Highlights currently selected language
 * - Persists selection in localStorage
 * - Loads saved language on mount
 *
 * @returns {JSX.Element} Language switcher
 */

const LanguageSwitcher = (): JSX.Element => {
  const languages = [
    { code: "en", label: "English", flag: EnFlag },
    { code: "cs", label: "Čeština", flag: CzFlag },
  ];

  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
  };

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChangeLanguage(lang.code)}
          className="cursor-pointer p-1"
          aria-label={lang.label}
        >
          <img
            src={lang.flag}
            alt={lang.label}
            style={{
              height: i18n.language === lang.code ? "40px" : "32px",
              width: "auto",
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
