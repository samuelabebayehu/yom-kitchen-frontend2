import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 

// Define the MenuItem type
export interface MenuItem {
    id: string;
    name: string;
    description?: string; 
    price: number;
    image?: string;      
}

interface MenuItemsCardProps {
    items: MenuItem[];
    className?: string; 
}

const MenuItemCard: React.FC<MenuItemsCardProps> = ({ items, className }) => {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
            {items.map((item) => (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        {item.price && <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>}
                    </CardHeader>
                    <CardContent className="py-2">
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="rounded-md aspect-video w-full object-cover mb-3"
                                style={{ maxHeight: '150px' }} // Optional: limit image height
                            />
                        )}
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button>Add to Cart</Button> 
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default MenuItemCard;