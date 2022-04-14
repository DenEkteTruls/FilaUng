<script>
    import Top from "../components/Calendar/Top.svelte";
    import News from "../components/Calendar/News.svelte";
    import Logo from "../components/Logo.svelte";
    import Navbar from "../components/Navbar.svelte";
    import Menu from "../components/Menu.svelte";
</script>


<div class="container">
    <Menu color="white"/>
    <Logo/>
</div>
<Top/>
<News/>
<Navbar current_site="discover" color="#F49D9A"/>



<style>
@media only screen and (min-width: 851px) {
    .container {
        max-width: 850px;
    }
}
</style>