# Invoice Studio - Interactive Invoice Generator & Tracker

An interactive, responsive web application that generates professional, pixel-perfect invoices matching the reference GST template (Tapur Sharma / Cutawayy Films), with **100% of all fields editable in real-time** and an **integrated Invoice Tracker & History Archive** to track and download previously generated invoices.

---

## 🌟 Key Features

### 1. Exact 1:1 Match with the Reference Invoice
- **Header**: Issuer details (Name, Address, PAN, GSTIN status, Email & Phone).
- **Meta Card**: Document title (`INVOICE`), Invoice Number (`INV-2026-001`), Invoice Date (`26 Oct 2026`), and optional Due Date.
- **Solid Divider**: Distinct horizontal separator line.
- **BILL TO Card**: Bordered client card with Company Name, full address, GSTIN, and contact emails.
- **Itemized Table**: Deep midnight-navy header (`#`, `DESCRIPTION OF WORK`, `SAC`, `AMOUNT (INR)`), multi-line job scope, SAC code, and formatted currency amounts.
- **Calculations**: Auto-calculated or exempt-styled subtotal, IGST %, CGST %, SGST %, and Total Amount with double-line styling.
- **Amount in Words Banner**: Automatic conversion into Indian English currency convention (`Rupees Forty Thousand Only`), with manual override support.
- **Bank Details Card**: 2-column layout with Account Holder, Account Number & Type, IFSC Code, Bank & Branch, and optional UPI ID.
- **Disclaimer**: *"This is a computer-generated invoice and does not require a signature."*
- **Footer**: Invoice ID and Page counter (`Page 1 of 1`).

### 2. Invoice History & Tracker (`history.html`)
- **Auto-Archiving**: Every generated or printed invoice is automatically tracked and stored in the history ledger in browser `localStorage`.
- **One-Click Download / Print**: Directly print or save any historical invoice as an A4 PDF without needing to re-open the editor.
- **Quick View Modal**: Preview any past invoice on an authentic A4 sheet before downloading.
- **Resume & Edit**: Click **Edit ↗** to open any archived invoice back in the editor to make adjustments.
- **Status Management**: Cycle status badges between `Generated`, `Paid`, and `Pending` with one click.
- **Live Search & Filter**: Instant search across invoice numbers, client names, and amounts.
- **Financial Analytics**: Displays Total Invoices count and Total Invoiced Value (Rs.).
- **Backup All**: Export all invoices as a consolidated JSON archive.

### 3. Dual-Mode Editing ("All Fields Editable")
- **Direct WYSIWYG Editing**: Click directly on any text, address, number, or tax rate on the invoice canvas to edit it immediately.
- **Comprehensive Control Sidebar**: Tabbed panels for **Details**, **Parties**, **Items**, **Taxes**, and **Bank Details** with real-time two-way synchronization.
- **Line Items**: Add, duplicate, or delete rows directly from the table or sidebar.

### 4. Fully Mobile-Friendly & Responsive
- **Mobile View Switcher**: A segmented control bar (`[ ✏️ Edit Form ]` & `[ 👁️ Invoice Sheet ]`) allows mobile users to switch between editing fields and inspecting the document with a single tap.
- **Auto-Fitting A4 Canvas**: On mobile screens, the invoice sheet automatically scales down to fit the phone's viewport width without horizontal clipping, with pinch-to-zoom and zoom buttons.
- **Touch-Friendly Controls**: Form rows stack neatly on small screens, inputs have a 16px font size to prevent iOS Safari auto-zooming, and tap targets meet standard accessibility requirements (44px min height).
- **Mobile History Cards**: In the history tracker, desktop tables transform into responsive cards with full-width action buttons for one-tap PDF download, viewing, and editing.

### 4. Tax & GST Modes
- **Reference Style (Exempt)**: Displays IGST (18%), CGST (9%), SGST (9%) with `0.00` values, exactly matching the reference invoice.
- **Auto-Calculate Mode**: Calculates tax amounts based on percentages and subtotal.
- **Manual Mode**: Customize exact amounts for custom invoices.

### 5. Print & PDF Export
- Click **Print / Save PDF** (or press <kbd>Ctrl</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>P</kbd>) to generate a clean A4 PDF.
- Uses dedicated print CSS that eliminates browser chrome, buttons, toolbars, and margins, ensuring vector-sharp printing.

---

## 🚀 How to Run

### Method 1: Direct Browser File (Zero Setup)
Simply open `index.html` or `history.html` directly in any web browser:
```bash
# Open Editor
xdg-open /home/raaghuu/projects/Invoices/index.html

# Open History & Tracker
xdg-open /home/raaghuu/projects/Invoices/history.html
```

### Method 2: Local HTTP Server
Run with Python:
```bash
cd /home/raaghuu/projects/Invoices
python3 -m http.server 3000
```
- Open `http://localhost:3000` for the **Invoice Editor**.
- Open `http://localhost:3000/history.html` for the **Invoice Tracker & History**.

---

## 📁 Project Structure

```
Invoices/
├── index.html                 # Main invoice generator & live WYSIWYG editor
├── history.html               # Invoice tracker, archives, search & download dashboard
├── README.md                  # Project documentation & guide
├── css/
│   ├── styles.css             # Editor UI, sidebar, layout, and responsive styles
│   ├── invoice.css            # Exact pixel-perfect styling for the invoice sheet
│   └── print.css              # Dedicated A4 vector print and PDF export styling
└── js/
    ├── app.bundle.js          # Standalone editor bundle with history integration
    ├── history-page.bundle.js # Standalone history tracker, search & print engine
    ├── app.js                 # Modular application controller
    ├── history-storage.js     # Shared history storage helper
    ├── invoice-data.js        # Default data matching reference invoice & presets
    └── number-to-words.js     # Indian numbering & currency words converter
```
