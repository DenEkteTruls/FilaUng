<script>
  let images = JSON.parse(localStorage.getItem("data")).events;
</script>



<div class="total">
  <h2>New Events</h2>
  <div class="container">
    {#each images as image, i}
      <div class="news">
        <img class="image" src="{image.image_src}" alt=""/>
        <h3>{image.title}</h3>
      </div>
    {/each}
  </div>
</div>



<style>

@media only screen {
  .total {
    margin: 0 auto;
    max-width: 850px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0 15px 0vw;
    margin-bottom: 100px;
    overflow-y: visible;
  }

  .news {
    display: flex;
    flex-direction: column;
    height: 200px;
    width: 29.8%;
    margin: 15px;
  }

  .image {
    height: 150px;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 1px 3px 15px grey;
  }

  h2 {
    margin: 520px 0 -10px 1.5vw;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  h3 {
    font-size: 15px;
    margin: 5px 0 0 3px;
  }
}

@media only screen and (max-width: 850px) {
  .container {
    display: flex;
    flex-wrap: nowrap;
    padding: 15px 0 15px 5vw;
    height: 170px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: 80px;
  }
  
  .news {
    display: flex;
    flex-direction: column;
    height: 180px;
    width: 180px;
    margin-right: 30px;
  }

  .image {
    height: 130px;
    width: 155px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 1px 3px 15px grey;
  }

  h2 {
    margin: 320px 0 0 5vw;
    margin-top: 320px;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  h3 {
    font-size: 15px;
    margin: 5px 0 0 3px;
  }
}
</style>
