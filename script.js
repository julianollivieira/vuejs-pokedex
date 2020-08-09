Vue.component('pkmn-img', {
  props: ['src'],
  template: '<div id="pokemon_image_background"><img id="pokemon_image" v-bind:src="src"></img></div>',
});

function ucfirst(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var app = new Vue({
  el: '#app',
  data: {
    // pokemon_id: 1,
    all_pokemon: [],
    pokemon: {
      sprites: {
        front_default: "",
      }
    },
  },
  methods: {
    async getAllPokemon(){
      let resp = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      console.log(resp);
      
      resp.data.results.forEach(element => {
        element.name = ucfirst(element.name);
      });

      this.all_pokemon = resp.data.results;
    },
    async getPokemon(index){
      index = index.toLowerCase();
      try {
        // API Request
        let resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`);
        resp.data.name = ucfirst(resp.data.name);
        resp.data.id = pad(resp.data.id, 3);
        this.pokemon = resp.data;

        // Get dominant color for pokemon sprite
        const colorThief = new ColorThief();
        const pokemon_image = document.getElementById('pokemon_image');
        const pokemon_image_background = document.getElementById('pokemon_image_background');
        let dominantColor = '0,0,0';
        pokemon_image.crossOrigin = "Anonymous";

        if (pokemon_image.complete) {
          dominantColor = colorThief.getColor(pokemon_image);
          pokemon_image_background.style.backgroundColor = `rgb(${dominantColor})`;
        } else {
          pokemon_image.addEventListener('load', function(){
            dominantColor = colorThief.getColor(pokemon_image);
            pokemon_image_background.style.backgroundColor = `rgb(${dominantColor})`;
          });
        }

      } catch(error){
        console.log(error);
      }
    },
  },
  beforeMount(){
    this.getAllPokemon();
    this.getPokemon('Bulbasaur');
  },
});
