<script>
  import Board from "../components/Board.svelte";
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
  <p>
    Can you solve the mystery? This game pulls interesting Wikipedia causes of
    death and gives you clues about how they died.
  </p>

  <Board />
</div>

<footer>
  <div class="footer-container">
    <p>
      Made with ❤️ by
      <a href="https://leviv.cool" target="_blank" rel="noopener noreferrer"
        >Levi</a
      >
      and
      <a href="https://lyuu.cc/" target="_blank" rel="noopener noreferrer"
        >Lucy</a
      > for Wiki Game Jam 2025 in Brooklyn, NY.
    </p>
    <p>&copy; 2025</p>
  </div>
</footer>

<style>
  .game-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 15px;
  }

  footer {
    margin-top: 50px;
    border-top: 1px solid #000;
    font-size: 14px;
    color: #666;
  }

  .footer-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }
</style>
