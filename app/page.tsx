"use client";

import { ResponeChatMsgItem } from "@/components/ResponeChatMsgItem";
import SenderChatMsgItem from "@/components/SenderChatMsgItem";
import TextEditor from "@/components/TextEditor";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col mb-36">
        <div className="flex flex-col w-[92%] max-w-[56.25rem] self-center">
          <ResponeChatMsgItem
            content="Hello friend"
            // content={
            //   "```jsx\n\nimport React from 'react';\n\n\n// A reusable product card component\n\nfunction ProductCard({ product }) {\n\n  return (\n\n    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>\n\n      <h2>{product.name}</h2>\n\n      <p>${product.price.toLocaleString()}</p>\n\n      <img src={product.image} alt={product.name} style={{ width: '100px', height: 'auto' }} />\n\n      {product.description && <p>{product.description}</p>}\n\n    </div>\n\n  );\n\n}\n\n\nexport default ProductCard;\n\n```\n\n\nThis example demonstrates a `ProductCard` component in React that takes a `product` object as props and renders a card showing the name, price, and an optional description of the product. The card also includes an image of the product. The `style` prop is used to give the card some basic styling; however, in a real project, you might want to apply CSS classes for better separation of concerns."
            // }
          />
          <SenderChatMsgItem />
        </div>
      </main>
      <footer className="min-h-32 fixed z-40 bg-background px-5 bottom-0 left-0 right-0 md:ml-64 flex justify-center">
        <TextEditor />
      </footer>
    </>
  );
}
