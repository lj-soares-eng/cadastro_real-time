import AuthTextField from './AuthTextField'
import { type FieldErrors } from '../validation/profileForm'
import { NAME_MAX } from '../validation/validators'
import type { FormEventHandler } from 'react'

/* Props do componente RegisterProfileForm */
type RegisterProfileFormProps = {
  name: string
  email: string
  password: string
  confirmPassword: string
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onFieldChange: (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

/* Componente de formulario de registro de perfil */
export default function RegisterProfileForm({
  name,
  email,
  password,
  confirmPassword,
  fieldErrors,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: RegisterProfileFormProps){

  /* Retorno do componente */
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
    {/* Campo de nome */}
    <AuthTextField
      id="register-name"
      label="Nome"
      name="name"
      autoComplete="name"
      value={name}
      onValueChange={(value) => onFieldChange('name', value)}
      error={fieldErrors.name}
      placeholder="Seu nome"
      maxLength={NAME_MAX + 10}
    />

    {/* Campo de e-mail */}
    <AuthTextField
      id="register-email"
      label="E-mail"
      type="email"
      name="email"
      autoComplete="email"
      value={email}
      onValueChange={(value) => onFieldChange('email', value)}
      error={fieldErrors.email}
      placeholder="user@provider.com"
    />

    {/* Campo de senha */}
    <AuthTextField
      id="register-password"
      label="Senha"
      type="password"
      name="password"
      autoComplete="new-password"
      value={password}
      onValueChange={(value) => onFieldChange('password', value)}
      error={fieldErrors.password}
      placeholder="Mínimo 6 caracteres"
    />

    {/* Campo de confirmar senha */}
    <AuthTextField
      id="register-confirm"
      label="Confirmar senha"
      type="password"
      name="confirmPassword"
      autoComplete="new-password"
      value={confirmPassword}
      onValueChange={(value) =>
        onFieldChange('confirmPassword', value)
      }
      error={fieldErrors.confirmPassword}
      placeholder="Repita a senha"
    />

    {/* Botao de criar conta */}
    <button
      className="btn-primary is-disabled"
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Cadastrando…' : 'Criar conta'}
    </button>
  </form>
  )
}
