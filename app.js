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
  {
    answer: "clock",
    accept: ["clock", "clocks", "a clock", "watch", "watches"],
    clues: [
      "Thing in place. Person see again, again.",
      "Same do, again, again, again. No fast, no no-fast.",
      "Person see thing, person think, 'go!' — and person go fast.",
      "Person want more — but thing say, 'no more.' Person go.",
    ],
  },
  {
    answer: "cat",
    accept: ["cat", "cats", "a cat", "kitten", "kitty"],
    clues: [
      "Thing, but no person.",
      "Person have, person feel good. No-big thing.",
      "Person say 'go!' Thing no go. Person say 'do!' Thing think, 'no.'",
      "Thing do same thing thing want — and no more.",
    ],
  },
  {
    answer: "bed",
    accept: ["bed", "beds", "a bed", "the bed"],
    clues: [
      "Thing in place.",
      "Person go in after hot thing far up go no-up.",
      "Person in thing, no go up. No see, no say, no do.",
      "After many after, person up. No person in thing.",
    ],
  },
  {
    answer: "book",
    accept: ["book", "books", "a book", "novel"],
    clues: [
      "Thing person have.",
      "Person see, person think. More see, more think.",
      "No real person in — but person see real person. No real place — but person see real place.",
      "Person go far far place, but no real go. Same place, same place.",
    ],
  },
  {
    answer: "window",
    accept: ["window", "windows", "a window", "the window"],
    clues: [
      "Thing in place.",
      "Person see far, but no go.",
      "Hot thing far up — go in. Place hot.",
      "Other person in other place — person see, but no say.",
    ],
  },
  {
    answer: "food",
    accept: ["food", "a meal", "meal", "snack", "eating"],
    clues: [
      "Thing person want.",
      "Person use. After, person feel good.",
      "No have? Person feel no good. Hard.",
      "Many many other thing in same. Person have, person want more, more.",
    ],
  },
  {
    answer: "cloud",
    accept: ["cloud", "clouds", "a cloud", "the clouds"],
    clues: [
      "Thing far up.",
      "Big, no-big, big, no-big — same thing, no same.",
      "Person see, but no have. No real hard.",
      "After many, person no see hot thing up. After more, many same thing go no-up.",
    ],
  },
  {
    answer: "star",
    accept: ["star", "stars", "a star", "the stars"],
    clues: [
      "Thing far up.",
      "No big — but real real big. Far far far.",
      "Person see after hot thing far up go no-up. No see before.",
      "Many many same thing in same big place. Person see, person feel good.",
    ],
  },
  {
    answer: "phone",
    accept: ["phone", "phones", "a phone", "telephone", "cell phone", "cellphone", "smartphone"],
    clues: [
      "Thing person have. No-big.",
      "Person say in thing. Other person, far far, feel same say.",
      "Other person no see person — but feel same.",
      "Person see other place in same thing. Person no go, but see far place.",
    ],
  },
  {
    answer: "dream",
    accept: ["dream", "dreams", "a dream", "dreaming"],
    clues: [
      "Thing person have in person.",
      "Person see thing — but no real see.",
      "Person do thing, go far place — but no real do, no real go.",
      "After, person think, 'real? No real?'",
    ],
  },
  {
    answer: "smile",
    accept: ["smile", "smiles", "smiling", "a smile", "grin"],
    clues: [
      "Thing person make — same place person say.",
      "Person feel good, person make thing.",
      "Other person see, other person feel good same.",
      "No say — but other person see, think, 'good!'",
    ],
  },
  {
    answer: "money",
    accept: ["money", "cash", "dollars"],
    clues: [
      "Thing person want.",
      "Person use, person have other thing.",
      "Many person hard make. Many no have.",
      "Person have more — person have more thing. But no more good feel.",
    ],
  },
  {
    answer: "home",
    accept: ["home", "house", "a house", "houses", "homes"],
    clues: [
      "Place person have.",
      "Person go in after many do — after far go.",
      "Person feel good in. Person no want go.",
      "Many person no in — but same person in. Again, again.",
    ],
  },
  {
    answer: "mother",
    accept: ["mother", "mom", "mum", "mama", "mommy", "mothers"],
    clues: [
      "Person.",
      "Before person, same other person.",
      "Make person. Have person. Feel and feel and feel.",
      "After many many after, person big — but same other person, same feel.",
    ],
  },
  {
    answer: "love",
    accept: ["love", "loving", "in love", "loves"],
    clues: [
      "Thing person feel.",
      "Person feel — and feel more, more, more.",
      "Person want see other person again. Person want same do other person do.",
      "Hard say. But real, real real.",
    ],
  },
  {
    answer: "ocean",
    accept: ["ocean", "oceans", "the ocean", "sea", "the sea", "seas"],
    clues: [
      "Big big place.",
      "Person see far far — no see other place.",
      "Many many thing in. Person no go in far.",
      "Same place, but other place same.",
    ],
  },
  {
    answer: "flower",
    accept: ["flower", "flowers", "a flower", "rose", "roses"],
    clues: [
      "Thing in place. No-big.",
      "Up — but no big up. No go. Same place, same place.",
      "Person see, person feel good. Many many in same place.",
      "Person have, person make other person have. Person say no thing — thing say.",
    ],
  },
  {
    answer: "word",
    accept: ["word", "words", "a word"],
    clues: [
      "Thing person say. Thing person make.",
      "Many many in same say. Person make, other person feel same.",
      "'Person', 'thing', 'big', 'go' — same same same same.",
      "Person have many many in person. Person say — and other person think same.",
    ],
  },
  {
    answer: "wheel",
    accept: ["wheel", "wheels", "a wheel", "tire", "tires"],
    clues: [
      "Thing person make.",
      "Same do, same do, same do — but no same place.",
      "Person use, other thing go fast far.",
      "Big thing have many same. No have? No go.",
    ],
  },
  {
    answer: "boat",
    accept: ["boat", "boats", "a boat", "ship", "ships"],
    clues: [
      "Thing person make.",
      "Person in thing. Thing in big place.",
      "Person no go in place — but go far in place. Far far.",
      "Big thing — many person in. Go far far, no fast.",
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
  dismissedBuyPopup: false, // user clicked × on a buy cross-sell at least once
  signedUpForEmail: false,  // user submitted the signup form (this session or prior)
};

const STORAGE_KEY_SIGNED_UP = "pdt_email_signed_up";

// ---------- sales funnel: cross-sell milestones ----------

// in-app buy page (same site, no offsite jump). milestone cross-sells
// route here so visitors stay in our funnel; the /buy page handles the
// final hand-off to amazon.
const BUY_URL = "buy.html";

const MILESTONES = {
  "first-clue": {
    type: "buy",
    eyebrow: "★ first-clue solve ★",
    headline: "you've got the touch.",
    body: "you'd be deadly across a real table. bring it home.",
    cta: "get the deck",
  },
  "solves-3": {
    type: "buy",
    eyebrow: "★ ★ ★",
    headline: "you're getting it.",
    body: "this is more fun with friends in the room. take the game home.",
    cta: "get the deck",
  },
  "solves-7": {
    type: "buy",
    eyebrow: "★ seven solved ★",
    headline: "okay, you're hooked.",
    body: "the real deck has hundreds of cards. play it for real.",
    cta: "take it home",
  },
  "solves-12": {
    type: "buy",
    eyebrow: "★ a dozen down ★",
    headline: "twelve and counting.",
    body: "you're past the tutorial part. this is where you find out how good your friends would be at it.",
    cta: "get the deck",
  },
  "solves-20": {
    type: "buy",
    eyebrow: "★ twenty solved ★",
    headline: "this is a habit now.",
    body: "twenty puzzles in. you've out-played most visitors. the deck is what's next.",
    cta: "bring it home",
  },
  "solves-30": {
    type: "buy",
    eyebrow: "★ thirty solved ★",
    headline: "you've outplayed the tutorial.",
    body: "the site has fifty. the deck has hundreds. you're ready for the real thing.",
    cta: "play it for real",
  },
  "email-after-dismiss": {
    type: "email",
    eyebrow: "★ another way to stay close ★",
    headline: "i'm working on more.",
    body: "drop your email and i'll let you know when something new lands. that's it — no spam, just occasional updates from me.",
    cta: "let me know",
  },
};

function buyUrl(campaign) {
  // milestones can still pass a campaign tag — preserved as a hash
  // fragment so /buy can read it later for analytics if we ever add it.
  return campaign ? `${BUY_URL}#${campaign}` : BUY_URL;
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
  signupForm:     document.getElementById("signup-form"),
  signupEmail:    document.getElementById("signup-email"),
  signupFeedback: document.getElementById("signup-feedback"),
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
  card.className = `cross-sell cross-sell-${m.type}`;
  card.setAttribute("data-milestone", key);
  card.setAttribute("role", "complementary");

  // shared header (eyebrow + headline + body + close button)
  const header = `
    <button class="cross-sell-close" type="button" aria-label="dismiss">×</button>
    <p class="cross-sell-eyebrow">${m.eyebrow}</p>
    <h2 class="cross-sell-headline">${m.headline}</h2>
    <p class="cross-sell-body">${m.body}</p>
  `;

  // body diverges by type: buy → CTA link, email → inline signup form
  let body = "";
  if (m.type === "buy") {
    // same-site link now (/buy), no target="_blank"
    body = `
      <a class="cross-sell-cta" href="${buyUrl(key)}">
        ${m.cta} <span class="cross-sell-arrow">→</span>
      </a>
    `;
  } else if (m.type === "email") {
    body = `
      <form class="cross-sell-signup" novalidate>
        <input
          class="cross-sell-signup-input"
          type="email"
          name="email"
          placeholder="your email"
          required
          spellcheck="false"
          autocomplete="email">
        <button class="cross-sell-signup-btn" type="submit">
          ${m.cta} <span class="cross-sell-arrow">→</span>
        </button>
      </form>
      <p class="cross-sell-signup-feedback" aria-live="polite"></p>
    `;
  }

  card.innerHTML = header + body;

  // insert above the mystery slot, after the puzzle meta
  els.mystery.parentNode.insertBefore(card, els.mystery);

  // dismiss handler — track buy-popup dismissals so the next milestone
  // can switch to an email ask instead of another buy ask
  card.querySelector(".cross-sell-close").addEventListener("click", () => {
    if (m.type === "buy") {
      state.dismissedBuyPopup = true;
    }
    card.classList.add("dismissed");
    setTimeout(() => card.remove(), 280);
  });

  // wire the embedded signup form on email popups
  if (m.type === "email") {
    const form = card.querySelector(".cross-sell-signup");
    const input = card.querySelector(".cross-sell-signup-input");
    const feedback = card.querySelector(".cross-sell-signup-feedback");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      processSignup(form, input, feedback, {
        autoDismissAfter: 1900,
        onAutoDismiss: () => {
          card.classList.add("dismissed");
          setTimeout(() => card.remove(), 280);
        },
      });
    });
  }
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
  if (state.solvedCount === 7) {
    // smart fallback: if the player dismissed an earlier buy popup AND
    // hasn't signed up yet, ask for an email instead of pushing buy again.
    // if they dismissed AND already signed up, show nothing — they've told
    // us twice they're not in the mood.
    if (state.dismissedBuyPopup) {
      if (!state.signedUpForEmail) queue("email-after-dismiss");
    } else {
      queue("solves-7");
    }
  }
  if (state.solvedCount === 12) queue("solves-12");
  if (state.solvedCount === 20) queue("solves-20");
  if (state.solvedCount === 30) queue("solves-30");

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

// ---------- email signup (wired to Loops) ----------
//
// Submissions POST directly to a Loops newsletter-form endpoint. The
// shared `processSignup` function handles validation, the loading state,
// success/error UI, localStorage dedup, and (for the popup variant) an
// auto-dismiss after the success state has had a moment to land.
//
// To swap providers in the future:
//   - Change LOOPS_FORM_URL to the new endpoint
//   - Adjust the body shape below if the new provider expects a different
//     field name (Loops uses `email` + optional `userGroup`)
//
// `userGroup` tags submissions in the Loops dashboard so the friend can see
// which signups came from this site vs other surfaces.

const LOOPS_FORM_URL = "https://app.loops.so/api/newsletter-form/cm6s5x8ld00nb78jzoupdwoux";
const SIGNUP_USER_GROUP = "play_site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// shared signup processor — used by both the deck-section form and the popup form.
// `options.autoDismissAfter` (ms) + `options.onAutoDismiss` callback let the popup
// auto-close after the success state has been visible for a beat.
async function processSignup(formEl, inputEl, feedbackEl, options = {}) {
  const email = inputEl.value.trim();

  if (!EMAIL_RE.test(email)) {
    feedbackEl.textContent = "that doesn't look like an email — try again?";
    feedbackEl.setAttribute("data-tone", "wrong");
    inputEl.focus();
    return;
  }

  const submitBtn = formEl.querySelector('button[type="submit"]');

  // loading state
  feedbackEl.textContent = "sending…";
  feedbackEl.removeAttribute("data-tone");
  if (submitBtn) submitBtn.disabled = true;
  inputEl.disabled = true;

  try {
    const res = await fetch(LOOPS_FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email,
        userGroup: SIGNUP_USER_GROUP,
      }),
    });

    // loops returns json with { success: true } on success and a body
    // with { success: false, message } on validation errors
    let data = null;
    try { data = await res.json(); } catch (_) { /* non-json response */ }

    if (!res.ok || (data && data.success === false)) {
      const msg = (data && data.message) || `signup failed (${res.status})`;
      throw new Error(msg);
    }

    // success — persist and update the deck-section form, even if this
    // popup was dismissed mid-fetch (the signup is real either way)
    markSignedUp(email);

    if (formEl.isConnected) {
      feedbackEl.textContent = "got it — you're on the list.";
      feedbackEl.setAttribute("data-tone", "right");
      formEl.classList.add("submitted");

      if (options.autoDismissAfter && typeof options.onAutoDismiss === "function") {
        setTimeout(options.onAutoDismiss, options.autoDismissAfter);
      }
    }
  } catch (err) {
    console.error("[signup] failed:", err);
    if (formEl.isConnected) {
      feedbackEl.textContent = "something broke. try again in a moment?";
      feedbackEl.setAttribute("data-tone", "wrong");
      // re-enable so the user can retry
      if (submitBtn) submitBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }
}

// called from any successful signup. persists, flips state, and replaces the
// deck-section form with a thanks state so the player isn't asked again.
function markSignedUp(email) {
  state.signedUpForEmail = true;
  try {
    localStorage.setItem(STORAGE_KEY_SIGNED_UP, "1");
  } catch (e) {
    // localStorage may be blocked (private mode, etc) — non-fatal
  }
  showDeckThanksState();
}

// replace the deck-section signup card contents with a static thank-you state.
// safe to call multiple times — it just rewrites the inner html.
function showDeckThanksState() {
  const container = document.querySelector(".deck-signup");
  if (!container) return;
  container.innerHTML = `
    <p class="deck-eyebrow deck-eyebrow-alt">★ subscribed ★</p>
    <h3 class="deck-signup-headline">you're on the list.</h3>
    <p class="deck-signup-body">
      thanks for signing up — i'll be in touch when there's something new to share.
    </p>
  `;
}

// thin wrapper for the deck-section form's submit event
function handleSignup(e) {
  e.preventDefault();
  processSignup(els.signupForm, els.signupEmail, els.signupFeedback);
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

  // returning visitor: if they signed up before, immediately swap the deck
  // section to its thanks state and skip any future email popups
  try {
    if (localStorage.getItem(STORAGE_KEY_SIGNED_UP) === "1") {
      state.signedUpForEmail = true;
      showDeckThanksState();
    }
  } catch (e) {
    // localStorage blocked — proceed without persistence
  }

  els.guessForm.addEventListener("submit", handleGuess);
  els.revealBtn.addEventListener("click", reveal);
  els.nextPuzzleBtn.addEventListener("click", nextPuzzle);
  els.signupForm.addEventListener("submit", handleSignup);

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
