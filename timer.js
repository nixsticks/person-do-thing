/* ============================================================
   PERSON DO THING — timer page
   2-minute describer countdown + target word picker for irl play.
   standalone from app.js: this page only needs the palette render,
   the word pool, and the timer logic. vanilla js, no build, no
   modules.
   ============================================================ */

// ---------- vocabulary (the 34 allowed words) ----------
//
// duplicated from app.js so the timer page can ship without loading
// the demo's full game logic. if this list ever changes, update both
// files together. (when there's a third page that needs VOCAB, pull
// it into a shared.js — not before.)

const VOCAB = {
  noun: ["person", "place", "thing"],
  verb: ["do", "feel", "go", "have", "like", "make", "say", "see", "think", "use", "want"],
  adj:  ["big", "far", "fast", "good", "hard", "hot", "many", "real"],
  conn: ["after", "before", "more", "other", "in", "up", "same", "again", "and", "but", "yes", "no"],
};

// ---------- timer-mode word pool ----------
//
// distinct from PUZZLES.answer in app.js so the demo isn't spoiled
// if the player flips between pages. curation rule: every word here
// must be plausibly describable using only the 34 vocab words above.
// no runtime validator — the player invents clues live, so this list
// is a discipline, not a checked guarantee.

const TIMER_WORDS = [
  "bridge", "key", "road", "chair", "fish",
  "hand", "mouth", "egg", "cake", "milk",
  "bread", "apple", "ball", "ring", "lock",
  "lamp", "king", "hero", "brother", "sister",
  "child", "teacher", "horse", "cow", "pig",
  "sheep", "snake", "frog", "rabbit", "bear",
  "shark", "whale", "owl", "spider", "bee",
  "butterfly", "beach", "island", "cave", "city",
  "farm", "park", "storm", "rainbow", "fog",
  "smoke", "winter", "summer", "hat", "kiss",
];

const TIMER_DURATION = 120; // seconds — matches the original persondothing.com timer

// ---------- state ----------

const state = {
  timerSeconds: TIMER_DURATION,
  timerInterval: null,
  timerWordOrder: [],   // shuffled pointer into TIMER_WORDS
  timerWordPos: -1,     // position in timerWordOrder (-1 = nothing picked yet)
};

// ---------- element refs ----------

const els = {
  timerWord:     document.getElementById("timer-word"),
  timerNextWord: document.getElementById("timer-next-word"),
  timerClock:    document.getElementById("timer-clock"),
  timerStart:    document.getElementById("timer-start"),
  timerReset:    document.getElementById("timer-reset"),
};

// ---------- helpers ----------

const pad2 = (n) => String(n).padStart(2, "0");

// fisher-yates shuffle (returns a new array)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- palette ----------

function renderPalette() {
  for (const [cat, words] of Object.entries(VOCAB)) {
    const ul = document.getElementById(`cat-${cat}`);
    if (!ul) continue;
    ul.innerHTML = words
      .map((w) => `<li class="word" data-word="${w}">${w}</li>`)
      .join("");
  }
}

// ---------- target word picker ----------

// shuffle TIMER_WORDS indices, ensuring the new order doesn't start
// with the word we just showed (avoids back-to-back repeats)
function freshTimerOrder(avoidIndex) {
  if (TIMER_WORDS.length <= 1) return [0];
  let next;
  do {
    next = shuffle([...TIMER_WORDS.keys()]);
  } while (next[0] === avoidIndex);
  return next;
}

function pickTimerWord() {
  // advance position in the shuffled order; reshuffle when exhausted
  if (state.timerWordPos < 0 || state.timerWordPos >= state.timerWordOrder.length - 1) {
    const lastIdx = state.timerWordPos >= 0 ? state.timerWordOrder[state.timerWordPos] : -1;
    state.timerWordOrder = freshTimerOrder(lastIdx);
    state.timerWordPos = 0;
  } else {
    state.timerWordPos++;
  }
  const word = TIMER_WORDS[state.timerWordOrder[state.timerWordPos]];
  els.timerWord.textContent = word;
  els.timerWord.setAttribute("data-text", word);
}

// ---------- countdown ----------

function formatClock(seconds) {
  const safe = Math.max(0, seconds | 0);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${pad2(s)}`;
}

function tickTimer() {
  state.timerSeconds--;
  if (state.timerSeconds <= 0) {
    state.timerSeconds = 0;
    els.timerClock.textContent = "0:00";
    els.timerClock.setAttribute("data-state", "done");
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    els.timerStart.disabled = false;
    els.timerReset.disabled = false;
    return;
  }
  els.timerClock.textContent = formatClock(state.timerSeconds);
}

function startTimer() {
  // start always restarts the countdown (matches the original timer.js).
  // if a previous interval is running, clear it first.
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerSeconds = TIMER_DURATION;
  els.timerClock.textContent = formatClock(state.timerSeconds);
  els.timerClock.setAttribute("data-state", "running");
  els.timerStart.disabled = true;
  els.timerReset.disabled = false;
  state.timerInterval = setInterval(tickTimer, 1000);
}

function resetTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.timerSeconds = TIMER_DURATION;
  els.timerClock.textContent = formatClock(state.timerSeconds);
  els.timerClock.setAttribute("data-state", "ready");
  els.timerStart.disabled = false;
  els.timerReset.disabled = true;
}

// restart the spin animation on the sync icon. used on every click
// so taps get visible feedback on mobile (where :hover doesn't fire).
// the remove → reflow → add dance is required to re-trigger a CSS
// animation on the same element.
function spinSyncIcon() {
  const svg = els.timerNextWord.querySelector("svg");
  if (!svg) return;
  svg.classList.remove("spinning");
  void svg.offsetWidth; // force reflow
  svg.classList.add("spinning");
}

// ---------- init ----------

function init() {
  renderPalette();
  pickTimerWord();
  els.timerStart.addEventListener("click", startTimer);
  els.timerReset.addEventListener("click", resetTimer);
  els.timerNextWord.addEventListener("click", () => {
    pickTimerWord();
    spinSyncIcon();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
