/**
 * InvoiceForge - Complete Standalone Bundle with History Archive Integration
 * Supports full two-way editing, Indian numbering, calculations, printing, and archive management.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'invoiceforge_saved_data_v1';
  const HISTORY_STORAGE_KEY = 'invoiceforge_history_v1';

  // 1. DATA & PRESETS
  const DEFAULT_INVOICE = {
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
      currencyPosition: "prefix"
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

  const PRESETS = {
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
        invoiceNo: `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
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

  // 2. NUMBER TO INDIAN WORDS & FORMATTING
  const ONES = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const TENS = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertBelowThousand(n) {
    let word = "";
    if (n >= 100) {
      word += ONES[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      word += TENS[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      word += ONES[n] + " ";
    }
    return word.trim();
  }

  function numberToIndianWords(amount, currencyPrefix = "Rupees", coinName = "Paise") {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return "";
    }

    const num = Math.abs(Number(amount));
    if (num === 0) {
      return `${currencyPrefix} Zero Only`;
    }

    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    let remaining = integerPart;
    let parts = [];

    if (remaining >= 10000000) {
      const crore = Math.floor(remaining / 10000000);
      remaining %= 10000000;
      parts.push(numberToIndianWords(crore, "", "").replace("Only", "").trim() + " Crore");
    }

    if (remaining >= 100000) {
      const lakh = Math.floor(remaining / 100000);
      remaining %= 100000;
      parts.push(convertBelowThousand(lakh) + " Lakh");
    }

    if (remaining >= 1000) {
      const thousand = Math.floor(remaining / 1000);
      remaining %= 1000;
      parts.push(convertBelowThousand(thousand) + " Thousand");
    }

    if (remaining > 0) {
      parts.push(convertBelowThousand(remaining));
    }

    let result = parts.join(" ").trim();
    if (currencyPrefix) {
      result = `${currencyPrefix} ${result}`;
    }

    if (decimalPart > 0) {
      const decimalWords = convertBelowThousand(decimalPart);
      result += ` and ${decimalWords} ${coinName}`;
    }

    return `${result} Only`;
  }

  function formatIndianCurrency(num, decimals = 2) {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    const fixed = Number(num).toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");

    let lastThree = intPart.slice(-3);
    let otherNumbers = intPart.slice(0, -3);
    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }
    const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }

  // 3. MAIN APPLICATION CONTROLLER
  class InvoiceApp {
    constructor() {
      this.state = this.loadState();
      this.zoomLevel = 1.0;

      // Seed history with default invoice if history is currently empty
      this.ensureHistorySeeded();

      this.initElements();
      this.bindEvents();
      this.render();
      this.updateHistoryBadge();
    }

    loadState() {
      const urlParams = new URLSearchParams(window.location.search);
      const loadId = urlParams.get('loadId');
      const isNew = urlParams.get('new');

      if (isNew === 'true') {
        const fresh = JSON.parse(JSON.stringify(PRESETS.blank));
        return fresh;
      }

      if (loadId) {
        try {
          const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
          if (rawHistory) {
            const hist = JSON.parse(rawHistory);
            const found = hist.find(h => h.id === loadId);
            if (found && found.data) {
              return found.data;
            }
          }
        } catch (e) {
          console.warn('Failed to load invoice by id:', e);
        }
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_INVOICE));
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.showSaveIndicator();
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }

    ensureHistorySeeded() {
      try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!raw || JSON.parse(raw).length === 0) {
          const seedEntry = {
            id: "inv_initial_seed",
            invoiceNo: DEFAULT_INVOICE.meta.invoiceNo,
            clientName: DEFAULT_INVOICE.client.name,
            clientEmail: DEFAULT_INVOICE.client.email,
            sellerName: DEFAULT_INVOICE.seller.name,
            date: DEFAULT_INVOICE.meta.invoiceDate,
            totalAmount: 40000.00,
            currencySymbol: "Rs.",
            status: "Generated",
            savedAt: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(DEFAULT_INVOICE))
          };
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([seedEntry]));
        }
      } catch (e) {
        console.warn('Failed to seed history:', e);
      }
    }

    saveToHistoryArchive(status = 'Generated') {
      try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        const history = raw ? JSON.parse(raw) : [];
        const invoiceNo = this.state.meta.invoiceNo || `INV-${Date.now()}`;

        const { totalAmount } = this.calculate();

        const existingIdx = history.findIndex(h => h.invoiceNo === invoiceNo);
        const entry = {
          id: existingIdx >= 0 ? history[existingIdx].id : `inv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          invoiceNo: invoiceNo,
          clientName: this.state.client?.name || 'Unnamed Client',
          clientEmail: this.state.client?.email || '',
          sellerName: this.state.seller?.name || '',
          date: this.state.meta.invoiceDate || new Date().toLocaleDateString('en-GB'),
          totalAmount: totalAmount,
          currencySymbol: this.state.meta.currencySymbol || 'Rs.',
          status: status,
          savedAt: new Date().toISOString(),
          data: JSON.parse(JSON.stringify(this.state))
        };

        if (existingIdx >= 0) {
          history[existingIdx] = entry;
        } else {
          history.unshift(entry);
        }

        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        this.updateHistoryBadge();
        return entry;
      } catch (e) {
        console.warn('Failed to archive to history:', e);
      }
      return null;
    }

    updateHistoryBadge() {
      try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        const count = raw ? JSON.parse(raw).length : 0;
        const badge = document.getElementById('history-count-badge');
        if (badge) {
          badge.textContent = count;
        }
      } catch (e) {}
    }

    initElements() {
      this.tabs = document.querySelectorAll('.tab-btn');
      this.tabPanels = document.querySelectorAll('.tab-panel');

      this.sidebarForm = document.getElementById('sidebar-form');
      this.itemListContainer = document.getElementById('sidebar-items-list');
      this.addItemBtn = document.getElementById('btn-add-item-sidebar');

      this.sheet = document.getElementById('invoice-sheet');
      this.canvasWrapper = document.getElementById('preview-canvas-wrapper');

      this.btnPrint = document.getElementById('btn-print');
      this.btnSaveHistory = document.getElementById('btn-save-history');
      this.btnReset = document.getElementById('btn-reset');
      this.btnExportJson = document.getElementById('btn-export-json');
      this.btnImportJson = document.getElementById('btn-import-json');
      this.presetSelect = document.getElementById('preset-select');
      this.btnZoomIn = document.getElementById('btn-zoom-in');
      this.btnZoomOut = document.getElementById('btn-zoom-out');
      this.btnZoomFit = document.getElementById('btn-zoom-fit');
      this.zoomLevelText = document.getElementById('zoom-level-text');
      this.sidebarToggleBtn = document.getElementById('btn-toggle-sidebar');
      this.sidebarEl = document.getElementById('app-sidebar');

      // Mobile view switcher elements
      this.appLayout = document.getElementById('app-layout');
      this.btnShowForm = document.getElementById('btn-show-form');
      this.btnShowPreview = document.getElementById('btn-show-preview');

      this.jsonModal = document.getElementById('json-modal');
      this.jsonTextarea = document.getElementById('json-textarea');
      this.btnApplyJson = document.getElementById('btn-apply-json');
      this.btnCloseJson = document.getElementById('btn-close-json');
      this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
      // Tab switching
      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          this.tabs.forEach(t => t.classList.remove('active'));
          this.tabPanels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          const panel = document.getElementById(`tab-${target}`);
          if (panel) panel.classList.add('active');
        });
      });

      // Sidebar input updates
      if (this.sidebarForm) {
        this.sidebarForm.addEventListener('input', (e) => this.handleSidebarInput(e));
        this.sidebarForm.addEventListener('change', (e) => this.handleSidebarInput(e));
      }

      // Add item from sidebar button
      if (this.addItemBtn) {
        this.addItemBtn.addEventListener('click', () => this.addNewItem());
      }

      // Preset selector
      if (this.presetSelect) {
        this.presetSelect.addEventListener('change', (e) => {
          const val = e.target.value;
          if (PRESETS[val]) {
            this.state = JSON.parse(JSON.stringify(PRESETS[val]));
            this.saveState();
            this.render();
            this.showToast(`Loaded ${val.charAt(0).toUpperCase() + val.slice(1)} template`);
          }
        });
      }

      // Save to History button
      if (this.btnSaveHistory) {
        this.btnSaveHistory.addEventListener('click', () => {
          this.saveToHistoryArchive('Generated');
          this.showToast(`Saved ${this.state.meta.invoiceNo} to History!`);
        });
      }

      // Reset button
      if (this.btnReset) {
        this.btnReset.addEventListener('click', () => {
          if (confirm('Reset invoice to original reference (Tapur Sharma)? Any unsaved custom edits will be replaced.')) {
            this.state = JSON.parse(JSON.stringify(DEFAULT_INVOICE));
            if (this.presetSelect) this.presetSelect.value = 'default';
            this.saveState();
            this.render();
            this.showToast('Reset to original reference invoice');
          }
        });
      }

      // Print & PDF - Auto saves to history archive when printing!
      if (this.btnPrint) {
        this.btnPrint.addEventListener('click', () => {
          this.saveToHistoryArchive('Generated');
          window.print();
        });
      }

      // Zoom Controls
      if (this.btnZoomIn) {
        this.btnZoomIn.addEventListener('click', () => {
          this.setZoom(Math.min(1.5, this.zoomLevel + 0.1));
        });
      }
      if (this.btnZoomOut) {
        this.btnZoomOut.addEventListener('click', () => {
          this.setZoom(Math.max(0.5, this.zoomLevel - 0.1));
        });
      }
      if (this.btnZoomFit) {
        this.btnZoomFit.addEventListener('click', () => {
          this.setZoom(1.0);
        });
      }

      // Mobile sidebar toggle
      if (this.sidebarToggleBtn && this.sidebarEl) {
        this.sidebarToggleBtn.addEventListener('click', () => {
          this.sidebarEl.classList.toggle('open');
        });
      }

      // JSON export & import
      if (this.btnExportJson) {
        this.btnExportJson.addEventListener('click', () => this.exportJson());
      }
      if (this.btnImportJson) {
        this.btnImportJson.addEventListener('click', () => this.openImportModal());
      }
      if (this.btnApplyJson) {
        this.btnApplyJson.addEventListener('click', () => this.applyJsonImport());
      }
      if (this.btnCloseJson) {
        this.btnCloseJson.addEventListener('click', () => {
          this.jsonModal.classList.remove('open');
        });
      }

      // Direct editing on sheet
      if (this.sheet) {
        this.sheet.addEventListener('input', (e) => this.handleDirectEdit(e));
        this.sheet.addEventListener('blur', (e) => this.handleDirectEditBlur(e), true);
      }

      // Mobile view tabs switcher
      if (this.btnShowForm && this.btnShowPreview && this.appLayout) {
        this.btnShowForm.addEventListener('click', () => {
          this.btnShowForm.classList.add('active');
          this.btnShowPreview.classList.remove('active');
          this.appLayout.classList.add('view-form');
          this.appLayout.classList.remove('view-preview');
        });

        this.btnShowPreview.addEventListener('click', () => {
          this.btnShowPreview.classList.add('active');
          this.btnShowForm.classList.remove('active');
          this.appLayout.classList.add('view-preview');
          this.appLayout.classList.remove('view-form');

          // Auto-scale invoice sheet to fit mobile viewport
          if (window.innerWidth < 768) {
            const scale = Math.max(0.4, Math.min(1.0, (window.innerWidth - 24) / 794));
            this.setZoom(scale);
          }
        });
      }

      // Responsive window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth < 768 && this.appLayout && this.appLayout.classList.contains('view-preview')) {
          const scale = Math.max(0.4, Math.min(1.0, (window.innerWidth - 24) / 794));
          this.setZoom(scale);
        }
      });

      document.body.classList.add('editing-active');
    }

    setZoom(val) {
      this.zoomLevel = Math.round(val * 10) / 10;
      if (this.canvasWrapper) {
        this.canvasWrapper.style.transform = `scale(${this.zoomLevel})`;
      }
      if (this.zoomLevelText) {
        this.zoomLevelText.textContent = `${Math.round(this.zoomLevel * 100)}%`;
      }
    }

    showSaveIndicator() {
      const statusText = document.getElementById('save-status-indicator');
      if (statusText) {
        statusText.innerHTML = '<span class="status-dot"></span> Saved to browser';
      }
    }

    showToast(message) {
      if (!this.toastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
      this.toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }, 2500);
    }

    calculate() {
      const subtotal = this.state.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
      const taxSettings = this.state.taxSettings || {};
      const mode = taxSettings.mode || 'exempt';

      let igstAmount = 0;
      let cgstAmount = 0;
      let sgstAmount = 0;

      if (mode === 'calculate') {
        if (taxSettings.igst?.enabled) {
          igstAmount = (subtotal * (Number(taxSettings.igst.rate) || 0)) / 100;
        }
        if (taxSettings.cgst?.enabled) {
          cgstAmount = (subtotal * (Number(taxSettings.cgst.rate) || 0)) / 100;
        }
        if (taxSettings.sgst?.enabled) {
          sgstAmount = (subtotal * (Number(taxSettings.sgst.rate) || 0)) / 100;
        }
      } else if (mode === 'custom') {
        igstAmount = Number(taxSettings.igst?.customAmount) || 0;
        cgstAmount = Number(taxSettings.cgst?.customAmount) || 0;
        sgstAmount = Number(taxSettings.sgst?.customAmount) || 0;
      } else {
        igstAmount = 0;
        cgstAmount = 0;
        sgstAmount = 0;
      }

      const totalTaxes = igstAmount + cgstAmount + sgstAmount;
      const totalAmount = Math.max(0, subtotal + totalTaxes);

      return {
        subtotal,
        igstAmount,
        cgstAmount,
        sgstAmount,
        totalAmount
      };
    }

    render() {
      this.renderSidebar();
      this.renderSheet();
    }

    renderSidebar() {
      const inputs = document.querySelectorAll('[data-model]');
      inputs.forEach(input => {
        const path = input.dataset.model;
        const val = this.getNestedValue(this.state, path);
        if (input.type === 'checkbox') {
          input.checked = Boolean(val);
        } else if (val !== undefined && val !== null) {
          input.value = val;
        }
      });

      if (this.itemListContainer) {
        this.itemListContainer.innerHTML = '';
        this.state.items.forEach((item, index) => {
          const itemCard = document.createElement('div');
          itemCard.className = 'item-card';
          itemCard.innerHTML = `
            <div class="item-card-header">
              <span class="item-card-title">#${index + 1} Line Item</span>
              ${this.state.items.length > 1 ? `
                <button type="button" class="item-card-remove" data-action="remove-item" data-index="${index}">
                  ✕ Delete
                </button>
              ` : ''}
            </div>
            <div class="form-group">
              <label class="form-label">Description / Job Details</label>
              <textarea class="form-textarea" data-item-field="description" data-index="${index}">${this.escapeHtml(item.description || '')}</textarea>
            </div>
            <div class="form-row">
              <div>
                <label class="form-label">SAC / HSN</label>
                <input type="text" class="form-input" data-item-field="sac" data-index="${index}" value="${this.escapeHtml(item.sac || '')}">
              </div>
              <div>
                <label class="form-label">Amount (${this.state.meta.currencySymbol || 'Rs.'})</label>
                <input type="number" step="0.01" class="form-input" data-item-field="amount" data-index="${index}" value="${item.amount}">
              </div>
            </div>
          `;
          this.itemListContainer.appendChild(itemCard);
        });

        // Bind remove buttons
        this.itemListContainer.querySelectorAll('[data-action="remove-item"]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index, 10);
            this.removeItem(idx);
          });
        });

        // Bind item input fields
        this.itemListContainer.querySelectorAll('[data-item-field]').forEach(inp => {
          inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.index, 10);
            const field = e.target.dataset.itemField;
            let val = e.target.value;
            if (field === 'amount') val = parseFloat(val) || 0;
            this.state.items[idx][field] = val;
            this.saveState();
            this.renderSheet();
          });
        });
      }
    }

    renderSheet() {
      if (!this.sheet) return;

      const { subtotal, igstAmount, cgstAmount, sgstAmount, totalAmount } = this.calculate();
      const sym = this.state.meta.currencySymbol || 'Rs.';

      let wordsText = this.state.amountInWords.text;
      if (this.state.amountInWords.auto) {
        wordsText = numberToIndianWords(totalAmount, 'Rupees', 'Paise');
        this.state.amountInWords.text = wordsText;
      }

      const s = this.state;

      this.sheet.innerHTML = `
        <!-- TOP HEADER -->
        <div class="inv-header">
          <div class="inv-seller-info">
            <h1 class="inv-seller-name" contenteditable="true" data-field="seller.name">${this.escapeHtml(s.seller.name)}</h1>
            <div class="inv-seller-address" contenteditable="true" data-field="seller.address">${this.escapeHtml(s.seller.address)}</div>
            <div class="inv-seller-tax-info">
              <span class="inv-label-bold">PAN:</span> <span contenteditable="true" data-field="seller.pan">${this.escapeHtml(s.seller.pan)}</span>
            </div>
            <div class="inv-seller-tax-info">
              <span class="inv-label-bold">GSTIN:</span> <span contenteditable="true" data-field="seller.gstin">${this.escapeHtml(s.seller.gstin)}</span>
            </div>
            <div class="inv-seller-contact">
              <span class="inv-label-bold">Email:</span> <span contenteditable="true" data-field="seller.email">${this.escapeHtml(s.seller.email)}</span>
              <span> | </span>
              <span class="inv-label-bold">Phone:</span> <span contenteditable="true" data-field="seller.phone">${this.escapeHtml(s.seller.phone)}</span>
            </div>
          </div>

          <div class="inv-header-right">
            <div class="inv-main-title" contenteditable="true" data-field="meta.title">${this.escapeHtml(s.meta.title)}</div>
            <div class="inv-meta-card">
              <div class="inv-meta-row">
                <span class="inv-meta-label">Invoice No.:</span>
                <span class="inv-meta-val" contenteditable="true" data-field="meta.invoiceNo">${this.escapeHtml(s.meta.invoiceNo)}</span>
              </div>
              <div class="inv-meta-row">
                <span class="inv-meta-label">Invoice Date:</span>
                <span class="inv-meta-val" contenteditable="true" data-field="meta.invoiceDate">${this.escapeHtml(s.meta.invoiceDate)}</span>
              </div>
              ${s.meta.dueDate ? `
              <div class="inv-meta-row">
                <span class="inv-meta-label">Due Date:</span>
                <span class="inv-meta-val" contenteditable="true" data-field="meta.dueDate">${this.escapeHtml(s.meta.dueDate)}</span>
              </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- SOLID THICK DIVIDER -->
        <div class="inv-top-divider"></div>

        <!-- BILL TO CARD -->
        <div class="inv-bill-to-card">
          <div class="inv-bill-to-tag" contenteditable="true" data-field="client.cardTitle">${this.escapeHtml(s.client.cardTitle || 'BILL TO')}</div>
          <div class="inv-client-name" contenteditable="true" data-field="client.name">${this.escapeHtml(s.client.name)}</div>
          <div class="inv-client-address" contenteditable="true" data-field="client.address">${this.escapeHtml(s.client.address)}</div>
          <div class="inv-client-gstin">
            <span class="inv-label-bold">GSTIN:</span> <span contenteditable="true" data-field="client.gstin">${this.escapeHtml(s.client.gstin)}</span>
          </div>
          <div class="inv-client-contact">
            <span class="inv-label-bold">Email:</span> <span contenteditable="true" data-field="client.email">${this.escapeHtml(s.client.email)}</span>
          </div>
        </div>

        <!-- TABLE OF ITEMS -->
        <div class="inv-table-wrapper">
          <table class="inv-table">
            <thead>
              <tr>
                <th class="inv-col-idx">#</th>
                <th class="inv-col-desc">DESCRIPTION OF WORK</th>
                <th class="inv-col-sac">SAC</th>
                <th class="inv-col-amt">AMOUNT (${s.meta.currency || 'INR'})</th>
                <th class="inv-col-action non-printable"></th>
              </tr>
            </thead>
            <tbody>
              ${s.items.map((item, idx) => `
                <tr data-item-row-index="${idx}">
                  <td class="inv-col-idx">${idx + 1}</td>
                  <td class="inv-col-desc">
                    <div class="inv-item-desc" contenteditable="true" data-sheet-item="description" data-index="${idx}">${this.escapeHtml(item.description)}</div>
                  </td>
                  <td class="inv-col-sac">
                    <span contenteditable="true" data-sheet-item="sac" data-index="${idx}">${this.escapeHtml(item.sac || '-')}</span>
                  </td>
                  <td class="inv-col-amt">
                    <span contenteditable="true" data-sheet-item="amount" data-index="${idx}">${formatIndianCurrency(item.amount)}</span>
                  </td>
                  <td class="inv-col-action non-printable">
                    ${s.items.length > 1 ? `
                      <button type="button" class="inv-row-delete-btn" title="Delete Row" data-action="delete-sheet-row" data-index="${idx}">✕</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
              <tr class="inv-add-item-row non-printable">
                <td colspan="5">
                  <button type="button" class="inv-btn-add-item-table" id="btn-add-item-table">
                    <span>+</span> Add Line Item
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- CALCULATION & TOTALS SECTION -->
        <div class="inv-calculation-section">
          <div class="inv-totals-box">
            <div class="inv-total-row">
              <span>Subtotal</span>
              <span class="inv-total-val">${formatIndianCurrency(subtotal)}</span>
            </div>

            ${s.taxSettings.igst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>IGST @ <span contenteditable="true" data-field="taxSettings.igst.rate">${s.taxSettings.igst.rate}</span>%</span>
              <span class="inv-total-val">${formatIndianCurrency(igstAmount)}</span>
            </div>
            ` : ''}

            ${s.taxSettings.cgst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>CGST @ <span contenteditable="true" data-field="taxSettings.cgst.rate">${s.taxSettings.cgst.rate}</span>%</span>
              <span class="inv-total-val">${formatIndianCurrency(cgstAmount)}</span>
            </div>
            ` : ''}

            ${s.taxSettings.sgst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>SGST @ <span contenteditable="true" data-field="taxSettings.sgst.rate">${s.taxSettings.sgst.rate}</span>%</span>
              <span class="inv-total-val">${formatIndianCurrency(sgstAmount)}</span>
            </div>
            ` : ''}

            <div class="inv-grand-total-row">
              <span class="inv-grand-total-label">Total Amount</span>
              <span class="inv-grand-total-val">${sym} ${formatIndianCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <!-- AMOUNT IN WORDS BANNER -->
        <div class="inv-words-banner">
          <span class="inv-words-label">Amount in words:</span>
          <span contenteditable="true" data-field="amountInWords.text">${this.escapeHtml(wordsText)}</span>
        </div>

        <!-- BANK DETAILS FOR PAYMENT -->
        <div class="inv-bank-card">
          <div class="inv-bank-title" contenteditable="true" data-field="bank.cardTitle">${this.escapeHtml(s.bank.cardTitle || 'BANK DETAILS FOR PAYMENT')}</div>
          <div class="inv-bank-grid">
            <div class="inv-bank-item">
              <span class="inv-label-bold">Account Holder Name:</span>
              <span contenteditable="true" data-field="bank.accountHolder">${this.escapeHtml(s.bank.accountHolder)}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">Account No.:</span>
              <span contenteditable="true" data-field="bank.accountNo">${this.escapeHtml(s.bank.accountNo)}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">IFSC Code:</span>
              <span contenteditable="true" data-field="bank.ifsc">${this.escapeHtml(s.bank.ifsc)}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">Bank & Branch:</span>
              <span contenteditable="true" data-field="bank.bankBranch">${this.escapeHtml(s.bank.bankBranch)}</span>
            </div>
            ${s.bank.upiId ? `
            <div class="inv-bank-item">
              <span class="inv-label-bold">UPI ID:</span>
              <span contenteditable="true" data-field="bank.upiId">${this.escapeHtml(s.bank.upiId)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- DISCLAIMER -->
        <div class="inv-disclaimer" contenteditable="true" data-field="disclaimer">
          ${this.escapeHtml(s.disclaimer)}
        </div>

        <!-- FOOTER -->
        <div class="inv-footer">
          <div contenteditable="true" data-field="footer.leftText">
            ${this.escapeHtml(s.footer.leftText || `Invoice ${s.meta.invoiceNo}`)}
          </div>
          <div contenteditable="true" data-field="footer.rightText">
            ${this.escapeHtml(s.footer.rightText || 'Page 1 of 1')}
          </div>
        </div>
      `;

      // Re-bind buttons inside the sheet
      const addBtn = this.sheet.querySelector('#btn-add-item-table');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.addNewItem());
      }

      this.sheet.querySelectorAll('[data-action="delete-sheet-row"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          this.removeItem(idx);
        });
      });
    }

    handleDirectEdit(e) {
      const target = e.target;
      const field = target.dataset.field;
      const sheetItem = target.dataset.sheetItem;

      if (field) {
        const val = target.innerText.trim();
        this.setNestedValue(this.state, field, val);

        if (field === 'meta.invoiceNo') {
          this.state.footer.leftText = `Invoice ${val}`;
          const footerLeftEl = this.sheet.querySelector('[data-field="footer.leftText"]');
          if (footerLeftEl) footerLeftEl.innerText = this.state.footer.leftText;
        }

        this.saveState();
        this.syncSidebarField(field, val);
      } else if (sheetItem) {
        const idx = parseInt(target.dataset.index, 10);
        if (sheetItem === 'description') {
          this.state.items[idx].description = target.innerText;
        } else if (sheetItem === 'sac') {
          this.state.items[idx].sac = target.innerText.trim();
        }
        this.saveState();
      }
    }

    handleDirectEditBlur(e) {
      const target = e.target;
      const sheetItem = target.dataset.sheetItem;
      const field = target.dataset.field;

      if (sheetItem === 'amount') {
        const idx = parseInt(target.dataset.index, 10);
        const cleanNum = parseFloat(target.innerText.replace(/[^0-9.-]+/g, '')) || 0;
        this.state.items[idx].amount = cleanNum;
        this.saveState();
        this.render();
      } else if (field === 'taxSettings.igst.rate' || field === 'taxSettings.cgst.rate' || field === 'taxSettings.sgst.rate') {
        const cleanNum = parseFloat(target.innerText.replace(/[^0-9.-]+/g, '')) || 0;
        this.setNestedValue(this.state, field, cleanNum);
        this.saveState();
        this.render();
      } else if (field === 'amountInWords.text') {
        this.state.amountInWords.auto = false;
        this.state.amountInWords.text = target.innerText.trim();
        this.saveState();
        this.syncSidebarField('amountInWords.auto', false);
      }
    }

    handleSidebarInput(e) {
      const target = e.target;
      const model = target.dataset.model;
      if (!model) return;

      let val = target.value;
      if (target.type === 'checkbox') {
        val = target.checked;
      } else if (target.type === 'number') {
        val = parseFloat(val) || 0;
      }

      this.setNestedValue(this.state, model, val);

      if (model === 'meta.invoiceNo') {
        this.state.footer.leftText = `Invoice ${val}`;
      }

      this.saveState();
      this.renderSheet();
    }

    syncSidebarField(path, value) {
      const input = document.querySelector(`[data-model="${path}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = Boolean(value);
        } else {
          input.value = value;
        }
      }
    }

    addNewItem() {
      this.state.items.push({
        id: `item-${Date.now()}`,
        description: "New Job or Service Description\nAdditional scope details",
        sac: "-",
        amount: 5000.00
      });
      this.saveState();
      this.render();
      this.showToast('Added new line item');
    }

    removeItem(index) {
      if (this.state.items.length <= 1) {
        alert('An invoice must have at least one line item.');
        return;
      }
      this.state.items.splice(index, 1);
      this.saveState();
      this.render();
      this.showToast('Item deleted');
    }

    exportJson() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${this.state.meta.invoiceNo || 'invoice'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast('Exported invoice JSON');
    }

    openImportModal() {
      if (!this.jsonModal || !this.jsonTextarea) return;
      this.jsonTextarea.value = JSON.stringify(this.state, null, 2);
      this.jsonModal.classList.add('open');
    }

    applyJsonImport() {
      try {
        const parsed = JSON.parse(this.jsonTextarea.value);
        if (parsed && parsed.seller && parsed.meta && parsed.items) {
          this.state = parsed;
          this.saveState();
          this.render();
          this.jsonModal.classList.remove('open');
          this.showToast('Invoice data imported successfully!');
        } else {
          alert('Invalid invoice structure. Please check the JSON format.');
        }
      } catch (err) {
        alert('Invalid JSON syntax: ' + err.message);
      }
    }

    getNestedValue(obj, path) {
      return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
    }

    setNestedValue(obj, path, value) {
      const parts = path.split('.');
      let curr = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      curr[parts[parts.length - 1]] = value;
    }

    escapeHtml(str) {
      if (typeof str !== 'string') return str || '';
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.invoiceApp = new InvoiceApp();
  });

})();
