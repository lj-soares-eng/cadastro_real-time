import { Link } from 'react-router-dom'
import LoginProfileForm from '../components/LoginProfileForm'
import AlertMessage from '../components/AlertMessage'
import { useLoginPage } from '../hooks/useLoginPage'

/* Pagina de login */
export default function LoginPage() {
  /* Estado do componente */
  const {
    email,
    password,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
    onFieldChange,
  } = useLoginPage()

  /* Retorno do componente */
  return (
    <div className="auth-shell">
      <div className="auth-card auth-card-page-md">
        <h1 className="auth-title">Entrar</h1>
        <p className="auth-subtitle">Acesse com seu e-mail e senha.</p>

        {/* Se houver um erro, exibe uma mensagem de erro */}
        {formError ? (
          <AlertMessage variant="error">{formError}</AlertMessage>
        ) : null}

        {/* Formulario de login */}
        <LoginProfileForm
          email={email}
          password={password}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          onFieldChange={onFieldChange}
          onSubmit={handleSubmit}
        />

        {/* Rodapé */}
        <p className="auth-footer">
          Não tem uma conta?{' '}
          <Link className="auth-link" to="/register">
            Registrar-se
          </Link>
        </p>
      </div>
    </div>
  )
}
