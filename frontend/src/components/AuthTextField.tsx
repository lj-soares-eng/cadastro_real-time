type AuthTextFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  name: string
  autoComplete?: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  placeholder?: string
  maxLength?: number
}

export default function AuthTextField({
  id,
  label,
  type = 'text',
  name,
  autoComplete,
  value,
  onValueChange,
  error,
  placeholder,
  maxLength,
}: AuthTextFieldProps) {
  const errorId = `${id}-error`
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="auth-label"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className={`auth-input ${hasError ? 'has-error' : ''}`}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className="field-error-text">
          {error}
        </p>
      ) : null}
    </div>
  )
}
