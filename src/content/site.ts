/**
 * All site copy lives here so it can be edited without touching layout or motion.
 *
 * BEFORE LAUNCH: `work.plates` are illustrative. The brands and every figure in them are invented
 * to show the format. Replace them with real case studies, then set `work.illustrative` to false,
 * which removes the on-page note saying so.
 */
import type { MediumKey } from "@/lib/mediums";

export const site = {
  name: "Progreate",
  domain: "progreate.co",
  email: "hello@progreate.co",
  title: "Progreate — We grow culture. A marketing agency.",
  description:
    "Progreate is a marketing agency for brands that would rather be passed around than paid for. Strategy, creative, social and media, built to spread.",
  year: 2026,
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Method", href: "#curve" },
  { label: "Services", href: "#media" },
  { label: "Contact", href: "#brief" },
];

export const hero = {
  lede: "A marketing agency for brands that would rather be passed around than paid for.",
  primary: { label: "See what grew", href: "#work" },
  secondary: { label: "Start a culture", href: "#brief" },
  hint: { mouse: "Click the cell. It divides.", touch: "Tap the cell. It divides." },
  hintSteps: ["Again.", "It gets addictive.", "Scroll. It gets much bigger."],
};

export const premise = {
  label: "The premise",
  lead: "No one has ever forwarded a media plan.",
  body: "People pass on what feels alive: a joke, a fight, a strange little truth about their own life. You can’t buy that. You can only get the conditions right, then get out of its way. So that’s the job. We find the one idea your brand can truly own, put it somewhere warm, and feed whatever starts to spread.",
};

export const doubling = {
  label: "The maths of being talked about",
  title: "Twenty doublings separate one person from a million.",
  aside: "Each of them only has to tell two.",
  total: 20,
  /** `at` is the generation at which the line takes over. */
  beats: [
    { at: 3, text: "A group chat." },
    { at: 7, text: "A room talking about you." },
    { at: 10, text: "A scene." },
    { at: 14, text: "A sold-out arena." },
    { at: 17, text: "A small city." },
    { at: 20, text: "Culture." },
  ],
  word: "culture",
};

export type Plate = {
  brand: string;
  sector: string;
  idea: string;
  text: string;
  services: string[];
  stats: { value: string; label: string }[];
  medium: MediumKey;
  growth: {
    name: string;
    /** Gray-Scott reaction-diffusion parameters: the pattern on the dish really is produced by these. */
    feed: number;
    kill: number;
  };
  dish: { agar: string; colony: string; colonyEdge: string };
};

export const work = {
  label: "Selected cultures",
  title: "What grew.",
  intro:
    "No two strains spread alike. Each dish below is a live simulation running that brand’s own growth pattern.",
  feedHint: { mouse: "Move across a dish to feed it.", touch: "Tap a dish to feed it." },
  illustrative: true,
  illustrativeNote: "Sample plates. Brands and figures are illustrative.",
  plates: [
    {
      brand: "Zestwick",
      sector: "Small-batch hot sauce",
      idea: "Dad Versus",
      text: "Every bottle shipped with a dare card addressed to your dad. We filmed one video to explain the rules. Customers filmed the other 38,000.",
      services: ["Campaign idea", "Creators", "Packaging"],
      stats: [
        { value: "38K", label: "customer films" },
        { value: "3×", label: "sold out in a quarter" },
        { value: "+340%", label: "retail sell-through" },
      ],
      medium: "blood",
      growth: { name: "Branching", feed: 0.0545, kill: 0.062 },
      dish: { agar: "#A50E27", colony: "#FFD5C7", colonyEdge: "#FF8E6E" },
    },
    {
      brand: "Hushlane",
      sector: "Sleep and mattresses",
      idea: "The Eight-Hour Ad",
      text: "An ad engineered to be slept through: eight hours of a very calm man reading the terms and conditions. People queued it up at bedtime, then told their friends it worked.",
      services: ["Brand film", "YouTube", "Earned media"],
      stats: [
        { value: "41M", label: "minutes watched" },
        { value: "+212%", label: "branded search" },
        { value: "0", label: "paid media" },
      ],
      medium: "bromo",
      growth: { name: "Self-spacing spots", feed: 0.03, kill: 0.062 },
      dish: { agar: "#1521A8", colony: "#C9F6FF", colonyEdge: "#7FD8FF" },
    },
    {
      brand: "Loopwell",
      sector: "Refillable home cleaning",
      idea: "Bottle No. 1",
      text: "Nobody cares about plastic statistics. So we gave one bottle a tracker and its own account, then followed it through 61 refills in nine homes. Everybody cared about the bottle.",
      services: ["Social", "Community", "Lifecycle"],
      stats: [
        { value: "61", label: "refills followed" },
        { value: "9.4M", label: "organic views" },
        { value: "+27%", label: "subscriptions" },
      ],
      medium: "macconkey",
      growth: { name: "Dividing", feed: 0.0367, kill: 0.0649 },
      dish: { agar: "#F23A92", colony: "#3A0B33", colonyEdge: "#6E1457" },
    },
    {
      brand: "Tallyho",
      sector: "Banking for teenagers",
      idea: "The Pocket Money Strike",
      text: "We helped teenagers form a union and picket their parents over allowance rates. Parents got the joke, news desks ran it, and then both generations opened accounts.",
      services: ["Strategy", "PR stunt", "Paid social"],
      stats: [
        { value: "120K", label: "accounts opened" },
        { value: "64", label: "press features" },
        { value: "4.1×", label: "organic installs" },
      ],
      medium: "sabouraud",
      growth: { name: "Labyrinthine", feed: 0.029, kill: 0.057 },
      dish: { agar: "#CFD64A", colony: "#1F3A12", colonyEdge: "#3F6B1C" },
    },
  ] satisfies Plate[],
};

export const curve = {
  label: "The method",
  title: "Every culture follows the same curve.",
  sub: "Most agencies only turn up for the steep bit.",
  chart: {
    alt: "A bacterial growth curve in four phases. A long flat lag, a steep rise, a plateau, then a decline, as a second culture begins to climb.",
    y: "People who care (log scale)",
    x: "Time",
  },
  phases: [
    {
      name: "Lag",
      line: "Looks like nothing. Is everything.",
      text: "Weeks of listening, research and positioning, looking for the one strain worth growing. No launch, no noise. Skip this and nothing after it works.",
    },
    {
      name: "Log",
      line: "Now it doubles.",
      text: "We seed it small and cheap among the right people, test dozens of versions, then back only what is already spreading.",
    },
    {
      name: "Stationary",
      line: "Everyone’s heard. Most brands stop here.",
      text: "The crowd has arrived, so make it pay: site, retail, CRM and retention, until attention turns into habit.",
    },
    {
      name: "Death",
      line: "Every idea tires.",
      text: "The good ones leave spores: a line people still quote, an audience still listening. We grow the next strain before this one fades.",
    },
  ],
};

export const media = {
  label: "What we feed it",
  title: "Growth media.",
  sub: "Five services. Bring us in for one or all of them.",
  items: [
    {
      name: "Strategy",
      role: "The medium",
      text: "What a brand grows in. Who it’s really for, what it’s against, and the one idea it can own.",
      list: ["Positioning", "Audience research", "Brand platform", "Go-to-market"],
      medium: "tcbs",
    },
    {
      name: "Creative",
      role: "The strain",
      text: "The idea itself, made to travel. If it can’t be retold in one breath, we start again.",
      list: ["Campaign ideas", "Identity", "Film and motion", "Copywriting"],
      medium: "blood",
    },
    {
      name: "Social & creators",
      role: "The spread",
      text: "Seeded where people already talk, by people they already trust. Always on, never shouting.",
      list: ["Short-form", "Creators", "Community", "Earned and PR"],
      medium: "macconkey",
    },
    {
      name: "Paid media",
      role: "The catalyst",
      text: "Money speeds up what’s already spreading. It can’t rescue what isn’t, and we won’t pretend it can.",
      list: ["Paid social", "Search", "YouTube and CTV", "Creative testing"],
      medium: "bromo",
    },
    {
      name: "Growth & data",
      role: "The readings",
      text: "What grew, why, and what to cut. Reported in plain language and read by humans.",
      list: ["Measurement", "SEO", "Lifecycle and CRM", "Conversion"],
      medium: "mannitol",
    },
  ] satisfies {
    name: string;
    role: string;
    text: string;
    list: string[];
    medium: MediumKey;
  }[],
};

export const notes = {
  label: "Lab notes",
  rows: [
    ["Reach is rented.", "Culture is owned.", "Feed what’s already spreading."],
    ["Nobody forwards a value proposition.", "A brief is a hypothesis."],
    ["If it needs a media plan to be funny, it isn’t.", "Every idea dies. Plan the next strain."],
  ],
};

export const brief = {
  label: "Start a culture",
  title: "Bring us one good idea.",
  sub: "Or a bad one. We’ll run the tests.",
  form: {
    hi: "Hi, I’m",
    from: "from",
    grow: "We’d like to grow",
    reach: "Reach me at",
    placeholders: {
      name: "your name",
      company: "your company",
      goal: "what you want more of",
      email: "your email",
    },
    submit: "Send it",
    sending: "Sending",
    done: "Got it. It’s in the incubator.",
    error: "That didn’t reach us. Try again, or email",
  },
  alt: "Prefer email?",
};

export const footer = {
  joke: "No cells were harmed. Many were divided.",
};

export const notFound = {
  label: "Error 404",
  title: "Contaminated plate.",
  text: "Nothing grew at this address.",
  back: "Back to the lab",
};
