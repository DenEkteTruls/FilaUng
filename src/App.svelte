<script>
	import router from 'page';

	import Calendar from "./sites/Calendar.svelte";
	import Podcast from "./sites/Podcast.svelte";
	import Giving from "./sites/Giving.svelte";
	import Info from "./sites/Info.svelte";

	let current_page = Calendar;

	router('/', () => current_page = Calendar);
	router('/calendar', () => current_page = Calendar);
	router('/podcast', () => current_page = Podcast);
	router('/gave', () => current_page = Giving);
	router('/info', () => current_page = Info);

	router.start();

	async function fetchJSON() {
		const response = await fetch("/jsons/data.json");
		const data = await response.json();
		return data;
	}

	fetchJSON().then(data => {
		localStorage.setItem("data", JSON.stringify(data));
	});
</script>



<svelte:component this={current_page}/>