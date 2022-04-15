<script>
    import SlideImages from "../Calendar/SlideImages.svelte";

    let images = JSON.parse(localStorage.getItem("data")).tops;
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
    <div class="top-container">
        <h3>DISCOVER</h3>
        <h2>Finn ut hva som skjer på FilaUng</h2>
        <SlideImages {images}/>
    </div>
</div>



<style>
    @import "global.css";

    @media only screen and (max-width: 850px) {
        h3 {
            position: absolute;
            margin: 85px 6vw;
            color: white;
            font-size: 40px;
            z-index: 21;
        }
    
        h2 {
            position: absolute;
            margin: 126px calc(6vw + 2px);
            font-size: 16px;
            color: rgb(251, 251, 251);
            font-weight: 500;
            letter-spacing: 0.2px;
            z-index: 21;
        }
    
        .top {
            background: linear-gradient(90deg, #EE8178, #fd5a7b);
            height: 250px;
            z-index: 0;
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
    }

    @media only screen and (min-width: 851px) {
        h3 {
            position: absolute;
            margin: 103px 1vw;
            color: white;
            font-size: 50px;
            letter-spacing: 0.2px;
        }
    
        h2 {
            position: absolute;
            margin: 155px 1vw;
            font-size: 18px;
            color: rgb(251, 251, 251);
            font-weight: 500;
            letter-spacing: 0.2px;
        }
    
        .top {
            background: linear-gradient(90deg, #EE8178, #fd5a7b);
            height: 250px;
            z-index: 0;
        }

        .top-container {
            margin: 0 auto;
            max-width: 850px;
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
    }
</style>