import React, { useState } from "react";
import "../App.css";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CertificatePreview({ onBack }) {
  const [isPaid, setIsPaid] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [icNumber, setIcNumber] = useState("");

  const handlePayment = () => {
    setShowForm(true);
  };

  const handleSubmitPayment = () => {
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^\d{12}$/.test(icNumber)) {
      alert("IC number must be exactly 12 digits.");
      return;
    }

    setShowForm(false);
    setIsPaid(true);
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

  return (
    <div className="cert-preview-page">
      <div className="cert-preview-blur cert-preview-blur-left"></div>
      <div className="cert-preview-blur cert-preview-blur-right"></div>

      {showForm && (
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
              background: "white",
              padding: "28px",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "420px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Certificate Details</h2>

            <p style={{ marginBottom: "18px", color: "#6b7280" }}>
              Please enter your details before payment.
            </p>

            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.toUpperCase())}
              placeholder="ENTER FULL NAME"
              style={{
                width: "100%",
                padding: "12px",
                margin: "8px 0 16px",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            />

            <label>IC Number</label>
            <input
              type="text"
              value={icNumber}
              onChange={(e) => {
                const numbersOnly = e.target.value.replace(/\D/g, "");
                setIcNumber(numbersOnly.slice(0, 12));
              }}
              placeholder="12 DIGIT IC NUMBER"
              maxLength="12"
              style={{
                width: "100%",
                padding: "12px",
                margin: "8px 0 20px",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            />

            <button
              type="button"
              className="cert-preview-primary-btn"
              onClick={handleSubmitPayment}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              Proceed Payment - RM40
            </button>

            <button
              type="button"
              className="cert-preview-secondary-btn"
              onClick={() => setShowForm(false)}
              style={{ width: "100%" }}
            >
              Cancel
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
              Make Payment - RM40
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