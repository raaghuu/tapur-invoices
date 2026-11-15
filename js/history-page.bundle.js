/**
 * Invoice History Tracker Controller
 * Manages invoice archive, searching, filtering, stats, previewing, and direct printing/downloading.
 */

(function () {
  'use strict';

  const HISTORY_STORAGE_KEY = 'invoiceforge_history_v1';

  // Fallback initial sample if history is empty
  const INITIAL_SEED_INVOICE = {
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
      mode: "exempt",
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

  // Indian currency formatting
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

  function escapeHtml(str) {
    if (typeof str !== 'string') return str || '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  class HistoryApp {
    constructor() {
      this.history = this.loadHistory();
      this.activeFilter = 'all';
      this.searchQuery = '';
      this.currentPreviewItem = null;

      this.initElements();
      this.bindEvents();
      this.render();
    }

    loadHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse history', e);
      }

      // Seed with initial sample invoice if none exists
      const initialEntry = {
        id: "inv_initial_seed",
        invoiceNo: "INV-2026-001",
        clientName: "CUTAWAYY FILMS PRIVATE LIMITED",
        clientEmail: "accounts@cutawayyfilms.com",
        sellerName: "Tapur Sharma",
        date: "26 Oct 2026",
        totalAmount: 40000.00,
        currencySymbol: "Rs.",
        status: "Generated",
        savedAt: new Date().toISOString(),
        data: INITIAL_SEED_INVOICE
      };

      const seedList = [initialEntry];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(seedList));
      return seedList;
    }

    saveHistory() {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
      } catch (e) {
        console.warn('Failed to save history', e);
      }
    }

    initElements() {
      this.tableBody = document.getElementById('history-table-body');
      this.emptyState = document.getElementById('empty-state');
      this.searchInput = document.getElementById('search-input');
      this.statusFilter = document.getElementById('status-filter');
      this.btnClearHistory = document.getElementById('btn-clear-history');
      this.btnExportAllJson = document.getElementById('btn-export-all-json');

      // Stats
      this.statTotalCount = document.getElementById('stat-total-count');
      this.statTotalAmount = document.getElementById('stat-total-amount');
      this.statStatusSummary = document.getElementById('stat-status-summary');

      // Modal elements
      this.previewModal = document.getElementById('preview-modal');
      this.previewModalTitle = document.getElementById('preview-modal-title');
      this.modalInvoiceSheet = document.getElementById('modal-invoice-sheet');
      this.btnModalPrint = document.getElementById('btn-modal-print');
      this.btnCloseModal = document.getElementById('btn-close-modal');

      this.printStagingArea = document.getElementById('print-staging-area');
      this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderTable();
        });
      }

      if (this.statusFilter) {
        this.statusFilter.addEventListener('change', (e) => {
          this.activeFilter = e.target.value;
          this.renderTable();
        });
      }

      if (this.btnClearHistory) {
        this.btnClearHistory.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear your invoice history? This cannot be undone.')) {
            this.history = [];
            this.saveHistory();
            this.render();
            this.showToast('History cleared');
          }
        });
      }

      if (this.btnExportAllJson) {
        this.btnExportAllJson.addEventListener('click', () => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.history, null, 2));
          const dl = document.createElement('a');
          dl.setAttribute("href", dataStr);
          dl.setAttribute("download", `invoices_history_backup_${Date.now()}.json`);
          document.body.appendChild(dl);
          dl.click();
          dl.remove();
          this.showToast('Exported history JSON');
        });
      }

      if (this.btnCloseModal) {
        this.btnCloseModal.addEventListener('click', () => {
          this.previewModal.classList.remove('open');
        });
      }

      if (this.btnModalPrint) {
        this.btnModalPrint.addEventListener('click', () => {
          if (this.currentPreviewItem) {
            this.printSingleInvoice(this.currentPreviewItem);
          }
        });
      }
    }

    render() {
      this.renderStats();
      this.renderTable();
    }

    renderStats() {
      const totalCount = this.history.length;
      const totalAmt = this.history.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);

      const paidCount = this.history.filter(i => i.status === 'Paid').length;
      const generatedCount = this.history.filter(i => i.status === 'Generated').length;
      const pendingCount = this.history.filter(i => i.status === 'Pending').length;

      if (this.statTotalCount) this.statTotalCount.textContent = totalCount;
      if (this.statTotalAmount) this.statTotalAmount.textContent = `Rs. ${formatIndianCurrency(totalAmt)}`;
      if (this.statStatusSummary) {
        this.statStatusSummary.innerHTML = `
          <span style="color:#0284c7; font-weight:700;">${generatedCount} Generated</span> &bull; 
          <span style="color:#15803d; font-weight:700;">${paidCount} Paid</span> &bull; 
          <span style="color:#b45309; font-weight:700;">${pendingCount} Pending</span>
        `;
      }
    }

    getFilteredItems() {
      return this.history.filter(item => {
        const matchesFilter = (this.activeFilter === 'all') || (item.status === this.activeFilter);
        const query = this.searchQuery;
        const matchesSearch = !query || 
          (item.invoiceNo && item.invoiceNo.toLowerCase().includes(query)) ||
          (item.clientName && item.clientName.toLowerCase().includes(query)) ||
          (item.clientEmail && item.clientEmail.toLowerCase().includes(query)) ||
          (String(item.totalAmount).includes(query));

        return matchesFilter && matchesSearch;
      });
    }

    renderTable() {
      if (!this.tableBody) return;
      const items = this.getFilteredItems();

      if (items.length === 0) {
        this.tableBody.innerHTML = '';
        if (this.emptyState) this.emptyState.style.display = 'block';
        return;
      }

      if (this.emptyState) this.emptyState.style.display = 'none';

      this.tableBody.innerHTML = items.map(item => `
        <tr data-id="${item.id}">
          <td data-label="Invoice No">
            <div class="invoice-id-badge">${escapeHtml(item.invoiceNo)}</div>
          </td>
          <td data-label="Date">${escapeHtml(item.date)}</td>
          <td data-label="Client">
            <div class="client-cell-name">${escapeHtml(item.clientName)}</div>
            ${item.clientEmail ? `<div class="client-cell-email">${escapeHtml(item.clientEmail)}</div>` : ''}
          </td>
          <td data-label="Amount">
            <div class="amount-cell">${item.currencySymbol || 'Rs.'} ${formatIndianCurrency(item.totalAmount)}</div>
          </td>
          <td data-label="Status">
            <span class="badge-status badge-${(item.status || 'generated').toLowerCase()}" data-action="toggle-status" data-id="${item.id}" title="Click to cycle status (Generated -> Paid -> Pending)">
              ${item.status || 'Generated'}
            </span>
          </td>
          <td data-label="Actions">
            <div class="table-actions">
              <!-- Print / Download PDF button -->
              <button type="button" class="action-btn action-btn-primary" data-action="print" data-id="${item.id}" title="Print or Save as PDF">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                PDF
              </button>

              <!-- Quick View button -->
              <button type="button" class="action-btn" data-action="preview" data-id="${item.id}" title="Quick View">
                View
              </button>

              <!-- Edit in Editor button -->
              <a href="index.html?loadId=${encodeURIComponent(item.id)}" class="action-btn" title="Open in Editor">
                Edit ↗
              </a>

              <!-- Download JSON button -->
              <button type="button" class="action-btn" data-action="download-json" data-id="${item.id}" title="Download JSON file">
                JSON
              </button>

              <!-- Delete button -->
              <button type="button" class="action-btn action-btn-danger" data-action="delete" data-id="${item.id}" title="Delete invoice">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      // Bind row actions
      this.tableBody.querySelectorAll('[data-action="print"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const item = this.history.find(h => h.id === id);
          if (item) this.printSingleInvoice(item);
        });
      });

      this.tableBody.querySelectorAll('[data-action="preview"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const item = this.history.find(h => h.id === id);
          if (item) this.openPreviewModal(item);
        });
      });

      this.tableBody.querySelectorAll('[data-action="download-json"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const item = this.history.find(h => h.id === id);
          if (item) this.downloadSingleJson(item);
        });
      });

      this.tableBody.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          this.deleteItem(id);
        });
      });

      this.tableBody.querySelectorAll('[data-action="toggle-status"]').forEach(badge => {
        badge.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          this.cycleStatus(id);
        });
      });
    }

    cycleStatus(id) {
      const item = this.history.find(h => h.id === id);
      if (!item) return;

      const order = ['Generated', 'Paid', 'Pending'];
      const currentIdx = order.indexOf(item.status || 'Generated');
      const nextStatus = order[(currentIdx + 1) % order.length];

      item.status = nextStatus;
      this.saveHistory();
      this.render();
      this.showToast(`Updated status to ${nextStatus}`);
    }

    deleteItem(id) {
      const item = this.history.find(h => h.id === id);
      if (!item) return;

      if (confirm(`Delete invoice "${item.invoiceNo}" for ${item.clientName}?`)) {
        this.history = this.history.filter(h => h.id !== id);
        this.saveHistory();
        this.render();
        this.showToast('Invoice deleted from history');
      }
    }

    downloadSingleJson(item) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item.data, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `${item.invoiceNo || 'invoice'}.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      this.showToast(`Exported ${item.invoiceNo}.json`);
    }

    // Generate exact pixel-perfect HTML for an invoice item
    generateInvoiceHtml(s) {
      const subtotal = (s.items || []).reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
      const taxSettings = s.taxSettings || {};
      let igst = 0, cgst = 0, sgst = 0;

      if (taxSettings.mode === 'calculate') {
        if (taxSettings.igst?.enabled) igst = (subtotal * (Number(taxSettings.igst.rate) || 0)) / 100;
        if (taxSettings.cgst?.enabled) cgst = (subtotal * (Number(taxSettings.cgst.rate) || 0)) / 100;
        if (taxSettings.sgst?.enabled) sgst = (subtotal * (Number(taxSettings.sgst.rate) || 0)) / 100;
      } else if (taxSettings.mode === 'custom') {
        igst = Number(taxSettings.igst?.customAmount) || 0;
        cgst = Number(taxSettings.cgst?.customAmount) || 0;
        sgst = Number(taxSettings.sgst?.customAmount) || 0;
      }
      const totalAmount = subtotal + igst + cgst + sgst;
      const sym = s.meta?.currencySymbol || 'Rs.';

      return `
        <div class="inv-header">
          <div class="inv-seller-info">
            <h1 class="inv-seller-name">${escapeHtml(s.seller?.name || '')}</h1>
            <div class="inv-seller-address">${escapeHtml(s.seller?.address || '')}</div>
            <div class="inv-seller-tax-info">
              <span class="inv-label-bold">PAN:</span> <span>${escapeHtml(s.seller?.pan || '')}</span>
            </div>
            <div class="inv-seller-tax-info">
              <span class="inv-label-bold">GSTIN:</span> <span>${escapeHtml(s.seller?.gstin || '')}</span>
            </div>
            <div class="inv-seller-contact">
              <span class="inv-label-bold">Email:</span> <span>${escapeHtml(s.seller?.email || '')}</span>
              <span> | </span>
              <span class="inv-label-bold">Phone:</span> <span>${escapeHtml(s.seller?.phone || '')}</span>
            </div>
          </div>

          <div class="inv-header-right">
            <div class="inv-main-title">${escapeHtml(s.meta?.title || 'INVOICE')}</div>
            <div class="inv-meta-card">
              <div class="inv-meta-row">
                <span class="inv-meta-label">Invoice No.:</span>
                <span class="inv-meta-val">${escapeHtml(s.meta?.invoiceNo || '')}</span>
              </div>
              <div class="inv-meta-row">
                <span class="inv-meta-label">Invoice Date:</span>
                <span class="inv-meta-val">${escapeHtml(s.meta?.invoiceDate || '')}</span>
              </div>
              ${s.meta?.dueDate ? `
              <div class="inv-meta-row">
                <span class="inv-meta-label">Due Date:</span>
                <span class="inv-meta-val">${escapeHtml(s.meta.dueDate)}</span>
              </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="inv-top-divider"></div>

        <div class="inv-bill-to-card">
          <div class="inv-bill-to-tag">${escapeHtml(s.client?.cardTitle || 'BILL TO')}</div>
          <div class="inv-client-name">${escapeHtml(s.client?.name || '')}</div>
          <div class="inv-client-address">${escapeHtml(s.client?.address || '')}</div>
          <div class="inv-client-gstin">
            <span class="inv-label-bold">GSTIN:</span> <span>${escapeHtml(s.client?.gstin || '')}</span>
          </div>
          <div class="inv-client-contact">
            <span class="inv-label-bold">Email:</span> <span>${escapeHtml(s.client?.email || '')}</span>
          </div>
        </div>

        <div class="inv-table-wrapper">
          <table class="inv-table">
            <thead>
              <tr>
                <th class="inv-col-idx">#</th>
                <th class="inv-col-desc">DESCRIPTION OF WORK</th>
                <th class="inv-col-sac">SAC</th>
                <th class="inv-col-amt">AMOUNT (${s.meta?.currency || 'INR'})</th>
              </tr>
            </thead>
            <tbody>
              ${(s.items || []).map((item, idx) => `
                <tr>
                  <td class="inv-col-idx">${idx + 1}</td>
                  <td class="inv-col-desc">
                    <div class="inv-item-desc">${escapeHtml(item.description)}</div>
                  </td>
                  <td class="inv-col-sac">${escapeHtml(item.sac || '-')}</td>
                  <td class="inv-col-amt">${formatIndianCurrency(item.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="inv-calculation-section">
          <div class="inv-totals-box">
            <div class="inv-total-row">
              <span>Subtotal</span>
              <span class="inv-total-val">${formatIndianCurrency(subtotal)}</span>
            </div>

            ${s.taxSettings?.igst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>IGST @ ${s.taxSettings.igst.rate}%</span>
              <span class="inv-total-val">${formatIndianCurrency(igst)}</span>
            </div>
            ` : ''}

            ${s.taxSettings?.cgst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>CGST @ ${s.taxSettings.cgst.rate}%</span>
              <span class="inv-total-val">${formatIndianCurrency(cgst)}</span>
            </div>
            ` : ''}

            ${s.taxSettings?.sgst?.enabled ? `
            <div class="inv-total-row tax-row">
              <span>SGST @ ${s.taxSettings.sgst.rate}%</span>
              <span class="inv-total-val">${formatIndianCurrency(sgst)}</span>
            </div>
            ` : ''}

            <div class="inv-grand-total-row">
              <span class="inv-grand-total-label">Total Amount</span>
              <span class="inv-grand-total-val">${sym} ${formatIndianCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div class="inv-words-banner">
          <span class="inv-words-label">Amount in words:</span>
          <span>${escapeHtml(s.amountInWords?.text || '')}</span>
        </div>

        <div class="inv-bank-card">
          <div class="inv-bank-title">${escapeHtml(s.bank?.cardTitle || 'BANK DETAILS FOR PAYMENT')}</div>
          <div class="inv-bank-grid">
            <div class="inv-bank-item">
              <span class="inv-label-bold">Account Holder Name:</span>
              <span>${escapeHtml(s.bank?.accountHolder || '')}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">Account No.:</span>
              <span>${escapeHtml(s.bank?.accountNo || '')}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">IFSC Code:</span>
              <span>${escapeHtml(s.bank?.ifsc || '')}</span>
            </div>
            <div class="inv-bank-item">
              <span class="inv-label-bold">Bank & Branch:</span>
              <span>${escapeHtml(s.bank?.bankBranch || '')}</span>
            </div>
          </div>
        </div>

        <div class="inv-disclaimer">
          ${escapeHtml(s.disclaimer || '')}
        </div>

        <div class="inv-footer">
          <div>${escapeHtml(s.footer?.leftText || `Invoice ${s.meta?.invoiceNo}`)}</div>
          <div>${escapeHtml(s.footer?.rightText || 'Page 1 of 1')}</div>
        </div>
      `;
    }

    openPreviewModal(item) {
      this.currentPreviewItem = item;
      if (this.previewModalTitle) {
        this.previewModalTitle.textContent = `Invoice ${item.invoiceNo} (${item.clientName})`;
      }
      if (this.modalInvoiceSheet) {
        this.modalInvoiceSheet.innerHTML = this.generateInvoiceHtml(item.data);
      }
      this.previewModal.classList.add('open');
    }

    printSingleInvoice(item) {
      if (!this.printStagingArea) return;
      this.printStagingArea.innerHTML = `
        <div class="invoice-sheet" style="box-shadow: none; margin: 0; padding: 0;">
          ${this.generateInvoiceHtml(item.data)}
        </div>
      `;
      window.print();
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
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.historyApp = new HistoryApp();
  });

})();
