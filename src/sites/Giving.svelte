<script>
    import Logo from "../components/Logo.svelte";
    import Menu from "../components/Menu.svelte";
    import Navbar from "../components/Navbar.svelte";
</script>



<Logo/>
<Menu color="white"/>
<div class="icon-container">
    <h2>Gave</h2>
    <img class="icon" src="media/gave.png" alt=""/>
</div>
<div class="top">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
	</svg>
</div>
<div class="container">
    <img src="media/vipps.png" alt=""/>
</div>
<Navbar current_site="gave" color="#F68802"/>



<style>
    @import "global.css";

@media only screen and (max-width: 850px) {
    h2 {
        position: absolute;
        color: white;
        font-size: 50px;
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 120px;
		font-weight: 500;
		letter-spacing: 8px;
        z-index: 21;
    }

    .top {
        background: linear-gradient(90deg, #F7BE26, #F25622);
        height: 254px;
        z-index: 0;
    }

	.top svg {
        position: absolute;
        display: block;
        width: calc(115% + 1.3px);
        height: 69px;
        transform: rotate(180deg);
        margin-top: 186px;
        z-index: 0;
        width: 100%;
    }

    .top .shape-fill {
        fill: whitesmoke;
    }

    img {
        position: absolute;
        margin: 50px 13vw;
        justify-content: center;
        width: 70vw;
        border-radius: 30px;
        border: none;
        background-color: white;
        padding: 2vw;
    }

    .icon {
		position: absolute;
		width: 60px;
        margin: -195px calc(50vw - 40px);
        z-index: 21;
        background: none;
        filter: invert(100%)
	}
}

@media only screen and (min-width: 851px) {
    /*
    h2 {
        position: absolute;
        color: white;
        font-size: 60px;
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 120px;
		font-weight: 500;
		letter-spacing: 8px;
        z-index: 21;
    }*/

    h2 {
        color: white;
        font-size: 60px;
        font-weight: 500;
        letter-spacing: 8px;
    }

    .icon-container {
        position: absolute;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 65px;
    }

    .top {
        background: linear-gradient(90deg, #F7BE26, #F25622);
        height: 254px;
        z-index: 0;
    }

	.top svg {
        position: absolute;
        display: block;
        width: calc(115% + 1.3px);
        height: 69px;
        transform: rotate(180deg);
        margin-top: 186px;
        z-index: 0;
        width: 100%;
    }

    .top .shape-fill {
        fill: whitesmoke;
    }

    .container {
        display: flex;
        justify-content: center;
        height: 650px;
    }

    img {
        position: absolute;
        width: 400px;
        border: none;
        border-radius: 30px;
        background-color: white;
        padding: 2vw;
        margin: 50px auto;
    }

    .icon {
		width: 60px;
        background: none;
        filter: invert(100%);
        z-index: 21;
        margin-bottom: 160px;
	}
}
</style>