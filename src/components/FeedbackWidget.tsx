import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { navigate } from '../lib/router';
import { colorFor, fetchComments, MEMBERS, type Comment } from '../lib/feedback';

const NAME_KEY = 'edw_fb_name';

function timeAgo(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'sad';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

/** Floating "Komentar" + modal: thread komentara za TRENUTNI ekran (svi vide sve),
 *  svaka osoba u svojoj boji. Svaki ekran = zaseban thread. */
export function FeedbackWidget({ screen, screenLabel }: { screen: string; screenLabel: string }) {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<Comment[]>([]);
  const [name, setName] = useState<string>(() => localStorage.getItem(NAME_KEY) || '');
  const [otherName, setOtherName] = useState('');
  const [where, setWhere] = useState('');
  const [comment, setComment] = useState('');
  const [state, setState] = useState<'idle' | 'slanje' | 'ok' | 'err'>('idle');

  const load = useCallback(() => {
    fetchComments().then(setAll).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load, screen]);

  useEffect(() => {
    if (open) {
      setWhere(screenLabel);
      setState('idle');
    }
  }, [open, screenLabel]);

  const thread = all.filter((c) => c.screen === screen).sort((a, b) => a.ts - b.ts);
  const isOther = name === '__other__';
  const finalName = (isOther ? otherName : name).trim();

  async function submit() {
    if (!finalName || !comment.trim()) return;
    setState('slanje');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: finalName, screen, where: where.trim(), comment: comment.trim() }),
      });
      if (!res.ok) throw new Error('http ' + res.status);
      localStorage.setItem(NAME_KEY, isOther ? '__other__' : name);
      setComment('');
      setState('ok');
      load();
      setTimeout(() => setState('idle'), 1800);
    } catch {
      setState('err');
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-20 right-3 z-30 flex items-center gap-1.5 rounded-pill bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-navy-deep"
      >
        💬 Komentari
        {thread.length > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-orange px-1 text-xs">{thread.length}</span>
        )}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy/30 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
            <div
              className="flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-card bg-surface shadow-card sm:rounded-card animate-riseIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-hairline px-5 py-4">
                <div>
                  <p className="eyebrow">Thread · {screenLabel}</p>
                  <h3 className="mt-1 text-lg font-semibold text-navy">Komentari na ovom ekranu</h3>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Zatvori" className="grid h-8 w-8 place-items-center rounded-pill text-muted hover:bg-navy/5">✕</button>
              </div>

              {/* Thread (svi vide sve) */}
              <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
                {thread.length === 0 && <p className="py-4 text-center text-sm text-muted">Još nema komentara na ovom ekranu. Budi prvi/a 👇</p>}
                {thread.map((c) => {
                  const col = colorFor(c.name);
                  return (
                    <div key={c.id} className="rounded-2xl p-3" style={{ background: col.tint, borderLeft: `3px solid ${col.accent}` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: col.accent }}>{c.name}</span>
                        <span className="text-xs text-muted">{timeAgo(c.ts)}</span>
                      </div>
                      {c.where && c.where !== screenLabel && <p className="mt-0.5 text-xs text-muted">na: {c.where}</p>}
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-navy-ink">{c.comment}</p>
                    </div>
                  );
                })}
              </div>

              {/* Dodaj komentar */}
              <div className="border-t border-hairline px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {MEMBERS.map((m) => {
                    const col = colorFor(m);
                    const sel = name === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setName(m)}
                        className="rounded-pill border px-3 py-1 text-sm font-semibold transition"
                        style={sel ? { background: col.accent, borderColor: col.accent, color: '#fff' } : { borderColor: '#dce5ef', color: col.accent }}
                      >
                        {m}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setName('__other__')}
                    className={`rounded-pill border px-3 py-1 text-sm font-semibold transition ${isOther ? 'border-navy bg-navy text-white' : 'border-chipline text-navy'}`}
                  >
                    Drugo
                  </button>
                </div>
                {isOther && (
                  <input value={otherName} onChange={(e) => setOtherName(e.target.value)} placeholder="Tvoje ime"
                    className="mt-2 w-full rounded-2xl border border-chipline bg-page px-3 py-2 text-sm text-navy-ink outline-none focus:border-navy/40" />
                )}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder={`Komentar na "${screenLabel}"…`}
                  className="mt-2 w-full resize-none rounded-2xl border border-chipline bg-page px-3 py-2 text-sm text-navy-ink outline-none focus:border-navy/40"
                />
                {state === 'err' && <p className="mt-1 text-xs font-semibold text-red-600">Greška — pokušaj ponovno.</p>}
                {state === 'ok' && <p className="mt-1 text-xs font-semibold text-green-600">✓ Spremljeno</p>}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={submit}
                    disabled={!finalName || !comment.trim() || state === 'slanje'}
                    className="flex-1 rounded-pill bg-orange py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
                  >
                    {state === 'slanje' ? 'Šaljem…' : 'Pošalji'}
                  </button>
                  <button onClick={() => navigate('/feedback')} className="rounded-pill bg-chip px-4 py-2.5 text-sm font-semibold text-navy">
                    Svi
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
