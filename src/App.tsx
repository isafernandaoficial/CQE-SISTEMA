import { useState } from 'react'
import { TelaAcesso } from './features/auth/TelaAcesso'

export function App() {
  const [entrou, setEntrou] = useState(false)

  if (entrou) {
    return (
      <div className="app_conteudo">
        <p>Acesso confirmado. O painel de cada perfil ainda esta em construcao.</p>
      </div>
    )
  }

  return <TelaAcesso aoEntrarComSucesso={() => setEntrou(true)} />
}
