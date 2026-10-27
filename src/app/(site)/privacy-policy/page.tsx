import type { Metadata } from "next";
import { Container, Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy di Andromedia Web — Andromeda di Toni Serban, P.IVA 02449760517.",
};

const sections = [
  {
    h: "Titolare del Trattamento dei Dati",
    body: [
      `${site.legal.holder}\n${site.legal.legalAddress}\nP. IVA: ${site.legal.piva}`,
      "Indirizzo email del Titolare: toni@andromediaweb.it",
    ],
  },
  {
    h: "Tipologie di Dati raccolti",
    body: [
      "Fra i Dati Personali raccolti da questa Applicazione, in modo autonomo o tramite terze parti, ci sono: Strumenti di Tracciamento; Dati di utilizzo.",
      "I Dati Personali possono essere liberamente forniti dall'Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questa Applicazione. Se non diversamente specificato, tutti i Dati richiesti da questa Applicazione sono obbligatori. Se l'Utente rifiuta di comunicarli, potrebbe essere impossibile per questa Applicazione fornire il Servizio.",
      "Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono incoraggiati a contattare il Titolare.",
      "L'eventuale utilizzo di Cookie – o di altri strumenti di tracciamento – da parte di questa Applicazione o dei titolari dei servizi terzi utilizzati da questa Applicazione ha la finalità di fornire il Servizio richiesto dall'Utente, oltre alle ulteriori finalità descritte nel presente documento e nella Cookie Policy.",
    ],
  },
  {
    h: "Modalità e luogo del trattamento dei Dati raccolti",
    body: [
      "Modalità di trattamento: il Titolare adotta le opportune misure di sicurezza volte ad impedire l'accesso, la divulgazione, la modifica o la distruzione non autorizzate dei Dati Personali. Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle finalità indicate.",
      "Luogo: i Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate.",
      "Periodo di conservazione: se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.",
    ],
  },
  {
    h: "Finalità del Trattamento dei Dati raccolti",
    body: [
      "I Dati dell'Utente sono raccolti per consentire al Titolare di fornire il Servizio, adempiere agli obblighi di legge, rispondere a richieste o azioni esecutive, tutelare i propri diritti ed interessi (o quelli di Utenti o di terze parti), individuare eventuali attività dolose o fraudolente, nonché per le seguenti finalità: Statistica, Interazione con social network e piattaforme esterne e Visualizzazione di contenuti da piattaforme esterne.",
    ],
  },
  {
    h: "Interazione con social network e piattaforme esterne",
    body: [
      "Pulsante “Mi Piace” e widget sociali di Facebook (Meta Platforms, Inc.): servizi di interazione con il social network Facebook. Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento. Luogo del trattamento: Stati Uniti.",
      "Pulsante e widget sociali di LinkedIn (LinkedIn Corporation): servizi di interazione con il social network Linkedin. Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento. Luogo del trattamento: Stati Uniti.",
    ],
  },
  {
    h: "Visualizzazione di contenuti da piattaforme esterne",
    body: [
      "Google Fonts (Google LLC): servizio di visualizzazione di stili di carattere. Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento. Luogo del trattamento: Stati Uniti.",
      "Widget Google Maps (Google LLC): servizio di visualizzazione di mappe. Dati Personali trattati: Strumenti di Tracciamento. Luogo del trattamento: Stati Uniti.",
    ],
  },
  {
    h: "Statistica",
    body: [
      "Google Analytics (Google LLC): servizio di analisi web fornito da Google. Google utilizza i Dati Personali raccolti allo scopo di tracciare ed esaminare l'utilizzo di questa Applicazione, compilare report e condividerli con gli altri servizi sviluppati da Google. Dati Personali trattati: Dati di utilizzo; Strumenti di Tracciamento. Luogo del trattamento: Stati Uniti.",
    ],
  },
  {
    h: "Base giuridica del trattamento",
    body: [
      "Il Titolare tratta Dati Personali relativi all'Utente in caso sussista una delle seguenti condizioni: l'Utente ha prestato il consenso per una o più finalità specifiche; il trattamento è necessario all'esecuzione di un contratto con l'Utente e/o all'esecuzione di misure precontrattuali; il trattamento è necessario per adempiere un obbligo legale al quale è soggetto il Titolare; il trattamento è necessario per l'esecuzione di un compito di interesse pubblico o per l'esercizio di pubblici poteri di cui è investito il Titolare; il trattamento è necessario per il perseguimento del legittimo interesse del Titolare o di terzi.",
      "È comunque sempre possibile richiedere al Titolare di chiarire la concreta base giuridica di ciascun trattamento ed in particolare di specificare se il trattamento sia basato sulla legge, previsto da un contratto o necessario per concludere un contratto.",
    ],
  },
  {
    h: "Diritti dell'Utente",
    body: [
      "Nei limiti previsti dalla legge, l'Utente ha il diritto di: revocare il consenso in ogni momento; opporsi al trattamento dei propri Dati; accedere ai propri Dati; verificare e chiedere la rettificazione; ottenere la limitazione del trattamento; ottenere la cancellazione o rimozione dei propri Dati Personali; ricevere i propri Dati o farli trasferire ad altro titolare; proporre reclamo all'autorità di controllo competente o agire in sede giudiziale.",
      "Per esercitare i propri diritti, gli Utenti possono indirizzare una richiesta ai recapiti del Titolare indicati in questo documento. La richiesta è gratuita e il Titolare risponderà nel più breve tempo possibile, in ogni caso entro un mese.",
    ],
  },
  {
    h: "Ulteriori informazioni sul trattamento",
    body: [
      "Difesa in giudizio: i Dati Personali dell'Utente possono essere utilizzati da parte del Titolare in giudizio o nelle fasi preparatorie alla sua eventuale instaurazione per la difesa da abusi nell'utilizzo di questa Applicazione o dei Servizi connessi.",
      "Log di sistema e manutenzione: per necessità legate al funzionamento ed alla manutenzione, questa Applicazione e gli eventuali servizi terzi da essa utilizzati potrebbero raccogliere log di sistema, ossia file che registrano le interazioni e che possono contenere anche Dati Personali, quali l'indirizzo IP Utente.",
      "Modifiche a questa privacy policy: il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento notificandolo agli Utenti su questa pagina e, se possibile, su questa Applicazione. Si prega dunque di consultare con frequenza questa pagina, facendo riferimento alla data di ultima modifica indicata in fondo.",
    ],
  },
  {
    h: "Definizioni e riferimenti legali",
    body: [
      "Dati Personali (o Dati): costituisce dato personale qualunque informazione che, direttamente o indirettamente, anche in collegamento con qualsiasi altra informazione, ivi compreso un numero di identificazione personale, renda identificata o identificabile una persona fisica.",
      "Dati di Utilizzo: sono le informazioni raccolte automaticamente attraverso questa Applicazione, tra cui: gli indirizzi IP o i nomi a dominio dei computer utilizzati dall'Utente, gli indirizzi in notazione URI, l'orario della richiesta, il metodo utilizzato nell'inoltrare la richiesta al server, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta, il paese di provenienza, le caratteristiche del browser e del sistema operativo utilizzati dal visitatore, le varie connotazioni temporali della visita.",
      "Utente: l'individuo che utilizza questa Applicazione che, salvo ove diversamente specificato, coincide con l'Interessato.",
      "Responsabile del Trattamento: la persona fisica, giuridica, la pubblica amministrazione e qualsiasi altro ente che tratta dati personali per conto del Titolare, secondo quanto esposto nella presente privacy policy.",
      "Cookie: i Cookie sono Strumenti di Tracciamento che consistono in piccole porzioni di dati conservate all'interno del browser dell'Utente.",
      "Unione Europea (o UE): salvo ove diversamente specificato, ogni riferimento all'Unione Europea contenuto in questo documento si intende esteso a tutti gli attuali stati membri dell'Unione Europea e dello Spazio Economico Europeo.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <Container className="max-w-3xl">
        <Reveal>
          <p className="micro-label mb-6">Legale — Privacy</p>
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Privacy Policy</h1>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Questa Applicazione raccoglie alcuni Dati Personali dei propri Utenti.
            Questo documento può essere stampato utilizzando il comando di stampa
            presente nelle impostazioni di qualsiasi browser.
          </p>
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
