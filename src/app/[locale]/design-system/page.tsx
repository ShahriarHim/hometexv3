import ColorPalette from "@/components/ColorPalette";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System - Hometex",
  description: "Hometex color palette and design system showcase",
};

export default function DesignSystemPage() {
  return (
    <div>
      <ColorPalette />
    </div>
  );
}
