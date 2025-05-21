import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { getUserCredits } from "@/services/paymentService";
import type { PaymentProduct } from "@/lib/constants";
import { PAYMENT_PRODUCTS } from "@/lib/constants";
import type { PaymentMethod } from "@/services/paymentService";
import PaymentDialog from "./PaymentDialog";
import { processPayment } from "@/services/paymentService";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Array<{ text: string; sender: "user" | "bot" }>;
}

export default function ChatInterface({
  onSendMessage,
  messages,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [credits, setCredits] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserCredits();
    }
  }, [user]);

  const loadUserCredits = async () => {
    if (user) {
      const userCredits = await getUserCredits(user.id);
      setCredits(userCredits);
    }
  };

  const handleSend = () => {
    if (message.trim() && credits > 0) {
      onSendMessage(message);
      setMessage("");
      setCredits((prev) => prev - 1);
    } else if (credits <= 0) {
      setShowPaymentDialog(true);
    }
  };

  const handlePayment = async (productId: string, paymentMethod: string) => {
    if (!user) return;

    const product = PAYMENT_PRODUCTS[productId];
    const result = await processPayment(
      user.id,
      product,
      paymentMethod as PaymentMethod
    );
    if (result.success) {
      await loadUserCredits();
      setShowPaymentDialog(false);
    } else {
      // TODO: Show error message
      console.error(result.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 2,
                borderRadius: 2,
                bgcolor: msg.sender === "user" ? "primary.main" : "grey.100",
                color: msg.sender === "user" ? "white" : "text.primary",
              }}
            >
              <Typography>{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          남은 상담 횟수: {credits}회
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="contained" onClick={handleSend}>
            전송
          </Button>
        </Box>
      </Box>
      <PaymentDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onSelectProduct={handlePayment}
        type="chat"
      />
    </Box>
  );
}
