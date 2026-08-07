import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PapelDoUsuario } from './types/perfil'

/*
  Le o papel do usuario logado na clinica atual. Depende da
  tabela user_roles, que ja existe no Supabase. Nao decide nada
  de interface aqui, so devolve o dado, quem decide o que mostrar
  na tela e o componente que usa esse hook.
*/
export function useMyRole(clinicId: string | null) {
  const [papel, setPapel] = useState<PapelDoUsuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)

      const { data: sessao } = await supabase.auth.getUser()
      const userId = sessao.user?.id

      if (!userId || !clinicId) {
        if (ativo) {
          setPapel(null)
          setCarregando(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, clinic_id, role, ativo')
        .eq('user_id', userId)
        .eq('clinic_id', clinicId)
        .maybeSingle()

      if (ativo) {
        if (error || !data) {
          setPapel(null)
        } else {
          setPapel({
            userId: data.user_id,
            clinicId: data.clinic_id,
            perfil: data.role,
            ativo: data.ativo,
          })
        }
        setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [clinicId])

  return { papel, carregando }
}
