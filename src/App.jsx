import { useEffect, useRef, useState } from 'react';

const questions = [
  {
    key: 'place', label: 'Setting', title: 'Where would a conversation feel most workable?', note: 'Choose a practical setting. This is not a clinical question.',
    choices: [
      { value: 'outside', icon: '↝', title: 'Walking outside', detail: 'A steady route in Prater or Augarten' },
      { value: 'online', icon: '□', title: 'A private online session', detail: 'From a place where you can speak comfortably' },
      { value: 'unsure', icon: '?', title: 'I am not sure yet', detail: 'We can decide together in a first call' },
    ],
  },
  {
    key: 'pace', label: 'First step', title: 'What would make starting easier?', note: 'You can change this later. Nothing is booked here.',
    choices: [
      { value: 'talk', icon: '20', title: 'A short conversation first', detail: 'Twenty minutes to ask questions and check the fit' },
      { value: 'details', icon: 'i', title: 'Practical details first', detail: 'Fees, routes, availability, and how sessions work' },
      { value: 'session', icon: '01', title: 'Request a first full session', detail: 'A simple enquiry without explaining your situation here' },
    ],
  },
  {
    key: 'time', label: 'Timing', title: 'When would you like to hear back?', note: 'Immediate support uses dedicated services, not a practice inbox.',
    choices: [
      { value: 'soon', icon: '→', title: 'Within the next few days', detail: 'Replies usually arrive within two working days' },
      { value: 'later', icon: '○', title: 'I am planning ahead', detail: 'Ask about openings later in the season' },
      { value: 'urgent', icon: '!', title: 'I need immediate support', detail: 'See Austrian crisis and emergency contacts now' },
    ],
  },
];

const answerLabels = {
  outside: 'Walking outside', online: 'Online session', unsure: 'Setting undecided',
  talk: 'Introductory call', details: 'Practical guide', session: 'First session',
  soon: 'Reply soon', later: 'Planning ahead', urgent: 'Immediate support',
};

function Progress({ step }) {
  return <div className="progress" aria-label={`Step ${Math.min(step + 1, 4)} of 4`}>
    <div className="progress-copy"><span>{step < 3 ? `Question ${step + 1} of 3` : 'Your route'}</span><b>{step < 3 ? questions[step].label : 'Ready'}</b></div>
    <div className="progress-track" aria-hidden="true"><i style={{ '--progress': `${Math.min(step, 3) / 3 * 100}%` }} />{[0, 1, 2, 3].map((item) => <span key={item} className={item <= step ? 'passed' : ''}>{item + 1}</span>)}</div>
  </div>;
}

function AnswerTrail({ answers }) {
  const values = Object.values(answers);
  return <div className="answer-trail" aria-label="Your choices so far">
    <span>Your route so far</span>
    <div>{values.length ? values.map((value) => <b key={value}>{answerLabels[value]}</b>) : <p>No choices yet</p>}</div>
  </div>;
}

function CrisisResult({ reset }) {
  return <section className="result crisis" aria-live="polite">
    <p className="route-label">Immediate support</p>
    <h2>You do not need to wait for this practice to reply.</h2>
    <p>Fieldwork is not a crisis service. In Austria, these services are available now:</p>
    <div className="crisis-links"><a href="tel:112"><b>112</b><span>European emergency number</span></a><a href="tel:142"><b>142</b><span>TelefonSeelsorge, free and available 24 hours</span></a><a href="tel:0131330"><b>01 313 30</b><span>Vienna psychiatric emergency service</span></a></div>
    <button className="text-button" onClick={reset}>← Start over</button>
  </section>;
}

function Result({ answers, reset, back }) {
  if (answers.time === 'urgent') return <CrisisResult reset={reset} />;
  const setting = answers.place === 'outside' ? 'a walk-and-talk session' : answers.place === 'online' ? 'an online session' : 'a short format conversation';
  const action = answers.pace === 'details' ? 'Ask for the practical guide' : answers.pace === 'session' ? 'Request a first session' : 'Request a 20-minute call';
  const subject = encodeURIComponent(`${action}: ${setting}`);
  const body = encodeURIComponent(`Hello Dr. Weiss,\n\nI used the route chooser on your website. I would like to ask about ${setting}.\n\nMy preferred first step is: ${action.toLowerCase()}.\n\nThank you.`);
  return <section className="result" aria-live="polite">
    <p className="route-label">A clear next step</p>
    <h2>{action}</h2>
    <p>Based only on your practical preferences, the simplest route is {setting}. The prepared email contains no health information and can be edited before sending.</p>
    <dl className="result-ticket"><div><dt>Suggested format</dt><dd>{setting}</dd></div><div><dt>Reply window</dt><dd>{answers.time === 'later' ? 'Ask about a future opening' : 'Usually within two working days'}</dd></div><div><dt>Saved by this page</dt><dd>Nothing</dd></div></dl>
    <a className="primary-action" href={`mailto:hello@fieldwork-therapy.example?subject=${subject}&body=${body}`}>{action}<span>↗</span></a>
    <div className="result-actions"><button className="text-button" onClick={back}>← Change timing</button><button className="text-button" onClick={reset}>Start over</button></div>
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

  return <div className="guide" id="guide">
    <Progress step={step} />
    <AnswerTrail answers={answers} />
    {complete ? <div ref={headingRef} tabIndex="-1"><Result answers={answers} reset={reset} back={back} /></div> : <section className="question" key={questions[step].key}>
      <p className="question-label">Choose one option</p>
      <h2 ref={headingRef} tabIndex="-1">{questions[step].title}</h2>
      <div className="choices">
        {questions[step].choices.map((choice) => <button key={choice.value} onClick={() => select(choice.value)}><span className="choice-icon" aria-hidden="true">{choice.icon}</span><span><strong>{choice.title}</strong><small>{choice.detail}</small></span><b aria-hidden="true">→</b></button>)}
      </div>
      <div className="question-foot">{step > 0 ? <button className="text-button" onClick={back}>← Back</button> : <a href="#practical">Skip to practical details</a>}<p>{questions[step].note}</p></div>
    </section>}
  </div>;
}

function App() {
  return <main id="top">
    <nav><a className="logo" href="#top"><span>Field</span><i>work</i></a><div><a href="#approach">Approach</a><a href="#practical">Practical</a><a href="#contact">Contact</a></div><a className="nav-help" href="#crisis">Need help now?</a></nav>

    <header className="hero">
      <div className="hero-route" aria-hidden="true"><svg viewBox="0 0 900 900"><path d="M-40 650C110 505 235 768 390 520S680 210 960 350"/><path d="M-20 770C150 620 310 830 520 610S760 465 930 500"/><circle cx="390" cy="520" r="20"/><circle cx="520" cy="610" r="11"/></svg><span>Prater</span><i>48.2082° N</i></div>
      <div className="hero-copy">
        <p>Psychotherapy in motion · Vienna</p>
        <h1>A first step<br />with less <span>guesswork.</span></h1>
        <p className="hero-intro">Choose three practical preferences. The guide suggests a way to make contact without asking what happened, how you feel, or why you are seeking therapy.</p>
        <ul><li>No account</li><li>No clinical questions</li><li>No answers saved</li></ul>
      </div>
      <Guide />
    </header>

    <section className="approach" id="approach">
      <div className="section-mark"><span>01</span><p>How I work</p></div>
      <div className="approach-title"><h2>The route can move.<br />The attention stays.</h2></div>
      <div className="approach-copy"><p>Walking side by side can make conversation feel different from sitting across a room. It can also be distracting or simply not your preference. Both are useful information.</p><p>I offer psychotherapy outdoors in Prater and Augarten, plus secure online sessions. We agree on pace, route, weather limits, and privacy before the first walk. Outdoor work is a setting for therapy, not a claim that nature is treatment.</p></div>
      <div className="route-map" aria-hidden="true"><span>Meet</span><i/><span>Walk</span><i/><span>Pause</span><i/><span>Return</span></div>
    </section>

    <section className="first-contact">
      <div className="section-mark"><span>02</span><p>What happens next</p></div>
      <div className="first-contact-copy"><h2>No perfect first message required.</h2><p>Contact begins with logistics, not a life summary. A short introduction is enough to check availability and decide whether the format feels workable.</p></div>
      <ol><li><span>01</span><div><h3>Write one sentence</h3><p>Ask about a call, a route, fees, or an opening.</p></div></li><li><span>02</span><div><h3>Receive practical details</h3><p>I reply with availability, format, and what the first conversation includes.</p></div></li><li><span>03</span><div><h3>Choose without pressure</h3><p>A first call can end with a booking, more questions, or no next session.</p></div></li></ol>
    </section>

    <section className="practical" id="practical">
      <div className="section-mark"><span>03</span><p>The practical map</p></div>
      <div className="practical-list">
        <article><span>01</span><h3>Introductory call</h3><p>20 minutes · no fee<br />A chance to ask questions and check availability.</p></article>
        <article><span>02</span><h3>Individual session</h3><p>50 minutes · €110<br />Outdoors in Vienna or online.</p></article>
        <article><span>03</span><h3>Language</h3><p>English or German<br />Choose whichever lets you speak more precisely.</p></article>
        <article><span>04</span><h3>Weather and access</h3><p>Routes can be step-free. Heavy rain and heat move sessions online by agreement.</p></article>
        <article><span>05</span><h3>Cancellation</h3><p>48 hours notice<br />Later cancellations are charged in full.</p></article>
      </div>
    </section>

    <section className="contact" id="contact"><div><p>When you are ready</p><h2>You can begin<br />with one sentence.</h2></div><div><p>You do not need to explain everything in your first message. Ask about a call, a route, or a practical concern. I will reply within two working days.</p><a href="mailto:hello@fieldwork-therapy.example?subject=Introductory%20call">Write to Dr. Weiss <span>↗</span></a><a className="secondary-contact" href="#guide">Use the route chooser again ↑</a></div></section>
    <section className="crisis-bar" id="crisis"><strong>Need immediate support?</strong><p>This practice is not a crisis service.</p><a href="tel:112">Emergency 112</a><a href="tel:142">TelefonSeelsorge 142</a><a href="tel:0131330">Vienna PSD 01 313 30</a></section>
    <footer><a className="logo" href="#top"><span>Field</span><i>work</i></a><p>Dr. Amara Weiss<br />Fictional portfolio concept</p><p>Vienna, Austria<br />English · Deutsch</p><p>Privacy · Imprint<br />© 2026</p></footer>
  </main>;
}

export default App;
