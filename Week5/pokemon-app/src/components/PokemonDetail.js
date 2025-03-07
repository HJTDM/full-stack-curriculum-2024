import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";

function PokemonDetail() {
  const {name} = useParams()
  const [pokemon, setPokemon] = useState(null)

  function fetchPokemonDetail(){
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        setPokemon(response.data)
        console.log(response.data)
      })
  }

  useEffect(() => {
    fetchPokemonDetail()
  }, [])

  if(!pokemon){
    return <CircularProgress/>
  }

  const imageUrl = pokemon.sprites.other["official-artwork"].front_default

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img src={imageUrl}/>
    </div>
  );
}

export default PokemonDetail;
