<script>
    export let color;
    export let current_site;
    
    let tabs = ["discover", "podcast", "gave", "info"];

    console.log(current_site);

    function clicked(site)
    {
        window.location.replace("/"+site);
    }

</script>

        {#if color == "#F49D9A"}
        <div class="container" style="border-top: 2px solid #F49D9A;">
            <div class="tab-container">
            {#each tabs as tab}
            <div class="tab" on:click={() => clicked(tab)}>
                {#if tab == current_site}
                    <img id="{tab}" src="media/{tab}.png" alt="">
                    <p>{tab}</p>
                {:else}
                    {#if color == "#F49D9A"}
                        <img style="filter: invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#33AB5F"}
                        <img style="filter: invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#F68802"}
                        <img style="filter: invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#2DB4D8"}
                        <img style="filter: invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%);" id="{tab}" src="media/{tab}.png" alt="">
                    {/if}
                    <p style="color: {color};">{tab}</p>
                {/if}
            </div>
            {/each}
            </div>
        </div>
        {:else if color == "#33AB5F"}
        <div class="container" style="border-top: 2px solid #33AB5F;" >
            <div class="tab-container">
            {#each tabs as tab}
            <div class="tab" on:click={() => clicked(tab)}>
                {#if tab == current_site}
                    <img id="{tab}" src="media/{tab}.png" alt="">
                    <p>{tab}</p>
                {:else}
                    {#if color == "#F49D9A"}
                        <img style="filter: invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#33AB5F"}
                        <img style="filter: invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#F68802"}
                        <img style="filter: invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#2DB4D8"}
                        <img style="filter: invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%);" id="{tab}" src="media/{tab}.png" alt="">
                    {/if}
                    <p style="color: {color};">{tab}</p>
                {/if}
            </div>
            {/each}
            </div>
        </div>
        {:else if color == "#F68802"}
        <div class="container" style="border-top: 2px solid #F68802;" >
            <div class="tab-container">
            {#each tabs as tab}
            <div class="tab" on:click={() => clicked(tab)}>
                {#if tab == current_site}
                    <img id="{tab}" src="media/{tab}.png" alt="">
                    <p>{tab}</p>
                {:else}
                    {#if color == "#F49D9A"}
                        <img style="filter: invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#F68802"}
                        <img style="filter: invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#33AB5F"}
                        <img style="filter: invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#2DB4D8"}
                        <img style="filter: invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%);" id="{tab}" src="media/{tab}.png" alt="">
                    {/if}
                    <p style="color: {color};">{tab}</p>
                {/if}
            </div>
            {/each}
            </div>
        </div>
        {:else if color = "#2DB4D8"}
        <div class="container" style="border-top: 2px solid #2DB4D8;" >
            <div class="tab-container">
            {#each tabs as tab}
            <div class="tab" on:click={() => clicked(tab)}>
                {#if tab == current_site}
                    <img id="{tab}" src="media/{tab}.png" alt="">
                    <p>{tab}</p>
                {:else}
                    {#if color == "#F49D9A"}
                        <img style="filter: invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#F68802"}
                        <img style="filter: invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#33AB5F"}
                        <img style="filter: invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%);" id="{tab}" src="media/{tab}.png" alt="">
                    {:else if color == "#2DB4D8"}
                        <img style="filter: invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%);" id="{tab}" src="media/{tab}.png" alt="">
                    {/if}
                    <p style="color: {color};">{tab}</p>
                {/if}
            </div>
            {/each}
            </div>
        </div>
        {/if}



<style>
@media only screen and (max-width: 850px) {
    .container {
      position: fixed;
      bottom: 0;
      height: 75px;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      background: white;
      z-index: 10;
    }

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
    }

    img {
        width: 38px;
        height: auto;
        margin: 3px 0 0 0;
    }

    p {
        text-transform: capitalize;
        margin: 3px 0;
        font-weight: 600;
        letter-spacing: -1px;
    }
}

@media only screen {
    .container {
        position: fixed;
        bottom: 0;
        height: 75px;
        width: 100%;
        display: flex;
        background: white;
        display: flex;
        justify-content: space-evenly;
    }

    .tab-container {
        position: fixed;
        bottom: 0;
        height: 75px;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        z-index: 10;
        max-width: 850px;
    }

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
    }

    img {
        width: 38px;
        height: auto;
        margin: 3px 0 0 0;
    }

    p {
        text-transform: capitalize;
        margin: 3px 0;
        font-weight: 600;
        letter-spacing: -1px;
    }
}
</style>
