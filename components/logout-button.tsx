"use client"

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  showText?: boolean
  className?: string
  redirectTo?: string
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  showText = true,
  className = '',
  redirectTo = '/'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: redirectTo,
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`${className} ${variant === 'destructive' ? '' : 'hover:text-destructive'}`}
      disabled={isLoading}
    >
      {showIcon && <LogOut className={`${showText ? 'mr-2' : ''} h-4 w-4`} />}
      {showText && (isLoading ? 'Logging out...' : 'Logout')}
    </Button>
  )
}
