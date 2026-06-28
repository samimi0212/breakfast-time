import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type GameState = "register" | "start" | "play" | "over";

interface ScoreEntry {
  prenom: string;
  score: number;
  rank?: number;
}

const GROUND_Y = 300;
const CANVAS_W = 660;
const CANVAS_H = 360;
const ITEMS = ["🥐", "🥚", "🥯", "🧁", "🥞", "🍓", "🍞"];
const OBSTACLES = ["🍴", "🔪"];
const BEST_KEY = "bt_jeu_best";

interface Float {
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
  size: number;
}

function makeGame(best = 0) {
  return {
    frame: 0,
    speed: 3,
    score: 0,
    lives: 3,
    best,
    combo: 0,
    comboTimer: 0,
    shieldTimer: 0,
    invuln: 0,
    shake: 0,
    flash: 0,
    flashColor: "255,255,255",
    spawnTimer: 0,
    bgX: 0,
    player: { x: 80, y: GROUND_Y - 50, w: 40, h: 50, vy: 0, jumps: 0, onGround: false },
    platforms: [
      { x: 180, y: GROUND_Y - 90, w: 100, h: 18, color: "#D4A574" },
      { x: 350, y: GROUND_Y - 140, w: 110, h: 18, color: "#E8C49A" },
      { x: 530, y: GROUND_Y - 80, w: 90, h: 18, color: "#D4A574" },
    ] as { x: number; y: number; w: number; h: number; color: string }[],
    collectibles: [] as { x: number; y: number; emoji: string; collected: boolean }[],
    obstacles: [] as { x: number; y: number; w: number; h: number; emoji: string; dead: boolean }[],
    powerups: [] as { x: number; y: number; taken: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    floats: [] as Float[],
    clouds: [{ x: 100, y: 40, s: 1 }, { x: 300, y: 70, s: 0.8 }, { x: 550, y: 30, s: 1.2 }],
  };
}

type Game = ReturnType<typeof makeGame>;

function rectOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnParticles(g: Game, x: number, y: number, color: string, n: number) {
  for (let i = 0; i < n; i++) {
    g.particles.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1, life: 1, color });
  }
}

function addFloat(g: Game, x: number, y: number, text: string, color: string, size = 18) {
  g.floats.push({ x, y, vy: -1, life: 1, text, color, size });
}

function spawnPlatform(g: Game) {
  const lastX = g.platforms.length ? g.platforms[g.platforms.length - 1].x : CANVAS_W;
  const gapX = 140 + Math.random() * 80;
  const newX = Math.max(lastX, CANVAS_W) + gapX;
  const newY = GROUND_Y - 70 - Math.random() * 100;
  const pw = 80 + Math.random() * 50;
  g.platforms.push({ x: newX, y: newY, w: pw, h: 18, color: Math.random() > 0.5 ? "#D4A574" : "#E8C49A" });
  if (Math.random() < 0.6) {
    g.collectibles.push({ x: newX + 20 + Math.random() * 30, y: newY - 35, emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)], collected: false });
  }
  // Power-up café (bouclier) — rare, en l'air, à portée de double saut
  if (Math.random() < 0.07) {
    g.powerups.push({ x: newX + pw / 2, y: GROUND_Y - 130 - Math.random() * 40, taken: false });
  }
}

function tickGame(g: Game): { died: boolean } {
  g.frame++;
  g.bgX -= g.speed * 0.3;
  g.speed = Math.min(8.5, 3 + g.score * 0.0025);

  // timers
  if (g.shieldTimer > 0) g.shieldTimer--;
  if (g.invuln > 0) g.invuln--;
  if (g.shake > 0) g.shake *= 0.85;
  if (g.flash > 0) g.flash -= 0.06;
  if (g.comboTimer > 0) {
    g.comboTimer--;
    if (g.comboTimer === 0) g.combo = 0;
  }

  const p = g.player;
  p.vy += 0.6;
  p.y += p.vy;
  p.onGround = false;

  if (p.y + p.h >= GROUND_Y) {
    p.y = GROUND_Y - p.h;
    p.vy = 0;
    p.jumps = 0;
    p.onGround = true;
  }

  for (const pl of g.platforms) {
    pl.x -= g.speed;
    if (p.vy > 0 && p.y + p.h <= pl.y + 8 && p.y + p.h + p.vy >= pl.y && p.x + p.w > pl.x + 5 && p.x < pl.x + pl.w - 5) {
      p.y = pl.y - p.h;
      p.vy = 0;
      p.jumps = 0;
      p.onGround = true;
    }
  }
  g.platforms = g.platforms.filter((pl) => pl.x + pl.w > -20);

  g.spawnTimer++;
  if (g.spawnTimer > Math.max(38, 80 - g.score * 0.05)) {
    g.spawnTimer = 0;
    spawnPlatform(g);
    if (Math.random() < 0.35 + g.score * 0.0006) {
      // ~30% des obstacles volent en hauteur (il faut rester au sol / ne pas sauter)
      const fly = Math.random() < 0.3;
      const oy = fly ? GROUND_Y - 95 : GROUND_Y - 42;
      g.obstacles.push({ x: CANVAS_W + 20, y: oy, w: 34, h: 38, emoji: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)], dead: false });
    }
  }

  // collectibles
  for (const c of g.collectibles) {
    c.x -= g.speed;
    if (!c.collected && rectOverlap(p.x + 4, p.y + 4, p.w - 8, p.h - 8, c.x - 15, c.y - 15, 30, 30)) {
      c.collected = true;
      g.combo = Math.min(8, g.combo + 1);
      g.comboTimer = 110;
      const pts = 10 * Math.max(1, g.combo);
      g.score += pts;
      addFloat(g, c.x, c.y - 18, `+${pts}`, "#FF8C00", g.combo >= 2 ? 22 : 18);
      spawnParticles(g, c.x, c.y, "#FFD700", 8);
    }
  }
  g.collectibles = g.collectibles.filter((c) => c.x > -30 && !c.collected);

  // power-ups (café = bouclier)
  for (const pu of g.powerups) {
    pu.x -= g.speed;
    if (!pu.taken && rectOverlap(p.x, p.y, p.w, p.h, pu.x - 18, pu.y - 18, 36, 36)) {
      pu.taken = true;
      g.shieldTimer = 320;
      g.flash = 0.5;
      g.flashColor = "212,165,116";
      addFloat(g, pu.x, pu.y - 20, "BOUCLIER ☕", "#8B4513", 20);
      spawnParticles(g, pu.x, pu.y, "#D4A574", 14);
    }
  }
  g.powerups = g.powerups.filter((pu) => pu.x > -30 && !pu.taken);

  // obstacles
  for (const o of g.obstacles) {
    o.x -= g.speed;
    if (!o.dead && rectOverlap(p.x + 6, p.y + 6, p.w - 12, p.h - 12, o.x - 12, o.y - 10, o.w, o.h)) {
      if (g.shieldTimer > 0) {
        o.dead = true;
        g.score += 5;
        addFloat(g, o.x, o.y - 12, "+5", "#8B4513", 16);
        spawnParticles(g, o.x, o.y, "#D4A574", 10);
      } else if (g.invuln > 0) {
        o.dead = true;
      } else {
        o.dead = true;
        g.lives--;
        g.combo = 0;
        g.invuln = 75;
        g.shake = 12;
        g.flash = 0.6;
        g.flashColor = "226,75,74";
        spawnParticles(g, p.x + p.w / 2, p.y + p.h / 2, "#E24B4A", 14);
      }
    }
  }
  g.obstacles = g.obstacles.filter((o) => o.x > -50 && !o.dead);

  // particles & floats
  for (const pt of g.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life -= 0.05; }
  g.particles = g.particles.filter((pt) => pt.life > 0);
  for (const f of g.floats) { f.y += f.vy; f.life -= 0.02; }
  g.floats = g.floats.filter((f) => f.life > 0);

  for (const c of g.clouds) { c.x -= g.speed * 0.1; if (c.x < -120) c.x = CANVAS_W + 80; }

  g.score += 0.05;
  return { died: g.lives <= 0 };
}

function drawWorld(ctx: CanvasRenderingContext2D, g: Game) {
  const W = CANVAS_W, H = CANVAS_H;

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#FFECD2");
  grad.addColorStop(1, "#FCB69F");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // clouds
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (const c of g.clouds) {
    for (const [dx, dy, r] of [[0, 0, 30], [22, 0, 24], [-18, 0, 22], [8, -14, 20], [-8, -12, 18]] as [number, number, number][]) {
      ctx.beginPath(); ctx.arc(c.x + dx * c.s, c.y + dy * c.s, r * c.s, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ground
  ctx.fillStyle = "#8B6914"; ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = "#5D8A3C"; ctx.fillRect(0, GROUND_Y, W, 10);
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = "#4A7A2C";
    ctx.beginPath();
    ctx.arc(i * 36 + ((g.bgX * 0.5) % 36), GROUND_Y + 3, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // platforms
  for (const pl of g.platforms) {
    ctx.fillStyle = pl.color;
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(pl.x, pl.y, pl.w, pl.h, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(pl.x + 6, pl.y + 3, pl.w - 12, 4);
  }

  // collectibles / obstacles
  ctx.font = "24px serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  for (const c of g.collectibles) { if (!c.collected) ctx.fillText(c.emoji, c.x, c.y); }
  for (const o of g.obstacles) { ctx.fillText(o.emoji, o.x, o.y); }

  // power-ups (café avec halo)
  for (const pu of g.powerups) {
    if (pu.taken) continue;
    const pulse = 1 + Math.sin(g.frame * 0.15) * 0.12;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#D4A574";
    ctx.beginPath(); ctx.arc(pu.x, pu.y - 6, 20 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.font = "28px serif"; ctx.textAlign = "center";
    ctx.fillText("☕", pu.x, pu.y + 4);
  }

  // particles
  for (const pt of g.particles) {
    ctx.globalAlpha = Math.max(0, pt.life);
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // player (rotation selon la vitesse verticale + bouclier + clignotement i-frames)
  const p = g.player;
  const blink = g.invuln > 0 && Math.floor(g.frame / 4) % 2 === 0;
  if (!blink) {
    const bounce = p.onGround ? Math.sin(g.frame * 0.15) * 2 : 0;
    const tilt = Math.max(-0.45, Math.min(0.45, p.vy * 0.035));
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2 + bounce;
    if (g.shieldTimer > 0) {
      const ring = 1 + Math.sin(g.frame * 0.2) * 0.06;
      ctx.save();
      ctx.globalAlpha = g.shieldTimer < 60 ? 0.3 + Math.sin(g.frame * 0.5) * 0.2 : 0.45;
      ctx.strokeStyle = "#D4A574";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, 34 * ring, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(212,165,116,0.12)";
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.font = "38px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🥐", 0, 2);
    ctx.restore();
  }

  // floats (+10, bonus...)
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  for (const f of g.floats) {
    ctx.globalAlpha = Math.max(0, f.life);
    ctx.font = `bold ${f.size}px sans-serif`;
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx: CanvasRenderingContext2D, g: Game) {
  // score
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "rgba(92,46,0,0.9)";
  ctx.fillText(`${Math.floor(g.score)}`, 15, 38);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "rgba(92,46,0,0.6)";
  ctx.fillText("SCORE", 16, 52);
  if (g.best > 0) {
    ctx.fillStyle = "rgba(92,46,0,0.55)";
    ctx.font = "12px sans-serif";
    ctx.fillText(`🏆 Record ${Math.floor(g.best)}`, 16, 70);
  }

  // lives (cœurs en haut à droite)
  ctx.textAlign = "right";
  ctx.font = "20px serif";
  ctx.fillText("❤️".repeat(Math.max(0, g.lives)) || "💀", CANVAS_W - 14, 32);

  // combo (centre haut)
  if (g.combo >= 2) {
    const pop = 1 + Math.min(0.25, g.comboTimer / 110 * 0.25);
    ctx.save();
    ctx.translate(CANVAS_W / 2, 36);
    ctx.scale(pop, pop);
    ctx.textAlign = "center";
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#FF8C00";
    ctx.fillText(`COMBO x${g.combo}`, 0, 0);
    ctx.restore();
  }

  // barre de bouclier
  if (g.shieldTimer > 0) {
    const ratio = g.shieldTimer / 320;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(CANVAS_W / 2 - 60, CANVAS_H - 24, 120, 8);
    ctx.fillStyle = "#D4A574";
    ctx.fillRect(CANVAS_W / 2 - 60, CANVAS_H - 24, 120 * ratio, 8);
    ctx.textAlign = "center"; ctx.font = "11px sans-serif"; ctx.fillStyle = "#8B4513";
    ctx.fillText("☕ Bouclier", CANVAS_W / 2, CANVAS_H - 30);
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, g: Game, dpr: number, opts: { hud: boolean; overlay?: "start" | "paused" | null }) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const shaking = g.shake > 0.5;
  if (shaking) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
  }
  drawWorld(ctx, g);
  if (shaking) ctx.restore();

  // flash
  if (g.flash > 0) {
    ctx.fillStyle = `rgba(${g.flashColor},${Math.min(0.6, g.flash)})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  if (opts.hud) drawHUD(ctx, g);

  if (opts.overlay) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.textAlign = "center";
    if (opts.overlay === "start") {
      ctx.fillStyle = "#FFF8EC";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("🥐 Breakfast Time !", CANVAS_W / 2, CANVAS_H / 2 - 28);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#FFD9A0";
      ctx.fillText("Clic ou Espace pour commencer", CANVAS_W / 2, CANVAS_H / 2 + 6);
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "rgba(255,248,236,0.75)";
      ctx.fillText("Ramasse 🥐🥚🥯  •  évite 🍴🔪  •  attrape ☕ pour un bouclier", CANVAS_W / 2, CANVAS_H / 2 + 34);
    } else {
      ctx.fillStyle = "#FFF8EC";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("⏸ Pause", CANVAS_W / 2, CANVAS_H / 2 - 6);
      ctx.font = "15px sans-serif";
      ctx.fillStyle = "#FFD9A0";
      ctx.fillText("Espace / Clic pour reprendre", CANVAS_W / 2, CANVAS_H / 2 + 24);
    }
  }
}

export default function Jeu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(makeGame());
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const dprRef = useRef(1);
  const bestRef = useRef(0);
  const [gameState, setGameState] = useState<GameState>("register");
  const [finalScore, setFinalScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<{ prenom: string; email: string } | null>(null);

  // Restore player info + best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bt_jeu_player");
    if (saved) {
      setPlayerInfo(JSON.parse(saved));
      setGameState("start");
    }
    const b = Number(localStorage.getItem(BEST_KEY) || 0);
    bestRef.current = Number.isFinite(b) ? b : 0;
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("jeu_scores")
      .select("prenom, score")
      .order("score", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const submitScore = async (score: number, info: { prenom: string; email: string }) => {
    const { data: existing } = await supabase
      .from("jeu_scores")
      .select("id, score")
      .eq("email", info.email)
      .single();

    if (existing) {
      if (score > existing.score) {
        await supabase.from("jeu_scores").update({ score, prenom: info.prenom }).eq("id", existing.id);
      }
    } else {
      await supabase.from("jeu_scores").insert({ prenom: info.prenom, email: info.email, score });
    }

    const { count } = await supabase
      .from("jeu_scores")
      .select("*", { count: "exact", head: true })
      .gt("score", score);
    setMyRank((count ?? 0) + 1);
    fetchLeaderboard();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) return setFormError("Entre ton prénom");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError("Email invalide");
    const info = { prenom: prenom.trim(), email: email.trim().toLowerCase() };
    localStorage.setItem("bt_jeu_player", JSON.stringify(info));
    setPlayerInfo(info);
    setFormError("");
    setGameState("start");
  };

  const startGame = () => {
    gameRef.current = makeGame(bestRef.current);
    pausedRef.current = false;
    setIsNewRecord(false);
    setMyRank(null);
    setGameState("play");
  };

  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    return canvas.getContext("2d")!;
  };

  // Boucle de jeu
  useEffect(() => {
    if (gameState !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);

    const loop = () => {
      const g = gameRef.current;
      if (pausedRef.current) {
        drawFrame(ctx, g, dprRef.current, { hud: true, overlay: "paused" });
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const { died } = tickGame(g);
      drawFrame(ctx, g, dprRef.current, { hud: true });
      if (died) {
        const score = Math.floor(g.score);
        setFinalScore(score);
        const newRecord = score > bestRef.current;
        if (newRecord) {
          bestRef.current = score;
          localStorage.setItem(BEST_KEY, String(score));
        }
        setIsNewRecord(newRecord);
        setGameState("over");
        setSubmitting(true);
        if (playerInfo) {
          submitScore(score, playerInfo).finally(() => setSubmitting(false));
        }
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, playerInfo]);

  // Écran d'accueil animé
  useEffect(() => {
    if (gameState !== "start") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const g = gameRef.current;
    const loop = () => {
      g.frame++;
      for (const c of g.clouds) { c.x -= 0.3; if (c.x < -120) c.x = CANVAS_W + 80; }
      drawFrame(ctx, g, dprRef.current, { hud: false, overlay: "start" });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState]);

  const jump = () => {
    const p = gameRef.current.player;
    if (p.jumps < 2) { p.vy = -13; p.jumps++; }
  };

  const handlePrimaryAction = () => {
    if (gameState === "start") return startGame();
    if (gameState === "play") {
      if (pausedRef.current) { pausedRef.current = false; return; }
      return jump();
    }
  };

  // Clavier : saut + pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        handlePrimaryAction();
      } else if (e.code === "KeyP" && gameState === "play") {
        pausedRef.current = !pausedRef.current;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  // Auto-pause quand l'onglet passe en arrière-plan
  useEffect(() => {
    const onHide = () => { if (document.hidden && gameState === "play") pausedRef.current = true; };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [gameState]);

  const card: React.CSSProperties = { background: "#fff", borderRadius: "16px", border: "1px solid #F5DEB3", boxShadow: "0 4px 24px rgba(139,69,19,0.08)" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF8EC 0%, #FFE4C4 100%)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#8B4513", marginBottom: "4px" }}>🏆 Jeu Concours Breakfast Time</h1>
        <p style={{ color: "#A0522D", fontSize: "14px" }}>Fais le meilleur score et gagne un brunch offert !</p>
      </div>

      {/* Register form */}
      {gameState === "register" && (
        <div style={{ ...card, padding: "2rem", maxWidth: "400px", width: "100%" }}>
          <p style={{ marginBottom: "1.5rem", color: "#666", fontSize: "15px", lineHeight: 1.6 }}>
            Entre ton prénom et ton email pour participer — ton meilleur score sera enregistré automatiquement.
          </p>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Ton prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #E8C49A", fontSize: "15px", outline: "none" }}
            />
            <input
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #E8C49A", fontSize: "15px", outline: "none" }}
            />
            {formError && <p style={{ color: "#E24B4A", fontSize: "13px" }}>{formError}</p>}
            <button type="submit" style={{ padding: "14px", borderRadius: "10px", background: "#D4A574", color: "#fff", fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer" }}>
              Je joue ! 🎮
            </button>
          </form>
          <p style={{ marginTop: "12px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>Email utilisé uniquement pour te contacter si tu gagnes.</p>
        </div>
      )}

      {/* Game */}
      {(gameState === "start" || gameState === "play" || gameState === "over") && (
        <>
          {/* Barre d'infos statiques (le score/vies en direct sont dessinés sur le canvas) */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Joueur", value: playerInfo?.prenom ?? "" },
              { label: "Ton record", value: bestRef.current > 0 ? String(Math.floor(bestRef.current)) : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ ...card, padding: "8px 18px", textAlign: "center", boxShadow: "none" }}>
                <div style={{ fontSize: "11px", color: "#A0522D", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 600, color: "#5C2E00" }}>{value}</div>
              </div>
            ))}
          </div>

          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={handlePrimaryAction}
            style={{ borderRadius: "12px", border: "2px solid #E8C49A", cursor: "pointer", width: "100%", maxWidth: `${CANVAS_W}px`, aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, touchAction: "none", display: "block" }}
          />

          <p style={{ fontSize: "12px", color: "#A0522D" }}>Espace / Tap pour sauter (double saut !) — P pour mettre en pause</p>
        </>
      )}

      {/* Game Over */}
      {gameState === "over" && (
        <div style={{ ...card, padding: "1.5rem 2rem", maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>{isNewRecord ? "🎉" : "🎯"}</div>
          {isNewRecord && (
            <p style={{ color: "#D4A574", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Nouveau record personnel !</p>
          )}
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#8B4513", marginBottom: "4px" }}>Score final : {finalScore}</h2>
          {submitting ? (
            <p style={{ color: "#A0522D", fontSize: "14px" }}>Enregistrement...</p>
          ) : (
            myRank && (
              <p style={{ color: myRank <= 3 ? "#D4A574" : "#A0522D", fontWeight: myRank <= 3 ? 700 : 400, fontSize: "15px", marginBottom: "4px" }}>
                {myRank === 1 ? "🏆 Tu es 1er — bravo !" : myRank === 2 ? "🥈 2e place !" : myRank === 3 ? "🥉 3e place !" : `Tu es ${myRank}e au classement`}
              </p>
            )
          )}
          <button
            onClick={startGame}
            style={{ marginTop: "16px", padding: "12px 32px", borderRadius: "10px", background: "#D4A574", color: "#fff", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer" }}
          >
            Rejouer 🔄
          </button>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ ...card, padding: "1.5rem", maxWidth: "440px", width: "100%" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#8B4513", marginBottom: "1rem", textAlign: "center" }}>🏆 Classement</h2>
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "14px" }}>Sois le premier à jouer !</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {leaderboard.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
                  borderRadius: "10px",
                  background: i === 0 ? "#FFF8DC" : i === 1 ? "#F5F5F5" : i === 2 ? "#FFF0E0" : "transparent",
                  border: i < 3 ? "1px solid #F5DEB3" : "none",
                }}
              >
                <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <span style={{ flex: 1, fontWeight: i < 3 ? 600 : 400, color: "#5C2E00" }}>{entry.prenom}</span>
                <span style={{ fontWeight: 700, color: "#D4A574", fontSize: "16px" }}>{Math.floor(entry.score)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
