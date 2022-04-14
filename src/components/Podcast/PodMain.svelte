<script>
    function clicked()
    {
        window.location.assign("https://anchor.fm/filadelfiakirken");
    }
</script>



<div class="container">
    <iframe class="radio" src="https://anchor.fm/filadelfiakirken/embed" height="102px" width="400px" frameborder="0" scrolling="no"></iframe>
    <button on:click={clicked}>ALLE PODCASTER</button>
</div>



<style>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 5vw;
        margin-top: 30px;
    }

    .radio {
        width: 90vw;
        height: 98px;
        object-fit: cover;
        z-index: 2;
        margin: 10px 0;
        border-radius: 10px;
    }

    button {
        border: none;
        border-radius: 15px;
        background-color: black;
        width: 90vw;
        color: white;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 1px;
        padding: 10px;
    }
</style>