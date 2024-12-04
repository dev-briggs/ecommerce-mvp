"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailOrderHistory } from "@/features/orders/actions/orders";
import { ordersSchema } from "@/schema/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function MyOrdersPage() {
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof ordersSchema>>({
    resolver: zodResolver(ordersSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof ordersSchema>) {
    const data = await emailOrderHistory(values);
    if (data?.error) {
      form.setError("root", {
        message: data.error,
      });
    }
    if (data?.message) {
      setMessage(data?.message);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-2-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Enter your email and we will email you your order history and
              download links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            {!form.formState.isSubmitSuccessful && (
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full"
                size="lg"
              >
                {form.formState.isSubmitting ? "Sending..." : "Send"}
              </Button>
            )}

            {!!form.formState.isSubmitted && !!message && (
              <div className="text-sm">{message}</div>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
