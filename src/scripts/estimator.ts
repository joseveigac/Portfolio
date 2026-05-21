declare global {
    interface Window {
        turnstile?: { reset: (widget?: string | HTMLElement) => void };
    }
}

type Mode = 'idle' | 'sending' | 'success' | 'error';

function formatPrice(n: number) {
    return `€${n.toLocaleString('en-US')}`;
}

export function setupEstimator(root: HTMLElement) {
    if (root.dataset.estimatorInit === 'true') return;
    root.dataset.estimatorInit = 'true';

    const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
    const STR = {
        en: {
            noAddons: 'No add-ons', iPublish: 'I publish myself',
            sendBrief: 'Send brief →', sending: 'Sending…',
            errName: 'Please enter your name.', errEmail: 'Please enter a valid email address.',
            errNetwork: 'Network error — check your connection and try again.',
            errInvalid: 'Some fields look invalid. Please review the form and try again.',
            errCaptcha: 'Please complete the verification and try again.',
            errSendFailed: "Couldn't deliver the email right now. Use the link below to email me directly.",
            errGeneric: "Couldn't send. Try again, or email me directly.",
            mailHi: 'Hi Jose,', mailIntro: (s: string) => `I'd like to discuss a ${s} project.`,
            mailVersion: 'Bedrock version:', mailScale: 'Scale:', mailAddons: 'Add-ons:', mailNone: 'none',
            mailPublishing: 'Publishing:', mailRush: 'Rush:', mailYes: 'yes', mailNo: 'no',
            mailRange: 'Indicative range:', mailName: 'Name:', mailCompany: 'Company:',
            mailDeadline: 'Target deadline:', mailNotes: 'Notes:', mailSubject: (s: string) => `Project brief – ${s}`,
        },
        es: {
            noAddons: 'Sin extras', iPublish: 'Publico yo mismo',
            sendBrief: 'Enviar brief →', sending: 'Enviando…',
            errName: 'Introduce tu nombre.', errEmail: 'Introduce un email válido.',
            errNetwork: 'Error de red — comprueba tu conexión e inténtalo de nuevo.',
            errInvalid: 'Algunos campos no parecen válidos. Revisa el formulario e inténtalo de nuevo.',
            errCaptcha: 'Completa la verificación e inténtalo de nuevo.',
            errSendFailed: 'No se pudo enviar el email ahora mismo. Usa el enlace de abajo para escribirme directamente.',
            errGeneric: 'No se pudo enviar. Inténtalo de nuevo o escríbeme directamente.',
            mailHi: 'Hola Jose,', mailIntro: (s: string) => `Me gustaría hablar de un proyecto de ${s}.`,
            mailVersion: 'Versión de Bedrock:', mailScale: 'Escala:', mailAddons: 'Add-ons:', mailNone: 'ninguno',
            mailPublishing: 'Publicación:', mailRush: 'Exprés:', mailYes: 'sí', mailNo: 'no',
            mailRange: 'Rango orientativo:', mailName: 'Nombre:', mailCompany: 'Empresa:',
            mailDeadline: 'Fecha límite:', mailNotes: 'Notas:', mailSubject: (s: string) => `Brief de proyecto – ${s}`,
        },
    }[lang];

    const form = root.querySelector<HTMLFormElement>('[data-estimator-form]');
    const successEl = root.querySelector<HTMLElement>('[data-estimator-success]');
    if (!form || !successEl) return;

    const cartScale = form.querySelector<HTMLElement>('[data-cart-scale]');
    const cartTimeline = form.querySelector<HTMLElement>('[data-cart-timeline]');
    const cartScope = form.querySelector<HTMLElement>('[data-cart-scope]');
    const cartVersion = form.querySelector<HTMLElement>('[data-cart-version]');
    const cartPublishing = form.querySelector<HTMLElement>('[data-cart-publishing]');
    const versionSelect = form.querySelector<HTMLSelectElement>('[data-version-select]');
    const rangeMinEl = form.querySelector<HTMLElement>('[data-range-min]');
    const rangeMaxEl = form.querySelector<HTMLElement>('[data-range-max]');
    const rushTag = form.querySelector<HTMLElement>('[data-rush-tag]');
    const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit]');
    const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
    const messageEl = form.querySelector<HTMLElement>('[data-form-message]');
    const mailtoEl = form.querySelector<HTMLAnchorElement>('[data-mailto-fallback]');
    const successEmail = successEl.querySelector<HTMLElement>('[data-success-email]');
    const resetBtn = successEl.querySelector<HTMLButtonElement>('[data-reset]');

    if (!cartScale || !cartTimeline || !cartScope || !rangeMinEl || !rangeMaxEl
        || !rushTag || !submitBtn || !submitLabel || !messageEl || !mailtoEl
        || !successEmail || !resetBtn) return;

    const rushMultiplier = Number(form.dataset.rushMultiplier) || 1.3;
    const serviceLabel = form.dataset.serviceLabel ?? 'project';

    let lastRangeText = '';

    function recalc() {
        let min = 0;
        let max = 0;

        const scaleInput = form!.querySelector<HTMLInputElement>('input[name="scale"]:checked');
        if (scaleInput) {
            min += Number(scaleInput.dataset.min) || 0;
            max += Number(scaleInput.dataset.max) || 0;
        }
        cartScale!.textContent = scaleInput?.dataset.label ?? '—';
        cartTimeline!.textContent = scaleInput?.dataset.timeline ?? '—';

        if (cartVersion && versionSelect) {
            const opt = versionSelect.options[versionSelect.selectedIndex];
            cartVersion.textContent = opt?.dataset.label ?? opt?.text ?? '—';
        }

        const checkedToggles = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="toggle"]:checked'));
        checkedToggles.forEach(t => {
            min += Number(t.dataset.min) || 0;
            max += Number(t.dataset.max) || 0;
        });
        const baseMin = min;
        const baseMax = max;
        checkedToggles.forEach(t => {
            const pctMin = Number(t.dataset.percentMin);
            const pctMax = Number(t.dataset.percentMax);
            const months = Number(t.dataset.months) || 12;
            const minAmount = Number(t.dataset.minAmount) || 0;
            if (pctMin) {
                const contrib = Math.round(baseMin * pctMin / 100 * months / 12);
                min += Math.max(contrib, minAmount);
            }
            if (pctMax) {
                const contrib = Math.round(baseMax * pctMax / 100 * months / 12);
                max += Math.max(contrib, minAmount);
            }
        });
        const scopeLabels = checkedToggles
            .map(t => t.dataset.label ?? '')
            .filter(Boolean);
        cartScope!.textContent = scopeLabels.length > 0 ? scopeLabels.join(' · ') : STR.noAddons;

        const checkedPublishing = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="publishing"]:checked'));
        checkedPublishing.forEach(p => {
            min += Number(p.dataset.min) || 0;
            max += Number(p.dataset.max) || 0;
        });
        if (cartPublishing) {
            const publishingLabels = checkedPublishing
                .map(p => p.dataset.label ?? '')
                .filter(Boolean);
            cartPublishing.textContent = publishingLabels.length > 0 ? publishingLabels.join(' · ') : STR.iPublish;
        }

        const rushInput = form!.querySelector<HTMLInputElement>('input[name="rush"]');
        const rushOn = rushInput?.checked ?? false;
        if (rushOn) {
            min = Math.round(min * rushMultiplier);
            max = Math.round(max * rushMultiplier);
        }
        rushTag!.hidden = !rushOn;

        const minTxt = formatPrice(min);
        const maxTxt = formatPrice(max);
        rangeMinEl!.textContent = minTxt;
        rangeMaxEl!.textContent = maxTxt;
        lastRangeText = `${minTxt} – ${maxTxt}`;
    }

    function buildMailto(): string {
        const scaleInput = form!.querySelector<HTMLInputElement>('input[name="scale"]:checked');
        const scaleLabel = scaleInput?.dataset.label ?? '—';
        const toggleLabels = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="toggle"]:checked'))
            .map(t => t.dataset.label ?? '')
            .filter(Boolean);
        const publishingLabels = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="publishing"]:checked'))
            .map(p => p.dataset.label ?? '')
            .filter(Boolean);
        const rushOn = form!.querySelector<HTMLInputElement>('input[name="rush"]')?.checked ?? false;
        const name = (form!.querySelector<HTMLInputElement>('input[name="name"]')?.value ?? '').trim();
        const companyName = (form!.querySelector<HTMLInputElement>('input[name="company-name"]')?.value ?? '').trim();
        const deadline = (form!.querySelector<HTMLInputElement>('input[name="deadline"]')?.value ?? '').trim();
        const notes = (form!.querySelector<HTMLTextAreaElement>('textarea[name="notes"]')?.value ?? '').trim();

        const versionOpt = versionSelect?.options[versionSelect.selectedIndex];
        const versionLabel = versionOpt?.dataset.label ?? versionOpt?.text ?? '';

        const lines = [
            STR.mailHi,
            ``,
            STR.mailIntro(serviceLabel),
            ``,
        ];
        if (versionLabel) lines.push(`${STR.mailVersion} ${versionLabel}`);
        lines.push(
            `${STR.mailScale} ${scaleLabel}`,
            `${STR.mailAddons} ${toggleLabels.length ? toggleLabels.join(', ') : STR.mailNone}`,
            `${STR.mailPublishing} ${publishingLabels.length ? publishingLabels.join(', ') : STR.iPublish}`,
            `${STR.mailRush} ${rushOn ? STR.mailYes : STR.mailNo}`,
            `${STR.mailRange} ${lastRangeText} + IVA`,
        );
        if (name) lines.push(`${STR.mailName} ${name}`);
        if (companyName) lines.push(`${STR.mailCompany} ${companyName}`);
        if (deadline) lines.push(`${STR.mailDeadline} ${deadline}`);
        if (notes) {
            lines.push(``, STR.mailNotes, notes);
        }
        const subject = STR.mailSubject(serviceLabel);
        const body = lines.join('\n');
        return `mailto:contact@joseveiga.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function setMode(mode: Mode, text?: string) {
        switch (mode) {
            case 'idle':
                submitBtn!.disabled = false;
                submitLabel!.textContent = STR.sendBrief;
                messageEl!.hidden = true;
                mailtoEl!.hidden = true;
                break;
            case 'sending':
                submitBtn!.disabled = true;
                submitLabel!.textContent = STR.sending;
                messageEl!.hidden = true;
                mailtoEl!.hidden = true;
                break;
            case 'success':
                submitBtn!.disabled = false;
                submitLabel!.textContent = STR.sendBrief;
                messageEl!.hidden = true;
                mailtoEl!.hidden = true;
                form!.hidden = true;
                successEl!.hidden = false;
                break;
            case 'error':
                submitBtn!.disabled = false;
                submitLabel!.textContent = STR.sendBrief;
                messageEl!.hidden = false;
                messageEl!.className = 'text-[12px] font-sans text-center mt-3 text-red-400';
                messageEl!.textContent = text ?? STR.errGeneric;
                mailtoEl!.href = buildMailto();
                mailtoEl!.hidden = false;
                break;
        }
    }

    form.addEventListener('input', recalc);
    form.addEventListener('change', recalc);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const honeypot = form!.querySelector<HTMLInputElement>('input[name="website"]');
        if (honeypot?.value) {
            successEmail!.textContent = '';
            form!.hidden = true;
            successEl!.hidden = false;
            return;
        }

        const nameInput = form!.querySelector<HTMLInputElement>('input[name="name"]');
        const name = (nameInput?.value ?? '').trim();
        if (name.length < 2) {
            nameInput?.focus();
            setMode('error', STR.errName);
            return;
        }

        const emailInput = form!.querySelector<HTMLInputElement>('input[name="email"]');
        const email = (emailInput?.value ?? '').trim();
        if (!email || !email.includes('@')) {
            emailInput?.focus();
            setMode('error', STR.errEmail);
            return;
        }

        const scaleInput = form!.querySelector<HTMLInputElement>('input[name="scale"]:checked');
        const toggles = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="toggle"]:checked'))
            .map(t => t.value);
        const publishing = Array.from(form!.querySelectorAll<HTMLInputElement>('input[name="publishing"]:checked'))
            .map(p => p.value);
        const rushInput = form!.querySelector<HTMLInputElement>('input[name="rush"]');
        const notes = (form!.querySelector<HTMLTextAreaElement>('textarea[name="notes"]')?.value ?? '').trim();
        const companyName = (form!.querySelector<HTMLInputElement>('input[name="company-name"]')?.value ?? '').trim();
        const deadline = (form!.querySelector<HTMLInputElement>('input[name="deadline"]')?.value ?? '').trim();
        const turnstileToken = form!.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ?? '';

        const payload = {
            lang,
            service: form!.dataset.service,
            scale: scaleInput?.value ?? '',
            toggles,
            publishing,
            rush: rushInput?.checked ?? false,
            name,
            email,
            company: companyName,
            deadline,
            notes,
            website: honeypot?.value ?? '',
            version: versionSelect?.value ?? '',
            turnstileToken,
        };

        setMode('sending');

        let res: Response;
        try {
            res = await fetch('/api/brief', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch {
            setMode('error', STR.errNetwork);
            return;
        }

        if (res.ok) {
            successEmail!.textContent = email;
            setMode('success');
            return;
        }

        let code = '';
        try {
            const body = await res.json();
            code = typeof body?.error === 'string' ? body.error : '';
        } catch {}

        const message =
            code === 'captcha'
                ? STR.errCaptcha
                : code === 'invalid' || code === 'bad_json'
                    ? STR.errInvalid
                    : code === 'send_failed'
                        ? STR.errSendFailed
                        : STR.errGeneric;
        window.turnstile?.reset();
        setMode('error', message);
    });

    resetBtn.addEventListener('click', () => {
        form!.reset();
        window.turnstile?.reset();
        form!.hidden = false;
        successEl!.hidden = true;
        setMode('idle');
        recalc();
    });

    recalc();
}

export function initAllEstimators() {
    document.querySelectorAll<HTMLElement>('[data-estimator-root]').forEach(setupEstimator);
}
