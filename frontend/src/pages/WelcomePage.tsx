import AlertMessage from '../components/AlertMessage'
import { useWelcomePage } from '../hooks/useWelcomePage'

/* Pagina de boas vindas */
export default function WelcomePage() {
  /* Estado do componente */
  const {
    loading,
    userName,
    userRole,
    formError,
    isDeleting,
    handleLogout,
    handleDeleteAccount,
    goToAdmin,
    goToEditProfile,
  } = useWelcomePage()

  /* Se o carregamento estiver ativo ou o nome do usuário for nulo, retorna um loading */
  if (loading || userName === null) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-card-page-lg">
          <p className="text-muted-center">Carregando…</p>
        </div>
      </div>
    )
  }

  /* Retorno do componente */
  return (
    <div className="auth-shell">
      <div className="auth-card auth-card-page-lg">
        <h1 className="auth-title">Bem vindo, {userName}!</h1>

        {/* Se houver um erro, exibe uma mensagem de erro */}
        {formError ? (
          <AlertMessage variant="error">{formError}</AlertMessage>
        ) : null}

        {/* Div de botões de ação */}
        <div className="auth-actions">
          {/* Se o usuário for ADMIN, exibe um botão de painel de administração */}
          {userRole === 'ADMIN' ? (
            <button
              className="btn-muted"
              onClick={goToAdmin}
              type="button"
            >
              Painel admin
            </button>
          ) : null}

          {/* Se o usuário não for ADMIN, exibe um botão de editar perfil */}
          <button
            className="btn-primary"
            onClick={goToEditProfile}
            type="button"
          >
            Editar perfil
          </button>

          {/* Botao de deletar conta */}
          <button
            className="btn-danger is-disabled"
            onClick={handleDeleteAccount}
            type="button"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo conta…' : 'Deletar conta'}
          </button>
          
          {/* Botao de sair */}
          <button
            className="btn-muted"
            onClick={() => void handleLogout()}
            type="button"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
