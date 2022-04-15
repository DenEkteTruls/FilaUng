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
        <h2 style="color: #F49D9A; user-select: none;" on:click={() => toPage("discover")}>Discover</h2>
        <h2 style="color: #27AE60; user-select: none;" on:click={() => toPage("podcast")}>Podcast</h2>
        <h2 style="color: #F39C12; user-select: none;" on:click={() => toPage("gave")}>Gave</h2>
        <h2 style="color: #2DB4D8; user-select: none;" on:click={() => toPage("info")}>Info</h2>
    </div>
</div>



<style>
@media only screen and (max-width: 850px) {
    #menu_checkbox {
        display: none;
    }

    .container {
        display: none;
        position: absolute;
        margin: 130px auto 0 auto;
        z-index: 40;
    }

    .container > h2 {
        color: white;
        font-size: 50px;
        z-index: 50;
        margin: 30px 0 0 30px;
        text-transform: uppercase;
        font-weight: 800;
        cursor: pointer;
    }

    label {
        position: absolute;
        display: block;
        width: 60px;
        height: 60px;
        cursor: pointer;
        z-index: 30;
        margin-left: 4vw;
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
}



@media only screen and (min-width: 851px) {
    #menu_checkbox {
        display: none;
    }

    .total {
        position: absolute;
        margin-left: calc(50vw - 425px);
    }

    .container {
        display: none;
        position: absolute;
        margin: 130px auto 0 auto;
        z-index: 40;
    }

    .container > h2 {
        color: white;
        font-size: 50px;
        z-index: 50;
        margin: 30px 0 0 30px;
        text-transform: uppercase;
        font-weight: 800;
        cursor: pointer;
    }

    label {
        position: absolute;
        display: block;
        width: 60px;
        height: 60px;
        cursor: pointer;
        z-index: 30;
        margin-left: 0vw;
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
}
</style>
