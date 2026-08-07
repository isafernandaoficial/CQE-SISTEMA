import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

/*
  Tela principal de acesso do CQE.

  Corrige dois problemas ja sinalizados antes desta tela existir.

  Primeiro, no sistema anterior nao havia como completar o acesso
  de uma pessoa recem convidada, so era possivel vincular quem ja
  tinha conta. Aqui, quando o link de convite ou recuperacao e
  aberto, o Supabase dispara o evento PASSWORD_RECOVERY, e a tela
  troca sozinha para o modo de definir senha, fechando esse buraco.

  Segundo, essa tela nao busca nome, e-mail ou papel de nenhuma
  outra pessoa, so cuida da propria sessao de quem esta entrando.
  Quem decide o que aparece depois do login e a rota de destino,
  nunca esta tela, para nao repetir a mistura de painel de super
  administrador com dado pessoal de equipe que ja apareceu antes.
*/

type Modo = 'login' | 'definir_senha' | 'carregando'

interface TelaAcessoProps {
  aoEntrarComSucesso: (perfilAtivo: boolean) => void
}

export function TelaAcesso({ aoEntrarComSucesso }: TelaAcessoProps) {
  const [modo, setModo] = useState<Modo>('carregando')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregandoAcao, setCarregandoAcao] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const { data: assinatura } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'PASSWORD_RECOVERY') {
        setModo('definir_senha')
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      setModo((atual) => (atual === 'definir_senha' ? atual : data.session ? 'login' : 'login'))
    })

    return () => {
      assinatura.subscription.unsubscribe()
    }
  }, [])

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)
    setCarregandoAcao(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha invalidos.')
      setCarregandoAcao(false)
      return
    }

    const userId = data.user?.id

    if (!userId) {
      setErro('Nao foi possivel confirmar o acesso, tenta novamente.')
      setCarregandoAcao(false)
      return
    }

    const { data: papeis } = await supabase
      .from('user_roles')
      .select('ativo')
      .eq('user_id', userId)

    const temPapelAtivo = (papeis ?? []).some((papel) => papel.ativo)

    if (!temPapelAtivo) {
      await supabase.auth.signOut()
      setErro('Seu acesso esta desativado. Fala com o administrador do seu consultorio.')
      setCarregandoAcao(false)
      return
    }

    setCarregandoAcao(false)
    aoEntrarComSucesso(temPapelAtivo)
  }

  async function definirSenha(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)

    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas nao sao iguais.')
      return
    }

    setCarregandoAcao(true)
    const { error } = await supabase.auth.updateUser({ password: senha })

    if (error) {
      setErro('Nao foi possivel definir a senha, tenta novamente.')
      setCarregandoAcao(false)
      return
    }

    setCarregandoAcao(false)
    setModo('login')
    setSenha('')
    setConfirmarSenha('')
    setErro('Senha definida. Agora e so entrar normalmente.')
  }

  if (modo === 'carregando') {
    return null
  }

  return (
    <div className="tela_acesso">
      <div className="tela_acesso_cartao">
        <h1>CQE</h1>
        <p className="tela_acesso_subtitulo">Consultorio em Ordem</p>

        {modo === 'login' && (
          <form onSubmit={entrar}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              required
              autoComplete="current-password"
            />

            {erro && <p className="tela_acesso_erro">{erro}</p>}

            <button type="submit" disabled={carregandoAcao}>
              {carregandoAcao ? 'Entrando' : 'Entrar'}
            </button>
          </form>
        )}

        {modo === 'definir_senha' && (
          <form onSubmit={definirSenha}>
            <p className="tela_acesso_instrucao">
              Esse e seu primeiro acesso. Define uma senha para continuar.
            </p>

            <label htmlFor="nova_senha">Nova senha</label>
            <input
              id="nova_senha"
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              required
              autoComplete="new-password"
            />

            <label htmlFor="confirmar_senha">Confirmar senha</label>
            <input
              id="confirmar_senha"
              type="password"
              value={confirmarSenha}
              onChange={(evento) => setConfirmarSenha(evento.target.value)}
              required
              autoComplete="new-password"
            />

            {erro && <p className="tela_acesso_erro">{erro}</p>}

            <button type="submit" disabled={carregandoAcao}>
              {carregandoAcao ? 'Salvando' : 'Definir senha e continuar'}
            </button>
          </form>
        )}
      </div>
