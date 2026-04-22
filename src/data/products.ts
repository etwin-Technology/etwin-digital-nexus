import headphones from "@/assets/product-headphones.jpg";
import watch from "@/assets/product-watch.jpg";
import laptop from "@/assets/product-laptop.jpg";
import earbuds from "@/assets/product-earbuds.jpg";
import phone from "@/assets/product-phone.jpg";
import mouse from "@/assets/product-mouse.jpg";
import keyboard from "@/assets/product-keyboard.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Audio" | "Wearables" | "Computers" | "Mobile" | "Accessories";
  image: string;
  description: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    id: "etwin-aura-headphones",
    name: "eTwin Aura Headphones",
    price: 249,
    category: "Audio",
    image: headphones,
    description:
      "Immersive over-ear headphones with adaptive noise cancellation and 40h playback. Engineered for studio-grade sound on the move.",
    highlights: ["Active Noise Cancellation", "40h Battery", "Hi-Res Audio", "Spatial Sound"],
  },
  {
    id: "etwin-pulse-watch",
    name: "eTwin Pulse Watch",
    price: 329,
    category: "Wearables",
    image: watch,
    description:
      "Track every heartbeat with a luminous AMOLED display, advanced biosensors, and a 7-day battery life.",
    highlights: ["AMOLED Always-On", "ECG + SpO2", "GPS", "7-day Battery"],
  },
  {
    id: "etwin-blade-laptop",
    name: "eTwin Blade Laptop",
    price: 1599,
    category: "Computers",
    image: laptop,
    description:
      "An ultraportable powerhouse with the latest neural chip, 16GB unified memory, and an aerospace-grade chassis.",
    highlights: ["Neural Chip M-Pro", "16GB Memory", "14” Liquid Retina", "18h Battery"],
  },
  {
    id: "etwin-air-buds",
    name: "eTwin Air Buds",
    price: 149,
    category: "Audio",
    image: earbuds,
    description:
      "True wireless earbuds with H1 chip, transparency mode, and a slim charging case that lasts the whole week.",
    highlights: ["Active Noise Cancellation", "Transparency Mode", "Wireless Charging"],
  },
  {
    id: "etwin-vision-phone",
    name: "eTwin Vision Phone",
    price: 899,
    category: "Mobile",
    image: phone,
    description:
      "A flagship smartphone with a triple-lens AI camera, 6.7” OLED display, and lightning-fast 5G connectivity.",
    highlights: ["6.7” OLED 120Hz", "Triple AI Camera", "5G", "256GB"],
  },
  {
    id: "etwin-glide-mouse",
    name: "eTwin Glide Mouse",
    price: 89,
    category: "Accessories",
    image: mouse,
    description:
      "Precision wireless mouse with 26K DPI sensor, programmable RGB, and a feather-light frame for endless gaming.",
    highlights: ["26K DPI Sensor", "RGB Lighting", "70h Battery"],
  },
  {
    id: "etwin-mecha-keyboard",
    name: "eTwin Mecha Keyboard",
    price: 159,
    category: "Accessories",
    image: keyboard,
    description:
      "Tenkeyless mechanical keyboard with hot-swappable switches and per-key RGB. Built for makers and players.",
    highlights: ["Hot-swap Switches", "Per-key RGB", "USB-C", "Aluminium Frame"],
  },
  {
    id: "etwin-vision-mini",
    name: "eTwin Vision Mini",
    price: 699,
    category: "Mobile",
    image: phone,
    description:
      "All the flagship power in a compact 5.8” form. Pocketable, fast, and built to last.",
    highlights: ["5.8” OLED", "Dual AI Camera", "5G", "128GB"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
