// Updated Toaster component
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "calc(var(--radius) - 2px)",
          boxShadow: "var(--shadow-md)",
        },
        unstyled: false,
      }}
      {...props}
    />
  )
}

export { Toaster }