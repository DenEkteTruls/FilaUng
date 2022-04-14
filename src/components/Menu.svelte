<script>
    export let color;
    function toPage(site) { window.location.replace("/"+site); }
</script>


<div class="total">
    <input type="checkbox" id="menu_checkbox">
    <label for="menu_checkbox">
        <div style="background-color: {color};"></div>
        <div style="background-color: {color};"></div>
        <div style="background-color: {color};"></div>
    </label>
    <div class="container">
        <h2 style="color: #F49D9A" on:click={() => toPage("discover")}>Discover</h2>
        <h2 style="color: #27AE60" on:click={() => toPage("podcast")}>Podcast</h2>
        <h2 style="color: #F39C12" on:click={() => toPage("gave")}>Gave</h2>
    </div>
</div>



<style>

    #menu_checkbox {
        display: none;
    }

    .container {
        display: none;
        position: absolute;
        margin: 130px auto 0 auto;
        z-index: 21;
    }

    .container > h2 {
        color: white;
        font-size: 60px;
        z-index: 50;
        margin: 30px 0 0 30px;
        cursor: pointer;
    }

    label {
        position: absolute;
        display: block;
        width: 60px;
        height: 60px;
        cursor: pointer;
        z-index: 20;
        margin-left: 3vw;
        margin-top: 22px;
    }

    label:before {
        content: "";
        position: fixed;
        transition: 0.1s all;
    }

    label div {
        position: relative;
        top: 0;
        height: 12px;
        background-color: #fff;
        margin-bottom: 4px;
        transition: 0.3s ease transform, 0.3s ease top, 0.3s ease width,
            0.3s ease right;
        border-radius: 3px;
        transform: scale(0.6);
    }

    label div:first-child {
        transform-origin: 1;
    }

    label div:last-child {
        margin-bottom: 0;
        transform-origin: 1;
    }

    label div:nth-child(2) {
        right: 0;
        width: 60px;
    }

    #menu_checkbox:checked ~ .container {
        display: block;
    }

    #menu_checkbox:checked ~ label:before {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #menu_checkbox:checked ~ label {
        margin: 45px 35px;
    }

    #menu_checkbox:checked ~ label div {
        background-color: white !important;
    }

    #menu_checkbox:checked + label:before {
        background-color: black;
        width: 100vw;
    }

    #menu_checkbox:checked + label div:first-child {
        top: 10px;
        left: -4px;
        transform: rotateZ(45deg);
    }

    #menu_checkbox:checked + label div:last-child {
        top: -9px;
        left: 9px;
        transform: rotateZ(45deg);
    }

    #menu_checkbox:checked + label div:nth-child(2) {
        width: 79px;
        top: 0;
        right: 8px;
        transform: rotateZ(-45deg);
    }
</style>