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
	<h2 class="question">What killed {person?.personLabel}?</h2>

	{#if imageUrl}
		<Draggable left={50} top={100}>
			<div class="picture-wrapper">
				<img src="/frame.png" class="frame" alt="frame" />
				<img src={imageUrl} alt={person.personLabel} draggable="false" class="picture" />
			</div>
		</Draggable>
	{/if}

	<Draggable left={200} top={150}>
		<div class="birth-certificate">
			<h3>Birth Certificate</h3>
			<p>Born: {formatWikidataDate(person?.birthDate)}</p>
			<p>Gender: {person?.gender}</p>
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
		<div class="resume">
			<h3>Resume</h3>
			<p>Occupation: {person?.occupation}</p>
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
	.question {
		font-size: 35px;
		padding-top: 15px;
		color: white;
	}

	.board {
		width: 100%;
		min-height: 600px;
		background-image: url('/board.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: relative;
	}

	.birth-certificate,
	.passport,
	.resume {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		border: 2px solid #ddd;
		min-width: 200px;
		max-width: 250px;
	}

	.birth-certificate h3,
	.passport h3,
	.resume h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.1rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 0.25rem;
	}

	.birth-certificate p,
	.passport p,
	.resume p {
		margin: 0.25rem 0;
		color: #666;
		font-size: 0.9rem;
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
		padding: 40px;
		width: calc(100% - 80px);
		height: calc(100% - 80px);
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
