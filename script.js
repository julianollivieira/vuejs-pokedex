function ucfirst(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function setBackgoundToDominantColor(){
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
}

var app = new Vue({
  el: '#app',
  data: {
    all_pokemon: [],
    pokemon: {
      id_padded: 0,
      ucfirst_name: '',
      stats: [],
    },
  },
  methods: {
    async getPokemon(id){
      id++;
      let pkmn_resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      let spcs_resp = await axios.get(pkmn_resp.data.species.url);

      let type_colors = {
        normal: '#adb09d', poison: '#9f5997', psychic: '#e860aa',
        grass: '#83c54a', ground: '#d9bb49', ice: '#87dbfd',
        fire: '#e54c3c',  rock: '#bbac67', dragon: '#7d6bf5',
        water: '#4d9ef9', bug: '#b2c11e', dark: '#81614a',
        fighting: '#ac5341', ghost: '#6d6dc5', steel: '#b0b0c8',
        flying: '#6b95f7', electric: '#f3d132', fairy: '#dea0eb',
      };

      ['id', 'name', 'height', 'weight', 'stats'].forEach((item, i) => {
        this.pokemon[item] = pkmn_resp.data[item];
      });

      ['habitat', 'shape'].forEach((item, i) => {
        this.pokemon[item] = spcs_resp.data[item].name;
      });

      this.pokemon.primary_type = {
        name: pkmn_resp.data.types[0].type.name,
        color: type_colors[pkmn_resp.data.types[0].type.name],
      }

      this.pokemon.stats.forEach((item, i) => {
        let len = (item.base_stat/2 < 7) ? 7 : item.base_stat/2;
        document.querySelector(`.${item.stat.name} .bar`).style.width = `${len}%`;
      });


      this.pokemon.primary_type = pkmn_resp.data.types[0].type.name;
      this.pokemon.secondary_type = (pkmn_resp.data.types[1] !== undefined) ? pkmn_resp.data.types[1].type.name : null;
      this.pokemon.sprite = pkmn_resp.data.sprites.front_default;
      this.pokemon.id_padded = pad(this.pokemon.id, 3);
      this.pokemon.ucfirst_name = ucfirst(this.pokemon.name);

      document.getElementById("primary_type").style.backgroundColor = type_colors[pkmn_resp.data.types[0].type.name];
      document.getElementById("secondary_type").style.backgroundColor = type_colors[pkmn_resp.data.types[1].type.name];

      setBackgoundToDominantColor();
    },
    async getAllPokemon(){
      let allpkmn_resp = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      let i = 0;
      allpkmn_resp.data.results.forEach(element => {
        i++;
        element.id = pad(i, 3);
        element.name = ucfirst(element.name);
      });
      this.all_pokemon = allpkmn_resp.data.results;
    },
  },
  mounted: function () {
    this.getAllPokemon();
    this.getPokemon(0);
  },
});
