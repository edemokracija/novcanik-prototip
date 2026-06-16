// Feedback prototipa — komentari članova UO na pojedini ekran.
// POST /api/feedback  { name, screen, where?, comment }  -> sprema u KV
// GET  /api/feedback                                     -> lista svih komentara (desc)
//
// Bez backenda izvan Pages Functions; KV (FEEDBACK_KV) skuplja centralno sve komentare.

interface Env {
  FEEDBACK_KV: KVNamespace;
}

type Comment = {
  id: string;
  name: string;
  screen: string;
  where?: string;
  comment: string;
  ts: number;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Partial<Comment>;
  try {
    body = (await request.json()) as Partial<Comment>;
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const name = (body.name ?? '').toString().trim().slice(0, 60);
  const screen = (body.screen ?? '').toString().trim().slice(0, 40);
  const where = (body.where ?? '').toString().trim().slice(0, 120);
  const comment = (body.comment ?? '').toString().trim().slice(0, 2000);

  if (!name || !comment) return json({ ok: false, error: 'name i comment su obavezni' }, 400);

  const ts = Date.now();
  const id = `${ts}-${Math.random().toString(36).slice(2, 8)}`;
  const rec: Comment = { id, name, screen, where, comment, ts };
  // Ključ s padded ts za kronološko sortiranje po prefiksu.
  await env.FEEDBACK_KV.put(`fb:${ts}:${id}`, JSON.stringify(rec));
  return json({ ok: true, id });
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const list = await env.FEEDBACK_KV.list({ prefix: 'fb:', limit: 1000 });
  const items: Comment[] = [];
  for (const key of list.keys) {
    const v = await env.FEEDBACK_KV.get(key.name);
    if (v) {
      try {
        items.push(JSON.parse(v) as Comment);
      } catch {
        /* ignore */
      }
    }
  }
  items.sort((a, b) => b.ts - a.ts);
  return json({ ok: true, count: items.length, items });
};
