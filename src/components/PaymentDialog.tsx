import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  PAYMENT_PRODUCTS,
  PaymentProduct,
  PaymentMethod,
} from "@/services/paymentService";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: PaymentProduct, method: PaymentMethod) => void;
}

export default function PaymentDialog({
  open,
  onClose,
  onSelectProduct,
}: PaymentDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<PaymentProduct | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("toss");

  const handleProductSelect = (product: PaymentProduct) => {
    setSelectedProduct(product);
  };

  const handlePaymentMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: PaymentMethod
  ) => {
    if (newMethod !== null) {
      setPaymentMethod(newMethod);
    }
  };

  const handlePayment = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct, paymentMethod);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>AI 상담 이용권 구매</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          AI 상담을 이용하기 위해서는 이용권이 필요합니다. 아래 상품 중 하나를
          선택해주세요.
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {PAYMENT_PRODUCTS.map((product) => (
              <Box
                key={product.id}
                sx={{ width: { xs: "100%", md: "30%" }, flexGrow: 1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    border: selectedProduct?.id === product.id ? 2 : 0,
                    borderColor: "primary.main",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {product.price.toLocaleString()}원
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        </Box>

        {selectedProduct && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              결제 수단 선택
            </Typography>
            <ToggleButtonGroup
              value={paymentMethod}
              exclusive
              onChange={handlePaymentMethodChange}
              aria-label="payment method"
            >
              <ToggleButton value="toss" aria-label="toss">
                토스페이
              </ToggleButton>
              <ToggleButton value="naver" aria-label="naver">
                네이버페이
              </ToggleButton>
              <ToggleButton value="kakao" aria-label="kakao">
                카카오페이
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        {selectedProduct && (
          <Button onClick={handlePayment} variant="contained" color="primary">
            결제하기
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
