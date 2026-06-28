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
const ITEMS = ["🥐", "🥚", "☕", "🥯", "🧁"];
const OBSTACLES = ["🍴", "🔪"];

function makeGame() {
  return {
    frame: 0,
    speed: 3,
    score: 0,
    lives: 3,
    spawnTimer: 0,
    bgX: 0,
    player: { x: 80, y: GROUND_Y - 50, w: 40, h: 50, vy: 0, jumps: 0, onGround: false },
    platforms: [
      { x: 180, y: GROUND_Y - 90, w: 100, h: 18, color: "#D4A574" },
      { x: 350, y: GROUND_Y - 140, w: 110, h: 18, color: "#E8C49A" },
      { x: 530, y: GROUND_Y - 80, w: 90, h: 18, color: "#D4A574" },
    ] as { x: number; y: number; w: number; h: number; color: string }[],
    collectibles: [] as { x: number; y: number; emoji: string; collected: boolean }[],
    obstacles: [] as { x: number; y: number; w: number; h: number; emoji: string }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    clouds: [{ x: 100, y: 40, s: 1 }, { x: 300, y: 70, s: 0.8 }, { x: 550, y: 30, s: 1.2 }],
  };
}

type Game = ReturnType<typeof makeGame>;

function rectOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnParticles(g: Game, x: number, y: number, color: string, n: number) {
  for (let i = 0; i < n; i++) {
    g.particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3 - 1, life: 1, color });
  }
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
}

function tickGame(g: Game): { died: boolean; lostLife: boolean } {
  g.frame++;
  g.bgX -= g.speed * 0.3;
  g.speed = 3 + g.score * 0.003;

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
  if (g.spawnTimer > Math.max(40, 80 - g.score * 0.05)) {
    g.spawnTimer = 0;
    spawnPlatform(g);
    if (Math.random() < 0.35 + g.score * 0.0005) {
      g.obstacles.push({ x: CANVAS_W + 20, y: GROUND_Y - 50, w: 36, h: 40, emoji: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)] });
    }
  }

  for (const c of g.collectibles) {
    c.x -= g.speed;
    if (!c.collected && rectOverlap(p.x + 4, p.y + 4, p.w - 8, p.h - 8, c.x - 15, c.y - 15, 30, 30)) {
      c.collected = true;
      g.score += 10;
      spawnParticles(g, c.x, c.y, "#FFD700", 8);
    }
  }
  g.collectibles = g.collectibles.filter((c) => c.x > -30 && !c.collected);

  let lostLife = false;
  for (const o of g.obstacles) {
    o.x -= g.speed;
    if (rectOverlap(p.x + 6, p.y + 6, p.w - 12, p.h - 12, o.x - 12, o.y - 10, o.w, o.h)) {
      o.x = -200;
      g.lives--;
      lostLife = true;
      spawnParticles(g, p.x + p.w / 2, p.y + p.h / 2, "#E24B4A", 12);
    }
  }
  g.obstacles = g.obstacles.filter((o) => o.x > -50);

  for (const pt of g.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life -= 0.05; }
  g.particles = g.particles.filter((pt) => pt.life > 0);

  for (const c of g.clouds) { c.x -= g.speed * 0.1; if (c.x < -120) c.x = CANVAS_W + 80; }

  let died = false;
  if (p.y > CANVAS_H + 50) {
    g.lives--;
    lostLife = true;
    p.x = 80; p.y = GROUND_Y - 50; p.vy = 0; p.jumps = 0;
  }
  if (g.lives <= 0) died = true;

  g.score += 0.05;
  return { died, lostLife };
}

function drawGame(ctx: CanvasRenderingContext2D, g: Game) {
  const W = CANVAS_W, H = CANVAS_H;
  ctx.clearRect(0, 0, W, H);

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#FFECD2");
  grad.addColorStop(1, "#FCB69F");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // clouds
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (const c of g.clouds) {
    for (const [dx, dy, r] of [[0,0,30],[22,0,24],[-18,0,22],[8,-14,20],[-8,-12,18]] as [number,number,number][]) {
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
    (ctx as any).roundRect(pl.x, pl.y, pl.w, pl.h, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(pl.x + 6, pl.y + 3, pl.w - 12, 4);
  }

  ctx.font = "24px serif"; ctx.textAlign = "center";
  for (const c of g.collectibles) { if (!c.collected) ctx.fillText(c.emoji, c.x, c.y); }
  for (const o of g.obstacles) { ctx.fillText(o.emoji, o.x, o.y); }

  // particles
  for (const pt of g.particles) {
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // player
  const bounce = g.player.onGround ? Math.sin(g.frame * 0.15) * 2 : 0;
  ctx.font = "36px serif"; ctx.textAlign = "center";
  ctx.fillText("🥐", g.player.x + g.player.w / 2, g.player.y + g.player.h + bounce);
}

export default function Jeu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(makeGame());
  const rafRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>("register");
  const [finalScore, setFinalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<{ prenom: string; email: string } | null>(null);

  // Restore player info from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bt_jeu_player");
    if (saved) {
      const info = JSON.parse(saved);
      setPlayerInfo(info);
      setGameState("start");
    }
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
    if (!email.includes("@")) return setFormError("Email invalide");
    const info = { prenom: prenom.trim(), email: email.trim().toLowerCase() };
    localStorage.setItem("bt_jeu_player", JSON.stringify(info));
    setPlayerInfo(info);
    setFormError("");
    setGameState("start");
  };

  const startGame = () => {
    gameRef.current = makeGame();
    setGameState("play");
  };

  useEffect(() => {
    if (gameState !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const g = gameRef.current;
      const { died } = tickGame(g);
      drawGame(ctx, g);
      if (died) {
        const score = Math.floor(g.score);
        setFinalScore(score);
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

  const jump = () => {
    if (gameState !== "play") return;
    const p = gameRef.current.player;
    if (p.jumps < 2) { p.vy = -13; p.jumps++; }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  // Draw static screen when not playing
  useEffect(() => {
    if (gameState === "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawGame(ctx, gameRef.current);
    if (gameState === "start") {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "#FFF8EC";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🥐 Breakfast Time !", CANVAS_W / 2, CANVAS_H / 2 - 20);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#FFD9A0";
      ctx.fillText("Clic ou Espace pour commencer", CANVAS_W / 2, CANVAS_H / 2 + 18);
    }
  }, [gameState]);

  const hearts = "❤️".repeat(Math.max(0, gameRef.current.lives));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF8EC 0%, #FFE4C4 100%)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#8B4513", marginBottom: "4px" }}>🏆 Jeu Concours Breakfast Time</h1>
        <p style={{ color: "#A0522D", fontSize: "14px" }}>Fais le meilleur score et gagne un brunch offert !</p>
      </div>

      {/* Register form */}
      {gameState === "register" && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", maxWidth: "400px", width: "100%", boxShadow: "0 4px 24px rgba(139,69,19,0.1)", border: "1px solid #F5DEB3" }}>
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
          {/* Stats bar */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Joueur", value: playerInfo?.prenom ?? "" },
              { label: "Score", value: Math.floor(gameRef.current.score).toString() },
              { label: "Vies", value: hearts || "💀" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#fff", borderRadius: "10px", padding: "8px 18px", textAlign: "center", border: "1px solid #F5DEB3" }}>
                <div style={{ fontSize: "11px", color: "#A0522D", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 600, color: "#5C2E00" }}>{value}</div>
              </div>
            ))}
          </div>

          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={() => {
              if (gameState === "start") startGame();
              else jump();
            }}
            style={{ borderRadius: "12px", border: "2px solid #E8C49A", cursor: "pointer", maxWidth: "100%", touchAction: "none" }}
          />

          <p style={{ fontSize: "12px", color: "#A0522D" }}>Espace / Tap pour sauter — Double saut autorisé !</p>
        </>
      )}

      {/* Game Over */}
      {gameState === "over" && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem 2rem", maxWidth: "440px", width: "100%", border: "1px solid #F5DEB3", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎯</div>
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
      <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", maxWidth: "440px", width: "100%", border: "1px solid #F5DEB3" }}>
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
