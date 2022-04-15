<script>
    import Logo from "../components/Logo.svelte";
    import Menu from "../components/Menu.svelte";
    import Navbar from "../components/Navbar.svelte";

    let info = JSON.parse(localStorage.getItem("data")).info;
</script>



<Logo/>
<Menu color="white"/>
<img src="media/info.png" alt=""/>
<h2>om filaung</h2>
<div class="top">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
	</svg>
</div>
<div class="textbox-body">
    {#each info as textbox}
        <div class="textbox">
            <h1>{textbox.header}</h1>
            <p>{textbox.article}</p>
        </div>
    {/each}
</div>
<Navbar current_site="info" color="#2DB4D8"/>



<style>

     .textbox-body {
         display: flex;
         flex-direction: column;
         max-width: 600px;
         margin: 15px auto 75px auto;
     }

     .textbox {
         display: flex;
         flex-direction: column;
         background-color: white;
         margin: 20px;
         border: none;
         border-radius: 40px;
         padding: 10px 50px;
         box-shadow: 0px 0px 15px lightgrey;
     }

     .textbox h1 {
        font-size: 22px;
        text-transform: uppercase;
        font-weight: 1000;
        letter-spacing: 2px;
        color: rgb(83, 83, 83);
        margin-bottom: 0;
     }

     .textbox p {
         font-size: 16px;
         margin-top: 5px;
         color: rgb(83, 83, 83);
     }

     h2   {
        position: absolute;
        color: white;
        font-size: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 130px;
		font-weight: 500;
		letter-spacing: 2px;
        z-index: 21;
        text-transform: uppercase;
    }

    .top {
        background: linear-gradient(90deg, #90E0EF, #2DB4D8);
        height: 254px;
        z-index: 0;
    }

    .top svg {
        position: absolute;
        display: block;
        width: calc(115% + 1.3px);
        height: 68px;
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
		width: 50px;
        margin: 70px calc(50% - 25px);
        z-index: 21;
        filter: invert(100%);
	}
</style>