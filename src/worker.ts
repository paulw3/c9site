// Serves the static site for every route except /api/contact, which this
// handles directly: validates the submission, emails it to contact@c9ine.com
// via Cloudflare's own Email Service (the `EMAIL` send_email binding below —
// no third-party API, nothing to sign up for beyond Cloudflare itself), and
// responds either as JSON (the JS-enhanced form) or a redirect with a status
// query param (the plain-HTML fallback for no-JS).
export interface Env {
  ASSETS: Fetcher;
  EMAIL: SendEmail;
}

const CONTACT_PATH = '/api/contact';
const TO_EMAIL = 'contact@c9ine.com';
// Email Sending is onboarded on the notify.c9ine.com subdomain, not the
// root domain — keeps its DNS (MX/SPF/DKIM/DMARC) isolated from the root's
// existing records (Google Workspace mail), so the FROM address has to
// live on that subdomain too.
const FROM_EMAIL = 'C-9INE Website <contact@notify.c9ine.com>';

// The previous WordPress site (c9ine.com) has been live for ~2 years and
// has indexed pages/posts with no equivalent URL on the new site. Rather
// than let those hard-404 on cutover (losing whatever search ranking and
// backlinks they've accumulated), 301 them to the closest relevant page.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/asaas-getting-started': '/resources/asaas-getting-started',
  '/asaas-support': '/resources/asaas',
  '/products-and-services': '/resources',
  '/clients': '/about',
  '/articles': '/resources',
  '/quality-assurance-automation-and-ai-revolutionizing-software-development-with-c-9ine-solution':
    '/resources',
  '/digital-transformation-the-journey-from-chaos-to-c-9ine': '/resources',
  '/c-9ines-multi-cloud-accelerator-for-startup-supremacy': '/resources',
  '/why-chaos-engineering-no-longer-optional': '/resources',
  '/the-startup-graveyard': '/resources',
  '/introducing-c-9ine-devops-accelerator': '/resources',
  '/startups-ditch-the-chaos': '/resources',
  '/navigating-the-chaos-maze': '/resources',
  '/how-c-9ine-codegen-engine-supercharges-your-startup': '/resources',
  '/why-technical-smarts-are-your-startups-secret-weapon': '/resources',
  '/branching-out-right': '/resources',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === CONTACT_PATH) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleContact(request, env);
    }

    const normalizedPath = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
    const legacyTarget = LEGACY_REDIRECTS[normalizedPath];
    if (legacyTarget) {
      return Response.redirect(new URL(legacyTarget, url.origin).toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function redirectTarget(origin: string, locale: string, ok: boolean): string {
  const path = locale === 'ar' ? '/ar/contact' : '/contact';
  const target = new URL(path, origin);
  target.searchParams.set(ok ? 'sent' : 'error', '1');
  return target.toString();
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = request.headers.get('Accept')?.includes('application/json') ?? false;
  const origin = new URL(request.url).origin;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(wantsJson, origin, 'en', false, 400);
  }

  const locale = String(form.get('locale') || 'en') === 'ar' ? 'ar' : 'en';

  // Honeypot: real visitors never fill this (it's hidden off-screen), so
  // anything that does is a bot. Respond as if it succeeded rather than
  // telling the bot what tripped it.
  if (String(form.get('website') || '').trim() !== '') {
    return respond(wantsJson, origin, locale, true, 200);
  }

  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const company = String(form.get('company') || '').trim();
  const lookingFor = String(form.get('looking-for') || '').trim();
  const message = String(form.get('message') || '').trim();

  if (!name || !email || !isValidEmail(email)) {
    return respond(wantsJson, origin, locale, false, 400);
  }

  const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    lookingFor ? `Looking for: ${lookingFor}` : null,
    '',
    message || '(no message)',
  ].filter((line): line is string => line !== null);

  try {
    await env.EMAIL.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: bodyLines.join('\n'),
    });
  } catch (err) {
    console.error('Email Service send failed', err);
    return respond(wantsJson, origin, locale, false, 502);
  }

  return respond(wantsJson, origin, locale, true, 200);
}

function respond(wantsJson: boolean, origin: string, locale: string, ok: boolean, status: number): Response {
  if (wantsJson) {
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return Response.redirect(redirectTarget(origin, locale, ok), 303);
}
