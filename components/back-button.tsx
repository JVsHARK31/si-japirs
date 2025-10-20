"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link'
  className?: string
  showIcon?: boolean
  iconType?: 'arrow' | 'chevron'
  homeButton?: boolean
  customPath?: string
}

export function BackButton({
  label = "Kembali",
  variant = "ghost",
  className,
  showIcon = true,
  iconType = 'arrow',
  homeButton = false,
  customPath
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (customPath) {
      router.push(customPath)
    } else if (homeButton) {
      router.push('/')
    } else {
      router.back()
    }
  }

  const Icon = homeButton ? Home : iconType === 'arrow' ? ArrowLeft : ChevronLeft

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn(
        "group transition-all duration-200",
        variant === "ghost" && "hover:bg-primary/10",
        className
      )}
      size="sm"
    >
      {showIcon && (
        <Icon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
      )}
      {label}
    </Button>
  )
}

export function FloatingBackButton({
  className,
  ...props
}: BackButtonProps) {
  return (
    <div className={cn(
      "fixed top-20 left-4 z-40 md:top-24 md:left-8",
      className
    )}>
      <BackButton
        {...props}
        className="shadow-lg bg-background/95 backdrop-blur border hover:shadow-xl transition-all duration-300"
      />
    </div>
  )
}

export function MobileBackButton({
  className,
  ...props
}: BackButtonProps) {
  return (
    <div className={cn(
      "md:hidden sticky top-14 z-30 bg-background/95 backdrop-blur border-b p-2",
      className
    )}>
      <BackButton {...props} className="w-full justify-start" />
    </div>
  )
}

export function HeaderBackButton({
  title,
  subtitle,
  className,
  ...props
}: BackButtonProps & { title?: string; subtitle?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-4 mb-6",
      className
    )}>
      <BackButton {...props} />
      {title && (
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  )
}
