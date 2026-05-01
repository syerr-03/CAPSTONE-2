import React, { useState } from "react";
import "../App.css";

function CertificatePreview({ onBack }) {
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    setIsPaid(true);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="cert-preview-page">
      <div className="cert-preview-blur cert-preview-blur-left"></div>
      <div className="cert-preview-blur cert-preview-blur-right"></div>

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
          <div className="cert-preview-paper">
            <div className="cert-preview-inner-border"></div>
            <div className="cert-preview-top-pattern"></div>
            <div className="cert-preview-bottom-pattern"></div>

            <h2>CERTIFICATE OF COMPLETION</h2>

            <div className="cert-preview-divider"></div>

            <p className="cert-preview-small">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>

            <h3>YOUR NAME</h3>

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
            <button className="cert-preview-primary-btn" onClick={handlePayment}>
              Make Payment - RM40
            </button>
          ) : (
            <button className="cert-preview-primary-btn" onClick={handleDownload}>
              Download Certificate
            </button>
          )}

          <button className="cert-preview-secondary-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}

export default CertificatePreview;