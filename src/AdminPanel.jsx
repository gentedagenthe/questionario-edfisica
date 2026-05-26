import React, { useState, useEffect, useCallback } from 'react';

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
const ADMIN_PASS    = process.env.REACT_APP_ADMIN_PASSWORD || 'genthe2026';

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f8fc; font-family: 'DM Sans', sans-serif; color: #1a2e3d; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1B6FAB; padding: 24px; }
  .login-card { background: #fff; border-radius: 16px; padding: 40px 36px; width: 100%; max-width: 380px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .login-logo { font-family: 'Nunito', sans-serif; font-size: 28px; font-weight: 800; color: #1B6FAB; margin-bottom: 4px; }
  .login-logo span { color: #6BBF4E; }
  .login-slogan { font-size: 10px; color: #5a7a8a; letter-spacing: 2px; text-transform: uppercase; font-family: 'Nunito', sans-serif; margin-bottom: 28px; }
  .login-titulo { font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; color: #1a2e3d; margin-bottom: 20px; }
  .login-input { width: 100%; padding: 12px 16px; border: 1.5px solid #d4e6f1; border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 12px; transition: border-color 0.2s; background: #f8fbfd; }
  .login-input:focus { border-color: #1B6FAB; }
  .login-btn { width: 100%; padding: 13px; background: #1B6FAB; color: #fff; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; }
  .login-btn:hover { opacity: 0.88; }
  .login-erro { font-size: 12px; color: #c0392b; margin-top: 10px; font-weight: 500; }

  .topbar { background: #1B6FAB; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; border-bottom: 3px solid #6BBF4E; }
  .topbar-logo { font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 800; color: #fff; }
  .topbar-logo span { color: #6BBF4E; }
  .topbar-titulo { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 1px; }
  .btn-sair { padding: 7px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; color: rgba(255,255,255,0.8); font-size: 12px; cursor: pointer; }

  .painel { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }

  .resumo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-bottom: 28px; }
  .resumo-card { background: #fff; border-radius: 12px; padding: 18px 20px; border: 1.5px solid #d4e6f1; }
  .r-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: #5a7a8a; margin-bottom: 6px; font-family: 'Nunito', sans-serif; }
  .r-num { font-family: 'Nunito', sans-serif; font-size: 28px; font-weight: 800; }
  .r-total { color: #1a2e3d; } .r-novo { color: #3b82f6; } .r-analise { color: #f59e0b; } .r-aprovado { color: #10b981; } .r-reprovado { color: #ef4444; }

  .filtros { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center; }
  .filtro-btn { padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1.5px solid #d4e6f1; background: #fff; color: #5a7a8a; cursor: pointer; font-family: 'Nunito', sans-serif; transition: all 0.2s; }
  .filtro-btn.ativo { background: #1B6FAB; border-color: #1B6FAB; color: #fff; }
  .busca-input { padding: 8px 14px; border: 1.5px solid #d4e6f1; border-radius: 20px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; width: 220px; background: #fff; }
  .busca-input:focus { border-color: #1B6FAB; }
  .btn-refresh { padding: 8px 16px; background: #6BBF4E; border: none; border-radius: 20px; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Nunito', sans-serif; margin-left: auto; }

  .tabela-wrap { background: #fff; border-radius: 12px; border: 1.5px solid #d4e6f1; overflow: hidden; }
  .tabela-header { padding: 16px 20px; border-bottom: 1px solid #d4e6f1; display: flex; align-items: center; justify-content: space-between; }
  .tabela-header h2 { font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700; }
  .tabela-header span { font-size: 13px; color: #5a7a8a; }
  .tabela { width: 100%; border-collapse: collapse; }
  .tabela thead tr { background: #f4f8fc; }
  .tabela th { padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5a7a8a; border-bottom: 1px solid #d4e6f1; white-space: nowrap; font-family: 'Nunito', sans-serif; }
  .tabela td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid #d4e6f1; vertical-align: middle; }
  .tabela tbody tr:last-child td { border-bottom: none; }
  .tabela tbody tr:hover { background: #f8fbfd; cursor: pointer; }
  .nome-cell { font-weight: 700; color: #1a2e3d; font-family: 'Nunito', sans-serif; }

  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Nunito', sans-serif; }
  .badge-novo      { background: #eff6ff; color: #3b82f6; }
  .badge-em-analise { background: #fffbeb; color: #f59e0b; }
  .badge-aprovado  { background: #f0fdf4; color: #10b981; }
  .badge-reprovado { background: #fef2f2; color: #ef4444; }

  .vazio-msg { text-align: center; padding: 48px; color: #5a7a8a; font-size: 14px; }

  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(13,42,69,0.55); z-index: 200; align-items: center; justify-content: center; padding: 16px; }
  .modal-overlay.aberto { display: flex; }
  .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 80px rgba(0,0,0,0.2); }
  .modal-header { background: #1B6FAB; padding: 24px 28px; display: flex; align-items: flex-start; justify-content: space-between; border-radius: 16px 16px 0 0; gap: 16px; }
  .modal-nome { font-family: 'Nunito', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
  .modal-sub { font-size: 13px; color: rgba(255,255,255,0.65); margin-top: 4px; }
  .modal-fechar { width: 32px; height: 32px; background: rgba(255,255,255,0.12); border: none; border-radius: 8px; color: #fff; font-size: 18px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .modal-body { padding: 24px 28px; }
  .modal-secao { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #d4e6f1; }
  .modal-secao:last-child { border-bottom: none; margin-bottom: 0; }
  .modal-secao-titulo { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: #4ea032; margin-bottom: 14px; font-family: 'Nunito', sans-serif; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-item .mi-label { font-size: 11px; color: #5a7a8a; font-weight: 600; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.4px; font-family: 'Nunito', sans-serif; }
  .modal-item .mi-val { font-size: 14px; color: #1a2e3d; font-weight: 500; line-height: 1.5; }
  .modal-item.full { grid-column: 1 / -1; }
  .modal-item .mi-val.longo { font-size: 13px; font-weight: 400; color: #5a7a8a; background: #f8fbfd; border-radius: 8px; padding: 10px 12px; }
  .modal-acoes { display: flex; gap: 8px; flex-wrap: wrap; padding: 16px 28px 24px; border-top: 1px solid #d4e6f1; }
  .modal-acoes span { font-size: 13px; color: #5a7a8a; align-self: center; margin-right: 6px; }
  .btn-status { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 2px solid transparent; cursor: pointer; font-family: 'Nunito', sans-serif; }
  .btn-analise  { background: #fffbeb; color: #f59e0b; border-color: #fde68a; }
  .btn-aprovar  { background: #f0fdf4; color: #10b981; border-color: #86efac; }
  .btn-reprovar { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
`;

const STATUS_LABEL = { 'novo': 'Novo', 'em-analise': 'Em análise', 'aprovado': 'Aprovado', 'reprovado': 'Reprovado' };
const STATUS_BADGE = { 'novo': 'badge-novo', 'em-analise': 'badge-em-analise', 'aprovado': 'badge-aprovado', 'reprovado': 'badge-reprovado' };

export default function AdminPanel() {
  const [logado, setLogado]         = useState(false);
  const [senha, setSenha]           = useState('');
  const [senhaErro, setSenhaErro]   = useState(false);
  const [dados, setDados]           = useState([]);
  const [filtro, setFiltro]         = useState('todos');
  const [busca, setBusca]           = useState('');
  const [modalItem, setModalItem]   = useState(null);

  const carregar = useCallback(async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respostas_edfisica?order=enviado_em.desc`, {
      headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    });
    const json = await res.json();
    if (Array.isArray(json)) setDados(json);
  }, []);

  useEffect(() => { if (logado) carregar(); }, [logado, carregar]);

  function login() {
    if (senha === ADMIN_PASS) { setLogado(true); setSenhaErro(false); }
    else setSenhaErro(true);
  }

  async function atualizarStatus(id, status) {
    await fetch(`${SUPABASE_URL}/rest/v1/respostas_edfisica?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` },
      body: JSON.stringify({ status })
    });
    setDados(d => d.map(r => r.id === id ? { ...r, status } : r));
    if (modalItem?.id === id) setModalItem(m => ({ ...m, status }));
  }

  const filtrados = dados.filter(r => {
    const ok = filtro === 'todos' || r.status === filtro;
    const b  = busca.toLowerCase();
    const bOk = !b || (r.nome||'').toLowerCase().includes(b) || (r.bairro||'').toLowerCase().includes(b) || (r.instituicao||'').toLowerCase().includes(b);
    return ok && bOk;
  });

  const cnt = (s) => dados.filter(r => r.status === s).length;
  const fmtData = (d) => new Date(d).toLocaleDateString('pt-BR') + ' ' + new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (!logado) return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">gen<span>th</span>e</div>
          <div className="login-slogan">que entende de gente</div>
          <div className="login-titulo">Painel Administrativo</div>
          <input className="login-input" type="password" placeholder="Senha de acesso" value={senha}
            onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          <button className="login-btn" onClick={login}>Entrar</button>
          {senhaErro && <p className="login-erro">Senha incorreta. Tente novamente.</p>}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="topbar">
        <div>
          <div className="topbar-logo">gen<span>th</span>e</div>
          <div className="topbar-titulo">Estagiário(a) de Educação Física · Painel de Candidatos</div>
        </div>
        <button className="btn-sair" onClick={() => setLogado(false)}>Sair</button>
      </div>

      <div className="painel">
        {/* RESUMO */}
        <div className="resumo-grid">
          <div className="resumo-card"><div className="r-label">Total</div><div className="r-num r-total">{dados.length}</div></div>
          <div className="resumo-card"><div className="r-label">Novos</div><div className="r-num r-novo">{cnt('novo')}</div></div>
          <div className="resumo-card"><div className="r-label">Em análise</div><div className="r-num r-analise">{cnt('em-analise')}</div></div>
          <div className="resumo-card"><div className="r-label">Aprovados</div><div className="r-num r-aprovado">{cnt('aprovado')}</div></div>
          <div className="resumo-card"><div className="r-label">Reprovados</div><div className="r-num r-reprovado">{cnt('reprovado')}</div></div>
        </div>

        {/* FILTROS */}
        <div className="filtros">
          {['todos','novo','em-analise','aprovado','reprovado'].map(s => (
            <button key={s} className={`filtro-btn ${filtro === s ? 'ativo' : ''}`} onClick={() => setFiltro(s)}>
              {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
            </button>
          ))}
          <input className="busca-input" placeholder="🔍 Buscar nome ou bairro..." value={busca} onChange={e => setBusca(e.target.value)} />
          <button className="btn-refresh" onClick={carregar}>↻ Atualizar</button>
        </div>

        {/* TABELA */}
        <div className="tabela-wrap">
          <div className="tabela-header">
            <h2>Candidatos</h2>
            <span>{filtrados.length} registro(s)</span>
          </div>
          {filtrados.length === 0 ? (
            <div className="vazio-msg">Nenhum candidato encontrado.</div>
          ) : (
            <table className="tabela">
              <thead><tr>
                <th>Nome</th><th>WhatsApp</th><th>Bairro</th><th>Semestre</th><th>Instituição</th><th>Enviado em</th><th>Status</th>
              </tr></thead>
              <tbody>
                {filtrados.map(r => (
                  <tr key={r.id} onClick={() => setModalItem(r)}>
                    <td><span className="nome-cell">{r.nome || '—'}</span></td>
                    <td>{r.whatsapp || '—'}</td>
                    <td>{r.bairro || '—'}</td>
                    <td>{r.semestre || '—'}</td>
                    <td>{r.instituicao || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#5a7a8a' }}>{r.enviado_em ? fmtData(r.enviado_em) : '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-novo'}`}>{STATUS_LABEL[r.status] || r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalItem && (
        <div className="modal-overlay aberto" onClick={e => e.target.className.includes('modal-overlay') && setModalItem(null)}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-nome">{modalItem.nome || '—'}</div>
                <div className="modal-sub">{modalItem.whatsapp || ''}{modalItem.enviado_em ? ' · ' + fmtData(modalItem.enviado_em) : ''}</div>
              </div>
              <button className="modal-fechar" onClick={() => setModalItem(null)}>✕</button>
            </div>
            <div className="modal-body">

              <div className="modal-secao">
                <div className="modal-secao-titulo">Dados Pessoais</div>
                <div className="modal-grid">
                  <div className="modal-item"><div className="mi-label">Nome</div><div className="mi-val">{modalItem.nome || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">WhatsApp</div><div className="mi-val">{modalItem.whatsapp || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">E-mail</div><div className="mi-val">{modalItem.email || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Bairro</div><div className="mi-val">{modalItem.bairro || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Como soube da vaga</div><div className="mi-val">{modalItem.origem || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Status</div><div className="mi-val"><span className={`badge ${STATUS_BADGE[modalItem.status]||'badge-novo'}`}>{STATUS_LABEL[modalItem.status]||modalItem.status}</span></div></div>
                </div>
              </div>

              <div className="modal-secao">
                <div className="modal-secao-titulo">Formação Acadêmica</div>
                <div className="modal-grid">
                  <div className="modal-item"><div className="mi-label">Cursando Ed. Física</div><div className="mi-val">{modalItem.cursando_edfisica || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Semestre</div><div className="mi-val">{modalItem.semestre || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Instituição</div><div className="mi-val">{modalItem.instituicao || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Termo de Estágio</div><div className="mi-val">{modalItem.termo_estagio || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Experiência com Aulas</div><div className="mi-val">{modalItem.exp_aulas || '—'}</div></div>
                </div>
              </div>

              <div className="modal-secao">
                <div className="modal-secao-titulo">Perfil e Experiência</div>
                <div className="modal-grid">
                  <div className="modal-item full"><div className="mi-label">Experiência com Atendimento</div><div className="mi-val">{modalItem.exp_atendimento || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Experiência com Cadastro</div><div className="mi-val">{modalItem.exp_cadastro || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Reação a Cliente Insatisfeito</div><div className="mi-val">{modalItem.perfil_atendimento || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Organização de Tarefas</div><div className="mi-val longo">{modalItem.organizacao || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Comunicação (1–5)</div><div className="mi-val">{modalItem.nota_comunicacao || '—'}</div></div>
                  <div className="modal-item"><div className="mi-label">Pontualidade</div><div className="mi-val">{modalItem.pontualidade || '—'}</div></div>
                </div>
              </div>

              <div className="modal-secao">
                <div className="modal-secao-titulo">Disponibilidade e Motivação</div>
                <div className="modal-grid">
                  <div className="modal-item full"><div className="mi-label">Disponibilidade de Horário</div><div className="mi-val">{modalItem.disponibilidade_horario || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Disponibilidade de Início</div><div className="mi-val">{modalItem.disponibilidade_inicio || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Área de Interesse</div><div className="mi-val">{modalItem.area_interesse || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Pratica Atividade Física</div><div className="mi-val">{modalItem.pratica_atividade || '—'}</div></div>
                  <div className="modal-item full"><div className="mi-label">Motivação</div><div className="mi-val longo">{modalItem.motivacao || '—'}</div></div>
                  {modalItem.observacoes && <div className="modal-item full"><div className="mi-label">Observações</div><div className="mi-val longo">{modalItem.observacoes}</div></div>}
                </div>
              </div>

            </div>
            <div className="modal-acoes">
              <span>Atualizar status:</span>
              <button className="btn-status btn-analise"  onClick={() => atualizarStatus(modalItem.id, 'em-analise')}>Em análise</button>
              <button className="btn-status btn-aprovar"  onClick={() => atualizarStatus(modalItem.id, 'aprovado')}>✓ Aprovado</button>
              <button className="btn-status btn-reprovar" onClick={() => atualizarStatus(modalItem.id, 'reprovado')}>✕ Reprovado</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
