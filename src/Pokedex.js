import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard";
import SearchIcon from "./icons8-search.svg";
import "./Pokedex.css";
import "./PokemonCard.css";

//setSprite(data.sprites.other["official-artwork"].front_default);

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const batch = 6; // how many pokemon to fetch from API at a time

const Pokedex = () => {
  const [pokedex, setPokedex] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0); // used as "offset" term in pokeapi fetch
  const [renderOffset, setRenderOffset] = useState(0);

  const [renderMode, setRenderMode] = useState(0);

  const ref = useRef(null); // used as component for Intersection Observer to observe
  const firstUpdate = useRef(true); // to prevent duplicate first batch of pokemon from entering the pokedex
  const stillMorePokemon = useRef(true); // to prevent additional API fetches once there are no more pokemon left

  // Intersection Observer for revealing on scroll
  useEffect(() => {
    console.log("useEffect Observer call");
    const callback = ([entry]) => {
      if (entry.isIntersecting) {
        setRenderOffset(renderOffset + batch);
        console.log(`renderOffset = ${renderOffset}`);
      }
    };

    const options = {
      rootMargin: "-10px",
    };

    const observer = new IntersectionObserver(callback, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, renderOffset]);

  // Runs every time offset is changed; used to update pokedex
  useEffect(() => {
    console.log("useEffect fillPokedex call");

    const fillPokedex = async () => {
      const response_list = await fetch(
        `${API_URL}?limit=${batch}&offset=${offset}`
      );
      const data = await response_list.json();
      const pokeNames = await data.results.map((pokemon) => pokemon.name);
      console.log(`pokeNames = ${pokeNames}`);

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
      console.log("Updating firstUpdate to false");
      firstUpdate.current = false;
      return;
    }

    if (stillMorePokemon.current) {
      console.log("stillMorePokemon = true");
      fillPokedex();
      console.log(`pokedex.length = ${pokedex.length}`);
    }
  }, [offset]);

  // Runs everytime pokedex is changed; used to update offset
  useEffect(() => {
    console.log("useEffect checkMorePokemon call");
    const checkMorePokemon = async () => {
      const api_response = await fetch(
        `${API_URL}?limit=${batch}&offset=${offset}`
      );
      const api_data = await api_response.json();

      if (api_data.results.length === 0) {
        console.log("Setting stillMorePokemon to false");
        stillMorePokemon.current = false;
      } else {
        console.log(`Setting offset to ${offset} + ${batch}`);
        setOffset(offset + batch);
      }
    };

    checkMorePokemon();
  }, [pokedex]);

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
    } else {
      const response = await fetch(`${API_URL}/${search}`);
      const data = await response.json();

      console.log(response);
      console.log(data);

      setPokedex([data]);
    }
  };

  const renderPokemonCards = (pokedex, mode) => {
    switch (mode) {
      case 0:
        console.log(
          `render pokedex length = ${pokedex.length} and renderOffset = ${renderOffset}`
        );
        const returnValue = pokedex
          .filter((entry) => entry.id <= renderOffset)
          .map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />);

        console.log(`returnValue.length = ${returnValue.length}`);
        return returnValue;
        break;
      case 1:
        console.log("DEBUG: Not expected to hit case 1 yet");
        break;
      case 2:
        console.log("DEBUG: Not expected to hit case 2 yet");
        break;
      default:
        console.log("DEBUG: Not expected to hit default case yet");
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
        {pokedex.length > 0 ? (
          <div>{renderPokemonCards(pokedex, renderMode)}</div>
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
