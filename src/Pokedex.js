import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import SearchIcon from "./icons8-search.svg";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

const Pokedex = () => {
  const [pokemon, setPokemon] = useState([]);
  const [sprite, setSprite] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchPokemon = async (name) => {
    const response = await fetch(`${API_URL}/${name}`);
    const data = await response.json();

    console.log(response);
    console.log(data);
    console.log(data.types["0"].type.name);

    setPokemon(data);
    setSprite(data.sprites.other["official-artwork"].front_default);
  };

  useEffect(() => {
    searchPokemon("bulbasaur");
  }, []);

  return (
    <>
      <h1>The Bestest Pokedex in the World</h1>

      <div className="search">
        <input
          placeholder="Search for Pokemon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchPokemon(searchTerm);
            }
          }}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchPokemon(searchTerm)}
        />
      </div>

      <div>
        <PokemonCard pokemon={pokemon} sprite={sprite} />
      </div>
    </>
  );
};

export default Pokedex;
