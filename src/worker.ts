// Serves the static site for every route except /api/contact, which this
// handles directly: validates the submission, emails it to contact@c9ine.com
// via Cloudflare's own Email Service (the `EMAIL` send_email binding below —
// no third-party API, nothing to sign up for beyond Cloudflare itself), and
// responds either as JSON (the JS-enhanced form) or a redirect with a status
// query param (the plain-HTML fallback for no-JS).
export interface Env {
  ASSETS: Fetcher;
  EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
}

const CONTACT_PATH = '/api/contact';
const TO_EMAIL = 'contact@c9ine.com';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// Email Sending is onboarded on the notify.c9ine.com subdomain, not the
// root domain — keeps its DNS (MX/SPF/DKIM/DMARC) isolated from the root's
// existing records (Google Workspace mail), so the FROM address has to
// live on that subdomain too.
const FROM_EMAIL = 'C-9INE Website <contact@notify.c9ine.com>';

// The previous WordPress site (c9ine.com) has been live for ~2 years and
// has indexed pages/posts with no equivalent URL on the new site. Rather
// than let those hard-404 on cutover (losing whatever search ranking and
// backlinks they've accumulated), 301 them to the closest relevant page.
//
// Also covers this site's own "Resources" section, renamed to "Products"
// (page files, nav, everything) after it had already been live — so its
// old /resources* URLs get the same treatment as the WordPress ones,
// rather than hard-404ing anyone with an old link or bookmark.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/asaas-getting-started': '/products/asaas-getting-started',
  '/asaas-support': '/products/asaas',
  '/products-and-services': '/products',
  '/clients': '/about',
  '/articles': '/products',
  '/quality-assurance-automation-and-ai-revolutionizing-software-development-with-c-9ine-solution':
    '/products',
  '/digital-transformation-the-journey-from-chaos-to-c-9ine': '/products',
  '/c-9ines-multi-cloud-accelerator-for-startup-supremacy': '/products',
  '/why-chaos-engineering-no-longer-optional': '/products',
  '/the-startup-graveyard': '/products',
  '/introducing-c-9ine-devops-accelerator': '/products',
  '/startups-ditch-the-chaos': '/products',
  '/navigating-the-chaos-maze': '/products',
  '/how-c-9ine-codegen-engine-supercharges-your-startup': '/products',
  '/why-technical-smarts-are-your-startups-secret-weapon': '/products',
  '/branching-out-right': '/products',
  '/resources': '/products',
  '/resources/anfaa': '/products/anfaa',
  '/resources/asaas': '/products/asaas',
  '/resources/asaas-getting-started': '/products/asaas-getting-started',
  '/ar/resources': '/ar/products',
  '/ar/resources/anfaa': '/ar/products/anfaa',
  '/ar/resources/asaas': '/ar/products/asaas',
  '/ar/resources/asaas-getting-started': '/ar/products/asaas-getting-started',
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

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification request failed', err);
    return false;
  }
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

  // Turnstile: catches the bots sophisticated enough to skip the honeypot
  // and fill the real fields out properly. Unlike the honeypot, a failure
  // here is a genuine error response — a human whose token expired or
  // failed just needs to retry, not be quietly let through.
  const turnstileToken = String(form.get('cf-turnstile-response') || '').trim();
  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP')
  );
  if (!turnstileOk) {
    return respond(wantsJson, origin, locale, false, 400);
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
