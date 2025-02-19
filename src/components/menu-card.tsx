import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { menuResponseSchema } from "@/lib/validations/menu";
import Image from "next/image";

// Define the MenuItem type

interface MenuItemsCardProps {
  items: z.infer<typeof menuResponseSchema>[];
}

const MenuItemCard: React.FC<MenuItemsCardProps> = ({ items }) => {
  return items.map((item) => {
    return (
      <Card key={item.ID}>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.desc}</CardDescription>
          <Image src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image_url}`} alt={item.name} />
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );
  });
};

export default MenuItemCard;
