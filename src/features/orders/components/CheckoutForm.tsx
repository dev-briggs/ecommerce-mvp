"use client";

import React, { FormEvent, useState } from "react";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatter";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { userOrderExists } from "@/features/orders/actions/orders";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video shrink-0 h-auto w-1/3 relative">
          <Image
            src={`/${product.imagePath}`}
            alt={product.name}
            className="object-cover"
            sizes="auto"
            fill
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100, "USD")}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);
    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message!);
        } else {
          setErrorMessage("An unknown error occured");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        {errorMessage && (
          <CardDescription className="text-destructive">
            {errorMessage}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap flex-row gap-4">
        <PaymentElement className="basis-full" />
        <LinkAuthenticationElement
          className="basis-full"
          onChange={(e) => setEmail(e.value.email)}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={!stripe || !elements || isLoading}
          type="submit"
        >
          Purchase - {formatCurrency(priceInCents / 100, "USD")}
        </Button>
      </CardFooter>
    </form>
  );
}
