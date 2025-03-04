"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { menuResponseSchema } from "@/lib/validations/menu";

export function MenuCard({
  item,
  onAddToOrder,
}: {
  item: z.infer<typeof menuResponseSchema>;
  onAddToOrder: (
    item: z.infer<typeof menuResponseSchema>,
    quantity: number
  ) => void;
}) {
  const [quantity, setQuantity] = useState(0);

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity);
    setQuantity(0);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={
              item.image_url
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${
                    item.image_url.startsWith("/") ? "" : "/"
                  }${item.image_url}`
                : "/placeholder.svg"
            }
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2">{item.name}</CardTitle>
        <p className="text-muted-foreground mb-2">{item.desc}</p>
        <p className="font-bold">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Button onClick={decrementQuantity} variant="outline">-</Button>
          <span className="mx-2">{quantity}</span>
          <Button onClick={incrementQuantity} variant="outline">+</Button>
        </div>
        <Button onClick={handleAddToOrder}>Add to Order</Button>
      </CardFooter>
    </Card>
  );
}
