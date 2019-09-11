import React, { Component } from "react";
import styled from "styled-components";
import User from "../interfaces/User.interface";

const Button = styled.button`
  border: 1px solid blue;
  background-image: white;
`;

const PokemonImage = styled.img`
  margin-top: 20px;
  margin-bottom: 10px;
`;

interface SearchState {
  error: boolean;
  pokemon: Pokemon;
}

interface Pokemon {
  name: string;
  numberOfAbilities: number;
  baseExperience: number;
  imageURL: string;
}

export class PokemonSearch extends Component<User, SearchState> {
  pokemonRef: React.RefObject<HTMLInputElement>;
  constructor(props: User) {
    super(props);
    this.state = {
      error: false,
      pokemon: null
    };
    this.pokemonRef = React.createRef();
  }

  onSearchClick = () => {
    const inputValue = this.pokemonRef.current.value;
    fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`).then(res => {
      if (res.status !== 200) {
        this.setState({ error: true });
        return;
      }
      res.json().then(data => {
        this.setState({
          error: false,
          pokemon: {
            name: data.name,
            numberOfAbilities: data.abilities.length,
            baseExperience: data.base_expereince,
            imageURL: data.sprites.front_default
          }
        });
      });
    });
  };

  render() {
    const { name: userName, numberOfPokemons } = this.props;
    const { error, pokemon } = this.state;

    let resultMarkup;

    if (error) {
      resultMarkup = <p>Pokemon not found please try again</p>;
    } else if (this.state.pokemon) {
      resultMarkup = (
        <div>
          <PokemonImage src={pokemon.imageURL} alt="pokemon" />
          <p>
            {userName} has {pokemon.numberOfAbilities} abilities and{" "}
            {pokemon.baseExperience} base experience points
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>
          User {userName} has {numberOfPokemons} Pokemons
        </p>
        <input type="text" ref={this.pokemonRef} />
        <Button onClick={this.onSearchClick}>Search</Button>
        {resultMarkup}
      </div>
    );
  }
}

export default PokemonSearch;
