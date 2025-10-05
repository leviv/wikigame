<script>
	import Board from '../components/Board.svelte';
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪦</text></svg>"
	/>
	<title>Wiki Mystery</title>
</svelte:head>

<div class="game-container">
	<h1>Wiki Mystery</h1>

	<div class="stats">
		<p>Game ID: 1234</p>
		<p>Time: 30s</p>
		<p>Score: 1234</p>
	</div>

	<Board />
</div>

<style>
	.game-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 15px;
	}
	.stats {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
