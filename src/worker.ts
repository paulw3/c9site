// Serves the static site for every route except /api/contact, which this
// handles directly: validates the submission, emails it to contact@c9ine.com
// via Resend, and responds either as JSON (the JS-enhanced form) or a
// redirect with a status query param (the plain-HTML fallback for no-JS).
export interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
}

const CONTACT_PATH = '/api/contact';
const TO_EMAIL = 'contact@c9ine.com';
const FROM_EMAIL = 'C-9INE Website <contact@c9ine.com>';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === CONTACT_PATH) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleContact(request, env);
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
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New contact form submission from ${name}`,
        text: bodyLines.join('\n'),
      }),
    });

    if (!res.ok) {
      console.error('Resend API error', res.status, await res.text());
      return respond(wantsJson, origin, locale, false, 502);
    }
  } catch (err) {
    console.error('Resend request failed', err);
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
