import React from "react";
import fireIcon from "./images/fire.svg";




const PokemonCard = (props) => {

  const toPascalCase = (str) => {
    let words = str.split(" ");
    words = words.map(x => x.charAt(0).toUpperCase() + x.slice(1))
    return words.join(" ")
  }
  return (
    <div
      key={props.pokemon.key}
      className="card pokemon-card"
    >
      <div className="pokemon-card-grid">

        <div className="pokemon-card-header">
          <div className="pokemon-card-id">#{props.pokemon.id}</div>
          <div className="pokemon-card-name">{toPascalCase(props.pokemon.name)}</div>
          <div className="pokemon-type-icon icon">
            {/*FIXME: add type icons <img src={fireIcon} alt="fire"></img>*/}
          </div>
        </div>

        <div className="pokemon-card-image-wrapper">
          <img
            className="pokemon-card-image"
            src={props.pokemon.image}
            alt={toPascalCase(props.pokemon.name)}
          ></img>
        </div>

        <div className="pokemon-card-bio">
          <div>Type:   {toPascalCase(props.pokemon.type.join(' / '))}</div>
          <div>Height: {props.pokemon.height}</div>
          <div>Weight: {props.pokemon.weight}</div>
        </div>

        <div className="pokemon-card-stats-1 pokemon-card-stats">
          <div>HP</div>
          <div>ATK</div>
          <div>SP ATK</div>
        </div>
        <div className="pokemon-card-stats-2 pokemon-card-stats">
          <div>{props.pokemon.hp}</div>
          <div>{props.pokemon.attack}</div>
          <div>{props.pokemon.specialAttack}</div>
        </div>
        <div className="pokemon-card-stats-3 pokemon-card-stats">
          <div>SPEED</div>
          <div>DEF</div>
          <div>SP DEF</div>
        </div>
        <div className="pokemon-card-stats-4 pokemon-card-stats">
          <div>{props.pokemon.speed}</div>
          <div>{props.pokemon.defense}</div>
          <div>{props.pokemon.specialDefense}</div>
        </div>

      </div>
    </div>
  );
};

export default PokemonCard;
