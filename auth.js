(() => {
  const trigger = document.querySelector('.link_icon__login');
  const userIcon = document.querySelector('.auth-user');
  const logout = document.querySelector('.auth-logout');
  const logoutMessage = document.querySelector('.auth-logout-message');
  const dialog = document.querySelector('#auth-dialog');
  const form = dialog.querySelector('form');
  const message = dialog.querySelector('.auth-message');
  const submit = dialog.querySelector('.auth-submit');
  const switchButton = dialog.querySelector('.auth-switch');
  let mode = 'login';
  let busy = false;
  let previousFocus;
  let requestId = 0;

  function setAuthenticated(authenticated) {
    trigger.hidden = authenticated;
    logout.hidden = !authenticated;
    userIcon.hidden = !authenticated;
    logoutMessage.hidden = true;
    logoutMessage.textContent = '';
  }
  logout.addEventListener('click', async () => {
    if (logout.disabled) return;
    ++requestId;
    logout.disabled = true;
    logout.setAttribute('aria-label', 'Saindo...');
    logout.setAttribute('aria-busy', 'true');
    logoutMessage.hidden = true;
    const result = await request('logout', {});
    logout.disabled = false;
    logout.setAttribute('aria-label', 'Sair da conta');
    logout.removeAttribute('aria-busy');
    if (result.error) {
      logoutMessage.textContent = result.error;
      logoutMessage.hidden = false;
      return;
    }
    setAuthenticated(false);
    trigger.focus({ preventScroll: true });
  });
  function showMessage(text, success = false) {
    message.textContent = text;
    message.dataset.success = String(success);
  }
  function setMode(nextMode, email = '') {
    mode = nextMode;
    form.reset();
    form.elements.email.value = email;
    const register = mode === 'register';
    dialog.classList.toggle('auth-dialog--register', register);
    dialog.querySelector('#auth-title').textContent = register ? 'Faça seu cadastro' : 'Faça seu Login';
    dialog.querySelector('#auth-text').textContent = register ? 'Seja bem-vindo! Crie sua conta' : 'Seja bem-vindo! Acesse sua conta';
    submit.textContent = register ? 'Cadastrar' : 'Entrar';
    dialog.querySelector('.auth-switch-text').textContent = register ? 'Já possui uma conta? ' : 'Não possui uma conta? ';
    switchButton.textContent = register ? 'Faça login' : 'Cadastre-se';
    for (const group of dialog.querySelectorAll('[data-register]')) {
      group.hidden = !register;
      group.querySelector('input').disabled = !register;
      group.querySelector('input').required = register;
    }
    form.elements.password.autocomplete = register ? 'new-password' : 'current-password';
    showMessage('');
    if (dialog.open) form.elements[register ? 'name' : 'email'].focus();
  }
  async function request(route, body) {
    try {
      const response = await fetch(`/api/${route}`, {
        method: body ? 'POST' : 'GET', credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(10000)
      });
      const data = await response.json();
      if (!response.ok) return { error: data.message || 'Não foi possível concluir. Tente novamente.' };
      return data;
    } catch {
      return { error: 'Não foi possível conectar ao servidor. Confira se o backend está iniciado e tente novamente.' };
    }
  }
  // Captura antes do manipulador de rolagem existente (que trata href="#").
  trigger.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    previousFocus = document.activeElement;
    setMode('login');
    dialog.showModal();
    form.elements.email.focus();
  }, true);
  dialog.querySelector('.auth-close').addEventListener('click', () => dialog.close());
  let backdropDown = false;
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => { if (backdropDown && event.target === dialog && outside(event)) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('close', () => {
    form.reset();
    const target = trigger.hidden ? document.querySelector('.link_icon__agenda') : previousFocus;
    target?.focus({ preventScroll: true });
  });
  switchButton.addEventListener('click', () => { if (!busy) setMode(mode === 'login' ? 'register' : 'login'); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const data = Object.fromEntries(new FormData(form));
    data.email = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return showMessage('Informe um e-mail válido.');
    if (mode === 'register' && !data.name.trim()) return showMessage('Informe seu nome completo.');
    if (mode === 'register' && data.password !== data.confirmPassword) return showMessage('As senhas não coincidem.');
    busy = true;
    submit.disabled = switchButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showMessage('Aguarde...');
    const action = mode;
    ++requestId; // Uma consulta inicial antiga nao deve sobrescrever um login novo.
    const result = await request(action, data);
    busy = false;
    submit.disabled = switchButton.disabled = false;
    form.removeAttribute('aria-busy');
    if (result.error) return showMessage(result.error);
    if (action === 'register') {
      setMode('login', data.email);
      showMessage(result.message, true);
    } else {
      window.location.assign('/portal-adm');
    }
  });
  async function refreshSession() {
    const id = ++requestId;
    const result = await request('session');
    if (id !== requestId || result.error) return;
    if (result.authenticated) {
        window.location.replace('/portal-adm');
    } else {
      setAuthenticated(false);
    }
  } 
    setMode('login');
  refreshSession();
})();
