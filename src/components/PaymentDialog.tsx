import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PAYMENT_PRODUCTS, PaymentProduct } from "@/lib/constants";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string, paymentMethod: string) => Promise<void>;
}

export default function PaymentDialog({
  open,
  onClose,
  onSelectProduct,
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>상담 이용권 구매</DialogTitle>
          <DialogDescription>
            원하시는 상담 이용권을 선택해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {Object.values(PAYMENT_PRODUCTS).map((product: PaymentProduct) => (
            <div key={product.id} className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="text-lg font-bold mt-2">
                {product.price.toLocaleString()}원
              </p>
              <div className="mt-4 space-x-2">
                <Button
                  onClick={() => onSelectProduct(product.id, "kakaopay")}
                  className="bg-yellow-400 hover:bg-yellow-500"
                >
                  카카오페이
                </Button>
                <Button
                  onClick={() => onSelectProduct(product.id, "tosspayments")}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  토스페이먼츠
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
