import { useEffect, useState } from "react";

const CHATBASE_BOT_ID = "E1mIw0rqpfEj31u4lKvar";

function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const userName =
    localStorage.getItem("loggedInUser") ||
    localStorage.getItem("name") ||
    "Student";

  const moduleName = localStorage.getItem("currentModule") || "defaultModule";
  const messageKey = `aiChatMessages_${userName}_${moduleName}`;
  const chatLimitKey = `chatCount_${userName}_${moduleName}`;

  const getPremiumStatus = () => {
    const plan =
      localStorage.getItem(`userPlan_${userName}`) ||
      localStorage.getItem("userPlan") ||
      localStorage.getItem("plan") ||
      "standard";

    return plan === "premium";
  };

  const [isPremium, setIsPremium] = useState(() => getPremiumStatus());

  const [chatCount, setChatCount] = useState(
    Number(localStorage.getItem(chatLimitKey)) || 0
  );

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(messageKey);

    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            sender: "ai",
            text: "Hi! Ask me anything about this module.",
          },
        ];
  });

  useEffect(() => {
    const updatePremiumStatus = () => {
      setIsPremium(getPremiumStatus());
    };

    updatePremiumStatus();

    window.addEventListener("premiumPlanUpdated", updatePremiumStatus);
    window.addEventListener("storage", updatePremiumStatus);

    return () => {
      window.removeEventListener("premiumPlanUpdated", updatePremiumStatus);
      window.removeEventListener("storage", updatePremiumStatus);
    };
  }, []);

  const generateAnswer = (question) => {
    const q = question.toLowerCase();

    if (q.includes("data science")) {
      return "Data Science is the process of collecting, analysing, and interpreting data to find useful insights.";
    }

    if (q.includes("python")) {
      return "Python is commonly used in data science for analysis, automation, machine learning, and visualization.";
    }

    if (q.includes("statistics") || q.includes("probability")) {
      return "Statistics helps us understand data using concepts such as mean, median, probability, and data distribution.";
    }

    if (q.includes("visualization") || q.includes("chart") || q.includes("graph")) {
      return "Data Visualization presents data using charts and graphs so information becomes easier to understand.";
    }

    if (q.includes("machine learning") || q.includes("ml")) {
      return "Machine Learning is a field of AI where computers learn patterns from data to make predictions or decisions.";
    }

    if (q.includes("eda") || q.includes("exploratory data analysis")) {
      return "EDA is the process of exploring data to understand patterns, missing values, and relationships before modelling.";
    }

    return `I am not sure yet, but "${question}" seems related to your learning. Try asking about Data Science, Python, Statistics, Visualization, ML, or EDA.`;
  };

  const askAI = () => {
    if (!question.trim()) return;

    if (!isPremium && chatCount >= 3) {
      const limitMessage = [
        ...messages,
        {
          sender: "ai",
          text: "You have used all 3 free AI prompts. Subscribe to Premium to continue using the AI Assistant.",
        },
      ];

      setMessages(limitMessage);
      localStorage.setItem(messageKey, JSON.stringify(limitMessage));
      setQuestion("");
      return;
    }

    const userQuestion = question.trim();
    const aiAnswer = generateAnswer(userQuestion);

    const newMessages = [
      ...messages,
      { sender: "user", text: userQuestion },
      { sender: "ai", text: aiAnswer },
    ];

    setMessages(newMessages);
    localStorage.setItem(messageKey, JSON.stringify(newMessages));

    if (!isPremium) {
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem(chatLimitKey, String(newCount));
    }

    setQuestion("");
  };

  const handleSubscribePremium = () => {
    window.dispatchEvent(new Event("openPremiumSubscription"));
    setIsOpen(false);
  };

  const openChat = () => {
    setIsPremium(getPremiumStatus());
    setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={openChat}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#7C3AED",
            color: "white",
            border: "none",
            borderRadius: "999px",
            padding: "14px 20px",
            cursor: "pointer",
            fontWeight: "700",
            boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
            zIndex: 9999,
          }}
        >
          💬 Chat with AI
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: isPremium ? "420px" : "360px",
            height: isPremium ? "620px" : "520px",
            background: "white",
            borderRadius: "22px",
            boxShadow: "0 18px 45px rgba(17,24,39,0.18)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              background: "linear-gradient(135deg, #7C3AED, #9F67FF)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "18px" }}>🤖 AI Assistant</h3>

              <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.9 }}>
                {isPremium
                  ? "Premium chatbox is now available."
                  : `Standard plan: ${Math.max(0, 3 - chatCount)} free prompts left.`}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>

          {isPremium ? (
            <div style={{ flex: 1, background: "white" }}>
              <iframe
                src={`https://www.chatbase.co/chatbot-iframe/${CHATBASE_BOT_ID}`}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Premium AI Chatbox"
                style={{ border: "none", width: "100%", height: "100%" }}
              ></iframe>
            </div>
          ) : (
            <>
              <div
                style={{
                  flex: 1,
                  padding: "18px",
                  overflowY: "auto",
                  background: "#FAFAFA",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "12px 14px",
                        borderRadius:
                          msg.sender === "user"
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                        background: msg.sender === "user" ? "#7C3AED" : "#F0E9FF",
                        color: msg.sender === "user" ? "white" : "#111827",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "14px",
                  borderTop: "1px solid #EEE8FF",
                  background: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#F5F3FF",
                    border: "1px solid #EEE8FF",
                    borderRadius: "14px",
                    fontSize: "13px",
                    color: "#5B21B6",
                    textAlign: "center",
                    fontWeight: "600",
                    minWidth: "120px",
                  }}
                >
                  Free prompts left:
                  <br />
                  {Math.max(0, 3 - chatCount)} / 3

                  {chatCount >= 3 && (
                    <button
                      onClick={handleSubscribePremium}
                      style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        border: "none",
                        background: "#7C3AED",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      Subscribe Premium
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={
                    chatCount >= 3
                      ? "Free limit reached..."
                      : "Type your question..."
                  }
                  value={question}
                  disabled={!isPremium && chatCount >= 3}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askAI();
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: "999px",
                    border: "1px solid #DDD6FE",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                    minWidth: 0,
                    background: chatCount >= 3 ? "#F3F4F6" : "white",
                  }}
                />

                <button
                  onClick={askAI}
                  disabled={!isPremium && chatCount >= 3}
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    border: "none",
                    background: chatCount >= 3 ? "#9CA3AF" : "#7C3AED",
                    color: "white",
                    cursor: chatCount >= 3 ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default FloatingAiChat;