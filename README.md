# Person Do Thing — play it

An interactive tutorial for [Person Do Thing](https://persondothing.com), a word-guessing game where the describer can only use **34 simple words**.

This site is a companion to/demo for the main reference page.

## Stack

```
index.html    markup
styles.css    riso/zine styling (cream paper, federal blue + fluorescent pink)
app.js        game state, puzzles, vocabulary palette
```

## Adding a puzzle

Open `app.js` and add an entry to the `PUZZLES` array:

```js
{
  answer: "ocean",
  accept: ["ocean", "oceans", "sea", "the sea"],
  clues: [
    "Big big place.",
    "More big than place person see.",
    "Many many thing in. Person no go in far.",
    "Same place, but other place same.",
  ],
},
```

**Constraint:** every clue may only use the 34 allowed words. On page load, the app validates every clue and prints a warning to the browser console if any word slips through. The 34 words are defined at the top of `app.js`:

- **Nouns:** Person, Place, Thing
- **Verbs:** Do, Feel, Go, Have, Like, Make, Say, See, Think, Use, Want
- **Adjectives:** Big, Far, Fast, Good, Hard, Hot, Many, Real
- **Connectors:** After, Before, More, Other, In, Up, Same, Again, And, But, Yes, No

Compounds like `no-big` (= "small") and `no-up` (= "down") are fine — the tokenizer splits on hyphens, so both halves still need to be in the allowed list.

The `accept` array is fuzzy-matched (case-insensitive, punctuation-stripped), so list any reasonable variants you want to count as correct.

## Retuning the look

The whole color palette lives in four CSS variables at the top of `styles.css`:

```css
--paper: #f3e9d2;   /* cream */
--ink:   #1c2960;   /* blue */
--pink:  #ff2e7e;   /* pink */
```

Change those and the rest of the page follows.

## Further improvement

- **Challenge mode** — visitor acts as describer with a keyboard restricted to the 34 words.
- More puzzles.
- Share-a-puzzle URL params.
