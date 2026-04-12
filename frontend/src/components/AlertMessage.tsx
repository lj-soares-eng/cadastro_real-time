import type { ReactNode } from 'react'

type AlertMessageProps = {
  variant: 'success' | 'error'
  role?: 'status' | 'alert'
  children: ReactNode
}

const alertVariantClass = {
  success: 'alert-success',
  error: 'alert-error',
}

export default function AlertMessage({
  variant,
  role,
  children,
}: AlertMessageProps) {
  return (
    <p
      className={`alert-message ${alertVariantClass[variant]}`}
      role={role ?? (variant === 'success' ? 'status' : 'alert')}
    >
      {children}
    </p>
  )
}
