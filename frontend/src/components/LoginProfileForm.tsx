
import { type LoginFieldErrors } from '../validation/profileForm'
import AuthEmailPasswordFields from './AuthEmailPasswordFields'
import { loginProfileConfig } from '../validation/formVariantConfig'
import type { FormEventHandler } from 'react'

/* Tipo de props do formulario de login */
type LoginProfileFormProps = {
  email: string
  password: string
  fieldErrors: LoginFieldErrors
  onFieldChange: (field: 'email' | 'password', value: string) => void 
  isSubmitting: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
}

/* Componente de formulario de login */
export default function LoginProfileForm({
  email,
  password,
  fieldErrors,
  onFieldChange,
  isSubmitting,
  onSubmit,
}: LoginProfileFormProps) {

  /* Retorno do componente */
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      
      {/* Campos de e-mail e senha */}
      <AuthEmailPasswordFields
        email={email}
        password={password}
        fieldErrors={fieldErrors}
        config={loginProfileConfig}
        onFieldChange={onFieldChange}
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
