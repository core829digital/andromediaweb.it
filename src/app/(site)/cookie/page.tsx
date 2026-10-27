import type { Metadata } from "next";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cookie",
  description: "Cookie Policy di Andromedia Web — Strumenti di Tracciamento e finalità di utilizzo.",
};

const sections = [
  {
    h: "Introduzione",
    body: [
      "Questo documento contiene informazioni in merito alle tecnologie che consentono a questa Applicazione di raggiungere gli scopi descritti di seguito. Tali tecnologie permettono al Titolare di raccogliere e salvare informazioni (per esempio tramite l'utilizzo di Cookie) o di utilizzare risorse (per esempio eseguendo uno script) sul dispositivo dell'Utente quando quest'ultimo interagisce con questa Applicazione.",
      "Per semplicità, in questo documento tali tecnologie sono sinteticamente definite \"Strumenti di Tracciamento\", salvo vi sia ragione di differenziare.",
      "Questa Applicazione utilizza Strumenti di Tracciamento gestiti direttamente dal Titolare (comunemente detti \"di prima parte\") e Strumenti di Tracciamento che abilitano servizi forniti da terzi (comunemente detti \"di terza parte\"). Durata e scadenza dei Cookie e degli altri Strumenti di Tracciamento simili possono variare a seconda di quanto impostato dal Titolare o da ciascun fornitore terzo.",
    ],
  },
  {
    h: "Attività strettamente necessarie a garantire il funzionamento",
    body: [
      "Questa Applicazione utilizza Cookie comunemente detti \"tecnici\" o altri Strumenti di Tracciamento analoghi per svolgere attività strettamente necessarie a garantire il funzionamento o la fornitura del Servizio.",
    ],
  },
  {
    h: "Esperienza",
    body: [
      "Questa Applicazione utilizza Strumenti di Tracciamento per migliorare la qualità della user experience e consentire le interazioni con contenuti, network e piattaforme esterni.",
      "Pulsante \"Mi Piace\" e widget sociali di Facebook (Meta Platforms, Inc.). Dati Personali trattati: Dati di utilizzo e Strumenti di Tracciamento. Durata di archiviazione: _fbp: 3 mesi.",
      "Pulsante e widget sociali di LinkedIn (LinkedIn Corporation). Dati Personali trattati: Dati di utilizzo e Strumenti di Tracciamento. Durate: AnalyticsSyncHistory: 1 mese; JSESSIONID: durata della sessione; UserMatchHistory: 1 mese; bcookie: 1 anno; bscookie: 1 anno; lang: durata della sessione; lidc: 1 giorno; lissc: 1 anno; lms_ads: 1 mese; lms_analytics: 1 mese.",
      "Google Fonts (Google LLC): servizio di visualizzazione di stili di carattere. Dati Personali trattati: Dati di utilizzo e Strumenti di Tracciamento.",
      "Widget Google Maps (Google LLC): servizio di visualizzazione di mappe. Dati Personali trattati: Strumenti di Tracciamento.",
    ],
  },
  {
    h: "Misurazione",
    body: [
      "Questa Applicazione utilizza Strumenti di Tracciamento per misurare il traffico e analizzare il comportamento degli Utenti per migliorare il Servizio.",
      "Google Analytics (Google LLC). Dati Personali trattati: Dati di utilizzo e Strumenti di Tracciamento. Durate: AMP_TOKEN: 1 ora; _ga: 2 anni; _gac*: 3 mesi; _gat: 1 minuto; _gid: 1 giorno.",
    ],
  },
  {
    h: "Come gestire le preferenze e prestare o revocare il consenso",
    body: [
      "Gli Utenti possono gestire le preferenze relative agli Strumenti di Tracciamento direttamente tramite le impostazioni dei propri dispositivi. In aggiunta, ogni qualvolta l'utilizzo di Strumenti di Tracciamento dipenda da consenso, l'Utente può prestare o revocare tale consenso impostando le proprie preferenze all'interno dell'informativa sui cookie.",
      "Grazie ad apposite funzioni del browser o del dispositivo è anche possibile rimuovere Strumenti di Tracciamento precedentemente salvati, inclusi quelli utilizzati per il salvataggio delle preferenze relative al consenso inizialmente espresse dall'Utente.",
      "Per quanto riguarda Strumenti di Tracciamento di terza parte, gli Utenti possono gestire le proprie preferenze visitando il relativo link di opt out (qualora disponibile), utilizzando gli strumenti descritti nella privacy policy della terza parte o contattando quest'ultima direttamente.",
    ],
  },
  {
    h: "Impostazioni relative agli Strumenti di Tracciamento",
    body: [
      "Gli Utenti possono trovare informazioni su come gestire i Cookie nei browser più diffusi ai seguenti indirizzi: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Brave, Opera (consulta le sezioni di supporto dei rispettivi fornitori).",
    ],
  },
  {
    h: "Conseguenze legate al rifiuto dell'utilizzo di Strumenti di Tracciamento",
    body: [
      "Gli Utenti sono liberi di decidere se permettere o meno l'utilizzo di Strumenti di Tracciamento. Tuttavia, si noti che gli Strumenti di Tracciamento consentono a questa Applicazione di fornire agli Utenti un'esperienza migliore e funzionalità avanzate. Pertanto, qualora l'Utente decida di bloccare l'utilizzo di Strumenti di Tracciamento, il Titolare potrebbe non essere in grado di fornire le relative funzionalità.",
    ],
  },
  {
    h: "Titolare del Trattamento dei Dati",
    body: [
      `${site.legal.holder}\n${site.legal.legalAddress}\nIndirizzo email del Titolare: toni@andromediaweb.it`,
    ],
  },
  {
    h: "Definizioni e riferimenti legali",
    body: [
      "Dati Personali (o Dati): costituisce dato personale qualunque informazione che, direttamente o indirettamente, anche in collegamento con qualsiasi altra informazione, renda identificata o identificabile una persona fisica.",
      "Dati di Utilizzo: le informazioni raccolte automaticamente attraverso questa Applicazione (anche da applicazioni di parti terze integrate), tra cui: gli indirizzi IP o i nomi a dominio dei computer utilizzati dall'Utente, gli indirizzi in notazione URI, l'orario della richiesta, il metodo utilizzato, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta, il paese di provenienza, le caratteristiche del browser e del sistema operativo, le varie connotazioni temporali della visita.",
      "Cookie: i Cookie sono Strumenti di Tracciamento che consistono in piccole porzioni di dati conservate all'interno del browser dell'Utente.",
      "Strumento di Tracciamento: qualsiasi tecnologia – es. Cookie, identificativi univoci, web beacons, script integrati, e-tag e fingerprinting – che consenta di tracciare gli Utenti, per esempio raccogliendo o salvando informazioni sul dispositivo dell'Utente.",
    ],
  },
];

export default function CookiePage() {
  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <Container className="max-w-3xl">
        <Reveal>
          <p className="micro-label mb-6">Legale — Cookie</p>
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Cookie</h1>
        </Reveal>
        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <Reveal key={s.h}>
              <section>
                <h2 className="font-heading text-lg uppercase tracking-wide">{s.h}</h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body.map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Ultima modifica: {site.legal.lastUpdate}
        </p>
      </Container>
    </Section>
  );
}
