import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard";
import SearchIcon from "./icons8-search.svg";
import "./Pokedex.css";
import "./PokemonCard.css";

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const batch = 3; // how many pokemon to fetch from API at a time

const Pokedex = () => {
  const [pokedex, setPokedex] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);

  const ref = useRef(null);
  const firstUpdate = useRef(true);

  // Intersection Observer for revealing on scroll
  useEffect(() => {
    const callback = ([entry]) => {
      if (entry.isIntersecting) {
        setOffset(offset + batch);
      }
    };

    const options = {
      rootMargin: "-10px",
    };

    const observer = new IntersectionObserver(callback, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, offset]);

  // Run this only once to populate pokedex
  useEffect(() => {
    const fillPokedex = async () => {
      const response_list = await fetch(
        `${API_URL}?limit=${batch}&offset=${offset}`
      );
      const data = await response_list.json();
      const pokeNames = await data.results.map((pokemon) => pokemon.name);

      const pokemon = await Promise.all(
        pokeNames.map(async (pokemon) => {
          const response_pokemon = await fetch(`${API_URL}/${pokemon}`);
          const data = await response_pokemon.json();

          return {
            name: data.name,
            id: data.id,
            image: data.sprites.other["official-artwork"].front_default,
            weight: data.weight,
            height: data.height,
            hp: data.stats[0]["base_stat"],
            attack: data.stats[1]["base_stat"],
            defence: data.stats[2]["base_stat"],
            specialAttack: data.stats[3]["base_stat"],
            specialDefence: data.stats[4]["base_stat"],
            speed: data.stats[5]["base_stat"],
            type: data.types.map((type) => type.type.name),
          };
        })
      );

      setPokedex((prev) => [...prev, ...pokemon]);
    };

    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    fillPokedex();
  }, [offset]);

  const searchPokemon = async (search) => {
    if (typeof search == "undefined") {
      const response = await fetch(`${API_URL}?limit=15`);
      const data = await response.json();

      console.log(response);
      console.log(data);

      let pokelist = [];
      for (let i = 0; i < data.results.length; i++) {
        const response2 = await fetch(data.results[i].url);
        const data2 = await response2.json();
        pokelist.push(data2);
      }

      console.log(pokelist);

      setPokedex(pokelist);

      //setSprite(data.sprites.other["official-artwork"].front_default);
    } else {
      const response = await fetch(`${API_URL}/${search}`);
      const data = await response.json();

      console.log(response);
      console.log(data);

      setPokedex([data]);
    }
  };

  return (
    <>
      <div className="title">
        <h1>The Bestest Pokedex in the World</h1>
      </div>

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
        {pokedex?.length > 0 ? (
          <div>
            {pokedex.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No Pokemon found.</h2>
          </div>
        )}
      </div>

      <div ref={ref}>
        <div className="loading">Loading...</div>
      </div>
    </>
  );
};

export default Pokedex;
