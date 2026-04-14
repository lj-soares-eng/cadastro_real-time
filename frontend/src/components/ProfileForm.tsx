import type { FormEventHandler } from 'react'
import AuthTextField from './AuthTextField'
import type { FieldErrors } from '../validation/profileForm'
import { NAME_MAX } from '../validation/validators'
import type { FormFieldsConfig } from '../validation/formVariantConfig'
import AuthEmailPasswordFields from './AuthEmailPasswordFields'

/* Tipo de dado para as propriedades do componente ProfileForm */
type ProfileFormProps = {
  fields: FormFieldsConfig
  name: string
  email: string
  password: string
  confirmPassword: string
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onFieldChange: (
    field: 'name' | 'email' | 'password' | 'confirmPassword',
    value: string,
  ) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

/* Tipo de dado para os campos do formulário */
type ProfileField = 'name' | 'email' | 'password' | 'confirmPassword'

/* Função para mudar o valor de um campo */
function fieldChange(
  onFieldChange: (field: ProfileField, value: string) => void,
  field: ProfileField,
) {
  return (value: string) => onFieldChange(field, value)
}

/* Componente de formulario de perfil */
  export default function ProfileForm({
  fields,
  name,
  email,
  password,
  confirmPassword,
  fieldErrors,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
        {/* Campo de nome */}
      <AuthTextField
        id={fields.idName}
        label="Nome"
        name="name"
        autoComplete="name"
        value={name}
        onValueChange={fieldChange(onFieldChange, 'name')}
        error={fieldErrors.name}
        placeholder="Seu nome"
        maxLength={NAME_MAX + 10}
      />

      <AuthEmailPasswordFields
        email={email}
        password={password}
        fieldErrors={fieldErrors}
        config={fields}
        onFieldChange={onFieldChange}
      />

      {/* Campo de confirmação de senha */}
      <AuthTextField
        id={fields.idConfirm}
        label={fields.labelConfirm}
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onValueChange={fieldChange(onFieldChange, 'confirmPassword')}
        error={fieldErrors.confirmPassword}
        placeholder={fields.placeholderConfirm}
      />
      
      {/* Botão de envio */}
      <button
        className="btn-primary is-disabled"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? fields.submitBusy : fields.submitIdle}
      </button>
    </form>
  )
}