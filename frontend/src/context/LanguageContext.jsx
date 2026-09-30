import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    portalName: 'Penguine',
    portalSub: 'National Polar Data Archive & Content Studio',
    navHome: 'Home',
    navLibrary: 'Research Library',
    navDatasets: 'Datasets & Telemetry',
    navGallery: 'Polar Gallery',
    navActivities: 'Expedition Timeline',
    navNews: 'News & Press',
    navStudent: 'Student Zone',
    navAsk: 'Ask Polar Archive',
    navContact: 'Contact & Directory',
    navConsole: 'Staff Console',
    navUpload: 'Upload Item',
    navMySubmissions: 'My Submissions',
    navReviewQueue: 'Review Queue',
    navContentStudio: 'Content Studio',
    navUsers: 'User Management',
    navAudit: 'Audit Trail',
    login: 'Sign In',
    logout: 'Sign Out',
    switchRole: 'Demo Role Switcher',
    currentRole: 'Current Role',
    heroTitle: 'Archive Once. Publish Everywhere.',
    heroSub: "India's official repository for Antarctic, Arctic, and Southern Ocean scientific reports, datasets, photos, and media. AI-powered cited exploration and editor-supervised content generation.",
    exploreLibrary: 'Explore Research Library',
    askAssistantBtn: 'Ask Polar Assistant',
    stationLiveStatus: 'Active Station Telemetry',
    searchPlaceholder: 'Search reports, datasets, expeditions, keywords...',
    allStations: 'All Stations',
    allTypes: 'All Types',
    allTopics: 'All Topics',
    allYears: 'All Years',
    published: 'Published',
    draft: 'Draft',
    inReview: 'In review',
    rejected: 'Rejected',
    viewDetails: 'View Document',
    downloadPdf: 'Download Report',
    citations: 'Verified Citations',
    previewTable: 'Data Preview Table',
    chartView: 'Interactive Chart',
    generateAI: 'Generate Content',
    approve: 'Approve & Publish',
    reject: 'Reject with Remarks',
    copied: 'Copied to Clipboard!',
    downloadCard: 'Download Social Card',
  },
  hi: {
    portalName: 'पेंगुइन (Penguine)',
    portalSub: 'राष्ट्रीय ध्रुवीय डेटा संग्रह एवं सामग्री स्टूडियो',
    navHome: 'मुख्य पृष्ठ',
    navLibrary: 'अनुसंधान पुस्तकालय',
    navDatasets: 'डेटासेट एवं टेलीमेट्री',
    navGallery: 'ध्रुवीय गैलरी',
    navActivities: 'अभियान समयरेखा',
    navNews: 'समाचार एवं विज्ञप्ति',
    navStudent: 'विद्यार्थी प्रभाग',
    navAsk: 'ध्रुवीय अभिलेख से पूछें',
    navContact: 'संपर्क एवं मुख्यालय',
    navConsole: 'कर्मचारी कंसोल',
    navUpload: 'अपलोड करें',
    navMySubmissions: 'मेरे प्रस्तुतीकरण',
    navReviewQueue: 'समीक्षा कतार',
    navContentStudio: 'कंटेंट स्टूडियो',
    navUsers: 'उपयोगकर्ता प्रबंधन',
    navAudit: 'ऑडिट ट्रेल',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    switchRole: 'डेमो भूमिका स्विचर',
    currentRole: 'वर्तमान भूमिका',
    heroTitle: 'एक बार संग्रह करें, सर्वत्र प्रकाशित करें।',
    heroSub: 'अंटार्कटिक, आर्कटिक और दक्षिणी महासागर के वैज्ञानिक शोध, डेटासेट और मीडिया के लिए भारत का राष्ट्रीय संग्रह। प्रमाणित एआई सहायक और संपादक-सत्यापित सामग्री निर्माण।',
    exploreLibrary: 'पुस्तकालय देखें',
    askAssistantBtn: 'एआई सहायक से पूछें',
    stationLiveStatus: 'सक्रिय अनुसंधान स्टेशन टेलीमेट्री',
    searchPlaceholder: 'रिपोर्ट, डेटासेट, अभियान, कीवर्ड खोजें...',
    allStations: 'सभी स्टेशन',
    allTypes: 'सभी प्रकार',
    allTopics: 'सभी विषय',
    allYears: 'सभी वर्ष',
    published: 'प्रकाशित',
    draft: 'प्रारूप (Draft)',
    inReview: 'समीक्षाधीन',
    rejected: 'अस्वीकृत',
    viewDetails: 'दस्तावेज़ देखें',
    downloadPdf: 'रिपोर्ट डाउनलोड करें',
    citations: 'सत्यापित उद्धरण',
    previewTable: 'डेटा पूर्वावलोकन तालिका',
    chartView: 'इंटरैक्टिव चार्ट',
    generateAI: 'सामग्री तैयार करें',
    approve: 'स्वीकृत एवं प्रकाशित करें',
    reject: 'टिप्पणी सहित अस्वीकार करें',
    copied: 'कॉपी किया गया!',
    downloadCard: 'सोशल कार्ड डाउनलोड करें',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
