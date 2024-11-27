"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { ACCEPTED_IMAGE_TYPES, productFormSchema } from "@/schema/products";
import { addProduct, updateProduct } from "@/server/actions/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ProductForm({ product }: { product?: Product | null }) {
  const addProductDefaultValues = {
    name: "",
    priceInCents: 0,
    description: "",
    file: new File([], ""),
    image: new File([], ""),
  };

  const editProductDefaultValues = {
    name: product?.name,
    priceInCents: product?.priceInCents,
    description: product?.description,
  };

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: !product
      ? addProductDefaultValues
      : editProductDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    const action = !product ? addProduct : updateProduct.bind(null, product.id);
    const data = await action(values);
    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your product",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input id="name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="priceInCents">Price In Cents</FormLabel>
              <FormControl>
                <Input id="priceInCents" type="number" {...field} />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                {formatCurrency(
                  (form.getValues("priceInCents") || 0) / 100,
                  "USD"
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="file">File</FormLabel>
              <FormControl>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
              {!!product && (
                <div className="text-muted-foreground">{product.filePath}</div>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="image">Image</FormLabel>
              <FormControl>
                <Input
                  id="image"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.toString()}
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
              {!!product && (
                <Image
                  src={`/${product.imagePath}`}
                  height="200"
                  width="200"
                  alt="Product Image"
                ></Image>
              )}
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
