import { Link } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import EditProfileForm from '../components/EditProfileForm'
import { useEditProfileForm } from '../validation/useEditProfile'

export default function EditPage() {
  const {
    loading,
    name,
    email,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    successMessage,
    isSubmitting,
    onFieldChange,
    handleSubmit,
  } = useEditProfileForm()

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card max-w-105">
          <p className="text-muted-center">
            Carregando…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <div className="auth-card max-w-105">
        <h1 className="auth-title">Atualizar perfil</h1>
        <p className="auth-subtitle">
          Atualize nome, e-mail e, se quiser, sua senha.
        </p>

        {successMessage ? (
          <AlertMessage variant="success">{successMessage}</AlertMessage>
        ) : null}
        {formError ? <AlertMessage variant="error">{formError}</AlertMessage> : null}

        <EditProfileForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          onFieldChange={onFieldChange}
          onSubmit={handleSubmit}
        />

        <p className="auth-footer">
          <Link className="auth-link" to="/welcome">
            Voltar para a tela inicial
          </Link>
        </p>
      </div>
    </div>
  )
}
