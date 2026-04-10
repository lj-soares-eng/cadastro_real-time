import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, logoutRequest } from '../api/auth'
import { deleteUser } from '../api/users'
import { authCardClass, authShellClass, authSubmitClass, authTitleClass } from '../authStyles'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<number | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchMe()
      .then((u) => {
        if (!cancelled) {
          setUserId(u.id)
          setUserName(u.name)
        }
      })
      .catch(() => {
        if (!cancelled) {
          navigate('/login', { replace: true })
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleLogout() {
    try {
      await logoutRequest()
    } catch {
      // mesmo com falha na API, segue para o login (cookie pode já ter expirado)
    }
    navigate('/login')
  }

  function handleDeleteAccount() {
    if (userId === null || isDeleting) {
      return
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    )
    if (!confirmed) {
      return
    }

    setFormError(null)
    setIsDeleting(true)
    void deleteUser(userId)
      .then(() => {
        navigate('/login', { replace: true })
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Não foi possível excluir a conta.'
        setFormError(message)
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  if (loading || userName === null) {
    return (
      <div className={authShellClass}>
        <div className={`${authCardClass} max-w-lg`}>
          <p className="text-center text-[#5a6272] dark:text-[#9aa3b5]">
            Carregando…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={authShellClass}>
      <div className={`${authCardClass} max-w-lg`}>
        <h1 className={authTitleClass}>Bem vindo, {userName}!</h1>
        {formError ? (
          <p
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200"
            role="alert"
          >
            {formError}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className={authSubmitClass}
            onClick={() => navigate('/profile/edit')}
            type="button"
          >
            Editar perfil
          </button>
          <button
            className={`${authSubmitClass} bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-400`}
            onClick={handleDeleteAccount}
            type="button"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo conta…' : 'Deletar conta'}
          </button>
          <button
            className={`${authSubmitClass} bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400`}
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
