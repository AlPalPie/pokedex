import React from "react";

//placeholder image: https://via.placeholder.com/400

const PokemonCard = ({ pokemon }) => {
  // let types = "";
  // if (typeof pokemon.types != "undefined") {
  //   switch (pokemon.types.length) {
  //     case 1:
  //       types = pokemon.types["0"].type.name;
  //       break;
  //     case 2:
  //       types =
  //         pokemon.types["0"].type.name + " / " + pokemon.types["1"].type.name;
  //       break;
  //     default:
  //       types = "N/A";
  //   }
  // }

  return (
    <div
      key={pokemon.key}
      className="card PokemonCard"
      style={{ width: "18rem" }}
    >
      <img
        src={pokemon.image}
        className="card-img-top"
        alt={pokemon.name}
      ></img>
      <div className="card-body">
        <p className="card-text">
          {pokemon.name} {pokemon.type}
        </p>
      </div>
    </div>
  );
};

export default PokemonCard;
