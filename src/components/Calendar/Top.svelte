<script>
    let images = [
        "https://lensire.com/275919041_817167405884328_2531714923431134668_n.jpeg",
        "https://i.pinimg.com/originals/6d/51/d3/6d51d3f9f63b5de77b2e8190c95c2646.jpg",
        "https://i.swncdn.com/media/900w/via/7711-congregation-hands-up-in-worship-gettyimages-.jpg",
        "https://i.pinimg.com/736x/85/54/dc/8554dc76e548a38e2e40d95a046bb134.jpg"
    ];

    let idx = 0;

    function slideImage()
    {
        if(idx + 1 >= images.length) {
            idx = 0;
        } else {
            idx++;
        }
        setTimeout(slideImage, 5000);
    }

    slideImage();

    
    function slideTo(slide) { idx = slide; }

</script>



<div class="top">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
    </svg>
    <h3>DISCOVER</h3>
    <h2>Finn ut hva som skjer på FilaUng</h2>
    <img src="{images[idx]}" alt="">
    <div class="dotList">
        {#each images as image, i}
            <span class="dot" on:click={slideTo(i)}></span>
        {/each}
    </div>
</div>



<style>
    h3 {
        position: absolute;
        margin: 85px 6vw;
        color: white;
        font-size: 40px;
    }

    h2 {
        position: absolute;
        margin: 126px 6vw;
        font-size: 16px;
        color: rgb(251, 251, 251);
        font-weight: 500;
        letter-spacing: 0.2px;
    }

    .top {
        background: linear-gradient(90deg, #EE8178, #D76C81);
        height: 250px;
        z-index: 0;
    }
    
    .dot {
        cursor: pointer;
        height: 13px;
        width: 13px;
        margin: 2px;
        padding: 0;
        border: 1px solid #F49D9A;
        border-radius: 50%;
        transition: background-color 0.15s;
    }

    .dot:hover {
        background-color: #F49D9A;
    }

    .dotList {
        display: flex;
        justify-content: center;
    }

    img {
        border: none;
        border-radius: 15px;
        width: 90vw;
        height: 350px;
        object-fit: cover;
        margin: 150px 5vw 0 5vw;
        position: relative;
        z-index: 1;
    }

    .top svg {
        position: absolute;
        display: block;
        width: calc(115% + 1.3px);
        height: 69px;
        transform: rotate(180deg);
        margin-top: 185px;
        z-index: 0;
        width: 100%;
    }

    .top .shape-fill {
        fill: whitesmoke;
    }
</style>
