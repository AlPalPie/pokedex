import React from "react";

//placeholder image: https://via.placeholder.com/400

const PokemonCard = (props) => {
  // let types = "";
  // if (typeof props.pokemon.types != "undefined") {
  //   switch (props.pokemon.types.length) {
  //     case 1:
  //       types = props.pokemon.types["0"].type.name;
  //       break;
  //     case 2:
  //       types =
  //         props.pokemon.types["0"].type.name + " / " + props.pokemon.types["1"].type.name;
  //       break;
  //     default:
  //       types = "N/A";
  //   }
  // }

  return (
    <div
      key={props.pokemon.key}
      className="card PokemonCard"
      style={{ width: "18rem" }}
    >
      <p className="cardId">#{props.pokemon.id}</p>
      <p className="cardStat">
        {props.stat} = {props.pokemon[props.stat]}
      </p>
      <img
        src={props.pokemon.image}
        className="card-img-top"
        alt={props.pokemon.name}
      ></img>
      <div className="card-body">
        <p className="card-text">
          {props.pokemon.name} {props.pokemon.type}
        </p>
      </div>
    </div>
  );
};

export default PokemonCard;
