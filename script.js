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
    pokemon: {},
    type_styles: [],
    stats_styles: [
      { width: '100%', backgroundColor: '#ff5959' },
      { width: '100%', backgroundColor: '#f5ac78' },
      { width: '100%', backgroundColor: '#fae078' },
      { width: '100%', backgroundColor: '#94efe0' },
      { width: '100%', backgroundColor: '#94efe0' },
      { width: '100%', backgroundColor: '#fa92b2' },
    ],
  },
  methods: {
    async getPokemon(id){
      id++;
      const type_colors = {
        normal: '#adb09d', poison: '#9f5997', psychic: '#e860aa',
        grass: '#83c54a', ground: '#d9bb49', ice: '#87dbfd',
        fire: '#e54c3c',  rock: '#bbac67', dragon: '#7d6bf5',
        water: '#4d9ef9', bug: '#b2c11e', dark: '#81614a',
        fighting: '#ac5341', ghost: '#6d6dc5', steel: '#b0b0c8',
        flying: '#6b95f7', electric: '#f3d132', fairy: '#dea0eb',
      };
      let pokemon_response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      let species_response = await axios.get(pokemon_response.data.species.url);
      let pkmn = pokemon_response.data;
      let spcs = species_response.data;

      this.pokemon = {
        id: pkmn.id,
        id_padded: pad(pkmn.id, 3),
        name: pkmn.name,
        ucfirst_name: ucfirst(pkmn.name),
        height: pkmn.height,
        weight: pkmn.weight,
        habitat: ucfirst(spcs.habitat.name),
        shape: ucfirst(spcs.shape.name),
        sprite: pkmn.sprites.front_default,
        stats: pkmn.stats,
        primary_type: ucfirst(pkmn.types[0].type.name),
        secondary_type: pkmn.types[1] !== undefined ? ucfirst(pkmn.types[1].type.name) : null,
        entry: '',
      }

      this.type_styles = [
        { backgroundColor: type_colors[pkmn.types[0].type.name] },
        { backgroundColor: pkmn.types[1] !== undefined ? type_colors[pkmn.types[1].type.name] : null },
      ]

      pkmn.stats.forEach((item, i) => {
        this.stats_styles[i].width = ((item.base_stat/2 < 7) ? 7 : item.base_stat/2) + "%";
        this.pokemon.stats[i].stat.name = ucfirst(this.pokemon.stats[i].stat.name);
      });

      spcs.flavor_text_entries.forEach((item, i) => {
        if(item.language.name == "en" && item.version.name == "red"){
          this.pokemon.entry = item.flavor_text;
        }
      });

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
