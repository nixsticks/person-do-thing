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
      "Many many thing in. Same — but no same.",
      "Person no say. Other person no say. Same do.",
      "After, person have thing — but after more, no have. Other person have.",
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
      "Other person.",
      "But person want, person have. No other person make same.",
      "Person say, other person say. Person say, other person say.",
      "Other person make person feel good. Person make other person feel good.",
    ],
  },
  {
    answer: "river",
    accept: ["river", "rivers", "a river", "stream"],
    clues: [
      "Thing in place.",
      "Go. Same go, same go, same go.",
      "Person see, person no go in fast.",
      "After, more place. After more, big big place.",
    ],
  },
  {
    answer: "moon",
    accept: ["moon", "the moon", "luna"],
    clues: [
      "Big thing far up.",
      "Person see after hot thing go no-up.",
      "No hot. Real far.",
      "Big, no big, big, no big — same thing.",
    ],
  },
  {
    answer: "baby",
    accept: ["baby", "babies", "a baby", "infant", "newborn"],
    clues: [
      "Person, but no big.",
      "Person no say, no go fast.",
      "Other person have, other person feel good.",
      "After many many after, no-big person big.",
    ],
  },
  {
    answer: "dog",
    accept: ["dog", "dogs", "a dog", "puppy", "doggo"],
    clues: [
      "Thing, but no person.",
      "Person have. Person feel good.",
      "Go fast. Like person, but no say.",
      "Person say 'go!', thing go. Person say 'do!', thing do.",
    ],
  },
  {
    answer: "car",
    accept: ["car", "cars", "a car", "automobile", "auto"],
    clues: [
      "Big thing. Person have.",
      "Person in. Person make thing go — fast, far.",
      "Person go same place again, again, again. But person go other place after.",
      "In big place: many same thing, no go. Many person no in.",
    ],
  },
  {
    answer: "music",
    accept: ["music", "song", "songs", "a song"],
    clues: [
      "Thing person make and use.",
      "Person feel. More more feel.",
      "Many person make same thing in same place.",
      "After, person feel good. Person want again.",
    ],
  },
  {
    answer: "school",
    accept: ["school", "schools", "a school", "class", "classroom"],
    clues: [
      "Place.",
      "Many no-big person go in.",
      "Other person say, no-big person think.",
      "After many after, no-big person have more think.",
    ],
  },
  {
    answer: "snow",
    accept: ["snow", "snowfall", "snowing"],
    clues: [
      "Thing in place.",
      "No hot. More more no hot.",
      "Many same thing go no-up.",
      "After, place no same. Person see no thing other.",
    ],
  },
  {
    answer: "eyes",
    accept: ["eye", "eyes", "the eyes"],
    clues: [
      "Thing in person.",
      "Person use, person see.",
      "After, person no use, person no see.",
      "Same thing, same thing — but in same person.",
    ],
  },
  {
    answer: "dance",
    accept: ["dance", "dancing", "dances", "a dance"],
    clues: [
      "Thing person do.",
      "Person use, person go — but no go far.",
      "Many person, same place, same do.",
      "After, person feel good. More more good.",
    ],
  },
  {
    answer: "tree",
    accept: ["tree", "trees", "a tree"],
    clues: [
      "Big thing in place.",
      "Up. More up. Many many same thing up.",
      "No go. Same place, same place.",
      "Person see, person feel good. More many, more good.",
    ],
  },
  {
    answer: "rain",
    accept: ["rain", "raining", "rainfall"],
    clues: [
      "Many same thing go no-up — fast.",
      "Person feel — and person no want feel.",
      "Person have other thing — make up. No feel.",
      "After, place no same. Many in place. Hard go.",
    ],
  },
  {
    answer: "piano",
    accept: ["piano", "pianos", "a piano", "keys"],
    clues: [
      "Big thing. Person no go — same place.",
      "Many many same thing in. Same — but no same.",
      "Person use. Person use other. Person use other. Fast.",
      "Other person feel — good, no good, more more good.",
    ],
  },
  {
    answer: "ice",
    accept: ["ice", "iceberg", "frozen"],
    clues: [
      "Thing in place.",
      "Hard. But before, no hard.",
      "No hot. Real no hot.",
      "After hot, no thing.",
    ],
  },
  {
    answer: "ghost",
    accept: ["ghost", "ghosts", "a ghost", "spirit", "phantom"],
    clues: [
      "Person, but no real person.",
      "No real, but person see.",
      "Person feel no good after see.",
      "In big place, no other person.",
    ],
  },
  {
    answer: "wind",
    accept: ["wind", "winds", "the wind", "breeze"],
    clues: [
      "Thing in place.",
      "Person no see, but person feel.",
      "Make other thing go. Same go, same go.",
      "Fast, no fast, fast, no fast. Big, no big.",
    ],
  },
  {
    answer: "shadow",
    accept: ["shadow", "shadows", "a shadow", "shade"],
    clues: [
      "Thing person have.",
      "Same thing same person — but no real.",
      "Go same place person go. Do same do.",
      "No hot thing up: no thing.",
    ],
  },
  {
    answer: "heart",
    accept: ["heart", "hearts", "the heart", "heartbeat"],
    clues: [
      "Thing in person.",
      "Person no see, but person feel — same feel, again, again, again.",
      "Go fast after person feel hot, fast after person feel no good.",
      "After thing no go, no person.",
    ],
  },
  {
    answer: "bird",
    accept: ["bird", "birds", "a bird"],
    clues: [
      "Thing, but no person.",
      "No big — but go far up. Far far up.",
      "Many same thing in big up place. Same go, same after.",
      "Make thing — and other person feel good.",
    ],
  },
  {
    answer: "secret",
    accept: ["secret", "secrets", "a secret"],
    clues: [
      "Thing person have in.",
      "Person no say. Person want say, but no.",
      "Other person want, but no have.",
      "After person say, no thing.",
    ],
  },
  {
    answer: "echo",
    accept: ["echo", "echoes", "an echo"],
    clues: [
      "Thing.",
      "Person say, after person say same.",
      "No other person, but say.",
      "Same say, but no big. After, more no big.",
    ],
  },
  {
    answer: "night",
    accept: ["night", "nights", "nighttime", "the night"],
    clues: [
      "Place, but no place — same place after.",
      "After hot thing far up go no-up.",
      "No see far. No hot.",
      "Many person no do, no see, no think — same do.",
    ],
  },
  {
    answer: "door",
    accept: ["door", "doors", "a door", "the door"],
    clues: [
      "Thing in place.",
      "Before, person go in. After, no go in.",
      "Person say 'go in!' Person say 'no go in!'",
      "Other person no see in — but after, see.",
    ],
  },
];

// ---------- state ----------

const state = {
  order: [],              // shuffled puzzle indices
  orderPos: 0,            // pointer into state.order
  cluesShown: 1,
  solved: false,
  revealed: false,
  played: 0,              // # puzzles started this session
  solvedCount: 0,         // # puzzles solved correctly this session
  advanceTimer: null,     // pending auto-advance after a win
  shownMilestones: new Set(), // milestone keys already triggered
  pendingMilestone: null, // milestone queued for the next puzzle load
};

// ---------- sales funnel: cross-sell milestones ----------

const BUY_URL = "https://want.persondothing.com/";

const MILESTONES = {
  "first-clue": {
    eyebrow: "★ first-clue solve ★",
    headline: "you've got the touch.",
    body: "you'd be deadly across a real table. bring it home.",
    cta: "get the deck",
  },
  "solves-3": {
    eyebrow: "★ ★ ★",
    headline: "you're getting it.",
    body: "this is more fun with friends in the room. take the game home.",
    cta: "get the deck",
  },
  "solves-7": {
    eyebrow: "★ seven solved ★",
    headline: "okay, you're hooked.",
    body: "the real deck has hundreds of cards. play it for real.",
    cta: "take it home",
  },
};

function buyUrl(campaign) {
  const params = new URLSearchParams({
    utm_source: "play_site",
    utm_medium: campaign ? "milestone" : "masthead",
  });
  if (campaign) params.set("utm_campaign", campaign);
  return `${BUY_URL}?${params.toString()}`;
}

// ---------- element refs ----------

const els = {
  mystery:        document.getElementById("mystery"),
  mysteryText:    document.getElementById("mystery-text"),
  clues:          document.getElementById("clues"),
  guessForm:      document.getElementById("guess-form"),
  guessInput:     document.getElementById("guess-input"),
  feedback:       document.getElementById("feedback"),
  revealBtn:      document.getElementById("reveal-btn"),
  nextPuzzleBtn:  document.getElementById("next-puzzle-btn"),
  playedNum:      document.getElementById("played-num"),
  solvedNum:      document.getElementById("solved-num"),
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

// fisher-yates shuffle (returns a new array)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// shuffle puzzle indices, ensuring the new shuffle doesn't start
// with the puzzle we just finished (avoids back-to-back repeats)
function freshOrder(avoidIndex) {
  if (PUZZLES.length <= 1) return [0];
  let next;
  do {
    next = shuffle([...PUZZLES.keys()]);
  } while (next[0] === avoidIndex);
  return next;
}

function currentPuzzleIndex() {
  return state.order[state.orderPos];
}

function currentPuzzle() {
  return PUZZLES[currentPuzzleIndex()];
}

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
  const puzzle = currentPuzzle();
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
}

function highlightUsedWords() {
  const puzzle = currentPuzzle();
  const shown = puzzle.clues.slice(0, state.cluesShown).join(" ");
  const used = new Set(tokens(shown));
  document.querySelectorAll(".word").forEach((el) => {
    el.classList.toggle("lit", used.has(el.dataset.word));
  });
}

function renderMystery() {
  if (state.solved || state.revealed) {
    const word = currentPuzzle().answer;
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
  els.playedNum.textContent = pad2(state.played);
  els.solvedNum.textContent = pad2(state.solvedCount);
  els.solvedNum.parentElement.classList.toggle("has-solves", state.solvedCount > 0);
}

function renderControls() {
  const finished = state.solved || state.revealed;
  els.revealBtn.hidden = finished;
  els.nextPuzzleBtn.hidden = !finished;
  els.guessInput.disabled = finished;
}

function renderAll() {
  renderMeta();
  renderMystery();
  renderClues();
  highlightUsedWords();
  renderControls();
}

// ---------- game flow ----------

const AUTO_ADVANCE_MS = 1400;

function cancelAutoAdvance() {
  if (state.advanceTimer) {
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
  }
}

function loadCurrentPuzzle() {
  state.cluesShown = 1;
  state.solved = false;
  state.revealed = false;
  state.played++;
  cancelAutoAdvance();
  els.guessInput.value = "";
  els.guessInput.disabled = false;
  els.feedback.textContent = "";
  els.feedback.removeAttribute("data-tone");
  // render any queued milestone cross-sell card before the puzzle
  if (state.pendingMilestone) {
    renderCrossSell(state.pendingMilestone);
    state.pendingMilestone = null;
  } else {
    clearCrossSell();
  }
  renderAll();
  els.guessInput.focus({ preventScroll: true });
}

// ---------- cross-sell rendering ----------

function clearCrossSell() {
  const existing = document.querySelector(".cross-sell");
  if (existing) existing.remove();
}

function renderCrossSell(key) {
  clearCrossSell();
  const m = MILESTONES[key];
  if (!m) return;

  const card = document.createElement("aside");
  card.className = "cross-sell";
  card.setAttribute("data-milestone", key);
  card.setAttribute("role", "complementary");

  card.innerHTML = `
    <button class="cross-sell-close" type="button" aria-label="dismiss">×</button>
    <p class="cross-sell-eyebrow">${m.eyebrow}</p>
    <h2 class="cross-sell-headline">${m.headline}</h2>
    <p class="cross-sell-body">${m.body}</p>
    <a class="cross-sell-cta"
       href="${buyUrl(key)}"
       target="_blank"
       rel="noopener">
      ${m.cta} <span class="cross-sell-arrow">→</span>
    </a>
  `;

  // insert above the mystery slot, after the puzzle meta
  els.mystery.parentNode.insertBefore(card, els.mystery);

  card.querySelector(".cross-sell-close").addEventListener("click", () => {
    card.classList.add("dismissed");
    setTimeout(() => card.remove(), 280);
  });
}

function showNextClue() {
  const puzzle = currentPuzzle();
  if (state.cluesShown < puzzle.clues.length) {
    state.cluesShown++;
    renderClues();
    highlightUsedWords();
    return true;
  }
  return false;
}

function checkGuess(input) {
  const guess = norm(input);
  if (!guess) return false;
  const puzzle = currentPuzzle();
  return puzzle.accept.some((a) => norm(a) === guess);
}

const RIGHT_LINES = [
  "yes. that's the one.",
  "got it.",
  "exactly that.",
  "★ correct ★",
  "right on.",
];

const WRONG_LINES = [
  "no — here's another clue.",
  "not quite. one more.",
  "nope. another.",
  "not it. take another.",
];

const NEUTRAL_LINES = [
  "another clue, then.",
  "here, take another.",
  "one more for you.",
];

const NO_MORE_CLUES = "out of clues — guess or give up.";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shakeInput() {
  els.guessInput.classList.remove("shake");
  // force reflow so the animation can re-trigger
  void els.guessInput.offsetWidth;
  els.guessInput.classList.add("shake");
}

function setFeedback(text, tone) {
  els.feedback.textContent = text;
  if (tone) {
    els.feedback.setAttribute("data-tone", tone);
  } else {
    els.feedback.removeAttribute("data-tone");
  }
}

function win() {
  const wonOnFirstClue = state.cluesShown === 1;
  state.solved = true;
  state.solvedCount++;

  // queue at most one milestone for the next puzzle load.
  // first-clue takes priority over count-based milestones —
  // it's the rarer / more impressive event.
  const queue = (key) => {
    if (!state.shownMilestones.has(key) && !state.pendingMilestone) {
      state.shownMilestones.add(key);
      state.pendingMilestone = key;
    }
  };
  if (wonOnFirstClue) queue("first-clue");
  if (state.solvedCount === 3) queue("solves-3");
  if (state.solvedCount === 7) queue("solves-7");

  setFeedback(pick(RIGHT_LINES), "right");
  renderMystery();
  renderControls();
  renderMeta();
  // auto-advance after a celebratory beat
  cancelAutoAdvance();
  state.advanceTimer = setTimeout(nextPuzzle, AUTO_ADVANCE_MS);
}

function handleGuess(e) {
  e.preventDefault();
  if (state.solved || state.revealed) return;

  const value = els.guessInput.value.trim();

  // empty submit → just give the next clue (no judgment)
  if (!value) {
    if (showNextClue()) {
      setFeedback(pick(NEUTRAL_LINES), null);
    } else {
      setFeedback(NO_MORE_CLUES, "wrong");
      shakeInput();
    }
    return;
  }

  if (checkGuess(value)) {
    win();
    return;
  }

  // wrong guess → reveal next clue automatically
  shakeInput();
  els.guessInput.value = "";
  if (showNextClue()) {
    setFeedback(pick(WRONG_LINES), "wrong");
  } else {
    setFeedback(NO_MORE_CLUES, "wrong");
  }
}

function reveal() {
  cancelAutoAdvance();
  state.revealed = true;
  // also reveal all clues so the player sees the full pattern
  state.cluesShown = currentPuzzle().clues.length;
  setFeedback("here it is.", "right");
  renderClues();
  highlightUsedWords();
  renderMystery();
  renderControls();
}

function nextPuzzle() {
  cancelAutoAdvance();
  state.orderPos++;
  if (state.orderPos >= state.order.length) {
    // completed the bag — reshuffle, avoiding back-to-back repeat
    state.order = freshOrder(currentPuzzleIndex());
    state.orderPos = 0;
  }
  loadCurrentPuzzle();
}

// ---------- init ----------

function init() {
  validatePuzzles();
  renderPalette();

  // seed the shuffle
  state.order = shuffle([...PUZZLES.keys()]);
  state.orderPos = 0;
  state.played = 0;
  state.solvedCount = 0;
  loadCurrentPuzzle();

  els.guessForm.addEventListener("submit", handleGuess);
  els.revealBtn.addEventListener("click", reveal);
  els.nextPuzzleBtn.addEventListener("click", nextPuzzle);

  // keyboard shortcut: enter on a finished puzzle → next immediately
  // (skips the auto-advance celebration window)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (state.solved || state.revealed)) {
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
