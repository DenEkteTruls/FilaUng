<script>
	import Logo from "../components/Logo.svelte";
	import Menu from "../components/Menu.svelte";
	import Navbar from "../components/Navbar.svelte";
	import PodMain from "../components/Podcast/PodMain.svelte";
</script>



<Logo/>
<Menu color="black"/>
<img src="media/podcast.png" alt=""/>
<h2>PODCAST</h2>
<div class="top">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
	</svg>
</div>
<PodMain/>
<Navbar current_site="podcast" color="#33AB5F"/>



<style>
    @import "global.css";

	.top {
        background: linear-gradient(90deg, #D5F591, #88D6A5);
        height: 254px;
        z-index: 0;
        animation: fadeIn 0.3s;
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

	h2 {
        position: absolute;
        color: black;
        font-size: 45px;
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 120px;
		font-weight: 300;
		letter-spacing: 8px;
        z-index: 21;
        animation: fadeIn 0.3s;
    }

	img {
		position: absolute;
		width: 60px;
		margin: 50px calc(50% - 30px);
        z-index: 21;
        animation: fadeIn 0.3s;
	}
</style>