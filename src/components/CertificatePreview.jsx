import React, { useState } from "react";
import "../App.css";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CertificatePreview({ onBack }) {
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [fullName, setFullName] = useState("");
  const [icNumber, setIcNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStep, setPaymentStep] = useState("method");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankUsername, setBankUsername] = useState("");
  const [bankPassword, setBankPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handlePayment = () => {
    setPaymentError("");
    setPaymentStep("method");
    setPaymentMethod("");
    setSelectedBank("");
    setBankUsername("");
    setBankPassword("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardHolderName("");
    setShowPaymentModal(true);
  };

  const handlePaymentNext = () => {
    if (!fullName.trim()) {
      setPaymentError("Please enter your full name.");
      return;
    }

    if (!icNumber.trim()) {
      setPaymentError("Please enter your IC number.");
      return;
    }

    if (!paymentMethod) {
      setPaymentError("Please select a payment method.");
      return;
    }

    setPaymentError("");
    setPaymentStep("details");
  };

  const handlePaymentBack = () => {
    setPaymentStep("method");
    setPaymentError("");
  };

  const getMaskedCardNumber = () => {
    const digits = cardNumber.replace(/\D/g, "");
    return digits.length >= 4 ? `**** **** **** ${digits.slice(-4)}` : "N/A";
  };

  const handleSubmitPayment = () => {
    if (!fullName.trim()) {
      setPaymentError("Please enter your full name.");
      return;
    }

    if (!/^\d{12}$/.test(icNumber)) {
      setPaymentError("IC number must be exactly 12 digits.");
      return;
    }

    if (paymentMethod === "onlineBanking") {
      if (!selectedBank) {
        setPaymentError("Please select a bank.");
        return;
      }
      if (!bankUsername.trim()) {
        setPaymentError("Please enter your bank username.");
        return;
      }
      if (!bankPassword.trim()) {
        setPaymentError("Please enter your bank password.");
        return;
      }
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim()) {
        setPaymentError("Please enter your card number.");
        return;
      }
      if (!cardExpiry.trim()) {
        setPaymentError("Please enter your card expiry date.");
        return;
      }
      if (!cardCvv.trim()) {
        setPaymentError("Please enter your CVV.");
        return;
      }
      if (!cardHolderName.trim()) {
        setPaymentError("Please enter the cardholder name.");
        return;
      }
    }

    setPaymentError("");
    setShowPaymentModal(false);
    setIsPaid(true);
    setShowPaymentSuccess(true);
  };

  const handleDownload = async () => {
    const certificate = document.getElementById("certificateToDownload");

    if (!certificate) {
      alert("Certificate not found.");
      return;
    }

    try {
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fullName || "certificate"}.pdf`);

      const user = auth.currentUser;

      const certificateRef = doc(
        db,
        "certificates",
        `${user?.uid || fullName}_${Date.now()}`
      );

      await setDoc(certificateRef, {
        uid: user?.uid || "guest",
        name: fullName,
        fullName,
        icNumber,
        email: user?.email || "",

        certificateTitle: "Certificate of Completion",
        courseName: "Data Science Fundamentals",

        paid: true,
        amount: 40,
        downloaded: true,
        downloadedAt: serverTimestamp()
      });

      console.log("✅ Certificate download saved");
    } catch (error) {
      console.error("❌ Error downloading certificate:", error);
      alert("Failed to download certificate.");
    }
  };

  const handleDownloadReceipt = () => {
    const receipt = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = receipt.internal.pageSize.getWidth();
    const margin = 40;
    const lineHeight = 20;
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const receiptNumber = `R-${Math.floor(100000 + Math.random() * 900000)}`;

    receipt.setFont("helvetica", "bold");
    receipt.setFontSize(22);
    receipt.setTextColor("#3b0768");
    receipt.text("Payment Receipt", pageWidth / 2, 72, { align: "center" });

    receipt.setDrawColor("#7c3aed");
    receipt.setLineWidth(1);
    receipt.line(margin, 86, pageWidth - margin, 86);

    receipt.setFont("helvetica", "normal");
    receipt.setFontSize(11);
    receipt.setTextColor("#6b7280");
    receipt.text(
      "Thank you for your payment.",
      pageWidth / 2,
      108,
      { align: "center" }
    );

    const tableWidth = 400;
    const tableX = (pageWidth - tableWidth) / 2;
    let currentY = 138;
    receipt.setFontSize(12);
    receipt.setTextColor("#7c3aed");
    receipt.text("PAYER DETAILS", pageWidth / 2, currentY, { align: "center" });

    currentY += 18;
    const rowHeight = 24;
    const labelWidth = 150;
    const valueStart = tableX + labelWidth + 12;

    const payerRows = [
      ["Full Name", fullName || "N/A"],
      ["IC Number", icNumber || "N/A"]
    ];

    payerRows.forEach(([label, value]) => {
      receipt.setFillColor("#f5efff");
      receipt.roundedRect(tableX, currentY, labelWidth, rowHeight, 6, 6, "F");
      receipt.setDrawColor("#d8c2f7");
      receipt.roundedRect(tableX, currentY, tableWidth, rowHeight, 6, 6);

      receipt.setFontSize(11);
      receipt.setTextColor("#4b1e9a");
      receipt.text(label, tableX + 10, currentY + 16);
      receipt.setTextColor("#111827");
      receipt.text(value, valueStart, currentY + 16);
      currentY += rowHeight + 8;
    });

    currentY += 12;
    receipt.setFontSize(12);
    receipt.setTextColor("#7c3aed");
    receipt.text("PAYMENT DETAILS", pageWidth / 2, currentY, { align: "center" });

    currentY += 16;
    const paymentRows = [
      ["Payment Item", "E-Certificate"],
      ["Amount", "RM40"],
      ["Payment Method", paymentMethod === "card" ? "Debit / Credit Card" : "Online Banking"],
      [paymentMethod === "card" ? "Card Number" : "Bank Name", paymentMethod === "card" ? getMaskedCardNumber() : selectedBank || "N/A"],
      ["Payment Status", "Successful"],
      ["Date and Time", formattedDate],
      ["Receipt Number", receiptNumber]
    ];

    paymentRows.forEach(([label, value]) => {
      receipt.setFillColor("#f5efff");
      receipt.roundedRect(tableX, currentY, labelWidth, rowHeight, 6, 6, "F");
      receipt.setDrawColor("#d8c2f7");
      receipt.roundedRect(tableX, currentY, tableWidth, rowHeight, 6, 6);

      receipt.setFontSize(11);
      receipt.setTextColor("#4b1e9a");
      receipt.text(label, tableX + 10, currentY + 16);
      receipt.setTextColor("#111827");
      receipt.text(value, valueStart, currentY + 16);
      currentY += rowHeight + 8;
    });

    currentY += 10;
    receipt.setDrawColor("#7c3aed");
    receipt.setLineWidth(0.5);
    receipt.line(tableX, currentY, tableX + tableWidth, currentY);

    receipt.save(`receipt-${fullName || "student"}-${Date.now()}.pdf`);
  };

  return (
    <div className="cert-preview-page">
      <div className="cert-preview-blur cert-preview-blur-left"></div>
      <div className="cert-preview-blur cert-preview-blur-right"></div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card" style={{ paddingTop: "18px", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="payment-modal-icon">
                <span style={{ fontSize: "20px", lineHeight: 1 }}>💳</span>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 className="payment-modal-title">Make Payment</h2>
              <p className="payment-modal-subtitle">
                {paymentStep === "method"
                  ? "E-Certificate · RM40"
                  : paymentMethod === "onlineBanking"
                  ? "Pay securely using online banking."
                  : "Enter your debit or credit card details."}
              </p>
            </div>

            <div className="payment-modal-form">
              <div className="payment-modal-field">
                <span className="payment-modal-input-icon">👤</span>
                <input
                  type="text"
                  aria-label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value.toUpperCase())}
                  placeholder="Enter full name"
                  className="payment-modal-input"
                />
              </div>

              <div className="payment-modal-field">
                <span className="payment-modal-input-icon">🆔</span>
                <input
                  type="text"
                  aria-label="IC number"
                  value={icNumber}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/\D/g, "");
                    setIcNumber(numbersOnly.slice(0, 12));
                  }}
                  placeholder="12 digit IC number"
                  maxLength="12"
                  className="payment-modal-input"
                />
              </div>

              {paymentStep === "method" && (
                <div className="payment-method-grid">
                  <button
                    type="button"
                    className={`payment-method-card ${paymentMethod === "onlineBanking" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("onlineBanking")}
                  >
                    <div className="payment-method-card-icon">🏦</div>
                    <span className="payment-method-card-title">Online Banking</span>
                    <span className="payment-method-card-text">Secure payment through your bank.</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-method-card ${paymentMethod === "card" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="payment-method-card-icon">💳</div>
                    <span className="payment-method-card-title">Debit / Credit Card</span>
                    <span className="payment-method-card-text">Pay with Visa, MasterCard, or AMEX.</span>
                  </button>
                </div>
              )}

              {paymentStep === "details" && paymentMethod === "onlineBanking" && (
                <>
                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">🏦</span>
                    <select
                      aria-label="Select your bank"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="payment-modal-input"
                    >
                      <option value="" hidden>
                        Select your bank
                      </option>
                      <option value="Maybank">Maybank</option>
                      <option value="CIMB Bank">CIMB Bank</option>
                      <option value="Bank Islam">Bank Islam</option>
                      <option value="RHB Bank">RHB Bank</option>
                      <option value="Public Bank">Public Bank</option>
                      <option value="Hong Leong Bank">Hong Leong Bank</option>
                    </select>
                  </div>

                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">👤</span>
                    <input
                      type="text"
                      aria-label="Bank username"
                      value={bankUsername}
                      onChange={(e) => setBankUsername(e.target.value)}
                      placeholder="Enter bank username"
                      className="payment-modal-input"
                    />
                  </div>

                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">🔒</span>
                    <input
                      type="password"
                      aria-label="Bank password"
                      value={bankPassword}
                      onChange={(e) => setBankPassword(e.target.value)}
                      placeholder="Enter bank password"
                      className="payment-modal-input"
                    />
                  </div>
                </>
              )}

              {paymentStep === "details" && paymentMethod === "card" && (
                <>
                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">💳</span>
                    <input
                      type="text"
                      aria-label="Card number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="Card number"
                      className="payment-modal-input"
                    />
                  </div>

                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">📅</span>
                    <input
                      type="text"
                      aria-label="Expiry date"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="payment-modal-input"
                    />
                  </div>

                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">🔒</span>
                    <input
                      type="text"
                      aria-label="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="CVV"
                      className="payment-modal-input"
                    />
                  </div>

                  <div className="payment-modal-field">
                    <span className="payment-modal-input-icon">👤</span>
                    <input
                      type="text"
                      aria-label="Cardholder name"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                      placeholder="Cardholder name"
                      className="payment-modal-input"
                    />
                  </div>
                </>
              )}
            </div>

            <p className="payment-modal-error">{paymentError}</p>

            <div className="payment-modal-footer">
              {paymentStep === "method" ? (
                <>
                  <button
                    type="button"
                    className="cert-preview-primary-btn"
                    onClick={handlePaymentNext}
                    style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="cert-preview-secondary-btn"
                    onClick={() => setShowPaymentModal(false)}
                    style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="cert-preview-primary-btn"
                    onClick={handleSubmitPayment}
                    style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                  >
                    Make Payment
                  </button>
                  <button
                    type="button"
                    className="cert-preview-secondary-btn"
                    onClick={handlePaymentBack}
                    style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="cert-preview-secondary-btn"
                    onClick={() => setShowPaymentModal(false)}
                    style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "30px 28px",
              borderRadius: "24px",
              width: "92%",
              maxWidth: "420px",
              boxShadow: "0 24px 48px rgba(124, 58, 237, 0.18)"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #9f67ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "28px",
                margin: "0 auto 18px"
              }}
            >
              ✓
            </div>

            <h2 style={{ marginBottom: "10px", color: "#4b1e9a" }}>
              Payment Successful
            </h2>

            <p style={{ marginBottom: "18px", color: "#6b7280" }}>
              Payment successful. Your certificate payment has been completed.
            </p>

            <p
              style={{
                marginBottom: "20px",
                color: "#4b1e9a",
                fontWeight: 600
              }}
            >
              Do you want to download your receipt?
            </p>

            <button
              type="button"
              className="cert-preview-primary-btn"
              onClick={handleDownloadReceipt}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              Download Receipt
            </button>

            <button
              type="button"
              className="cert-preview-secondary-btn"
              onClick={() => {
                setShowPaymentSuccess(false);
                onBack();
              }}
              style={{ width: "100%" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <main className="cert-preview-shell">
        <section className="cert-preview-header">
          {!isPaid ? (
            <>
              <div className="cert-preview-icon pending">!</div>
              <h1>CONGRATULATION!</h1>
              <p>Review your certificate before making payment.</p>

              <div className="cert-preview-highlight pending">
                Payment is required to unlock certificate download.
              </div>
            </>
          ) : (
            <>
              <div className="cert-preview-icon success">✓</div>
              <h1>CONGRATULATION!</h1>
              <p>Payment successful. Your certificate is ready to download.</p>

              <div className="cert-preview-highlight success">
                ✓ Payment Successful
              </div>
            </>
          )}
        </section>

        <section className="cert-preview-area">
          <div className="cert-preview-paper" id="certificateToDownload">
            <div className="cert-preview-inner-border"></div>
            <div className="cert-preview-top-pattern"></div>
            <div className="cert-preview-bottom-pattern"></div>

            <h2>CERTIFICATE OF COMPLETION</h2>

            <div className="cert-preview-divider"></div>

            <p className="cert-preview-small">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>

            <h3>{fullName || "YOUR NAME"}</h3>

            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                letterSpacing: "1px",
                color: "#555"
              }}
            >
              IC NO: {icNumber || "XXXXXXXXXXXX"}
            </p>

            <p className="cert-preview-text">
              for successfully completing the course
            </p>

            <h4>Data Science Fundamentals</h4>

            <div className="cert-preview-footer">
              <div className="cert-preview-sign">
                <p>A. Rahman</p>
                <span>Instructor</span>
              </div>

              <div className="cert-preview-seal">★</div>

              <div className="cert-preview-sign">
                <p>01 May 2026</p>
                <span>Date</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cert-preview-actions">
          {!isPaid ? (
            <button
              type="button"
              className="cert-preview-primary-btn"
              onClick={handlePayment}
            >
              Proceed to Payment - RM40
            </button>
          ) : (
            <button
              type="button"
              className="cert-preview-primary-btn"
              onClick={handleDownload}
            >
              Download Certificate
            </button>
          )}

          <button
            type="button"
            className="cert-preview-secondary-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}

export default CertificatePreview;