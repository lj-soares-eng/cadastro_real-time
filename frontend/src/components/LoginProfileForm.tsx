import AuthTextField from './AuthTextField'
import { type LoginFieldErrors } from '../validation/profileForm'
import type { FormEventHandler } from 'react'

/* Tipo de campo de login */
type LoginField = 'email' | 'password'

/* Tipo de props do formulario de login */
type LoginProfileFormProps = {
  email: string
  password: string
  fieldErrors: LoginFieldErrors
  isSubmitting: boolean
  onFieldChange: (field: LoginField, value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

/* Função para mudar o valor de um campo */
function fieldChange(
  onFieldChange: (field: LoginField, value: string) => void,
  field: LoginField,
) {
  return (value: string) => onFieldChange(field, value)
}

/* Componente de formulario de login */
export default function LoginProfileForm({
  email,
  password,
  fieldErrors,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: LoginProfileFormProps) {

  /* Retorno do componente */
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {/* Campo de e-mail */}
      <AuthTextField
        id="login-email"
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onValueChange={fieldChange(onFieldChange, 'email')}
        error={fieldErrors.email}
        placeholder="user@provider.com"
      />

      {/* Campo de senha */}
      <AuthTextField
        id="login-password"
        label="Senha"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onValueChange={fieldChange(onFieldChange, 'password')}
        error={fieldErrors.password}
        placeholder="••••••"
      />

      {/* Botao de login */}
      <button
        className="btn-primary is-disabled"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
