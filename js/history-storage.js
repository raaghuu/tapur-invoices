/**
 * Manages the persistence and retrieval of historical invoices
 */

const HISTORY_STORAGE_KEY = 'invoiceforge_history_v1';

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse history from localStorage', e);
  }
  return [];
}

export function saveToHistory(invoiceData, status = 'Generated') {
  if (!invoiceData || !invoiceData.meta) return null;

  const history = getHistory();
  const invoiceNo = invoiceData.meta.invoiceNo || `INV-${Date.now()}`;
  
  // Calculate total amount
  const subtotal = (invoiceData.items || []).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const taxSettings = invoiceData.taxSettings || {};
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

  // Check if invoice already exists in history with this invoiceNo
  const existingIndex = history.findIndex(item => item.meta?.invoiceNo === invoiceNo);

  const entry = {
    id: existingIndex >= 0 ? history[existingIndex].id : `inv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    invoiceNo: invoiceNo,
    clientName: invoiceData.client?.name || 'Unnamed Client',
    clientEmail: invoiceData.client?.email || '',
    sellerName: invoiceData.seller?.name || '',
    date: invoiceData.meta.invoiceDate || new Date().toLocaleDateString('en-GB'),
    totalAmount: totalAmount,
    currencySymbol: invoiceData.meta?.currencySymbol || 'Rs.',
    status: status,
    savedAt: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(invoiceData))
  };

  if (existingIndex >= 0) {
    history[existingIndex] = entry;
  } else {
    history.unshift(entry);
  }

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function updateInvoiceStatus(id, newStatus) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item) {
    item.status = newStatus;
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return true;
  }
  return false;
}

export function deleteFromHistory(id) {
  const history = getHistory();
  const filtered = history.filter(h => h.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getInvoiceById(id) {
  const history = getHistory();
  return history.find(h => h.id === id) || null;
}

export function seedInitialHistoryIfEmpty(defaultInvoice) {
  const history = getHistory();
  if (history.length === 0 && defaultInvoice) {
    saveToHistory(defaultInvoice, 'Generated');
  }
}
