import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
  };
  downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    imagePath: `products/960b8655-6250-4ced-8724-233ca40f7822-108568061_1204103576589415_546804295583961964_n.jpg`,
    description: "sample description",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  order,
  product,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
