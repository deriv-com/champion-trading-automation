import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { BottomActionSheet } from "../BottomActionSheet";
import { AuthorizeResponse } from '../../types/websocket';

import {
  LegacyOpenLink2pxIcon,
  StandaloneSunBrightBoldIcon,
  StandaloneMoonBoldIcon,
  StandaloneHouseBlankBoldIcon,
  StandaloneLanguageBoldIcon,
  StandaloneLifeRingBoldIcon,
  StandaloneRightFromBracketBoldIcon,
  StandaloneGearBoldIcon,
} from "@deriv/quill-icons";
import "./styles.scss";

// Setting types
type SettingType = "theme" | "language" | "help" | null;

// Language options with icons
const languages = [
  { label: "English", value: "en", icon: "🇺🇸" },
  { label: "中文", value: "zh", icon: "🇨🇳" },
  { label: "Español", value: "es", icon: "🇪🇸" },
  { label: "Français", value: "fr", icon: "🇫🇷" },
];

// Theme Selector Component
const ThemeSelector = ({
  currentTheme,
  onThemeSelect,
}: {
  currentTheme: string;
  onThemeSelect: (theme: "light" | "dark" | "system") => void;
}) => {
  const themeOptions = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  return (
    <div className="settings__action-sheet">
      <div className="settings__action-sheet-header">
        <h3>Theme</h3>
      </div>
      <div className="settings__action-sheet-list">
        {themeOptions.map((option) => (
          <div
            key={option.value}
            className={`settings__action-sheet-list-item ${
              currentTheme === option.value
                ? "settings__action-sheet-list-item--active"
                : ""
            }`}
            onClick={() => {
              if (currentTheme !== option.value) {
                onThemeSelect(option.value as "light" | "dark" | "system");
              }
            }}
          >
            <span className="settings__action-sheet-list-item-label">
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Language Selector Component
const LanguageSelector = ({
  currentLanguage,
  onLanguageChange,
  languages,
}: {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages: Array<{ label: string; value: string; icon: string }>;
}) => {
  return (
    <div className="settings__action-sheet">
      <div className="settings__action-sheet-header">
        <h3>Language</h3>
      </div>
      <div className="settings__action-sheet-list">
        {languages.map((lang) => (
          <div
            key={lang.value}
            className={`settings__action-sheet-list-item ${
              currentLanguage === lang.value
                ? "settings__action-sheet-list-item--active"
                : ""
            }`}
            onClick={() => onLanguageChange(lang.value)}
          >
            <span className="settings__action-sheet-list-item-icon">
              {lang.icon}
            </span>
            <span className="settings__action-sheet-list-item-label">
              {lang.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Help Center Component
const HelpCenter = () => {
  const helpOptions = [
    { label: "FAQ", value: "faq", url: "https://champion.trade/faq" },
    {
      label: "WhatsApp",
      value: "whatsapp",
      url: "https://wa.me/message/KPQFKKQZXEYPM1",
    },
    {
      label: "Live chat",
      value: "livechat",
      url: "https://champion.trade/livechat",
    },
  ];

  const handleHelpOptionClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="settings__action-sheet">
      <div className="settings__action-sheet-header">
        <h3>Help Centre</h3>
      </div>
      <div className="settings__action-sheet-list">
        {helpOptions.map((option) => (
          <div
            key={option.value}
            className="settings__action-sheet-list-item"
            onClick={() => handleHelpOptionClick(option.url)}
          >
            <span className="settings__action-sheet-list-item-label">
              {option.label}
            </span>
            <div className="settings__action-sheet-list-item-right">
              <LegacyOpenLink2pxIcon
                className="settings__menu-arrow"
                iconSize="xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function Settings() {
  const { setAuthParams, setAuthorizeResponse, authorizeResponse } = useAuth();
  const { theme, setTheme } = useTheme();
  const userInfo = authorizeResponse as AuthorizeResponse | null;

  // State for bottom action sheet
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<SettingType>(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handleLogout = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
  };

  const handleGoHome = () => {
    window.open("https://champion.trade/", "_blank");
  };

  // Open action sheet for a specific setting
  const openActionSheet = (setting: SettingType) => {
    setCurrentSetting(setting);
    setIsActionSheetOpen(true);
  };

  // Close action sheet
  const closeActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    // Here you would implement actual language change logic
    closeActionSheet();
  };

  // Handle theme change
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    closeActionSheet();
  };

  // Render content based on selected setting
  const renderActionSheetContent = () => {
    switch (currentSetting) {
      case "theme":
        return (
          <ThemeSelector
            currentTheme={theme}
            onThemeSelect={handleThemeChange}
          />
        );
      case "language":
        return (
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            languages={languages}
          />
        );
      case "help":
        return <HelpCenter />;
      default:
        return null;
    }
  };

  return (
    <div className="settings">
      <div className="settings__container">
        <div className="settings__menu">
          {/* Go to Home */}
          <div className="settings__menu-item" onClick={handleGoHome}>
            <div className="settings__menu-item-left">
              <StandaloneHouseBlankBoldIcon className="settings__menu-icon" />
              <span className="settings__menu-label">Go to Home</span>
            </div>
            <LegacyOpenLink2pxIcon
              className="settings__menu-arrow"
              iconSize="xs"
            />
          </div>

          {/* Theme */}
          <div
            className="settings__menu-item"
            onClick={() => openActionSheet("theme")}
          >
            <div className="settings__menu-item-left">
              <span className="settings__menu-icon">
                {theme === "dark" ? (
                  <StandaloneMoonBoldIcon />
                ) : theme === "light" ? (
                  <StandaloneSunBrightBoldIcon />
                ) : (
                  <StandaloneGearBoldIcon />
                )}
              </span>
              <span className="settings__menu-label">Theme</span>
            </div>
          </div>

          {/* Language */}
          <div
            className="settings__menu-item"
            onClick={() => openActionSheet("language")}
          >
            <div className="settings__menu-item-left">
              <StandaloneLanguageBoldIcon className="settings__menu-icon" />
              <span className="settings__menu-label">Language</span>
            </div>
          </div>

          {/* Help Center */}
          <div
            className="settings__menu-item"
            onClick={() => openActionSheet("help")}
          >
            <div className="settings__menu-item-left">
              <StandaloneLifeRingBoldIcon className="settings__menu-icon" />
              <span className="settings__menu-label">Help Center</span>
            </div>
          </div>


          {/* Log out */}
          {userInfo && (
            <div
              className="settings__menu-item settings__menu-item--logout"
              onClick={handleLogout}
            >
              <div className="settings__menu-item-left">
                <StandaloneRightFromBracketBoldIcon
                  className="settings__menu-icon"
                  iconSize="xs"
                />
                <span className="settings__menu-label">Log out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Sheet */}
      <BottomActionSheet
        isOpen={isActionSheetOpen}
        onClose={closeActionSheet}
        height="auto"
      >
        {renderActionSheetContent()}
      </BottomActionSheet>
    </div>
  );
}
