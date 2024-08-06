import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Sprachdateien importieren
const resources = {
  en: {
    translation: {
      "home": "Home",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "documentation": "Documentation",
      "settings": "Settings",
      "PrivacyPolicy": "Privacy Policy",
      "Imprint": "Imprint",
      "welcome": "Welcome to the F1 Ligabot",
      "createLeague": "Create League",
      "inviteBot": "Invite Bot",
      "driverAdd": "Add Driver",
      "resultsEnter": "Enter Results",
      "exampleAnswers": "Example Answers",
      "availableSlashCommands": "Available Slash Commands",
      "stepsToF1Ligabot": "These are the steps to the F1 Ligabot",
      "introduction": "Introduction",
      "introductionText": "The F1 League Bot is an application that allows you to create, manage, and store the race results of your own Formula 1 league. Each league gets its own website where the league's tables and statistics are displayed. A Discord bot is also available, which posts the race results to a Discord server.",
      "registrationText": "To use the application, you must register your league. To do this, you must register once. When registering, you must specify the server ID of your Discord server so that the bot knows which server belongs to which league.",
      "discordBot": "The Discord bot is a bot that can be added to a Discord server.",
      "botPost": "The bot can post the driver table and the constructor table of the league in a Discord server.",
      "leagueWebsiteTitle": "League Website",
      "leagueWebsite": "The league website displays the set up league. To access the league page, the URL must look like this: 'https://ligabot-38d61.web.app/(LeagueName)'.",
      "leagueWebsiteContent": "The league website displays the driver table, the constructor table, and the statistics of the league.",
      "settingsPage": "Settings Page",
      "settingsPageContent": "The settings page allows you to create a new league or edit an existing league.",
      "settingsPageContent2": "The name of the league, the logo of the league, and the number of the races per season can be set, as well as their results can be entered.",
      "settingsPageContent3": "The visibility of the countries in the tables can be set if not all tracks are included in your Race Calendar. Press the 'Calendar' button.",
      "settingPageContent4": "The driver standings and the constructor standings can be reset. This will set all points of the drivers and constructors to 0 for a new season.",
      "settingPageContent5": "The tables 'Driver Standings' and 'Constructor Standings' can be downloaded as a CSV file on the settings page via the 'Downloads' button.",
      "settingPageContent6": "To select the tracks for your race calendar and to sort them, you can press the 'Calendar' button. There you can select the tracks that should be displayed in the table and when they should be driven. This way the table is automatically sorted.",
      "settingPageContent7": "The CSV files can be opened in Excel or Google Sheets. In Excel, the comma may need to be set as the delimiter."
    }
  },
  de: {
    translation: {
      "home": "Startseite",
      "login": "Anmelden",
      "register": "Registrieren",
      "logout": "Abmelden",
      "documentation": "Dokumentation",
      "settings": "Einstellungen",
      "PrivacyPolicy": "Datenschutzerklärung",
      "Imprint": "Impressum",
      "welcome": "Willkommen beim F1 Ligabot",
      "createLeague": "Liga erstellen",
      "inviteBot": "Bot einladen",
      "driverAdd": "Fahrer hinzufügen",
      "resultsEnter": "Ergebnisse eintragen",
      "exampleAnswers": "Beispielantworten",
      "availableSlashCommands": "Verfügbare Slash Befehle",
      "stepsToF1Ligabot": "Das sind die Schritte zum F1 Ligabot",
      "introduction": "Einleitung",
      "introductionText": "Der F1-LigaBot ist eine Anwendung, die es ermöglicht, eine eigene Formel 1 Liga zu erstellen, verwalten, und die Ergebnisse der Rennen zu speichern. Es wird jeder Liga eine eigene Webseite erstellt in der die Tabellen & Statistiken der Liga angezeigt werden. Außerdem wird ein Discord Bot bereitgestellt, der die Ergebnisse der Rennen in einem Discord Server postet.",
      "registrationText": "Um die Anwendung zu nutzen, musst du deine Liga registrieren. Dazu musst du dich einmal registrieren. Bei der Registrierung musst du die ServerID deines Discord Servers angeben, damit der Bot weiß, welcher Server zu welcher Liga gehört.",
      "discordBot": "Der Discord Bot ist ein Bot, der in einem Discord Server hinzugefügt werden kann.",
      "botPost": "Der Bot kann die Fahrertabelle und die Konstrukteurstabelle der Liga in einem Discord Server posten.",
      "leagueWebsiteTitle": "Liga Webseite",
      "leagueWebsite": "Die Liga Webseite zeigt die Eingerichtete Liga an. Um auf die LigaSeite zu gelangen, muss die URL so ausschauen: 'https://ligabot-38d61.web.app/(Liganame)'.",
      "leagueWebsiteContent": "Auf der Liga Webseite werden die Fahrertabelle, die Konstrukteurstabelle und die Statistiken der Liga angezeigt.",
      "settingsPage": "Einstellungsseite",
      "settingsPageContent": "Die Einstellungsseite ermöglicht es, eine neue Liga zu erstellen oder eine bestehende Liga zu bearbeiten.",
      "settingsPageContent2": "Es können der Name der Liga, das Logo der Liga und die Anzahl der Rennen pro Saison eingestellt werden, sowie deren Ergebnisse eingetragen werden.",
      "settingsPageContent3": "Die Sichtbarkeit der Länder in den Tabellen kann eingestellt werden, falls nicht alle Strecken im Rennkalender enthalten sind. Drücke dazu den Button 'Kalender'.",
      "settingPageContent4": "Die Fahrerwertung und die Konstrukteurswertung können zurückgesetzt werden. Damit werden alle Punkte der Fahrer und Konstrukteure auf 0 gesetzt für eine neue Saison.",
      "settingPageContent5": "Die Tabellen 'Fahrerwertung' und 'Konstrukteurswertung' können auf der Einstellungsseite über den Button 'Downloads' als CSV-Datei heruntergeladen werden.",
      "settingPageContent6": "Um die zu fahrenden Strecken auszuwählen und diese zu sortieren kannst du den Button 'Kalender' drücken. Dort kannst du die Strecken auswählen, die in der Tabelle angezeigt werden sollen, und wann sie gefahren werden sollen. So wird die Tabelle automatisch sortiert.",
      "settingPageContent7": "Die CSV-Dateien können in Excel oder Google Tabellen geöffnet werden. Bei Excel muss gegebenfalls das das Komma als Trennzeichen eingestellt werden."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false // React already does escaping
    }
});

// Sprache beim Initialisieren setzen
const storedLanguage = localStorage.getItem('Language');
if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
}

export default i18n;