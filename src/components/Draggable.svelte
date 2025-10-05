<script lang="ts">
  export let width = 100;
  export let height = 100;
  export let contentKey: any = null;

  let left = Math.random() * width;
  let top = Math.random() * height;

  let moving = false;

  function onMouseDown() {
    moving = true;
  }

  function onMouseMove(e: MouseEvent) {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  }

  function onMouseUp() {
    moving = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
  on:mousedown={onMouseDown}
  style="left: {left}px; top: {top}px;"
  class="draggable"
>
  <slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
  .draggable {
    user-select: none;
    cursor: move;
    position: absolute;
  }
</style>
