import React, { useState } from 'react';
import MenuItemCard from './menu-card';
import z from "zod"




const ClientOrder = () => {
    const menuItems z.infer<typeof menuSchema>[]
  const [order, setOrder] = useState<{ [key: number]: number }>({});

  const addItem = (id: number) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      [id]: (prevOrder[id] || 0) + 1,
    }));
  };

  const removeItem = (id: number) => {
    setOrder(prevOrder => {
      const newOrder = { ...prevOrder };
      if (newOrder[id] > 1) {
        newOrder[id] -= 1;
      } else {
        delete newOrder[id];
      }
      return newOrder;
    });
  };

  return (

    
    <div className="menu">
     
        <MenuItemCard items={menuItems}/>

    </div>
  );
};

export default ClientOrder;
