'use strict';

import axios from 'axios';
import { POKE_API_URI } from '../config';

import { Team } from '../models';

export const addPokemonToTeam = async (req, res) => {
  try {
    const { teamArr, trainer } = req.body;
    const userAuth = req.user._id.toString();

    // TODO: Middleware
    if (userAuth !== trainer)
      return res.status(401).json({ msg: 'Unauthorized. Not the same user' });

    if (teamArr.length >= 7)
      return res
        .status(400)
        .json({ msg: 'You can only form teams of 7 pokemon' });

    let team = [];
    const respArr = await Promise.all(
      teamArr.map(pokemonName =>
        axios.get(`${POKE_API_URI}/${pokemonName.toLowerCase()}`)
      )
    );

    team = respArr.map(res => {
      const { data } = res;

      return {
        name: data.species.name,
        types: data.types.map(typeObj => typeObj.type.name),
        pokedexNumber: data.id,
        moves: data.moves.map(moveObj => moveObj.move.name),
      };
    });

    // Funciona xq valido q sea el mismo user:   if (userAuth !== trainer)
    const pokemonTeam = await Team.findOneAndUpdate(
      { trainer },
      { team, trainer },
      { upsert: true, new: true }
    );

    res.status(201).json({ msg: 'ok', pokemonTeam });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getTeamFromUser = async (req, res) => {
  const trainer = req.user._id.toString();
  const pokemonTeam = await Team.findOne({ trainer });

  res.status(200).json({
    trainer,
    team: pokemonTeam?.team || [],
  });

  // // Pagination / Paginado:
  // const { perPage, pageNum } = req.query;
  // const skips = perPage * (pageNum - 1);
  // const pokemonTeam = (await Team.findOne().skip(skips).limit(perPage)) || [];
};

export const deletePokemonFromTeam = async (req, res) => {
  const { id } = req.params;
  const trainer = req.user._id.toString();

  const pokemonTeam = await Team.findOne({ trainer });
  if (!pokemonTeam) return res.status(400).json({ msg: 'No team is defined!' });

  const team = pokemonTeam.team;
  if (team.length <= 0)
    return res
      .status(400)
      .json({ msg: 'You no longer have pokemon in your team!' });

  team.splice(id - 1, 1);

  const currentTeam = await Team.findOneAndUpdate(
    { trainer },
    { trainer, team },
    { new: true }
  );
  const total = currentTeam.team.length;

  res
    .status(200)
    .json({ msg: 'Pokemon successfully deleted', total, currentTeam });
};
