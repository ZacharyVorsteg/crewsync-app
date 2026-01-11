'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, name, src, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    }

    const initials = getInitials(name)
    const bgColor = getAvatarColor(name)

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-full font-medium text-white overflow-hidden',
          bgColor,
          sizes[size],
          className
        )}
        title={name}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
