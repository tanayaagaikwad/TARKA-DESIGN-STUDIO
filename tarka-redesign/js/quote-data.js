/* ============================================================
   TARKA — quotation catalog
   Every line item needs a configurable unit price (INR).
   Grouped by the same five disciplines as the main site.
   ============================================================ */

const QUOTE_CURRENCY = "₹";
const QUOTE_GST_RATE = 0.18; // 18% — toggled on/off per quotation

const QUOTE_CATALOG = [
  {
    category: "Product Design",
    items: [
      { id: "pd-sprint",  name: "Product Design Sprint",      unit: "per sprint",  price: 150000 },
      { id: "pd-audit",   name: "UX Audit",                    unit: "per audit",   price: 60000  },
      { id: "pd-system",  name: "Design System Setup",         unit: "flat",        price: 120000 }
    ]
  },
  {
    category: "UI / UX",
    items: [
      { id: "ux-mobile",  name: "Mobile App UI Design",        unit: "per screen",  price: 8000   },
      { id: "ux-web",     name: "Web App UI Design",            unit: "per screen",  price: 7000   },
      { id: "ux-testing", name: "Usability Testing",            unit: "per round",   price: 40000  }
    ]
  },
  {
    category: "Branding",
    items: [
      { id: "br-identity", name: "Logo & Identity Design",     unit: "flat",        price: 90000  },
      { id: "br-guide",    name: "Brand Guideline Document",   unit: "flat",        price: 50000  },
      { id: "br-pack",     name: "Packaging Design",            unit: "per SKU",     price: 35000  }
    ]
  },
  {
    category: "Digital / Web",
    items: [
      { id: "dw-site",    name: "Marketing Website (up to 6 pages)", unit: "flat",  price: 180000 },
      { id: "dw-ecom",    name: "E-commerce Website",           unit: "flat",       price: 350000 },
      { id: "dw-cms",     name: "Webflow / CMS Build",          unit: "flat",       price: 120000 }
    ]
  },
  {
    category: "AI Video Generation",
    items: [
      { id: "ai-brand",   name: "AI Brand Video (30s)",         unit: "per video",  price: 45000  },
      { id: "ai-pack",    name: "AI Product Video Pack (5 videos)", unit: "pack",    price: 75000  },
      { id: "ai-motion",  name: "Motion Graphics Add-on",        unit: "per video",  price: 25000  }
    ]
  }
];

/* Fixed boilerplate for the PDF — not user-editable */
const QUOTE_TERMS = [
  "This quotation is valid for 30 days from the date of issue.",
  "50% advance payment is required to commence work; the balance is due on delivery.",
  "Timelines are estimated per project scope and confirmed at kickoff.",
  "Revisions beyond the agreed scope will be quoted separately.",
  "All prices are exclusive of GST unless stated otherwise above."
];

const TARKA_CONTACT = {
  email: "hello@tarkadesign.com",
  phone: "+91 80 4000 1234",
  address: "Bengaluru, India",
  web: "www.tarkadesign.com"
};
