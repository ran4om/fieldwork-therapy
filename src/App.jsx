import { useEffect, useRef, useState } from 'react';

const questions = [
  {
    key: 'place', eyebrow: 'First, choose a setting', title: 'Where would a conversation feel most workable?', note: 'This is a practical preference, not an assessment.',
    choices: [
      { value: 'outside', title: 'Walking outside', detail: 'A steady route in Prater or Augarten' },
      { value: 'online', title: 'A private online session', detail: 'From a place where you can speak comfortably' },
      { value: 'unsure', title: 'I am not sure yet', detail: 'We can decide together in a first call' },
    ],
  },
  {
    key: 'pace', eyebrow: 'Next, choose a pace', title: 'What would make starting easier?', note: 'You can change this later. There is no commitment here.',
    choices: [
      { value: 'talk', title: 'A short conversation first', detail: 'Twenty minutes to ask questions and get a feel for the fit' },
      { value: 'details', title: 'Practical details first', detail: 'Fees, routes, availability, and how sessions work' },
      { value: 'session', title: 'Request a first full session', detail: 'Send a simple enquiry without explaining your situation here' },
    ],
  },
  {
    key: 'time', eyebrow: 'Last, choose a timeframe', title: 'When would you like to hear back?', note: 'For immediate or crisis support, use the dedicated services below.',
    choices: [
      { value: 'soon', title: 'Within the next few days', detail: 'Current replies are usually sent within two working days' },
      { value: 'later', title: 'I am planning ahead', detail: 'Ask about openings later in the season' },
      { value: 'urgent', title: 'I need immediate support', detail: 'See crisis and emergency contacts available now' },
    ],
  },
];

function RouteLine({ step }) {
  return <div className="route-line" aria-label={`Step ${Math.min(step + 1, 4)} of 4`}>
    {[0, 1, 2, 3].map((item) => <span key={item} className={item <= step ? 'passed' : ''}><i>{item + 1}</i><b>{['Setting', 'Pace', 'Timing', 'Your route'][item]}</b></span>)}
  </div>;
}

function CrisisResult({ reset }) {
  return <section className="result crisis" aria-live="polite">
    <p className="route-label">Immediate support</p>
    <h2>You do not need to wait for this practice to reply.</h2>
    <p>Fieldwork is not a crisis service. In Austria, these services are available now:</p>
    <div className="crisis-links"><a href="tel:112"><b>112</b><span>European emergency number</span></a><a href="tel:142"><b>142</b><span>TelefonSeelsorge, free and 24 hours</span></a><a href="tel:0131330"><b>01 313 30</b><span>Vienna psychiatric emergency service, 24 hours</span></a></div>
    <button className="text-button" onClick={reset}>← Start over</button>
  </section>;
}

function Result({ answers, reset }) {
  if (answers.time === 'urgent') return <CrisisResult reset={reset} />;
  const setting = answers.place === 'outside' ? 'a walk-and-talk session' : answers.place === 'online' ? 'an online session' : 'a short format conversation';
  const action = answers.pace === 'details' ? 'Ask for the practical guide' : answers.pace === 'session' ? 'Request a first session' : 'Request a 20-minute call';
  const subject = encodeURIComponent(`${action}: ${setting}`);
  const body = encodeURIComponent(`Hello Dr. Weiss,\n\nI used the route chooser on your website. I would like to ask about ${setting}.\n\nMy preferred first step is: ${action.toLowerCase()}.\n\nThank you.`);
  return <section className="result" aria-live="polite">
    <p className="route-label">A suitable next step</p>
    <h2>{action}</h2>
    <p>Based only on your format choices, the simplest route is {setting}. The email below contains no health information. You can edit it before sending.</p>
    <div className="result-ticket"><span>Suggested format</span><strong>{setting}</strong><span>Reply window</span><strong>{answers.time === 'later' ? 'Ask about a future opening' : 'Usually within two working days'}</strong></div>
    <a className="primary-action" href={`mailto:hello@fieldwork-therapy.example?subject=${subject}&body=${body}`}>{action}<span>↗</span></a>
    <button className="text-button" onClick={reset}>← Start over</button>
  </section>;
}

function Guide() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const headingRef = useRef(null);
  const complete = step === questions.length;
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [step]);
  const select = (value) => {
    const question = questions[step];
    setAnswers((current) => ({ ...current, [question.key]: value }));
    setStep((current) => current + 1);
  };
  const back = () => setStep((current) => Math.max(0, current - 1));
  const reset = () => { setAnswers({}); setStep(0); };

  return <div className="guide">
    <RouteLine step={step} />
    {complete ? <div ref={headingRef} tabIndex="-1"><Result answers={answers} reset={reset} /></div> : <section className="question" key={questions[step].key}>
      <p>{questions[step].eyebrow}</p>
      <h2 ref={headingRef} tabIndex="-1">{questions[step].title}</h2>
      <div className="choices">
        {questions[step].choices.map((choice, index) => <button key={choice.value} onClick={() => select(choice.value)}><span>0{index + 1}</span><strong>{choice.title}</strong><small>{choice.detail}</small><b aria-hidden="true">→</b></button>)}
      </div>
      <div className="question-foot">{step > 0 ? <button className="text-button" onClick={back}>← Back</button> : <span />}<p>{questions[step].note}</p></div>
    </section>}
  </div>;
}

function App() {
  return <main id="top">
    <nav><a className="logo" href="#top"><span>Field</span><i>work</i></a><div><a href="#approach">Approach</a><a href="#practical">Practical</a><a href="#contact">Contact</a></div><a className="nav-help" href="#crisis">Need help now?</a></nav>
    <header className="hero">
      <div className="hero-copy"><p>Psychotherapy in motion · Vienna</p><h1>A first step<br />with less <span>guesswork.</span></h1><p>Choose a few practical preferences. We will point you toward a suitable way to make contact. No answers are saved or sent.</p></div>
      <div className="city-mark" aria-hidden="true"><svg viewBox="0 0 500 520"><path d="M-30 325C78 248 117 364 204 271S357 163 540 226"/><path d="M-40 403C90 323 187 454 302 343S404 294 541 320"/><circle cx="202" cy="272" r="21"/><circle cx="303" cy="343" r="12"/></svg><span>Prater</span><i>48.2082° N</i></div>
    </header>
    <section className="guide-wrap" id="guide"><div className="guide-intro"><span>Private route chooser</span><p>Three choices. No account. No clinical questions.</p></div><Guide /></section>

    <section className="approach" id="approach">
      <div className="approach-title"><p>How I work</p><h2>The route can move.<br />The attention stays.</h2></div>
      <div className="approach-copy"><p>Walking side by side can make conversation feel different from sitting across a room. It can also be distracting or simply not your preference. Both are useful information.</p><p>I offer psychotherapy outdoors in Prater and Augarten, plus secure online sessions. We agree on pace, route, weather limits, and privacy before the first walk. Outdoor work is a setting for therapy, not a claim that nature is treatment.</p></div>
      <div className="route-map" aria-hidden="true"><span>Meet</span><i/><span>Walk</span><i/><span>Pause</span><i/><span>Return</span></div>
    </section>

    <section className="practical" id="practical">
      <p className="side-title">The practical map</p>
      <div className="practical-list">
        <article><span>01</span><h3>Introductory call</h3><p>20 minutes · no fee<br />A chance to ask questions and check availability.</p></article>
        <article><span>02</span><h3>Individual session</h3><p>50 minutes · €110<br />Outdoors in Vienna or online.</p></article>
        <article><span>03</span><h3>Language</h3><p>English or German<br />Choose whichever lets you speak more precisely.</p></article>
        <article><span>04</span><h3>Weather and access</h3><p>Routes can be step-free. Heavy rain and heat move sessions online by agreement.</p></article>
        <article><span>05</span><h3>Cancellation</h3><p>48 hours notice<br />Later cancellations are charged in full.</p></article>
      </div>
    </section>

    <section className="contact" id="contact"><p>When you are ready</p><h2>You can begin<br />with one sentence.</h2><div><p>You do not need to explain everything in your first message. Ask about a call, a route, or a practical concern. I will reply within two working days.</p><a href="mailto:hello@fieldwork-therapy.example?subject=Introductory%20call">Write to Dr. Weiss <span>↗</span></a></div></section>
    <section className="crisis-bar" id="crisis"><strong>Need immediate support?</strong><p>This practice is not a crisis service.</p><a href="tel:112">Emergency 112</a><a href="tel:142">TelefonSeelsorge 142</a><a href="tel:0131330">Vienna PSD 01 313 30</a></section>
    <footer><a className="logo" href="#top"><span>Field</span><i>work</i></a><p>Dr. Amara Weiss<br />Fictional portfolio concept</p><p>Vienna, Austria<br />English · Deutsch</p><p>Privacy · Imprint<br />© 2026</p></footer>
  </main>;
}
export default App;
