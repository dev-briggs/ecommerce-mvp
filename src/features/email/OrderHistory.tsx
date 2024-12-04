import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 10000,
      product: {
        name: "Product name 1",
        imagePath: `products/960b8655-6250-4ced-8724-233ca40f7822-108568061_1204103576589415_546804295583961964_n.jpg`,
        description: "sample description 2",
      },
      downloadVerificationId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 20000,
      product: {
        name: "Product name 2",
        imagePath: `products/af85195c-0bf8-433f-a4d6-a2d6cd7a102c-108568061_1204103576589415_546804295583961964_n.jpg`,
        description: "sample description 2",
      },
      downloadVerificationId: crypto.randomUUID(),
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
