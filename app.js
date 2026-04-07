/* ============================================================
   PERSON DO THING — interactive guess mode
   vanilla js, no build step. data lives inline.
   ============================================================ */

// ---------- vocabulary (the 34 allowed words) ----------

const VOCAB = {
  noun: ["person", "place", "thing"],
  verb: ["do", "feel", "go", "have", "like", "make", "say", "see", "think", "use", "want"],
  adj:  ["big", "far", "fast", "good", "hard", "hot", "many", "real"],
  conn: ["after", "before", "more", "other", "in", "up", "same", "again", "and", "but", "yes", "no"],
};

const ALL_WORDS = new Set([...VOCAB.noun, ...VOCAB.verb, ...VOCAB.adj, ...VOCAB.conn]);

// ---------- puzzles ----------
//
// each puzzle has:
//   answer  — canonical answer for display
//   accept  — list of guesses considered correct (case/whitespace-insensitive)
//   clues   — progressive clue strings, each built only from the 34 words
//
// add new puzzles below — startup will validate every clue against
// the allowed vocabulary and warn in the console if anything slips.

const PUZZLES = [
  {
    answer: "desert",
    accept: ["desert", "deserts", "the desert", "sahara"],
    clues: [
      "Big place.",
      "More no-big. No big thing in.",
      "Hot. Same hot, same hot, same hot.",
      "Person go far in, person no feel good.",
    ],
  },
  {
    answer: "sun",
    accept: ["sun", "the sun", "sunshine", "sunlight"],
    clues: [
      "Big hot thing, far up.",
      "After thing go up: place hot. After thing go no-up: no hot.",
      "Person see, but person no want see hard.",
      "Same thing, again and again.",
    ],
  },
  {
    answer: "mirror",
    accept: ["mirror", "a mirror", "mirrors", "reflection"],
    clues: [
      "Thing in place.",
      "Person see person — same person!",
      "Person do, thing do same.",
      "But no other real person.",
    ],
  },
  {
    answer: "library",
    accept: ["library", "libraries", "a library", "the library"],
    clues: [
      "Big place.",
      "In: many many thing. Person use, person think.",
      "Person no say. Other person no say. No say.",
      "Person go in, see thing, think, go.",
    ],
  },
  {
    answer: "sleep",
    accept: ["sleep", "sleeping", "asleep", "nap", "napping"],
    clues: [
      "Thing person do.",
      "After, person feel good. Person want more.",
      "But person no see, no think, no say, no do.",
      "Same thing, again, again, again.",
    ],
  },
  {
    answer: "mountain",
    accept: ["mountain", "mountains", "a mountain", "the mountain"],
    clues: [
      "Big big thing in place.",
      "Up. More up. More more up.",
      "Hard go up. Person feel no good.",
      "But after, person see far, far, far.",
    ],
  },
  {
    answer: "fire",
    accept: ["fire", "flame", "flames", "campfire", "a fire"],
    clues: [
      "Thing.",
      "Hot. More more hot.",
      "Person make, person use.",
      "But no person go in. Hard. No good.",
    ],
  },
  {
    answer: "friend",
    accept: ["friend", "friends", "a friend", "buddy", "pal"],
    clues: [
      "Person.",
      "Other person — but person like.",
      "Person say thing, other person say 'yes, yes'.",
      "After many same do, person feel good.",
    ],
  },
];

// ---------- state ----------

const state = {
  puzzleIndex: 0,
  cluesShown: 1,
  solved: false,
  revealed: false,
};

// ---------- element refs ----------

const els = {
  mystery:        document.getElementById("mystery"),
  mysteryText:    document.getElementById("mystery-text"),
  clues:          document.getElementById("clues"),
  nextClueBtn:    document.getElementById("next-clue-btn"),
  guessForm:      document.getElementById("guess-form"),
  guessInput:     document.getElementById("guess-input"),
  feedback:       document.getElementById("feedback"),
  revealBtn:      document.getElementById("reveal-btn"),
  nextPuzzleBtn:  document.getElementById("next-puzzle-btn"),
  puzzleNum:      document.getElementById("puzzle-num"),
  puzzleTotal:    document.getElementById("puzzle-total"),
};

// ---------- helpers ----------

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, "");

const tokens = (s) =>
  (s || "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

const pad2 = (n) => String(n).padStart(2, "0");

// validate every clue uses only allowed vocab — dev safety net
function validatePuzzles() {
  let problems = 0;
  PUZZLES.forEach((p, i) => {
    p.clues.forEach((clue, j) => {
      tokens(clue).forEach((tok) => {
        if (!ALL_WORDS.has(tok)) {
          console.warn(
            `[puzzle ${i + 1} "${p.answer}", clue ${j + 1}] illegal word: "${tok}"`
          );
          problems++;
        }
      });
    });
  });
  if (problems === 0) {
    console.log(`%c✓ all ${PUZZLES.length} puzzles use only allowed words`, "color:#1c2960");
  }
}

// ---------- rendering ----------

function renderPalette() {
  for (const [cat, words] of Object.entries(VOCAB)) {
    const ul = document.getElementById(`cat-${cat}`);
    ul.innerHTML = words
      .map((w) => `<li class="word" data-word="${w}">${w}</li>`)
      .join("");
  }
}

function renderClues() {
  const puzzle = PUZZLES[state.puzzleIndex];
  els.clues.innerHTML = "";

  for (let i = 0; i < state.cluesShown; i++) {
    const li = document.createElement("li");
    li.className = "clue";
    li.style.animationDelay = `${i * 90}ms`;

    const numEl = document.createElement("span");
    numEl.className = "clue-num";
    numEl.textContent = pad2(i + 1);

    const textEl = document.createElement("span");
    textEl.className = "clue-text";
    textEl.textContent = puzzle.clues[i];

    li.appendChild(numEl);
    li.appendChild(textEl);
    els.clues.appendChild(li);
  }

  els.nextClueBtn.hidden = state.cluesShown >= puzzle.clues.length;
}

function highlightUsedWords() {
  const puzzle = PUZZLES[state.puzzleIndex];
  const shown = puzzle.clues.slice(0, state.cluesShown).join(" ");
  const used = new Set(tokens(shown));
  document.querySelectorAll(".word").forEach((el) => {
    el.classList.toggle("lit", used.has(el.dataset.word));
  });
}

function renderMystery() {
  if (state.solved || state.revealed) {
    const word = PUZZLES[state.puzzleIndex].answer;
    els.mysteryText.textContent = word;
    els.mysteryText.setAttribute("data-text", word);
    els.mystery.setAttribute("data-state", "revealed");
  } else {
    els.mysteryText.textContent = "?";
    els.mysteryText.setAttribute("data-text", "?");
    els.mystery.setAttribute("data-state", "hidden");
  }
}

function renderMeta() {
  els.puzzleNum.textContent = pad2(state.puzzleIndex + 1);
  els.puzzleTotal.textContent = pad2(PUZZLES.length);
}

function renderControls() {
  const finished = state.solved || state.revealed;
  els.revealBtn.hidden = finished;
  els.nextPuzzleBtn.hidden = !finished;
  els.guessInput.disabled = finished;
  if (finished) {
    els.nextClueBtn.hidden = true;
  }
}

function renderAll() {
  renderMeta();
  renderMystery();
  renderClues();
  highlightUsedWords();
  renderControls();
}

// ---------- game flow ----------

function loadPuzzle(i) {
  state.puzzleIndex = ((i % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  state.cluesShown = 1;
  state.solved = false;
  state.revealed = false;
  els.guessInput.value = "";
  els.feedback.textContent = "";
  els.feedback.removeAttribute("data-tone");
  renderAll();
}

function showNextClue() {
  const puzzle = PUZZLES[state.puzzleIndex];
  if (state.cluesShown < puzzle.clues.length) {
    state.cluesShown++;
    renderClues();
    highlightUsedWords();
    els.nextClueBtn.hidden = state.cluesShown >= puzzle.clues.length;
  }
}

function checkGuess(input) {
  const guess = norm(input);
  if (!guess) return false;
  const puzzle = PUZZLES[state.puzzleIndex];
  return puzzle.accept.some((a) => norm(a) === guess);
}

const RIGHT_LINES = [
  "yes. that's the one.",
  "got it.",
  "exactly that.",
  "★ correct ★",
];

const WRONG_LINES = [
  "no — try another angle.",
  "not quite. show another clue?",
  "nope. keep going.",
  "not it.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function handleGuess(e) {
  e.preventDefault();
  if (state.solved || state.revealed) return;

  if (checkGuess(els.guessInput.value)) {
    state.solved = true;
    els.feedback.textContent = pick(RIGHT_LINES);
    els.feedback.setAttribute("data-tone", "right");
    renderMystery();
    renderControls();
    els.nextPuzzleBtn.focus({ preventScroll: true });
  } else {
    els.feedback.textContent = pick(WRONG_LINES);
    els.feedback.setAttribute("data-tone", "wrong");
    els.guessInput.classList.remove("shake");
    // force reflow so the animation can re-trigger
    void els.guessInput.offsetWidth;
    els.guessInput.classList.add("shake");
  }
}

function reveal() {
  state.revealed = true;
  // also reveal all clues so the player sees the full pattern
  state.cluesShown = PUZZLES[state.puzzleIndex].clues.length;
  els.feedback.textContent = "here it is.";
  els.feedback.setAttribute("data-tone", "right");
  renderClues();
  highlightUsedWords();
  renderMystery();
  renderControls();
}

function nextPuzzle() {
  loadPuzzle(state.puzzleIndex + 1);
  els.guessInput.focus({ preventScroll: true });
}

// ---------- init ----------

function init() {
  validatePuzzles();
  renderPalette();
  loadPuzzle(0);

  els.nextClueBtn.addEventListener("click", showNextClue);
  els.guessForm.addEventListener("submit", handleGuess);
  els.revealBtn.addEventListener("click", reveal);
  els.nextPuzzleBtn.addEventListener("click", nextPuzzle);

  // keyboard shortcut: enter on a finished puzzle → next
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (state.solved || state.revealed) && !els.nextPuzzleBtn.hidden) {
      e.preventDefault();
      nextPuzzle();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
