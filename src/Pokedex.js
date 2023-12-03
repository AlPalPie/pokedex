import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard";
import "./Pokedex.css";
import "./PokemonCard.css";
import "./types.css";
import pokemon_center from  "./images/pokemon_center.png"

/* TODOs:

- add a "waiting/loading" message that will prevent rendering until ALL pokeapi fetches have been completed when user tries to sort by other stats or search
- add a scroll back to top button at end of page
- add a better placeholder image if no image in API
- add type icons
- improve text formatting
- fix footer Loading message

*/

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const batch = 6; // how many pokemon to fetch from API at a time

const Pokedex = () => {
  const [pokedex, setPokedex] = useState([]);                 // stores all pokeapi data, updated continuously in batches until no more pokemon left, wont be updated anymore afterwards
  const [tempPokedex, setTempPokedex] = useState([]);         // subset of the pokedex used for rendering which is updated everytime end user changes how they want to view the pokemon
  const [nameSearchTerm, setNameSearchTerm] = useState("");   // tracks end user's name search terms
  const [typeSearchTerm, setTypeSearchTerm] = useState("");   // tracks end user's type search terms
  const [offset, setOffset] = useState(0);                    // used as "offset" term in pokeapi fetch
  const [renderOffset, setRenderOffset] = useState(0);        // tracks how much of the tempPokedex to render on screen, increases as user scrolls to bottom of page 

  const [sortStat, setSortStat] = useState("id");             // represents a pokemon stat which is used for sorting
  const [order, setOrder] = useState("ascending");            // the order used for sorting

  const ref = useRef(null);                                   // used as component for Intersection Observer to observe
  const firstUpdate = useRef(true);                           // to prevent duplicate first batch of pokemon from entering the pokedex
  const stillMorePokemon = useRef(true);                      // to prevent additional API fetches once there are no more pokemon left
  const maxNumberOfPokemon = useRef(-1);                      // to prevent renderOffset from increasing endlessly if user is sitting at bottom of page






  // Intersection Observer for revealing on scroll
  useEffect(() => {
    const callback = ([entry]) => {
      if (entry.isIntersecting && (maxNumberOfPokemon.current < 0 || renderOffset < maxNumberOfPokemon.current)) {
        setRenderOffset(renderOffset + batch);
      }

      if (entry.isIntersecting && maxNumberOfPokemon.current > 0) {
        ref.current.querySelectorAll("div").forEach((elem) => {
          elem.classList.add("slide-out");
        })
      }
    };
    const options = {
      threshold: 0,         // only the edge of the observed object needs to be in viewport for intersection to be triggered
      rootMargin: "50%"     // increases the margin of the observed object that triggers an intersection
    };
    const observer = new IntersectionObserver(callback, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, renderOffset]);


  // Adds pokeapi data to the pokedex state
  // Runs every time offset is changed - implemented this way to breakup api calls into smaller chunks
  useEffect(() => {
    const fillPokedex = async () => {
      const response_list = await fetch(`${API_URL}?limit=${batch}&offset=${offset}`);
      const data = await response_list.json();
      const pokeNames = await data.results.map((pokemon) => pokemon.name);

      const pokemon = await Promise.all(
        pokeNames.map(async (pokemon) => {
          const response_pokemon = await fetch(`${API_URL}/${pokemon}`);
          const data = await response_pokemon.json();

          const image = ( data.sprites.other["official-artwork"].front_default == null ) ? (
            "https://via.placeholder.com/400"
          ) : (
            data.sprites.other["official-artwork"].front_default
          )

          return {
            name: data.name,
            id: data.id,
            image: image,
            height: data.height,
            weight: data.weight,
            hp: data.stats[0]["base_stat"],
            attack: data.stats[1]["base_stat"],
            defense: data.stats[2]["base_stat"],
            specialAttack: data.stats[3]["base_stat"],
            specialDefense: data.stats[4]["base_stat"],
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

    if (stillMorePokemon.current) {
      fillPokedex();
    }
  }, [offset]);


  // Increases the offset, but stops when no more pokemon data retrieved from pokeapi
  // Runs everytime pokedex is changed - implemented this way to breakup api calls into smaller chunks
  useEffect(() => {
    const checkMorePokemon = async () => {
      const api_response = await fetch(
        `${API_URL}?limit=${batch}&offset=${offset}`
      );
      const api_data = await api_response.json();

      if (api_data.results.length === 0) {
        stillMorePokemon.current = false;
        maxNumberOfPokemon.current = offset;
      } else {
        setOffset(offset + batch);
      }
    };

    checkMorePokemon();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedex]);


  // reset the renderOffset after every time user changes how the pokemon are rendered, to avoid loading all pokemon all the time once youve reached the max
  useEffect(() => {
    setRenderOffset(0)
  }, [order, sortStat, nameSearchTerm])


  // Updates the tempPokedex based off of the static pokedex
  // This gets completely rewritten everytime end user changes how they want to view the pokemon
  useEffect(() => {
    const updateTempPokedex = () => {

      let tempTempPokedex = [...pokedex]

      if (nameSearchTerm !== "") {
        tempTempPokedex = tempTempPokedex.filter(pokemon => pokemon.name.match(nameSearchTerm.toLowerCase()))
      }

      if (typeSearchTerm !== "") {
        tempTempPokedex = tempTempPokedex.filter(pokemon => pokemon.type.some( (type) => type.match(typeSearchTerm.toLowerCase()) ))
      }

      switch (sortStat) {
        case "name": // only name property is a string so we sort this differently
          setTempPokedex(tempTempPokedex.sort((a, b) => { return (order === "ascending") ? (
            (a[sortStat].toLowerCase() < b[sortStat].toLowerCase()) ? -1 : 1
          ) : (
            (a[sortStat].toLowerCase() < b[sortStat].toLowerCase()) ? 1 : -1
          )}));
          break;
        default:
          setTempPokedex(tempTempPokedex.sort((a, b) => { return (order === "ascending") ? a[sortStat] - b[sortStat] : b[sortStat] - a[sortStat] }));
      }

    }

    updateTempPokedex();
  }, [pokedex, order, sortStat, nameSearchTerm, typeSearchTerm])


  // Render the first 'renderOffset' number of pokemon from the input pokedex as PokemonCards
  const renderPokemonCards = (pokedex, order) => {

    const returnValue = pokedex
      .filter((_, index) => index < renderOffset)
      .map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} stat={sortStat} />
      ));

    return returnValue;
  };

  return (
    <>
      <div>
        <img  className="header-image" src={pokemon_center} alt=""></img>
      </div>
      <div className="header">
        <p>Pokedex</p>
      </div>

      <div className="filters">
        <input
          className="search"
          placeholder="Search for Pokemon by Name"
          value={nameSearchTerm}
          onChange={(e) => setNameSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // FIXME: console.log("Pressed Enter");
            }
          }}
        />
        <input
          className="search"
          placeholder="Search for Pokemon by Type"
          value={typeSearchTerm}
          onChange={(e) => setTypeSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // FIXME: console.log("Pressed Enter");
            }
          }}
        />
        <div>
          <select className="sort" value={sortStat} onChange={(e) => setSortStat(e.target.value)}>
            <option value="name">Name</option>
            <option value="id">ID</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
            <option value="hp">HP</option>
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="specialAttack">Special Attack</option>
            <option value="specialDefense">Special Defense</option>
            <option value="speed">Speed</option>
          </select>
          <select className="sort" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      <div>
        {tempPokedex.length > 0 ? (
          <div>{renderPokemonCards(tempPokedex, order)}</div>
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
