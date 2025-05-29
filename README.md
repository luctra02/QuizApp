# QuizMaster
QuizMaster er en interaktiv quiz-applikasjon som lar brukere teste kunnskapen sin, spore fremgang og få personlig tilbakemelding. Applikasjonen tilbyr tusenvis av spørsmål av ulike kategorier, med statistikk og AI-drevet tilbakemelding.

## Funksjonalitet
- **Quiz-utfordringer**: Test deg selv med over 4000 spørsmål fordelt på mange forskjellige kategorier
- **Quiz-historikk**: Gå gjennom alle tidligere quiz og se på spørsmål og svar for å forsterke læringen
- **Detaljert statistikk**: Spor prestasjoner med omfattende analyser og visualiseringer
- **AI-tilbakemelding**: Få personlige innsikter og anbefalinger for å forbedre kunnskapshull ved hjelp av Hugging Face AI
- **Brukerautentisering**: Sikker innlogging og brukerdata med Supabase Authentication
- **Fremgangsregistrering**: Hold oversikt over utviklingen din over tid

## Hovedfunksjoner
### 📜 Quiz-historikk
- Tilgang til komplett quiz-arkiv
- Mulighet til å gå gjennom spørsmål og svar
- Lær av tidligere feil og styrk kunnskapen

### 📊 Statistikk og analyse
- Detaljerte oppdelinger av prestasjoner
- Kategorivisning av resultater
- Visualiseringer av fremgang over tid

### 🤖 AI-drevet tilbakemelding
- Personlige innsikter basert på prestasjoner
- AI-genererte anbefalinger via Hugging Face API
- Identifisering av kunnskapshull med intelligent analyse

### 🧠 Kunnskapsutfordringer
- Over 500 forskjellige quiz
- 4000+ spørsmål hentet fra Open Trivia Database
- Varierte vanskelighetsgrader og kategorier

## Teknologier brukt
- **Frontend**: Next.js (TypeScript), Tailwind CSS
- **UI-komponenter**: shadcn/ui komponenter
- **AI-integrasjon**: Hugging Face API for tekstgenerering
- **Autentisering**: Supabase Authentication
- **Database**: PostgreSQL via Supabase


## API-integrasjoner
- **Open Trivia Database**: [opentdb.com](https://opentdb.com/) - Kilde for quiz-spørsmål og kategorier
- **Hugging Face API**: AI-drevet tekstgenerering for personlig tilbakemelding
- **Supabase API**: Backend-tjenester, autentisering og database-operasjoner

## Navigasjon
- **Hjem**: Oversikt over alle funksjoner
- **Start Quiz**: `/start` - Begynn en ny quiz-utfordring
- **Historikk**: `/history` - Se på tidligere quiz
- **Statistikk**: `/stats` - Analyser prestasjoner
- **AI-tilbakemelding**: `/feedback` - Få personlige innsikter
