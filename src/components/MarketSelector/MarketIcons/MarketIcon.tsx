import React from "react"
import { marketIcons } from "./marketIcons"
import type { IconTypes } from "@deriv/quill-icons"

interface MarketIconProps {
  symbol: string
  isOneSecond?: boolean
  size?: "default" | "large" | "xlarge" | "small"
  showBadge?: boolean
}

export const MarketIcon: React.FC<MarketIconProps> = ({
  symbol,
  size = "default",
}) => {
  const Icon = marketIcons[symbol] as IconTypes

  if (!Icon) {
    console.warn(`No icon found for symbol: ${symbol}`)
    return null
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center ${
          size === "xlarge"
            ? "w-[64px] h-[64px]"
            : size === "large"
            ? "w-[52px] h-[52px]"
            : size === "small"
            ? "w-[24px] h-[24px]"
            : "w-[40px] h-[40px]"
        }`}
      >
        <Icon
          className={
            size === "xlarge"
              ? "w-10 h-10"
              : size === "large"
              ? "w-8 h-8"
              : "w-6 h-6"
          }
        />
      </div>
    </div>
  )
}
