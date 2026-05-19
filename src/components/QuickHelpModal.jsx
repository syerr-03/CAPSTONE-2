import React, { useState } from "react";
import { MessageCircle, Mail, X, Copy } from "lucide-react";

const QuickHelpModal = ({ closeHelp }) => {
  const [copiedText, setCopiedText] = useState("");

  const copyText = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);

      setTimeout(() => {
        setCopiedText("");
      }, 1500);
    } catch (error) {
      alert("Copy failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "28px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={closeHelp}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <X size={22} color="#555" />
        </button>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#7C3AED",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Need Help?
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            lineHeight: "1.6",
            marginBottom: "28px",
          }}
        >
          Having trouble using BrainyBits?
          <br />
          Contact our support team anytime.
        </p>

        {/* WHATSAPP */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#F9FAFB",
            padding: "14px 16px",
            borderRadius: "18px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              background: "#DCFCE7",
              padding: "10px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageCircle color="#16A34A" size={22} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                WhatsApp Support
              </h4>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                +60 13-315 2376
              </p>
            </div>

            <button
              onClick={() => copyText("+60 13-315 2376", "phone")}
              title="Copy phone number"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <Copy size={18} color="#16A34A" />
            </button>
          </div>
        </div>

        {/* EMAIL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#F9FAFB",
            padding: "14px 16px",
            borderRadius: "18px",
          }}
        >
          <div
            style={{
              background: "#EDE9FE",
              padding: "10px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail color="#7C3AED" size={22} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Email Us
              </h4>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                syarifahnaniey@gmail.com
              </p>
            </div>

            <button
              onClick={() => copyText("syarifahnaniey@gmail.com", "email")}
              title="Copy email"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <Copy size={18} color="#7C3AED" />
            </button>
          </div>
        </div>

        {copiedText && (
          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "13px",
              color: "#16A34A",
              fontWeight: "600",
            }}
          >
            {copiedText === "phone" ? "Phone number copied!" : "Email copied!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuickHelpModal;