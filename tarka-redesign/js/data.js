/* ============================================================
   TARKA — content data
   Placeholder studio copy + project set. Swap freely with real
   client work; the layout/animation logic doesn't need to change.
   ============================================================ */

const HERO_WORDS = [
  "Products", "Apps", "Brands", "Interfaces",
  "Websites", "Experiences", "Visuals", "AI Videos", "Ideas"
];

const SERVICES = [
  {
    id: "product-design",
    title: "Product Design",
    tag: "PD",
    blurb: "Turning a rough idea into a system people trust on day one.",
    process: ["Discover", "Define", "Prototype", "Ship"],
    projectTags: ["product"]
  },
  {
    id: "ui-ux",
    title: "UI / UX",
    tag: "UX",
    blurb: "Interfaces that get out of the way of the task at hand.",
    process: ["Research", "Flows", "Interface", "Test"],
    projectTags: ["ui-ux"]
  },
  {
    id: "branding",
    title: "Branding",
    tag: "BR",
    blurb: "A visual language a team can carry for the next ten years.",
    process: ["Strategy", "Identity", "System", "Guidelines"],
    projectTags: ["branding"]
  },
  {
    id: "digital-web",
    title: "Digital / Web",
    tag: "DW",
    blurb: "Sites and digital products built to be lived in, not launched and left.",
    process: ["Architecture", "Design", "Build", "Launch"],
    projectTags: ["web"]
  },
  {
    id: "ai-video",
    title: "AI Video Generation",
    tag: "AI",
    blurb: "Motion and film-craft for brands, made at the speed ideas move.",
    process: ["Concept", "Storyboard", "Generate", "Grade"],
    projectTags: ["ai-video"]
  }
];

const PROJECTS = [
  {
    id: "orbit",
    num: "01",
    title: "Orbit",
    category: "Product Design",
    year: "2025",
    tags: ["product"],
    image: "", // e.g. "assets/projects/orbit-cover.jpg" — drop in the real project image and the gradient placeholder is replaced automatically.
    summary: "A scheduling engine for field-service teams, redesigned from the dispatcher's point of view.",
    challenge: "Dispatchers were running the business from a spreadsheet bolted onto legacy software. Every reschedule took four screens and a phone call.",
    approach: "We shadowed three dispatch teams for two weeks before opening a design file. The insight that shaped everything: a map wasn't the primary tool, a timeline was.",
    outcome: "Reschedule time dropped from six minutes to forty seconds. Orbit now runs dispatch for over 400 field crews."
  },
  {
    id: "faune",
    num: "02",
    title: "Faune",
    category: "Branding",
    year: "2025",
    tags: ["branding"],
    image: "",
    summary: "Identity and packaging for an independent perfumery entering retail for the first time.",
    challenge: "A one-person perfume house with a devoted online following needed a shelf-ready identity that wouldn't lose its handmade character.",
    approach: "We built the mark around the pour of liquid into glass — a single continuous line that becomes the wordmark's connecting stroke.",
    outcome: "Faune launched in 40 stores in its first season and sold out its debut collection in eleven days."
  },
  {
    id: "keel",
    num: "03",
    title: "Keel",
    category: "UI / UX",
    year: "2024",
    tags: ["ui-ux"],
    image: "",
    summary: "A trading terminal redesigned for split-second decisions under real pressure.",
    challenge: "Traders were making six-figure calls inside an interface that hadn't meaningfully changed since 2011.",
    approach: "Every screen was tested against a single question: what does a trader need in the next three seconds, not the next three clicks.",
    outcome: "Order-entry errors fell 71%. Keel is now the default terminal for two regional exchanges."
  },
  {
    id: "harbor",
    num: "04",
    title: "Harbor",
    category: "Digital / Web",
    year: "2024",
    tags: ["web"],
    image: "",
    summary: "A marketing site and booking flow for a boutique hotel group across the Konkan coast.",
    challenge: "Five properties, five inconsistent booking experiences, and a brand that read as generic beachside luxury.",
    approach: "We treated the site as a single long scroll through a coastline rather than five separate property pages.",
    outcome: "Direct bookings rose 34% in the first quarter, reducing OTA commission spend materially."
  },
  {
    id: "loop",
    num: "05",
    title: "Loop",
    category: "AI Video Generation",
    year: "2026",
    tags: ["ai-video"],
    image: "",
    summary: "An AI-assisted toolkit that turns a brand's still photography into short-form motion.",
    challenge: "A DTC client needed a constant stream of scroll-stopping video but couldn't fund a production team.",
    approach: "We paired generative motion with hand-set brand guardrails, so nothing that shipped ever looked off-brand or uncanny.",
    outcome: "Video output went from two clips a month to thirty, with engagement outperforming the client's filmed content."
  },
  {
    id: "arden",
    num: "06",
    title: "Arden",
    category: "Product Design",
    year: "2024",
    tags: ["product"],
    image: "",
    summary: "A patient intake product that replaced a nineteen-page clinic form.",
    challenge: "New patients were abandoning intake halfway through, and clinics were losing the appointments they'd fought to book.",
    approach: "We split intake into short, contextual moments delivered over the days before an appointment instead of one long form.",
    outcome: "Completion rate rose from 58% to 93% across nine partner clinics."
  }
];

const CLIENTS_ROW_1 = ["Meridian", "Orbit Health", "Faune", "Keel Markets", "Harbor Hotels", "Loop AI", "Arden Care", "Northwind"];
const CLIENTS_ROW_2 = ["Kettle & Co", "Bluepeak", "Fieldnote", "Verse Studio", "Anchorage", "Signal House", "Tidewater", "Basalt"];

const THINKING = [
  {
    title: "The interface is the last decision, not the first.",
    tag: "Process"
  },
  {
    title: "What generative tools are actually good for, six months in.",
    tag: "AI"
  },
  {
    title: "Why most rebrands fail in the handoff, not the design.",
    tag: "Branding"
  },
  {
    title: "Designing for a dispatcher who has ninety seconds, not ninety minutes.",
    tag: "Product"
  }
];

const NAV_CURSOR_LABEL = "";
