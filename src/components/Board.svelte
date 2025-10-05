<script lang="ts">
  import deaths from "$lib/deaths.json";
  import {
    getImageFromWikidata,
    getWikipediaSections,
    formatWikidataDate,
  } from "$lib/apiHelpers";
  import { onMount } from "svelte";
  import Draggable from "./Draggable.svelte";

  let person: any;
  let deathOptions: string[] = [];
  let imageUrl: string | null = null;
  let wikiData: any;
  let isLoading = true;
  let showAnswer = false;
  let isCorrect = false;

  // Streak counters
  let currentStreak = 0;
  let bestStreak = 0;

  // Create a map of death types to people who died from that cause
  let deathTypeMap: Map<string, any[]> = new Map();
  let usedDeathTypes: Set<string> = new Set();

  // Initialize the death type map
  function initializeDeathTypeMap() {
    deathTypeMap.clear();
    deaths.forEach((death) => {
      const causeOfDeath = death.causeOfDeathLabel;
      if (causeOfDeath) {
        if (!deathTypeMap.has(causeOfDeath)) {
          deathTypeMap.set(causeOfDeath, []);
        }
        deathTypeMap.get(causeOfDeath)!.push(death);
      }
    });
  }

  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickDiversePersonAndDeathType() {
    const availableDeathTypes = Array.from(deathTypeMap.keys()).filter(
      (deathType) => !usedDeathTypes.has(deathType)
    );

    // If we've used all death types, reset for diversity
    if (availableDeathTypes.length === 0) {
      usedDeathTypes.clear();
      availableDeathTypes.push(...Array.from(deathTypeMap.keys()));
    }

    // Pick a random unused death type
    const selectedDeathType = pickRandom(availableDeathTypes);
    usedDeathTypes.add(selectedDeathType);

    // Pick a random person who died from this cause
    const peopleWithThisDeath = deathTypeMap.get(selectedDeathType)!;
    const selectedPerson = pickRandom(peopleWithThisDeath);

    return selectedPerson;
  }

  async function newRound() {
    isLoading = true;
    showAnswer = false;

    // Use the diverse selection method
    person = pickDiversePersonAndDeathType();

    imageUrl = await getImageFromWikidata(person.person);
    wikiData = await getWikipediaSections(person.person);

    console.log(wikiData);

    deathOptions = [person.causeOfDeathLabel];

    // Get all available death types for wrong options
    const allDeathTypes = Array.from(deathTypeMap.keys()).filter(
      (deathType) => deathType !== person.causeOfDeathLabel
    );

    while (deathOptions.length < 4 && allDeathTypes.length > 0) {
      const randomDeathType = pickRandom(allDeathTypes);
      if (!deathOptions.includes(randomDeathType)) {
        deathOptions.push(randomDeathType);
      }
      // Remove from available options to avoid picking same one again
      const index = allDeathTypes.indexOf(randomDeathType);
      allDeathTypes.splice(index, 1);
    }

    // Shuffle options
    deathOptions = deathOptions.sort(() => Math.random() - 0.5);
    isLoading = false;
  }

  function answer(selected: string) {
    if (showAnswer) {
      return;
    }

    isCorrect = selected === person.causeOfDeathLabel;

    if (isCorrect) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }

    showAnswer = true;

    setTimeout(() => {
      // Scroll to the answer section
      const answerSection = document.querySelector(".answer-section");
      if (answerSection) {
        answerSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }

  onMount(async () => {
    initializeDeathTypeMap();
    newRound();
  });
</script>

<div class="streak-container">
  <div class="current-streak-wrapper">
    <img src="clock.png" alt="clock" />
    <div class="current-streak-content">
      <p>{currentStreak}</p>
    </div>
  </div>
  <div class="best-streak-wrapper">
    <img src="high_score.png" alt="high score" />
    <div class="best-streak-content">
      <p>{bestStreak}</p>
    </div>
  </div>
</div>

<div class="board">
  <div class="intro">
    <h2 class="question">What killed {person?.personLabel}?</h2>
  </div>

  {#if !isLoading}
    {#if imageUrl}
      <Draggable width={600} height={200} contentKey={person.person}>
        <div class="picture-wrapper">
          <img src="/frame.png" class="frame" alt="frame" />
          <img
            src={imageUrl}
            alt={person.personLabel}
            draggable="false"
            class="picture"
          />
        </div>
      </Draggable>
    {/if}

    <Draggable width={700} height={400} contentKey={person.person}>
      <div class="birth-wrapper">
        <img src="birth_certificate.png" alt="Birth Certificate" />
        <div class="birth-content">
          <p>Born: {formatWikidataDate(person?.birthDate)}</p>
          <p>Gender: {person?.gender}</p>
        </div>
      </div>
    </Draggable>

    <Draggable width={700} height={350} contentKey={person.person}>
      <div class="passport-wrapper">
        <img src="passport.png" alt="passport" />

        <div class="passport-content">
          <p>Birthplace: {person?.placeOfBirth}</p>
          <p>Citizenship: {person?.citizenship.split("|").join(", ")}</p>
        </div>
      </div>
    </Draggable>

    <Draggable width={700} height={350} contentKey={person.person}>
      <div class="resume-wrapper">
        <img src="resume.png" alt="Resume" />
        <div class="resume-content">
          <p>Occupation: {person?.occupation.split("|").join(", ")}</p>
        </div>
      </div>
    </Draggable>
  {:else}
    <div class="loading">
      <p>Loading new case...</p>
    </div>
  {/if}
</div>

{#if !isLoading}
  <div class="options-container">
    <div class="options">
      <button on:click={() => answer(deathOptions[0])} class="button-container">
        <img src="ghost.png" alt="ghost" />
        {deathOptions[0]}
      </button>
      <button on:click={() => answer(deathOptions[1])} class="button-container">
        <img src="zombie.png" alt="zombie" />
        {deathOptions[1]}
      </button>
      <button on:click={() => answer(deathOptions[2])} class="button-container">
        <img src="rip.png" alt="rip" />
        {deathOptions[2]}
      </button>
      <button on:click={() => answer(deathOptions[3])} class="button-container">
        <img src="skull.png" alt="skull" />
        {deathOptions[3]}
      </button>
    </div>
    {#if !showAnswer}
      <div class="options">
        <button on:click={newRound}>Skip</button>
      </div>
    {/if}
  </div>
{/if}

{#if showAnswer}
  <div class="answer-section">
    <div class="answer-content">
      <h3 class="answer-title">
        {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
      </h3>
      <p class="correct-answer">
        The correct answer was: <strong>{person.causeOfDeathLabel}</strong>
      </p>
      {#if wikiData?.url}
        <p class="wikipedia-link">
          <a href={wikiData.url} target="_blank" rel="noopener noreferrer">
            Read more about {person.personLabel} on Wikipedia →
          </a>
        </p>
      {/if}
      <button on:click={newRound} class="next-button">Next Person</button>
    </div>
  </div>
{/if}

<style>
  .streak-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .current-streak-wrapper {
    position: relative;
    width: calc(196px * 1.3);
    height: calc(150px * 1.3);
    margin-left: 30px;
    bottom: -20px;
  }

  .streak-label p {
    position: absolute;
    top: -50px;
  }

  .current-streak-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .current-streak-content {
    position: absolute;
    text-align: center;
    color: black;
    width: 100%;
  }

  .best-streak-wrapper {
    position: relative;
    width: calc(191px * 1.3);
    height: calc(131x * 1.3);
    margin-left: 30px;
    bottom: -60px;
    right: -60px;
  }

  .best-streak-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .best-streak-content {
    position: absolute;
    text-align: center;
    color: black;
    width: 100%;
    bottom: 50px;
  }

  .best-streak-content p {
    font-size: 60px;
    margin: 0;
    text-align: center;
    margin-top: 86px;
    margin-right: 47px;
  }

  p {
    font-family: "Caveat", cursive;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
  }

  .intro {
    display: flex;
    width: 100%;
    justify-content: center;
    position: absolute;
    font-size: 30px;
    text-align: left;
    color: black;
    top: 45px;
    padding: 0px 15px 0px 25px;
  }

  .question {
    width: fit-content;
    font-family: "Caveat", cursive;
    font-size: 30px;
    margin-top: 0px;
    padding: 35px 45px;
    background-image: url("paper.png");
    background-size: 100% 100%;
  }

  .board {
    width: 100%;
    min-height: 600px;
    background-image: url("board.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
  }

  .resume-wrapper {
    position: relative;
    width: calc(134px * 1.5);
    height: calc(183px * 1.5);
  }

  .resume-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .resume-content {
    position: absolute;
    text-align: left;
    color: black;
    top: 45px;
    padding: 0px 25px 0px 20px;
  }

  .birth-wrapper {
    position: relative;
    width: calc(168px * 1.8);
    height: calc(98px * 1.8);
  }

  .birth-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .birth-content {
    position: absolute;
    text-align: left;
    color: black;
    bottom: 15px;
    padding: 0px 25px 0px 35px;
  }

  .passport-wrapper {
    position: relative;
    width: calc(140px * 1.5);
    height: calc(187px * 1.5);
  }

  .passport-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .passport-content {
    position: absolute;
    text-align: center;
    color: gold;
    bottom: 5px;
    margin-right: 25px;
    margin-left: 10px;
    padding: 0;
  }

  .passport-content p {
    margin: 10px 6px;
    font-size: 19px;
  }

  .picture-wrapper {
    position: relative;
    width: 300px;
    height: 400px;
  }

  .frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .picture {
    padding: 30px;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    object-fit: cover;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .options {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }

  button.button-container {
    display: flex;
    flex-direction: row;
    border-style: solid;
    border-width: 10px 10px 10px 10px;
    border-image: url("button.svg") 10 10 10 10 stretch stretch;
    background: white;
    font-family: "Caveat", cursive;
    font-size: 26px;
    text-transform: capitalize;
    border-radius: 5px;
  }

  button {
    border-style: solid;
    border-width: 10px 10px 10px 10px;
    border-image: url("button.svg") 10 10 10 10 stretch stretch;
    background: white;
    font-family: "Caveat", cursive;
    font-size: 26px;
  }

  button:hover {
    background: #ddd;
    cursor: pointer;
  }

  .button-container img {
    height: 30px;
    margin-right: 5px;
  }

  .button-container:hover {
    background: #ddd;
    cursor: pointer;
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 20px;
    color: #333;
    background: white;
    padding: 15px 25px;
    border-radius: 10px;
  }

  .answer-section {
    margin-top: 20px;
    padding: 15px;
    border-radius: 5px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    border-style: solid;
    border-width: 10px 10px 10px 10px;
    border-image: url(border.svg) 10 10 10 10 stretch stretch;
  }

  .answer-content {
    text-align: center;
  }

  .answer-title {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #333;
  }

  .correct-answer {
    font-size: 1.1rem;
    margin: 1rem 0;
    color: #555;
  }

  .wikipedia-link {
    margin: 1rem 0;
  }

  .wikipedia-link a {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .wikipedia-link a:hover {
    color: #0052a3;
    text-decoration: underline;
  }

  .next-button:hover {
    background: #bdddff;
  }
</style>
