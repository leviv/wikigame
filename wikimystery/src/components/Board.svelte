<script lang="ts">
	import deaths from '$lib/deaths.json';
	import { getImageFromWikidata, getWikipediaSections, formatWikidataDate } from '$lib/apiHelpers';
	import { onMount } from 'svelte';
	import Draggable from './Draggable.svelte';

	let person: any;
	let deathOptions: string[] = [];
	let imageUrl: string | null = null;
	let wikiData: any;

	function pickRandom<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	async function newRound() {
		person = pickRandom(deaths);
		imageUrl = await getImageFromWikidata(person.person);
		wikiData = await getWikipediaSections(person.person);

		console.log(wikiData);

		deathOptions = [person.causeOfDeathLabel];

		while (deathOptions.length < 4) {
			const death = pickRandom(deaths);
			const cause = death.causeOfDeathLabel;
			if (!cause || deathOptions.includes(cause)) {
				continue;
			}
			deathOptions.push(cause);
		}

		// Shuffle options
		deathOptions = deathOptions.sort(() => Math.random() - 0.5);
	}

	function answer(selected: string) {
		if (selected === person.causeOfDeathLabel) {
			alert('Correct!');
		} else {
			alert(`Wrong! The correct answer was: ${person.causeOfDeathLabel}`);
		}
		newRound();
	}

	onMount(async () => {
		newRound();
	});
</script>

<div class="board">
	<div class="intro">
		<h2 class="question">What killed {person?.personLabel}?</h2>
	</div>

	{#if imageUrl}
		<Draggable left={50} top={100}>
			<div class="picture-wrapper">
				<img src="/frame.png" class="frame" alt="frame" />
				<img src={imageUrl} alt={person.personLabel} draggable="false" class="picture" />
			</div>
		</Draggable>
	{/if}

	<Draggable left={200} top={150}>
		<div class="birth-wrapper">
			<img src="/birth_certificate.png" alt="Birth Certificate" />
			<div class="birth-content">
				<p>Born: {formatWikidataDate(person?.birthDate)}</p>
				<p>Gender: {person?.gender}</p>
			</div>
		</div>
	</Draggable>

	<Draggable left={400} top={200}>
		<div class="passport-wrapper">
			<img src="/passport.png" alt="passport" />

			<div class="passport-content">
				<p>Birthplace: {person?.placeOfBirth}</p>
				<p>Citizenship: {person?.citizenship}</p>
			</div>
		</div>
	</Draggable>

	<Draggable left={600} top={250}>
		<div class="resume-wrapper">
			<img src="/resume.png" alt="Resume" />
			<div class="resume-content">
				<p>Occupation: {person?.occupation}</p>
			</div>
		</div>
	</Draggable>

	<div class="options">
		{#each deathOptions as death}
			<button on:click={() => answer(death)}>{death}</button>
		{/each}
	</div>
	<button on:click={newRound}>Next</button>
</div>

<style>
	.intro {
		display: flex;
		justify-content: center;
	}

	.question {
		width: fit-content;
		font-size: 30px;
		padding: 35px 45px;
		background-image: url('/paper.png');
		background-size: 100% 100%;
	}

	.board {
		width: 100%;
		min-height: 600px;
		background-image: url('/board.png');
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
		padding: 0px 15px 0px 15px;
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
		bottom: 5px;
		padding: 0px 25px 0px 25px;
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
		padding: 0px 23px 0px 8px;
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

	.options {
		position: absolute;
		bottom: 80px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		background: #eee;
		font-size: 1rem;
		transition: background 0.2s;
	}

	button:hover {
		background: #ddd;
	}

	h2 {
		text-align: center;
		margin-bottom: 2rem;
		color: #333;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
