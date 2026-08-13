# THE MISSING DIAMOND
## Technical Specification for Codex

Create a complete browser-based educational detective game called **THE MISSING DIAMOND — A Grammar Detective Game**.

The game is an English grammar game for approximately **B1-level teenage learners (13–17 years old)**.

The interface and short story messages should use simple English whenever possible. The **HOW TO PLAY** instructions must be approximately **A1 level**.

The game must feel like a modern detective video game rather than a standard school quiz.

---

# 1. PROJECT GOAL

Create a complete static web game using:

- HTML
- CSS
- Vanilla JavaScript

Do NOT use:

- React
- Vue
- Firebase
- databases
- authentication
- backend/server code
- paid APIs
- external dependencies unless absolutely necessary

The finished project must be suitable for:

1. local development in VS Code;
2. GitHub repository;
3. GitHub Pages hosting;
4. embedding into Genially using the published HTTPS page.

Do not require a build process.

The game must work by opening the published `index.html`.

---

# 2. GAME FORMAT

The game contains:

- 1 Start Screen
- 1 How to Play modal
- 1 Case Briefing
- 3 game rounds
- 10 grammar tasks per round
- 30 tasks total
- story transitions between rounds
- evidence collection
- score system
- 3 lives per round
- sound effects
- background music
- volume control
- custom mouse crosshair
- animated detective
- final suspect selection
- final results screen
- case review

Main structure:

START SCREEN

↓

CASE BRIEFING

↓

ROUND 1 — CRIME SCENE

↓

STORY TRANSITION

↓

ROUND 2 — INTERROGATION

↓

STORY TRANSITION

↓

ROUND 3 — EVIDENCE BOARD

↓

WHO STOLE THE DIAMOND?

↓

CASE CLOSED

↓

RESULTS

---

# 3. VISUAL STYLE

IMPORTANT:

Do NOT use a cartoon, Pixar, anime, chibi or children's illustration style.

Use a:

**realistic digital illustration / cinematic detective game style**

The visuals should look illustrated, not photographic, but should have:

- realistic human proportions;
- realistic faces;
- realistic environments;
- cinematic lighting;
- detailed textures;
- realistic shadows;
- dramatic but elegant atmosphere.

The game should feel like a modern mystery/detective game.

## Color direction

Use mainly:

- dark navy;
- charcoal;
- deep grey;
- muted blue;
- warm amber/gold lighting;
- subtle burgundy/red for evidence strings;
- off-white for documents.

Avoid excessive neon colors.

Green and red should mainly be used for gameplay feedback.

---

# 4. DISPLAY AND RESPONSIVE DESIGN

Design primarily for desktop/laptop screens.

Main target aspect ratio:

**16:9**

The game must still resize reasonably inside an iframe.

Do not use fixed positioning that breaks when embedded.

Create a responsive game container.

Recommended internal reference resolution:

1920 × 1080

Scale proportionally when the browser window is smaller.

Do not require fullscreen mode.

---

# 5. PROJECT STRUCTURE

Use a clear structure similar to:

```text
missing-diamond/
│
├── index.html
│
├── README.md
│
├── GAME_INSTRUCTIONS.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── game.js
│   ├── questions.js
│   ├── audio.js
│   └── effects.js
│
└── assets/
    ├── images/
    ├── audio/
    └── icons/
```

Keep content, game logic, audio logic and visual effects reasonably separated.

---

# 6. IMAGE ASSETS

Do NOT attempt to create complicated human characters entirely with CSS.

Prepare the code to use replaceable image assets.

Expected image paths can include:

```text
assets/images/detective.png
assets/images/detective-thinking.png
assets/images/detective-success.png
assets/images/detective-wrong.png

assets/images/emma.png
assets/images/james.png
assets/images/oliver.png

assets/images/detective-office.webp
assets/images/museum-night.webp
assets/images/interrogation-room.webp
assets/images/evidence-board.webp
```

If these assets do not exist yet, create attractive temporary placeholders so the application remains fully usable.

The placeholders must be easy to replace later without rewriting game logic.

---

# 7. MAIN CHARACTER

The detective is:

**Alex Reed**

Alex is a young professional detective.

Approximate age:

25–30.

Suggested appearance:

- dark coat;
- shirt;
- notebook;
- intelligent and calm expression;
- modern detective appearance.

Alex acts as the game's guide.

---

# 8. DETECTIVE ANIMATION

Alex must not look completely static.

Create subtle idle animation.

Possible effects:

- gentle breathing;
- very small body movement;
- occasional head movement;
- subtle blinking if assets allow it.

Different visual states should be supported:

```text
idle
thinking
success
wrong
victory
```

During questions Alex can appear smaller in one corner.

During story scenes Alex may appear larger.

Animations should be subtle.

Do not make Alex bounce continuously.

---

# 9. START SCREEN

Create a cinematic detective office at night.

Possible environmental elements:

- investigation board;
- desk;
- warm desk lamp;
- photographs;
- documents;
- coffee cup;
- newspaper;
- evidence photographs.

Show the title:

# THE MISSING DIAMOND

Subtitle:

**A Grammar Detective Game**

Main buttons:

**START INVESTIGATION**

**HOW TO PLAY**

Place Alex on one side of the screen.

Add subtle ambient animation.

Examples:

- lamp glow;
- dust particles;
- very slow background movement;
- detective breathing.

---

# 10. MODERN BUTTON DESIGN

Buttons must look interactive and modern.

Use:

- subtle depth;
- soft shadows;
- slight gradient;
- edge highlight;
- restrained glow;
- smooth hover animation.

On hover:

- move approximately 2–4 px upward;
- increase shadow;
- slightly brighten.

On click:

- move slightly downward;
- reduce shadow;
- create a pressed-button feeling.

Avoid flat default HTML buttons.

---

# 11. HOW TO PLAY

The START SCREEN must contain a visible:

**HOW TO PLAY**

button.

Clicking it opens a modal without leaving the start screen.

Use very simple English, approximately A1.

Display:

# HOW TO PLAY

🎯 Move the target with your mouse.

🔫 Click to shoot.

🔎 Find the correct answer or the mistake.

❤️ You have 3 lives.

🧩 Find clues.

🕵️ Catch the thief!

Button:

**GOT IT!**

Keep this screen short.

Do not put long explanations here.

---

# 12. AUDIO SYSTEM

Prepare an audio system for:

```text
assets/audio/background.mp3
assets/audio/shot.mp3
assets/audio/correct.mp3
assets/audio/wrong.mp3
assets/audio/clue.mp3
assets/audio/round-complete.mp3
assets/audio/victory.mp3
```

If the files are temporarily unavailable, the game must NOT crash.

The code must gracefully continue without them.

---

# 13. BACKGROUND MUSIC

Background music should:

- begin after the user presses START INVESTIGATION;
- loop continuously;
- play quietly underneath sound effects.

Do NOT attempt to autoplay audio before the first user interaction.

---

# 14. VOLUME CONTROL

Place a sound control in a corner of the interface.

Example:

🔊 ━━━━━●

Include:

- speaker button;
- volume slider;
- mute/unmute functionality.

The slider should control the overall game audio.

Remember the chosen volume during the current browser session.

If practical, use `localStorage` to remember the volume for future visits as well.

---

# 15. CUSTOM CROSSHAIR

During gameplay, hide the normal mouse cursor inside the game area.

Replace it with a custom detective target/crosshair.

The crosshair must follow mouse movement smoothly.

The crosshair should contain:

- circular outer ring;
- thin cross lines;
- small center point.

Do NOT make it look excessively military.

It should fit the detective theme.

---

# 16. CROSSHAIR INTERACTION

Normal state:

neutral light-colored crosshair.

When hovering over a shootable object:

- slightly contract the crosshair;
- subtly highlight the object.

IMPORTANT:

Do NOT reveal whether an answer is correct before the player shoots.

Never make the target green before clicking a correct answer.

Never make it red before clicking a wrong answer.

---

# 17. SHOOTING EFFECT

Mouse click on a shootable object = shot.

On every shot:

1. play `shot.mp3`;
2. create a short flash at the center of the crosshair;
3. briefly enlarge/recoil the crosshair;
4. animate the selected object.

Keep the effect fast.

Do not block the screen with excessive particles.

---

# 18. CORRECT ANSWER EFFECT

After a correct shot:

- play correct sound;
- show green highlight;
- show +100;
- animate the corrected answer;
- update score.

Example:

Player shoots:

`broke`

Display:

~~broke~~

then:

**broken ✓**

Show:

**+100**

If the answer reveals important story information, show:

**NEW EVIDENCE**

and add an evidence card.

---

# 19. WRONG ANSWER EFFECT

After a wrong shot:

- play wrong sound;
- briefly show red screen-edge glow;
- briefly highlight selected object red;
- remove one life;
- reset combo.

Do NOT immediately reveal the correct answer.

Allow the player to try the same question again.

---

# 20. LIVES

Each round starts with:

❤️ ❤️ ❤️

A wrong shot removes one life.

Example:

❤️ ❤️ ❤️

↓

❤️ ❤️

If all three lives are lost:

show:

# TRY THIS CASE AGAIN

Restart only the current round.

Do NOT restart the entire game.

---

# 21. SCORE

Correct answer:

**+100**

Three correct answers in a row:

**COMBO +50**

Five correct answers in a row:

**SUPER DETECTIVE +100**

Wrong answer:

combo resets.

Display HUD information such as:

**SCORE 1450**

❤️❤️❤️

**ROUND 2 / 3**

---

# 22. NO COUNTDOWN TIMER

Do NOT add a countdown timer.

The player must have enough time to read and think.

However, track total play time silently.

Show total time on the final results screen.

---

# 23. EVIDENCE SYSTEM

Create an Evidence button visible during gameplay.

Example:

**📁 EVIDENCE 4/10**

When important evidence is discovered:

1. show evidence card;
2. play clue sound;
3. animate the card toward the Evidence button;
4. increase evidence count.

Clicking EVIDENCE opens an overlay/panel.

The game pauses while the evidence panel is open.

Show all story clues collected so far.

This is important because the player will need them for the final decision.

---

# 24. CASE BRIEFING

After pressing START INVESTIGATION:

fade the Start Screen out.

Show a cinematic CASE BRIEFING screen.

Background:

night museum / empty diamond display case.

Display text progressively in short sections.

Use:

# CASE #017

# THE MISSING DIAMOND

Story:

**The Blue Star is a famous diamond.**

**Last night, someone stole it from the City Museum.**

**The museum closed at 9:00 p.m.**

**The alarm went off at 9:40 p.m.**

**The doors were not broken.**

**The windows were closed.**

Then:

**The thief may know the museum.**

Show Alex.

Alex says:

**“We have three suspects. Let's find the truth.”**

Then introduce:

**EMMA BROOKS**  
Museum Curator

**JAMES MILLER**  
Security Guard

**OLIVER GRANT**  
Photographer

Do NOT reveal which suspect is more likely to be guilty.

Button:

**ENTER THE CRIME SCENE →**

---

# 25. MAIN STORY

The Blue Star diamond was stolen from a museum.

The museum closed at 9:00 p.m.

The alarm went off at 9:40 p.m.

The thief did not break a window or main door.

The thief had knowledge/access connected to the museum.

Three suspects exist.

---

# 26. SUSPECT — EMMA BROOKS

Occupation:

Museum Curator.

Emma organized the exhibition.

She knows the museum and has a key to the exhibition room.

Her statement:

**“I was in my office all evening.”**

Emma looks suspicious at first.

However, she is innocent.

Computer activity helps support her story.

---

# 27. SUSPECT — JAMES MILLER

Occupation:

Security Guard.

James discovered the missing diamond.

He knows the security system.

His statement:

**“I was checking the second floor.”**

James also looks suspicious.

However, he is innocent.

Security camera footage supports his story.

---

# 28. SUSPECT — OLIVER GRANT

Occupation:

Photographer.

Oliver photographed the exhibition.

His statement:

**“I left the museum at nine.”**

Oliver is lying.

Oliver is the thief.

Important evidence:

His camera automatically uploaded a photograph at 9:27 p.m.

Therefore, he was still inside the museum after 9:00.

A small metal piece found near the diamond display belongs to his damaged camera strap.

These clues must allow the player to logically identify Oliver.

---

# 29. ROUND 1 — CRIME SCENE

Title:

# ROUND 1

## CRIME SCENE

Instruction:

**Find 10 mistakes.**

Environment:

museum at night.

Include:

- empty diamond display;
- evidence markers;
- security camera;
- dark exhibition room;
- police/evidence atmosphere.

## Mechanic

Show one sentence.

One word/expression contains a grammar mistake.

Make sentence words individually shootable.

Player must shoot the incorrect word.

---

# 30. ROUND 1 QUESTIONS

## Question 1

Sentence:

**The museum close at 9 p.m.**

Shoot:

`close`

Correction:

`closed`

Evidence:

**The museum closed at 9:00 p.m.**

---

## Question 2

Sentence:

**The alarm ringed at 9:40 p.m.**

Shoot:

`ringed`

Correction:

`rang`

Evidence:

**The alarm went off at 9:40 p.m.**

---

## Question 3

Sentence:

**The guard don't remember seeing anyone.**

Shoot:

`don't`

Correction:

`doesn't`

---

## Question 4

Sentence:

**Someone open the display case.**

Shoot:

`open`

Correction:

`opened`

---

## Question 5

Sentence:

**The window wasn't broke.**

Shoot:

`broke`

Correction:

`broken`

Evidence:

**The window was not broken.**

---

## Question 6

Sentence:

**There was a small metal piece in the floor.**

Shoot:

`in`

Correction:

`on`

Evidence:

**A small metal piece was found near the display case.**

---

## Question 7

Sentence:

**The thief didn't used the main door.**

Shoot:

`used`

Correction:

`use`

---

## Question 8

Sentence:

**Emma has a key of the exhibition room.**

Shoot:

`of`

Correction:

`to`

Evidence:

**Emma has a key to the exhibition room.**

---

## Question 9

Sentence:

**The security camera stop working at 9:20.**

Shoot:

`stop`

Correction:

`stopped`

Evidence:

**Camera 3 stopped working at 9:20.**

---

## Question 10

Sentence:

**Someone was inside the museum after it has closed.**

Shoot:

`has`

Correction:

`had`

Evidence:

**Someone was still inside the museum after closing time.**

---

# 31. ROUND 1 TRANSITION

After question 10:

fade to the investigation board.

Show Alex.

Evidence cards appear one after another.

Include important clues such as:

- Museum closed — 9:00
- Camera stopped — 9:20
- Window intact
- Metal piece
- Emma's key

Play subtle evidence sounds.

Alex says:

**“This was not a normal robbery.”**

Then:

**“The thief knew the museum.”**

Show three suspect photographs:

Emma

James

Oliver

Button:

**START INTERROGATION**

---

# 32. ROUND 2 — INTERROGATION

Title:

# ROUND 2

## INTERROGATION

Environment:

cinematic interrogation room.

## Mechanic

Show a sentence with a blank.

Show three large answer cards.

The player shoots the correct answer.

Example:

Emma said she ___ in her office.

IS

WAS

WERE

Correct:

WAS

After correct answer:

show:

**STATEMENT VERIFIED**

---

# 33. ROUND 2 QUESTIONS

## Question 11

**Emma said she ___ in her office at 9:30.**

Answers:

IS / WAS / WERE

Correct:

**WAS**

---

## Question 12

**She ___ working on a report when the alarm rang.**

Answers:

IS / WAS / HAS

Correct:

**WAS**

Evidence:

**Emma was working on her computer.**

---

## Question 13

**The computer shows that she ___ a file at 9:32.**

Answers:

SAVED / SAVE / HAS SAVE

Correct:

**SAVED**

Evidence:

**Emma saved a document at 9:32.**

---

## Question 14

**James said he ___ the second floor.**

Answers:

WAS CHECKING / CHECKS / HAS CHECK

Correct:

**WAS CHECKING**

---

## Question 15

**He ___ the security room at 9:35.**

Answers:

LEAVES / LEFT / HAS LEAVE

Correct:

**LEFT**

---

## Question 16

**Another camera ___ James on the second floor.**

Answers:

RECORDED / RECORD / WAS RECORD

Correct:

**RECORDED**

Evidence:

**James was on the second floor at 9:37.**

---

## Question 17

**Oliver said he ___ the museum at 9:00.**

Answers:

LEFT / LEAVE / LEAVES

Correct:

**LEFT**

---

## Question 18

**He said he ___ home before the alarm rang.**

Answers:

**HAD GONE / WENT / HAS GONE**

Correct:

**HAD GONE**

---

## Question 19

**Oliver said he ___ returned to the museum.**

Answers:

HAD NEVER / NEVER / HAS NEVER

Correct:

**HAD NEVER**

This is only Oliver's statement.

Do NOT treat it as verified evidence.

---

## Question 20

**The detective thinks that one suspect ___ lying.**

Answers:

IS / ARE / WERE

Correct:

**IS**

After answering:

display dramatically:

# ONE SUSPECT IS LYING.

---

# 34. ROUND 2 TRANSITION

Return to the investigation board.

Show:

Emma → computer evidence

James → security camera evidence

Oliver → only his own statement

Do NOT explicitly say Oliver is guilty.

Show:

# NEW EVIDENCE FOUND

📷 **A CAMERA MEMORY CARD**

Alex says:

**“We need to check the evidence.”**

Button:

**OPEN EVIDENCE BOARD**

---

# 35. ROUND 3 — EVIDENCE BOARD

Title:

# ROUND 3

## EVIDENCE BOARD

This should visually be the strongest round.

Use a large detective board with:

- photographs;
- documents;
- time notes;
- camera;
- metal object;
- map;
- evidence labels;
- red strings.

## Mechanic

Show sentence and three possible answers.

Player shoots the correct answer.

Each important correct answer adds/connects evidence.

Animate red strings between related evidence cards.

---

# 36. ROUND 3 QUESTIONS

## Question 21

**By the time the police arrived, the thief ___.**

Answers:

ESCAPED / HAD ESCAPED / HAS ESCAPED

Correct:

**HAD ESCAPED**

---

## Question 22

**Emma ___ her computer at 9:32.**

Answers:

WAS USING / USE / HAS USED

Correct:

**WAS USING**

Connect:

Emma → Computer Log

---

## Question 23

**James ___ on camera at 9:37.**

Answers:

WAS SEEN / SAW / HAS SEE

Correct:

**WAS SEEN**

Connect:

James → Security Camera

---

## Question 24

**Oliver said that he ___ before 9:00.**

Answers:

HAD LEFT / HAS LEFT / LEAVES

Correct:

**HAD LEFT**

---

## Question 25

**But his camera ___ a photo at 9:27.**

Answers:

UPLOADED / UPLOAD / WAS UPLOAD

Correct:

**UPLOADED**

Important evidence:

**Oliver's camera uploaded a photo at 9:27 p.m.**

---

## Question 26

**The photo was taken ___ the museum.**

Answers:

IN / ON / AT

Correct:

**IN**

Important evidence:

**Oliver was still inside the museum at 9:27.**

---

## Question 27

**The metal piece belongs ___ a camera strap.**

Answers:

TO / FOR / WITH

Correct:

**TO**

---

## Question 28

**Oliver's camera strap ___ damaged.**

Answers:

WAS / WERE / IS BEEN

Correct:

**WAS**

Connect:

Metal Piece → Oliver's Camera

---

## Question 29

**Someone ___ Camera 3 before taking the diamond.**

Answers:

DISABLED / DISABLE / HAS DISABLE

Correct:

**DISABLED**

---

## Question 30

**The thief ___ access to the exhibition before the robbery.**

Answers:

HAD / HAS / HAVE

Correct:

**HAD**

After the final answer:

slowly connect the evidence board.

Increase musical tension.

Connect Oliver visually to:

- camera upload;
- 9:27 timestamp;
- metal camera strap piece;
- museum location;
- suspicious statement.

Do NOT automatically announce his guilt.

The player must decide.

---

# 37. FINAL DECISION

After Round 3:

fade the screen nearly to black.

Reduce music volume.

Temporarily hide the crosshair.

Display:

# YOU HAVE ALL THE EVIDENCE.

Then:

# WHO STOLE THE BLUE STAR?

Show three large suspect cards:

**EMMA BROOKS**  
Museum Curator

**JAMES MILLER**  
Security Guard

**OLIVER GRANT**  
Photographer

Bring the crosshair back.

The player must shoot one suspect.

---

# 38. CORRECT FINAL CHOICE

If the player shoots Oliver:

play shot.

Pause briefly.

Highlight Oliver.

Play correct/victory effect.

Show:

# GUILTY

Then:

# CASE CLOSED

## THE BLUE STAR HAS BEEN FOUND

Explain using simple English:

**Oliver said he left at 9:00.**

**But his camera took a photo at 9:27.**

**A piece of his camera strap was found near the diamond.**

**He lied.**

Show Alex in victory state.

---

# 39. WRONG FINAL CHOICE

If player chooses Emma or James:

play wrong sound.

Show red edge glow.

Do NOT immediately end the game.

Display:

# LOOK AT THE EVIDENCE AGAIN

Hint:

**One suspect lied about the time.**

Allow another attempt.

---

# 40. FINAL RESULTS

After solving the case, show:

# DETECTIVE REPORT

Include:

**Score**

**Accuracy**

**Correct Shots**

**Wrong Shots**

**Evidence Found**

**Time**

Example:

Score: **2,850**

Accuracy: **87%**

Correct Shots: **30**

Wrong Shots: **5**

Evidence Found: **10/10**

Time: **08:42**

---

# 41. DETECTIVE RANK

Calculate a rank based mainly on accuracy.

Possible ranks:

🥉 **JUNIOR DETECTIVE**

🥈 **SKILLED DETECTIVE**

🥇 **MASTER DETECTIVE**

Use reasonable thresholds.

For example:

90%+:

MASTER DETECTIVE

75–89%:

SKILLED DETECTIVE

Below 75%:

JUNIOR DETECTIVE

---

# 42. END SCREEN BUTTONS

Include:

**PLAY AGAIN**

**REVIEW THE CASE**

PLAY AGAIN resets:

- questions;
- score;
- lives;
- evidence;
- combo;
- timer;
- final choice.

Keep the user's audio volume preference.

---

# 43. REVIEW THE CASE

REVIEW THE CASE should show all 30 grammar sentences with their correct forms/answers.

Organize them by:

ROUND 1

ROUND 2

ROUND 3

This is an educational review, not another shooting round.

Make it easy to read.

Include a button:

**BACK TO RESULTS**

---

# 44. STORY INTEGRITY

The story must make logical sense.

Do not accidentally reveal Oliver as the thief before the final decision.

Evidence should gradually change suspicion:

Round 1:

Emma and James can look suspicious too.

Round 2:

Emma and James gain stronger alibis.

Oliver's story remains less supported.

Round 3:

evidence clearly contradicts Oliver's statement.

The player should be able to logically solve the mystery.

---

# 45. TRANSITIONS

Avoid abrupt page changes.

Use short cinematic transitions such as:

- fade to black;
- light flicker;
- board reveal;
- evidence card movement;
- subtle camera zoom;
- text fade;
- red string drawing.

Animations should usually take less than approximately 1 second.

Story transitions can be slightly longer.

Do not make the player wait unnecessarily.

---

# 46. ACCESSIBILITY / READABILITY

Grammar text is the most important content.

Always keep it highly readable.

Use:

- large text;
- strong contrast;
- clear spacing;
- readable fonts.

Do not place important text directly over visually busy backgrounds without an overlay.

Use dark translucent panels when necessary.

---

# 47. GAME STATE

Create a central game state object containing values such as:

```javascript
{
  round: 1,
  questionIndex: 0,
  score: 0,
  lives: 3,
  combo: 0,
  correctShots: 0,
  wrongShots: 0,
  evidence: [],
  startTime: null,
  endTime: null,
  volume: 0.5,
  muted: false
}
```

Do not scatter essential state across many unrelated global variables.

---

# 48. QUESTION DATA

Store questions separately from rendering logic.

For example, `questions.js` should contain structured data.

Each question can include fields such as:

```javascript
{
  id: 1,
  round: 1,
  type: "find-error",
  sentence: "The museum close at 9 p.m.",
  target: "close",
  correction: "closed",
  evidence: {
    important: true,
    text: "The museum closed at 9:00 p.m."
  }
}
```

For multiple-choice questions:

```javascript
{
  id: 11,
  round: 2,
  type: "multiple-choice",
  sentence: "Emma said she ___ in her office at 9:30.",
  answers: ["IS", "WAS", "WERE"],
  correct: "WAS"
}
```

This is important so questions can be edited later without rewriting game logic.

---

# 49. AUDIO CODE

Keep audio management in `audio.js`.

Provide reusable functions such as:

```javascript
playShot()
playCorrect()
playWrong()
playClue()
playRoundComplete()
playVictory()
setVolume()
toggleMute()
```

Do not duplicate audio logic throughout the game.

---

# 50. EFFECT CODE

Keep reusable visual effects in `effects.js` when practical.

Examples:

```javascript
showShotFlash()
showCorrectEffect()
showWrongEffect()
animateEvidence()
drawEvidenceString()
showScorePopup()
```

---

# 51. KEYBOARD / TOUCH FALLBACK

The primary interaction is mouse aiming.

However, do not make the page completely unusable without the custom cursor.

Buttons must remain standard clickable HTML controls underneath their visual styling.

For touch devices, allow tapping answers directly.

Do not require hover to answer a question.

---

# 52. GENIALLY COMPATIBILITY

The project will later be embedded in Genially.

Therefore:

- avoid browser popups;
- avoid opening unnecessary new windows;
- avoid requiring fullscreen;
- avoid relying on browser navigation;
- keep all gameplay inside the game container;
- make sizing responsive;
- use relative local asset paths;
- avoid mixed HTTP content;
- do not depend on a backend;
- do not depend on cookies for core functionality.

The published game should work over HTTPS.

---

# 53. GITHUB PAGES COMPATIBILITY

The project must work as a static GitHub Pages site.

Use relative paths.

Good:

```text
./assets/images/detective.png
```

Avoid absolute local computer paths.

Never use paths such as:

```text
/Users/name/Desktop/...
C:\Users\...
```

Do not require environment variables for basic operation.

---

# 54. ERROR HANDLING

Missing decorative image or audio files must not completely break the game.

If an image is missing:

use a fallback background/card.

If an audio file is missing:

continue silently.

Do not generate repeated console errors during normal gameplay if avoidable.

---

# 55. PERFORMANCE

Keep the game lightweight.

Avoid:

- large JavaScript frameworks;
- excessive particles;
- hundreds of simultaneous DOM elements;
- unnecessarily large video backgrounds.

Prefer optimized:

- WebP images;
- compressed audio;
- CSS animations;
- lightweight JavaScript.

This is especially important because the game will later run inside Genially.

---

# 56. FIRST-LOAD EXPERIENCE

When the website loads:

1. show the Start Screen quickly;
2. do not wait for every audio file before showing UI;
3. preload essential visual assets;
4. load secondary assets without blocking the entire page;
5. allow START INVESTIGATION after required game assets are ready.

If loading takes noticeable time, show a tasteful:

**LOADING CASE...**

indicator.

---

# 57. GAME FEEL

The final product must NOT feel like:

"a quiz with a detective background."

It should feel like:

"a small detective game that teaches grammar."

Use the story, evidence, character reactions, sound, crosshair, transitions and investigation board to create that feeling.

At the same time, do not sacrifice readability or grammar learning for visual effects.

---

# 58. IMPORTANT UX RULES

Do NOT:

- reveal correct answers on hover;
- immediately show the correct answer after a wrong shot;
- force the player to restart the whole game after losing one round;
- use long blocks of story text;
- add a countdown timer;
- autoplay audio before user interaction;
- make animations excessively long;
- hide important grammar text behind decorative graphics.

DO:

- give immediate feedback;
- keep story text short;
- make evidence meaningful;
- allow players to think;
- make buttons clearly interactive;
- make the final mystery logically solvable.

---

# 59. DEVELOPMENT ORDER

Implement the project in this order.

## Phase 1 — Functional prototype

Build:

- project files;
- screen navigation;
- all 30 questions;
- round logic;
- lives;
- score;
- evidence;
- final suspect selection;
- results;
- review screen.

Use simple placeholders.

Verify that the entire game can be completed from beginning to end.

## Phase 2 — Interaction

Add:

- custom crosshair;
- shooting;
- hover interactions;
- correct/wrong feedback;
- combo;
- evidence animations.

## Phase 3 — Audio

Add:

- background music system;
- shot;
- correct;
- wrong;
- clue;
- round completion;
- victory;
- mute;
- volume slider.

## Phase 4 — Visual polish

Add:

- cinematic backgrounds;
- detective;
- suspects;
- realistic illustrated visual treatment;
- 3D-style buttons;
- transitions;
- evidence board strings;
- subtle environmental animations.

## Phase 5 — Compatibility testing

Test:

- local browser;
- GitHub Pages paths;
- different desktop resolutions;
- iframe-like dimensions;
- sound on/off;
- missing asset fallback;
- replay/reset;
- Review the Case.

---

# 60. ACCEPTANCE CHECKLIST

Before considering the game complete, verify all of the following:

- [ ] Start screen works.
- [ ] START INVESTIGATION works.
- [ ] HOW TO PLAY opens and closes.
- [ ] Rules use simple English.
- [ ] Background music begins only after interaction.
- [ ] Volume slider works.
- [ ] Mute works.
- [ ] Custom crosshair follows the mouse.
- [ ] Normal cursor is hidden only where appropriate.
- [ ] Shooting sound works.
- [ ] Correct feedback works.
- [ ] Wrong feedback works.
- [ ] Lives work.
- [ ] Current round restarts after losing all lives.
- [ ] Score works.
- [ ] Combo works.
- [ ] Evidence can be collected.
- [ ] Evidence panel opens and closes.
- [ ] Round 1 contains exactly 10 tasks.
- [ ] Round 2 contains exactly 10 tasks.
- [ ] Round 3 contains exactly 10 tasks.
- [ ] All 30 answers are grammatically correct.
- [ ] Story transitions work.
- [ ] Emma's evidence makes sense.
- [ ] James's evidence makes sense.
- [ ] Oliver's evidence makes sense.
- [ ] Oliver is not revealed too early.
- [ ] Final suspect selection works.
- [ ] Wrong final suspect allows another attempt.
- [ ] Oliver triggers CASE CLOSED.
- [ ] Final statistics are calculated correctly.
- [ ] Detective rank works.
- [ ] PLAY AGAIN fully resets the game.
- [ ] REVIEW THE CASE displays all 30 answers.
- [ ] Missing audio does not crash the game.
- [ ] Missing decorative images do not crash the game.
- [ ] Relative asset paths are used.
- [ ] Game works without backend/database.
- [ ] Layout remains usable at iframe-sized resolutions.
- [ ] No important interaction requires browser fullscreen.
- [ ] Console has no major runtime errors.

---

# 61. FINAL CODE QUALITY REQUIREMENTS

Write clean and understandable code.

Use meaningful function and variable names.

Add comments around important systems, but do not over-comment obvious code.

Avoid one enormous JavaScript function.

Separate:

- question data;
- audio;
- effects;
- core game state/logic.

The project should be understandable enough that a beginner can later change:

- a question;
- a suspect name;
- a sound;
- an image;
- a background;
- a score value

without rebuilding the whole application.

---

# 62. FINAL INSTRUCTION TO CODEX

Build the game incrementally.

Do not skip the functional prototype and jump directly into visual effects.

First make the entire game playable from START INVESTIGATION to CASE CLOSED using placeholders.

Then add interaction, animation, audio and visual polish.

After each major phase, check for JavaScript errors and verify that existing functionality still works.

Do not remove or simplify major requirements from this specification without a technical reason.

The finished game should be polished, atmospheric, educational and easy to deploy as a static website.

**Core experience:**

> Read → Aim → Shoot → Discover → Investigate → Solve the case.
