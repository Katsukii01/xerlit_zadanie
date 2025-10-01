# Wellio – lekka aplikacja „wellbeing”

Wellio to prosta, przyjazna aplikacja pomagająca budować drobne, codzienne nawyki: nawadnianie, krótkie przerwy od ekranu, śledzenie nawyków i refleksję nad nastrojem. Interfejs jest lekki, responsywny i oparty na komponentach.

## Funkcje

- **Dashboard**: podsumowanie dnia z kartami prowadzącymi do modułów. Koła postępu dla wody i nawyków, średnia emotka nastroju, liczba przerw.
- **Water**: śledzenie nawodnienia w ml z animowaną „butelką”. Szybkie przyciski +100/+250/+500/+1000, własna ilość, reset. Cel domyślny: 2000 ml.
- **Habits**: lista nawyków z możliwością dodawania/usuwania i odhaczania na dziś. Pokazany procent dziennego progresu, przycisk „Reset today”.
- **Mood**: szybki zapis nastroju (😊/😐/😞). Historia ostatnich wpisów (do 30), średnia z ostatnich dni widoczna na Dashboardzie.
- **Office Breaks**: prosty timer 20‑minutowy przypominający o przerwie (rozciąganie, oddech, krótki spacer), z przyciskami Start/Stop/Reset.

## Technologia

- **Angular 17** (Standalone Components, Router)
- **Angular Material** (karty, listy, przyciski, formularze)
- **LocalStorage** przez serwis `StorageService` do trzymania stanu w przeglądarce (bez backendu)

## Uruchomienie

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Start w trybie deweloperskim:
   ```bash
   npm start
   ```
   Aplikacja: `http://localhost:4200/`

## Build produkcyjny

```bash
npm run build
```
Artefakty trafiają do `dist/wellio/browser/`.

## Testy

```bash
npm test
```

## Routing (ścieżki)

- `/` → `Dashboard`
- `/water` → `WaterTracker`
- `/habits` → `HabitTracker`
- `/mood` → `MoodTracker`
- `/breaks` → `OfficeBreaks`

## Przechowywanie danych

Dane użytkownika są zapisywane lokalnie w `localStorage` przez `StorageService` (np. `water.today.ml`, `habits.list`, `habits.today.<data>`, `mood.history`, `breaks.*`). Dzięki temu po odświeżeniu strony postęp pozostaje zachowany na danym urządzeniu/przeglądarce.

## Struktura katalogów (skrót)

```
src/
  app/
    components/
      dashboard/             # karta startowa z podsumowaniami
      water-tracker/         # moduł nawodnienia z animacją butelki
      habit-tracker/         # lista nawyków + progres dzienny
      mood-tracker/          # szybki zapis nastroju + historia
      office-breaks/         # prosty timer przerw biurowych
    services/
      storage.service.ts     # opakowanie na localStorage
```

## Dostępność i responsywność

- Komponenty mają semantyczne etykiety i stany focus/hover.
- Układ dostosowuje się do ekranów mobilnych (siatka 1 kolumna, przyciski pełnej szerokości w widokach wąskich).

---

Projekt korzysta z [Angular CLI](https://github.com/angular/angular-cli) (17.3.x). Więcej poleceń: `ng help` lub dokumentacja Angular.
