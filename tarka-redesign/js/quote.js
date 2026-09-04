/* ============================================================
   TARKA — quotation builder + fixed PDF generator
   Single source of truth: `cart` drives both the live on-page
   summary AND the PDF, so the two can never disagree.
   ============================================================ */
(function(){
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  // cart: Map<itemId, { item: catalogItem, qty: number }>
  const cart = new Map();
  let applyGst = false;

  function money(n){
    return QUOTE_CURRENCY + Math.round(n).toLocaleString("en-IN");
  }

  function findItem(id){
    for (const cat of QUOTE_CATALOG){
      const found = cat.items.find(i => i.id === id);
      if (found) return found;
    }
    return null;
  }

  function getTotals(){
    let subtotal = 0;
    cart.forEach(({ item, qty }) => { subtotal += item.price * qty; });
    const gst = applyGst ? subtotal * QUOTE_GST_RATE : 0;
    const grandTotal = subtotal + gst;
    return { subtotal, gst, grandTotal };
  }

  /* ---------------------------------------------------------
     CATALOG RENDER
  --------------------------------------------------------- */
  const catalogList = document.getElementById("catalogList");

  QUOTE_CATALOG.forEach(cat => {
    const block = document.createElement("div");
    block.className = "catalog-category";
    block.innerHTML = `<h2 class="catalog-category__title">${cat.category}</h2>`;

    cat.items.forEach(item => {
      const row = document.createElement("div");
      row.className = "catalog-item";
      row.dataset.id = item.id;
      row.innerHTML = `
        <div>
          <p class="catalog-item__name">${item.name}</p>
          <span class="catalog-item__meta">${item.unit}</span>
        </div>
        <span class="catalog-item__price">${money(item.price)}</span>
        <div class="catalog-item__action">
          <button class="btn-add" data-id="${item.id}">Add</button>
        </div>
      `;
      block.appendChild(row);
    });
    catalogList.appendChild(block);
  });

  catalogList.addEventListener("click", e => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    const id = btn.dataset.id;
    if (cart.has(id)){
      cart.get(id).qty += 1;
    } else {
      cart.set(id, { item: findItem(id), qty: 1 });
    }
    syncAddButtons();
    renderSummary();
  });

  function syncAddButtons(){
    document.querySelectorAll(".btn-add").forEach(btn => {
      const inCart = cart.has(btn.dataset.id);
      btn.classList.toggle("is-added", inCart);
      btn.textContent = inCart ? `In quotation (${cart.get(btn.dataset.id).qty})` : "Add";
    });
  }

  /* ---------------------------------------------------------
     SUMMARY RENDER
  --------------------------------------------------------- */
  const summaryItems = document.getElementById("summaryItems");
  const summaryEmpty = document.getElementById("summaryEmpty");
  const sumSubtotal = document.getElementById("sumSubtotal");
  const sumGst = document.getElementById("sumGst");
  const sumTotal = document.getElementById("sumTotal");
  const gstRow = document.getElementById("gstRow");
  const gstToggle = document.getElementById("gstToggle");
  const generateBtn = document.getElementById("openClientForm");

  gstToggle.addEventListener("change", () => {
    applyGst = gstToggle.checked;
    renderSummary();
  });

  function renderSummary(){
    summaryItems.querySelectorAll(".summary-line").forEach(el => el.remove());
    summaryEmpty.hidden = cart.size > 0;

    cart.forEach(({ item, qty }, id) => {
      const line = document.createElement("div");
      line.className = "summary-line";
      line.innerHTML = `
        <span class="summary-line__name">${item.name}</span>
        <span class="summary-line__sub">${money(item.price * qty)}</span>
        <div class="summary-line__meta">
          <span>${money(item.price)} × ${qty} ${item.unit}</span>
          <div class="summary-line__ctrl">
            <button data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
            <button class="summary-line__remove" data-action="remove" data-id="${id}" aria-label="Remove">Remove</button>
          </div>
        </div>
      `;
      summaryItems.appendChild(line);
    });

    const { subtotal, gst, grandTotal } = getTotals();
    sumSubtotal.textContent = money(subtotal);
    sumGst.textContent = money(gst);
    sumTotal.textContent = money(grandTotal);
    gstRow.hidden = !applyGst;

    generateBtn.disabled = cart.size === 0;
  }

  summaryItems.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const entry = cart.get(id);
    if (!entry) return;

    if (btn.dataset.action === "inc") entry.qty += 1;
    if (btn.dataset.action === "dec") entry.qty = Math.max(1, entry.qty - 1);
    if (btn.dataset.action === "remove") cart.delete(id);

    syncAddButtons();
    renderSummary();
  });

  renderSummary();

  /* ---------------------------------------------------------
     CLIENT MODAL
  --------------------------------------------------------- */
  const clientModal = document.getElementById("clientModal");
  const successModal = document.getElementById("successModal");
  const clientForm = document.getElementById("clientForm");
  const formError = document.getElementById("formError");

  function openModal(el){ el.classList.add("is-open"); el.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; }
  function closeModal(el){ el.classList.remove("is-open"); el.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }

  document.getElementById("openClientForm").addEventListener("click", () => {
    if (cart.size === 0) return;
    openModal(clientModal);
  });
  document.getElementById("modalClose").addEventListener("click", () => closeModal(clientModal));
  document.getElementById("modalScrim").addEventListener("click", () => closeModal(clientModal));
  document.getElementById("backToBuilder").addEventListener("click", () => closeModal(clientModal));

  /* ---------------------------------------------------------
     QUOTATION NUMBER — unique + persisted
  --------------------------------------------------------- */
  function nextQuoteNumber(){
    const year = new Date().getFullYear();
    const key = "tarka_quote_seq_" + year;
    let seq = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(seq));
    return `TK-${year}-${String(seq).padStart(3, "0")}`;
  }

  let lastQuoteData = null; // holds the exact data used to build the last PDF

  clientForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("fClientName").value.trim();
    const email = document.getElementById("fEmail").value.trim();
    const projectName = document.getElementById("fProjectName").value.trim();

    if (!name || !email || !projectName){
      formError.textContent = "Please fill in client name, email and project name.";
      formError.hidden = false;
      return;
    }
    formError.hidden = true;

    const client = {
      name,
      company: document.getElementById("fCompany").value.trim(),
      email,
      phone: document.getElementById("fPhone").value.trim(),
      projectName,
      projectDesc: document.getElementById("fProjectDesc").value.trim(),
      requirements: document.getElementById("fRequirements").value.trim()
    };

    const lineItems = [];
    cart.forEach(({ item, qty }) => {
      lineItems.push({
        name: item.name,
        unit: item.unit,
        qty,
        unitPrice: item.price,
        subtotal: item.price * qty
      });
    });

    const totals = getTotals();
    const quoteNumber = nextQuoteNumber();

    lastQuoteData = {
      quoteNumber,
      date: new Date(),
      client,
      lineItems,
      applyGst,
      ...totals
    };

    buildPdf(lastQuoteData);

    closeModal(clientModal);
    document.getElementById("successQuoteNum").textContent = quoteNumber;
    openModal(successModal);
  });

  document.getElementById("closeSuccess").addEventListener("click", () => closeModal(successModal));

  let generatedPdfDoc = null;
  document.getElementById("downloadPdfBtn").addEventListener("click", () => {
    if (!generatedPdfDoc || !lastQuoteData) return;
    generatedPdfDoc.save(`Tarka-Quotation-${lastQuoteData.quoteNumber}.pdf`);
  });

  /* ---------------------------------------------------------
     FIXED PDF TEMPLATE
     Same visual system on every quotation regardless of item
     count — header/footer redraw on every page automatically.
  --------------------------------------------------------- */
  function buildPdf(data){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;

    const DUCK = [10, 92, 110];      // #0a5c6e
    const DUCK_DEEP = [7, 63, 75];   // #073f4b
    const BLACK = [16, 18, 16];
    const GREY = [120, 120, 120];

    function drawHeaderFooter(){
      // header bar
      doc.setFillColor(...BLACK);
      doc.rect(0, 0, pageW, 64, "F");
      doc.setTextColor(255,255,255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("TARKA", margin, 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(220,220,220);
      doc.text("Design Studio — You think. We build.", margin + 78, 40);

      doc.setFontSize(9);
      doc.setTextColor(255,255,255);
      doc.text(`Quotation ${data.quoteNumber}`, pageW - margin, 32, { align: "right" });
      doc.setTextColor(200,200,200);
      doc.text(data.date.toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }), pageW - margin, 46, { align: "right" });

      // footer
      const footerY = pageH - 34;
      doc.setDrawColor(...DUCK);
      doc.setLineWidth(1.2);
      doc.line(margin, footerY - 12, pageW - margin, footerY - 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREY);
      doc.text(`${TARKA_CONTACT.email}   ·   ${TARKA_CONTACT.phone}   ·   ${TARKA_CONTACT.web}`, margin, footerY);
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      doc.text(`Page ${pageNum}`, pageW - margin, footerY, { align: "right" });
    }

    drawHeaderFooter();

    let y = 100;

    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Project Quotation", margin, y);
    y += 34;

    // client / project two-column block
    doc.setDrawColor(230,230,230);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageW - margin, y);
    y += 22;

    const colW = (pageW - margin * 2 - 24) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...DUCK_DEEP);
    doc.text("BILLED TO", margin, y);
    doc.text("PROJECT", margin + colW + 24, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...BLACK);
    const clientLines = [
      data.client.name,
      data.client.company,
      data.client.email,
      data.client.phone
    ].filter(Boolean);
    const projectLines = doc.splitTextToSize(data.client.projectName, colW);

    let yc = y;
    clientLines.forEach(line => { doc.text(line, margin, yc); yc += 15; });

    let yp = y;
    doc.setFont("helvetica", "bold");
    projectLines.forEach(line => { doc.text(line, margin + colW + 24, yp); yp += 15; });
    doc.setFont("helvetica", "normal");
    if (data.client.projectDesc){
      const descLines = doc.splitTextToSize(data.client.projectDesc, colW);
      doc.setTextColor(90,90,90);
      doc.setFontSize(9.5);
      descLines.forEach(line => { doc.text(line, margin + colW + 24, yp); yp += 13; });
    }

    y = Math.max(yc, yp) + 20;

    // services table
    const rows = data.lineItems.map(li => [
      li.name,
      `${li.qty} ${li.unit}`,
      money(li.unitPrice),
      money(li.subtotal)
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin, top: 80, bottom: 60 },
      head: [["Service", "Quantity", "Unit price", "Subtotal"]],
      body: rows,
      styles: { font: "helvetica", fontSize: 10, cellPadding: 8, textColor: BLACK, lineColor: [230,230,230], lineWidth: 0.5 },
      headStyles: { fillColor: DUCK, textColor: [255,255,255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [246, 250, 250] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 90, halign: "center" },
        2: { cellWidth: 90, halign: "right" },
        3: { cellWidth: 90, halign: "right" }
      },
      didDrawPage: drawHeaderFooter
    });

    let finalY = doc.lastAutoTable.finalY + 24;

    // check space for totals block, else new page
    if (finalY > pageH - 200){
      doc.addPage();
      drawHeaderFooter();
      finalY = 100;
    }

    const totalsX = pageW - margin - 230;
    doc.setDrawColor(230,230,230);
    doc.line(totalsX, finalY, pageW - margin, finalY);
    finalY += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...BLACK);
    doc.text("Subtotal", totalsX, finalY);
    doc.text(money(data.subtotal), pageW - margin, finalY, { align: "right" });
    finalY += 18;

    if (data.applyGst){
      doc.text("GST (18%)", totalsX, finalY);
      doc.text(money(data.gst), pageW - margin, finalY, { align: "right" });
      finalY += 18;
    }

    doc.setDrawColor(...DUCK);
    doc.setLineWidth(1);
    doc.line(totalsX, finalY, pageW - margin, finalY);
    finalY += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...DUCK_DEEP);
    doc.text("Grand Total", totalsX, finalY);
    doc.text(money(data.grandTotal), pageW - margin, finalY, { align: "right" });
    finalY += 40;

    // requirements / notes
    if (data.client.requirements){
      if (finalY > pageH - 160){ doc.addPage(); drawHeaderFooter(); finalY = 100; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...BLACK);
      doc.text("PROJECT NOTES", margin, finalY);
      finalY += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(70,70,70);
      const reqLines = doc.splitTextToSize(data.client.requirements, pageW - margin * 2);
      reqLines.forEach(line => { doc.text(line, margin, finalY); finalY += 14; });
      finalY += 16;
    }

    // terms
    if (finalY > pageH - 160){ doc.addPage(); drawHeaderFooter(); finalY = 100; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...BLACK);
    doc.text("TERMS & CONDITIONS", margin, finalY);
    finalY += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(90,90,90);
    QUOTE_TERMS.forEach(term => {
      const lines = doc.splitTextToSize("•  " + term, pageW - margin * 2);
      lines.forEach(line => { doc.text(line, margin, finalY); finalY += 13; });
    });

    generatedPdfDoc = doc;
  }

})();
