<script>
  export let images;

  let idx = 0;

  setInterval(() => {
    if(idx + 1 >= images.length) {
      idx = 0;
    } else {
      idx++;
    }
    window.location.assign("#"+idx);
  }, 5000);
</script>



<div class="slider">
  <div class="slides">
    {#each images as image, i}
      <img id="{i}" src={image} alt=""/>
    {/each}
  </div>
</div>



<style>
  .slider {
    text-align: center;
    overflow: hidden;
  }

  .slides {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    width: 100vw;
    -webkit-overflow-scrolling: touch;
  }

  .slides::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .slides::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 10px;
  }

  .slides::-webkit-scrollbar-track {
    background: transparent;
  }

  img {
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media only screen and (max-width: 850px) {
    .slider {
      width: 95vw;
      margin-left: 5vw;
    }

    .slides > img {
      scroll-snap-align: start;
      flex-shrink: 0;
      width: 90vw;
      height: 350px;
      border-radius: 15px;
      background: #eee;
      transform-origin: center center;
      transform: scale(1);
      transition: transform 0.5s;
      position: relative;
      margin-top: 150px;
      margin-right: 50px;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 100px;
    }
  }

  @media only screen and (min-width: 851px) {
    .slider {
      width: 850px;
    }

    .slides > img {
      scroll-snap-align: start;
      flex-shrink: 0;
      width: 850px;
      height: 500px;
      border-radius: 15px;
      background: #eee;
      transform-origin: center center;
      transform: scale(1);
      transition: transform 0.5s;
      position: relative;
      margin: 190px 50px 0 0;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 100px;
    }
  }
</style>