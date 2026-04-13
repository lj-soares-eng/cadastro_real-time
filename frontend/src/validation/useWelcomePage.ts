import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, logoutRequest, type UserRole } from '../api/auth'
import { deleteUser } from '../api/users'

/* Hook para estado e ações dos botões da página de boas-vindas */
export function useWelcomePage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<number | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  /* Efeito para buscar o usuário logado */
  useEffect(() => {
    let cancelled = false
    void fetchMe()
      .then((u) => {
        if (!cancelled) {
          setUserId(u.id)
          setUserName(u.name)
          setUserRole(u.role)
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

  /* Função para fazer logout */
  const handleLogout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // mesmo com falha na API, segue para o login (cookie pode já ter expirado)
    }
    navigate('/login')
  }, [navigate])

  /* Função para navegar para a página de administração */
  const goToAdmin = useCallback(() => {
    navigate('/admin')
  }, [navigate])

  /* Função para navegar para a página de edição de perfil */
  const goToEditProfile = useCallback(() => {
    navigate('/profile/edit')
  }, [navigate])

  /* Função para deletar a conta */
  const handleDeleteAccount = useCallback(() => {
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
          err instanceof Error
            ? err.message
            : 'Não foi possível excluir a conta.'
        setFormError(message)
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }, [userId, isDeleting, navigate])

  /* Retorno do hook */
  return {
    loading,
    userName,
    userRole,
    formError,
    isDeleting,
    handleLogout,
    handleDeleteAccount,
    goToAdmin,
    goToEditProfile,
  }
}
