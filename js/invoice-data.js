/**
 * Default invoice data matching the attached reference invoice exactly,
 * plus alternative templates and presets.
 */

export const DEFAULT_INVOICE = {
  seller: {
    name: "Tapur Sharma",
    address: "#48 Chinar bagh, Patiala (Punjab) - 147002",
    pan: "PYJPS5230N",
    gstin: "Not registered under GST",
    email: "tapur20star@gmail.com",
    phone: "7087238136",
    logoUrl: ""
  },
  meta: {
    title: "INVOICE",
    invoiceNo: "INV-2026-001",
    invoiceDate: "26 Oct 2026",
    dueDate: "",
    currency: "INR",
    currencySymbol: "Rs.",
    currencyPosition: "prefix" // 'prefix' (Rs. 40,000) or 'suffix'
  },
  client: {
    cardTitle: "BILL TO",
    name: "CUTAWAYY FILMS PRIVATE LIMITED",
    address: "403 & 404, Dhanashree Heights / B wing, Behind Axis Bank\nOff. Veera Desai Road, Andheri West, Mumbai, Maharashtra - 400053",
    gstin: "27AAFCC2689D1ZM",
    email: "accounts@cutawayyfilms.com, Muskaankhan.star@gmail.com"
  },
  items: [
    {
      id: "item-1",
      description: "Job Profile: Artist/Actor\nProject Name: HP KUDEL (commercial)\nWork of 1 day shoot",
      sac: "-",
      amount: 40000.00
    }
  ],
  taxSettings: {
    mode: "exempt", // 'exempt' (shows 0.00 as in original invoice), 'calculate' (calculates % of subtotal), 'custom' (manual)
    igst: { enabled: true, rate: 18, customAmount: 0 },
    cgst: { enabled: true, rate: 9, customAmount: 0 },
    sgst: { enabled: true, rate: 9, customAmount: 0 },
    discount: { enabled: false, rate: 0, amount: 0 }
  },
  amountInWords: {
    auto: true,
    text: "Rupees Forty Thousand Only"
  },
  bank: {
    cardTitle: "BANK DETAILS FOR PAYMENT",
    accountHolder: "Tapur Sharma",
    accountNo: "38372877099 (Savings)",
    ifsc: "SBIN0050733",
    bankBranch: "State Bank of India (SBI)",
    upiId: ""
  },
  disclaimer: "This is a computer-generated invoice and does not require a signature.",
  footer: {
    leftText: "Invoice INV-2026-001",
    rightText: "Page 1 of 1"
  }
};

export const PRESETS = {
  default: DEFAULT_INVOICE,
  developer: {
    seller: {
      name: "Aryan Kapoor",
      address: "Flat 402, Green Glen Heights, Bellandur, Bengaluru (Karnataka) - 560103",
      pan: "ABCPK8921M",
      gstin: "29ABCPK8921M1Z5",
      email: "aryan.dev@outlook.com",
      phone: "+91 98450 12345",
      logoUrl: ""
    },
    meta: {
      title: "TAX INVOICE",
      invoiceNo: "INV-2026-042",
      invoiceDate: "15 Nov 2026",
      dueDate: "30 Nov 2026",
      currency: "INR",
      currencySymbol: "Rs.",
      currencyPosition: "prefix"
    },
    client: {
      cardTitle: "BILL TO",
      name: "NEXUS TECH VENTURES LLP",
      address: "Level 6, Tech Park Phase 2, Whitefield, Bengaluru - 560066",
      gstin: "29AAACN1234E1Z2",
      email: "billing@nexustech.io, finance@nexustech.io"
    },
    items: [
      {
        id: "item-1",
        description: "Full Stack Web Application Development\nSprint 14: Payment Gateway & User Auth Module\nDelivered as per Milestone Agreement",
        sac: "998314",
        amount: 85000.00
      },
      {
        id: "item-2",
        description: "Cloud Infrastructure Setup & CI/CD Pipeline\nAutomated staging deployment on GCP",
        sac: "998315",
        amount: 25000.00
      }
    ],
    taxSettings: {
      mode: "calculate",
      igst: { enabled: false, rate: 18, customAmount: 0 },
      cgst: { enabled: true, rate: 9, customAmount: 0 },
      sgst: { enabled: true, rate: 9, customAmount: 0 },
      discount: { enabled: false, rate: 0, amount: 0 }
    },
    amountInWords: {
      auto: true,
      text: ""
    },
    bank: {
      cardTitle: "BANK DETAILS FOR PAYMENT",
      accountHolder: "Aryan Kapoor",
      accountNo: "50100239485710 (Current)",
      ifsc: "HDFC0000523",
      bankBranch: "HDFC Bank, Koramangala Branch",
      upiId: "aryankapoor@hdfcbank"
    },
    disclaimer: "This is a computer-generated invoice and does not require a signature.",
    footer: {
      leftText: "Invoice INV-2026-042",
      rightText: "Page 1 of 1"
    }
  },
  blank: {
    seller: {
      name: "Your Name / Business Name",
      address: "Your Business Address, City, State - PIN",
      pan: "ABCDE1234F",
      gstin: "Not registered under GST",
      email: "you@example.com",
      phone: "+91 98765 43210",
      logoUrl: ""
    },
    meta: {
      title: "INVOICE",
      invoiceNo: "INV-2026-001",
      invoiceDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: "",
      currency: "INR",
      currencySymbol: "Rs.",
      currencyPosition: "prefix"
    },
    client: {
      cardTitle: "BILL TO",
      name: "Client / Company Name",
      address: "Client Address, City, State - PIN",
      gstin: "Client GSTIN (if applicable)",
      email: "client@example.com"
    },
    items: [
      {
        id: "item-1",
        description: "Description of services or products rendered\nDetails / Scope / Deliverables",
        sac: "-",
        amount: 10000.00
      }
    ],
    taxSettings: {
      mode: "exempt",
      igst: { enabled: true, rate: 18, customAmount: 0 },
      cgst: { enabled: true, rate: 9, customAmount: 0 },
      sgst: { enabled: true, rate: 9, customAmount: 0 },
      discount: { enabled: false, rate: 0, amount: 0 }
    },
    amountInWords: {
      auto: true,
      text: ""
    },
    bank: {
      cardTitle: "BANK DETAILS FOR PAYMENT",
      accountHolder: "Your Account Name",
      accountNo: "000000000000 (Savings/Current)",
      ifsc: "BANK0000000",
      bankBranch: "Bank Name, Branch Name",
      upiId: ""
    },
    disclaimer: "This is a computer-generated invoice and does not require a signature.",
    footer: {
      leftText: "Invoice INV-2026-001",
      rightText: "Page 1 of 1"
    }
  }
};
