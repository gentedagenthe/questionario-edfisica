import React, { useState } from 'react';

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f8fc; font-family: 'DM Sans', sans-serif; color: #1a2e3d; }

  .header { background: #1B6FAB; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 16px rgba(27,111,171,0.25); }
  .header-inner { max-width: 680px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .logo-wrap { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
  .logo-text { font-family: 'Nunito', sans-serif; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .logo-verde { color: #6BBF4E; }
  .logo-slogan { font-family: 'Nunito', sans-serif; font-size: 7.5px; font-weight: 700; color: rgba(255,255,255,0.65); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .vaga-tag { font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 500; }
  .progress-bar { height: 4px; background: rgba(255,255,255,0.15); }
  .progress-fill { height: 100%; background: #6BBF4E; border-radius: 0 2px 2px 0; transition: width 0.4s ease; }

  .container { max-width: 680px; margin: 0 auto; padding: 32px 24px 60px; }
  .card { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(27,111,171,0.08); border: 1px solid #d4e6f1; }

  .vaga-badge { display: inline-block; font-size: 11px; font-weight: 700; color: #6BBF4E; background: #edf7e9; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-family: 'Nunito', sans-serif; }
  .vaga-titulo { font-family: 'Nunito', sans-serif; font-size: 28px; font-weight: 800; color: #1a2e3d; margin-bottom: 4px; }
  .vaga-empresa { font-size: 14px; color: #5a7a8a; }
  .vaga-header { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1.5px solid #d4e6f1; }

  .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .info-item { display: flex; align-items: flex-start; gap: 10px; background: #e8f2fa; border-radius: 10px; padding: 12px 14px; }
  .info-icone { font-size: 18px; margin-top: 1px; }
  .info-label { font-size: 11px; color: #5a7a8a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Nunito', sans-serif; }
  .info-valor { font-size: 13px; color: #1a2e3d; font-weight: 700; font-family: 'Nunito', sans-serif; margin-top: 2px; }

  .secao { margin-bottom: 24px; }
  .secao-titulo { font-size: 13px; font-weight: 800; color: #1B6FAB; font-family: 'Nunito', sans-serif; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px; }
  .benef-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; }
  .benef-item { font-size: 13px; color: #1a2e3d; display: flex; align-items: flex-start; gap: 6px; }
  .benef-check { color: #6BBF4E; font-weight: 800; flex-shrink: 0; }
  .req-lista { padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #1a2e3d; line-height: 1.55; }

  .prazo-banner { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #1B6FAB 0%, #1558a0 100%); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; color: #fff; }
  .prazo-icone { font-size: 24px; flex-shrink: 0; }
  .prazo-label { font-size: 11px; color: rgba(255,255,255,0.75); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-family: 'Nunito', sans-serif; }
  .prazo-data { font-size: 16px; font-weight: 800; font-family: 'Nunito', sans-serif; margin-top: 2px; }

  .lgpd-box { background: #f8fbfd; border: 1.5px solid #d4e6f1; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
  .lgpd-titulo { font-size: 13px; font-weight: 800; color: #1B6FAB; font-family: 'Nunito', sans-serif; margin-bottom: 10px; }
  .lgpd-texto { font-size: 13px; color: #5a7a8a; line-height: 1.7; margin-bottom: 14px; }
  .lgpd-label { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #1a2e3d; cursor: pointer; line-height: 1.5; }
  .lgpd-label input[type=checkbox] { margin-top: 2px; accent-color: #1B6FAB; width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; }
  .lgpd-erro { font-size: 12px; color: #c0392b; margin-top: 10px; font-weight: 500; }

  .etapa-num { font-size: 12px; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Nunito', sans-serif; }
  .etapa-titulo { font-family: 'Nunito', sans-serif; font-size: 26px; font-weight: 800; color: #1a2e3d; margin-top: 6px; margin-bottom: 8px; }
  .etapa-desc { font-size: 14px; color: #5a7a8a; line-height: 1.6; margin-bottom: 24px; }

  .campo { margin-bottom: 22px; }
  .campo-label { display: block; font-size: 14px; font-weight: 600; color: #1a2e3d; margin-bottom: 8px; font-family: 'Nunito', sans-serif; }
  .obrig { color: #1B6FAB; }
  .campo-input { width: 100%; padding: 11px 14px; font-size: 14px; border: 1.5px solid #d4e6f1; border-radius: 8px; background: #f8fbfd; color: #1a2e3d; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
  .campo-input:focus { border-color: #1B6FAB; box-shadow: 0 0 0 3px rgba(27,111,171,0.12); }
  .campo-textarea { width: 100%; padding: 11px 14px; font-size: 14px; border: 1.5px solid #d4e6f1; border-radius: 8px; background: #f8fbfd; color: #1a2e3d; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; min-height: 96px; line-height: 1.6; }
  .campo-textarea:focus { border-color: #1B6FAB; box-shadow: 0 0 0 3px rgba(27,111,171,0.12); }

  .botoes { display: flex; gap: 12px; margin-top: 32px; justify-content: flex-end; }
  .btn-voltar { padding: 11px 24px; background: #e8f2fa; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1B6FAB; cursor: pointer; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
  .btn-avancar { padding: 11px 28px; background: #1B6FAB; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
  .btn-voltar:hover, .btn-avancar:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-avancar:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .passos { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; justify-content: center; }
  .passo { display: flex; align-items: center; gap: 6px; opacity: 0.35; }
  .passo-ativo { opacity: 1; }
  .passo-concluido { opacity: 0.65; }
  .passo-circulo { width: 26px; height: 26px; border-radius: 50%; background: #d4e6f1; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #5a7a8a; font-family: 'Nunito', sans-serif; flex-shrink: 0; }
  .passo-circulo-ativo { background: #1B6FAB; color: #fff; }
  .passo-circulo-concluido { background: #6BBF4E; color: #fff; }
  .passo-label { font-size: 12px; color: #5a7a8a; white-space: nowrap; }

  .success-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: #f4f8fc; }
  .success-card { background: #fff; border-radius: 20px; padding: 52px 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(27,111,171,0.12); border: 1px solid #d4e6f1; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: #6BBF4E; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; color: #fff; margin: 24px auto 20px; }
  .success-titulo { font-family: 'Nunito', sans-serif; font-size: 24px; font-weight: 800; color: #1a2e3d; margin-bottom: 14px; }
  .success-texto { font-size: 14px; color: #5a7a8a; line-height: 1.7; margin-bottom: 20px; }
  .success-slogan { font-size: 11px; color: #1B6FAB; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-family: 'Nunito', sans-serif; }

  .erro-msg { font-size: 12px; color: #c0392b; margin-top: 6px; font-weight: 500; }
`;

const TOTAL_ETAPAS = 4;

function Campo({ label, obrig, children }) {
  return (
    <div className="campo">
      <label className="campo-label">{label} {obrig && <span className="obrig">*</span>}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select className="campo-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder || 'Selecione...'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function QuestionarioEdFisica() {
  const [tela, setTela]           = useState('intro'); // intro | form | sucesso
  const [etapa, setEtapa]         = useState(1);
  const [lgpd, setLgpd]           = useState(false);
  const [lgpdErro, setLgpdErro]   = useState(false);
  const [enviando, setEnviando]   = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const [form, setForm] = useState({
    nome: '', email: '', whatsapp: '', bairro: '', origem: '',
    cursando: '', semestre: '', instituicao: '', termo: '', exp_aulas: '',
    exp_atendimento: '', exp_cadastro: '', perfil_atendimento: '',
    organizacao: '', comunicacao: '', pontualidade: '',
    disponibilidade_horario: '', disponibilidade_inicio: '',
    area_interesse: '', pratica_atividade: '', motivacao: '', observacoes: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const progresso = tela === 'form' ? ((etapa - 1) / TOTAL_ETAPAS) * 100 : tela === 'sucesso' ? 100 : 0;

  function iniciar() {
    if (!lgpd) { setLgpdErro(true); return; }
    setLgpdErro(false);
    setTela('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function irPara(n) {
    setEtapa(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function enviar() {
    setEnviando(true);
    setErroEnvio('');
    try {
      const payload = {
        nome: form.nome, whatsapp: form.whatsapp, email: form.email,
        bairro: form.bairro, origem: form.origem,
        cursando_edfisica: form.cursando, semestre: form.semestre,
        instituicao: form.instituicao, termo_estagio: form.termo,
        exp_aulas: form.exp_aulas, exp_atendimento: form.exp_atendimento,
        exp_cadastro: form.exp_cadastro, perfil_atendimento: form.perfil_atendimento,
        organizacao: form.organizacao,
        nota_comunicacao: form.comunicacao ? parseInt(form.comunicacao) : null,
        pontualidade: form.pontualidade,
        disponibilidade_horario: form.disponibilidade_horario,
        disponibilidade_inicio: form.disponibilidade_inicio,
        area_interesse: form.area_interesse,
        pratica_atividade: form.pratica_atividade,
        motivacao: form.motivacao, observacoes: form.observacoes,
        status: 'novo'
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/respostas_edfisica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      setTela('sucesso');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErroEnvio('Ocorreu um erro ao enviar. Por favor, tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  const passosCfg = [
    { n: 1, label: 'Dados Pessoais' },
    { n: 2, label: 'Formação' },
    { n: 3, label: 'Perfil' },
    { n: 4, label: 'Disponibilidade' }
  ];

  if (tela === 'sucesso') {
    return (
      <>
        <style>{css}</style>
        <div className="header">
          <div className="header-inner">
            <div className="logo-wrap">
              <div className="logo-text">gen<span className="logo-verde">th</span>e</div>
              <div className="logo-slogan">que entende de gente</div>
            </div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '100%' }} /></div>
        </div>
        <div className="success-wrap">
          <div className="success-card">
            <div className="logo-wrap" style={{ alignItems: 'center', marginBottom: 12 }}>
              <div className="logo-text" style={{ color: '#1B6FAB' }}>gen<span className="logo-verde">th</span>e</div>
              <div className="logo-slogan" style={{ color: '#1B6FAB' }}>que entende de gente</div>
            </div>
            <div className="success-icon" style={{ display: 'flex' }}>✓</div>
            <h2 className="success-titulo">Questionário enviado!</h2>
            <p className="success-texto">Obrigado pela participação. Nossa equipe analisará suas respostas e, se houver compatibilidade com a vaga de <strong>Estagiário(a) de Educação Física</strong>, entraremos em contato em breve.</p>
            <p className="success-slogan">Genthe que entende de gente.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      {/* HEADER */}
      <div className="header">
        <div className="header-inner">
          <div className="logo-wrap">
            <div className="logo-text">gen<span className="logo-verde">th</span>e</div>
            <div className="logo-slogan">que entende de gente</div>
          </div>
          <div className="vaga-tag">Estagiário(a) de Educação Física · Campo Grande/MS</div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: progresso + '%' }} /></div>
      </div>

      {/* TELA INTRO */}
      {tela === 'intro' && (
        <div className="container">
          <div className="card">
            <div className="vaga-header">
              <div className="vaga-badge">Processo Seletivo Aberto</div>
              <h1 className="vaga-titulo">Estagiário(a) de Educação Física</h1>
              <p className="vaga-empresa">Academia / Educação Física · Campo Grande/MS</p>
            </div>

            <div className="info-grid">
              <div className="info-item"><span className="info-icone">📄</span><div><div className="info-label">Contratação</div><div className="info-valor">Estágio · 6 meses</div></div></div>
              <div className="info-item"><span className="info-icone">💰</span><div><div className="info-label">Bolsa</div><div className="info-valor">R$ 900,00</div></div></div>
              <div className="info-item"><span className="info-icone">🕗</span><div><div className="info-label">Horários</div><div className="info-valor">06h–09h e 17h–21h</div></div></div>
              <div className="info-item"><span className="info-icone">📍</span><div><div className="info-label">Local</div><div className="info-valor">Rua Rodolfo José Pinho</div></div></div>
            </div>

            <div className="secao">
              <div className="secao-titulo">🎁 Benefícios</div>
              <div className="benef-grid">
                <div className="benef-item"><span className="benef-check">✓</span> Vale Transporte</div>
                <div className="benef-item"><span className="benef-check">✓</span> Possibilidade de renovação após 6 meses</div>
              </div>
            </div>

            <div className="secao">
              <div className="secao-titulo">📚 Requisito</div>
              <ul className="req-lista">
                <li>Estar cursando Educação Física (obrigatório)</li>
                <li>Boa comunicação e receptividade no atendimento ao cliente</li>
                <li>Organização e atenção aos detalhes no registro de informações</li>
                <li>Disposição para aprender e acompanhar rotinas de aula</li>
                <li>Proatividade e comprometimento com horários</li>
              </ul>
            </div>

            <div className="secao">
              <div className="secao-titulo">🛠️ Principais Atividades</div>
              <ul className="req-lista">
                <li>Atender e recepcionar clientes</li>
                <li>Realizar cadastro de clientes no sistema</li>
                <li>Acompanhar as aulas ministradas pela professora responsável</li>
              </ul>
            </div>

            <div className="prazo-banner">
              <span className="prazo-icone">📅</span>
              <div>
                <div className="prazo-label">Inscrições abertas</div>
                <div className="prazo-data">Processo seletivo em andamento</div>
              </div>
            </div>

            <div className="lgpd-box">
              <div className="lgpd-titulo">🔒 Proteção de Dados — LGPD</div>
              <p className="lgpd-texto">
                As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de seleção e recrutamento,
                em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>.
                Seus dados serão armazenados com segurança, não serão compartilhados com terceiros sem sua autorização e poderão
                ser solicitados para exclusão a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.
              </p>
              <label className="lgpd-label">
                <input type="checkbox" checked={lgpd} onChange={e => { setLgpd(e.target.checked); if (e.target.checked) setLgpdErro(false); }} />
                <span>Li e concordo com o tratamento dos meus dados pessoais para fins de participação neste processo seletivo, conforme a LGPD.</span>
              </label>
              {lgpdErro && <p className="lgpd-erro">É necessário concordar com os termos para continuar.</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-avancar" onClick={iniciar}>Iniciar questionário →</button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO */}
      {tela === 'form' && (
        <div className="container">

          {/* ETAPA 1 */}
          {etapa === 1 && (
            <>
              <div className="etapa-num">Etapa 1 de 4</div>
              <h1 className="etapa-titulo">Dados Pessoais</h1>
              <p className="etapa-desc">Vamos começar com suas informações básicas.</p>
              <div className="card">
                <Campo label="Nome completo" obrig><input className="campo-input" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" /></Campo>
                <Campo label="E-mail" obrig><input className="campo-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" /></Campo>
                <Campo label="Telefone / WhatsApp" obrig><input className="campo-input" type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="(67) 99999-9999" /></Campo>
                <Campo label="Bairro onde mora" obrig><input className="campo-input" value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Ex: Centro, Jardim dos Estados..." /></Campo>
                <Campo label="Como ficou sabendo desta vaga?" obrig>
                  <Select value={form.origem} onChange={v => set('origem', v)} options={['Instagram da Genthe', 'Indicação de amigo ou familiar', 'LinkedIn', 'WhatsApp', 'Outro']} />
                </Campo>
                <div className="botoes"><button className="btn-avancar" onClick={() => irPara(2)}>Continuar →</button></div>
              </div>
            </>
          )}

          {/* ETAPA 2 */}
          {etapa === 2 && (
            <>
              <div className="etapa-num">Etapa 2 de 4</div>
              <h1 className="etapa-titulo">Formação Acadêmica</h1>
              <p className="etapa-desc">Informações sobre seu curso e instituição de ensino.</p>
              <div className="card">
                <Campo label="Você está cursando Educação Física atualmente?" obrig>
                  <Select value={form.cursando} onChange={v => set('cursando', v)} options={['Sim, estou cursando', 'Não ainda, pretendo iniciar', 'Já concluí o curso']} />
                </Campo>
                <Campo label="Em qual semestre ou período você está?" obrig><input className="campo-input" value={form.semestre} onChange={e => set('semestre', e.target.value)} placeholder="Ex: 3º semestre" /></Campo>
                <Campo label="Em qual instituição de ensino você estuda?" obrig><input className="campo-input" value={form.instituicao} onChange={e => set('instituicao', e.target.value)} placeholder="Nome da faculdade ou universidade" /></Campo>
                <Campo label="Você possui ou pode obter Termo de Compromisso de Estágio pela sua instituição?" obrig>
                  <Select value={form.termo} onChange={v => set('termo', v)} options={['Sim, já possuo', 'Ainda não, mas posso obter', 'Não sei como funciona']} />
                </Campo>
                <Campo label="Você já acompanhou ou auxiliou na condução de aulas ou atividades físicas?" obrig>
                  <Select value={form.exp_aulas} onChange={v => set('exp_aulas', v)} options={['Sim, tenho experiência prática com aulas', 'Somente em contexto acadêmico (aulas práticas da faculdade)', 'Ainda não tive essa experiência']} />
                </Campo>
                <div className="botoes">
                  <button className="btn-voltar" onClick={() => irPara(1)}>← Voltar</button>
                  <button className="btn-avancar" onClick={() => irPara(3)}>Continuar →</button>
                </div>
              </div>
            </>
          )}

          {/* ETAPA 3 */}
          {etapa === 3 && (
            <>
              <div className="etapa-num">Etapa 3 de 4</div>
              <h1 className="etapa-titulo">Perfil e Experiência</h1>
              <p className="etapa-desc">Queremos conhecer seu perfil profissional e comportamental.</p>
              <div className="card">
                <Campo label="Você já teve alguma experiência com atendimento ao público?" obrig>
                  <Select value={form.exp_atendimento} onChange={v => set('exp_atendimento', v)} options={['Sim, tenho experiência formal (emprego ou estágio)', 'Sim, de forma informal ou voluntária', 'Não, mas tenho facilidade para atendimento', 'Não tenho experiência com atendimento']} />
                </Campo>
                <Campo label="Você já realizou atividades de cadastro ou registro de informações em sistemas ou planilhas?" obrig>
                  <Select value={form.exp_cadastro} onChange={v => set('exp_cadastro', v)} options={['Sim, com frequência', 'Sim, algumas vezes', 'Nunca fiz, mas me adaptaria facilmente']} />
                </Campo>
                <Campo label="Como você se descreveria em uma situação de atendimento a um cliente insatisfeito ou impaciente?" obrig>
                  <Select value={form.perfil_atendimento} onChange={v => set('perfil_atendimento', v)} options={['Mantenho a calma e busco resolver com empatia', 'Fico um pouco desconfortável, mas consigo lidar', 'Prefiro acionar outra pessoa para resolver', 'Ainda não passei por essa situação']} />
                </Campo>
                <Campo label="Quando você tem várias tarefas ao mesmo tempo, como costuma organizar suas prioridades?" obrig>
                  <textarea className="campo-textarea" value={form.organizacao} onChange={e => set('organizacao', e.target.value)} placeholder="Descreva brevemente como você se organiza..." />
                </Campo>
                <Campo label="De 1 a 5, como você avalia sua facilidade de comunicação com pessoas desconhecidas?" obrig>
                  <Select value={form.comunicacao} onChange={v => set('comunicacao', v)} options={['1 — Muito difícil', '2 — Difícil', '3 — Razoável', '4 — Fácil', '5 — Muito fácil']} />
                </Campo>
                <Campo label="Você se considera uma pessoa pontual e comprometida com horários?" obrig>
                  <Select value={form.pontualidade} onChange={v => set('pontualidade', v)} options={['Sim, sou muito pontual', 'Na maioria das vezes sim', 'Tenho dificuldades com pontualidade']} />
                </Campo>
                <div className="botoes">
                  <button className="btn-voltar" onClick={() => irPara(2)}>← Voltar</button>
                  <button className="btn-avancar" onClick={() => irPara(4)}>Continuar →</button>
                </div>
              </div>
            </>
          )}

          {/* ETAPA 4 */}
          {etapa === 4 && (
            <>
              <div className="etapa-num">Etapa 4 de 4</div>
              <h1 className="etapa-titulo">Disponibilidade e Motivação</h1>
              <p className="etapa-desc">Últimas informações antes de concluir sua inscrição.</p>
              <div className="card">
                <Campo label="Os horários da vaga são: manhã das 06h às 09h e tarde/noite das 17h às 21h, de segunda a sexta. Você tem disponibilidade para esses dois turnos?" obrig>
                  <Select value={form.disponibilidade_horario} onChange={v => set('disponibilidade_horario', v)} options={['Sim, tenho disponibilidade para os dois turnos', 'Tenho disponibilidade parcial (apenas um turno)', 'Não tenho disponibilidade para esses horários']} />
                </Campo>
                <Campo label="Qual é a sua disponibilidade de início?" obrig>
                  <Select value={form.disponibilidade_inicio} onChange={v => set('disponibilidade_inicio', v)} options={['Imediata', 'Em até 15 dias', 'Em até 30 dias', 'Mais de 30 dias']} />
                </Campo>
                <Campo label="Qual área dentro da Educação Física mais desperta seu interesse profissional?" obrig>
                  <Select value={form.area_interesse} onChange={v => set('area_interesse', v)} options={['Academia e musculação', 'Esportes coletivos', 'Saúde e qualidade de vida', 'Reabilitação e fisioterapia esportiva', 'Educação escolar', 'Ainda estou descobrindo']} />
                </Campo>
                <Campo label="Você pratica alguma atividade física regularmente?" obrig>
                  <Select value={form.pratica_atividade} onChange={v => set('pratica_atividade', v)} options={['Sim, pratico regularmente', 'Sim, mas de forma irregular', 'Não pratico atualmente']} />
                </Campo>
                <Campo label="O que motivou você a se candidatar para esta vaga?" obrig>
                  <textarea className="campo-textarea" value={form.motivacao} onChange={e => set('motivacao', e.target.value)} placeholder="Conte um pouco sobre sua motivação..." />
                </Campo>
                <Campo label="Há algo que gostaria de acrescentar sobre sua candidatura?">
                  <textarea className="campo-textarea" value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Campo opcional. Sinta-se à vontade para complementar..." />
                </Campo>
                {erroEnvio && <p className="erro-msg">{erroEnvio}</p>}
                <div className="botoes">
                  <button className="btn-voltar" onClick={() => irPara(3)}>← Voltar</button>
                  <button className="btn-avancar" onClick={enviar} disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar questionário'}</button>
                </div>
              </div>
            </>
          )}

          {/* PASSOS */}
          <div className="passos">
            {passosCfg.map(p => {
              const concluido = p.n < etapa;
              const ativo = p.n === etapa;
              return (
                <div key={p.n} className={`passo ${ativo ? 'passo-ativo' : ''} ${concluido ? 'passo-concluido' : ''}`}>
                  <div className={`passo-circulo ${ativo ? 'passo-circulo-ativo' : ''} ${concluido ? 'passo-circulo-concluido' : ''}`}>
                    {concluido ? '✓' : p.n}
                  </div>
                  <span className="passo-label">{p.label}</span>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </>
  );
}
