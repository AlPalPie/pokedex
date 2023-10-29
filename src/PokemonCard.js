import React from "react";

const PokemonCard = ({ pokemon, sprite }) => {
  let types = "";

  if (typeof pokemon.types != "undefined") {
    switch (pokemon.types.length) {
      case 1:
        types = pokemon.types["0"].type.name;
        break;
      case 2:
        types =
          pokemon.types["0"].type.name + " / " + pokemon.types["1"].type.name;
        break;
      default:
        types = "";
    }
  }

  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <img src={sprite} className="card-img-top" alt={pokemon.name}></img>
        <div className="card-body">
          <p className="card-text">
            {pokemon.name} {types}
          </p>
        </div>
      </div>
    </>
  );
};

export default PokemonCard;
