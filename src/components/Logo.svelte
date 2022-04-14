

<div class="container">
    <img src="media/logo.jpg" alt="">
</div>


<style>
@media only screen and (max-width: 850px) {
    .container {
        position: absolute; 
        right: 5vw;
        top: 22px;
        z-index: 21;
    }

    img {
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
    }
}

@media only screen and (min-width: 851px) {
    .container {
        position: absolute;
        width: 850px;
        margin-left: calc(50vw - 425px);
    }

    img {
        border: none;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        margin-left: calc(850px - 80px - 40px);
        margin-top: 22px;
    }
}
</style>
