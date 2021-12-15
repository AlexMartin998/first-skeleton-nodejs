'use strict';

import axios from 'axios';
import { POKE_API_URI } from '../config';

import { Team } from '../models';

export const addPokemonToTeam = async (req, res) => {
  const { team, trainer } = req.body;
  const userAuth = req.user._id.toString();

  const { data } = await axios.get(`${POKE_API_URI}/${team[0]}`);
  console.log(data.abilities[0].ability.name);

  // TODO: Middleware
  if (userAuth !== trainer)
    return res.status(401).json({ msg: 'Unauthorized. Not the same user' });

  if (team.length >= 7)
    return res
      .status(400)
      .json({ msg: 'You can only form teams of 7 pokemon' });

  // Funciona xq valido q sea el mismo user
  const pokemonTeam = await Team.findOneAndUpdate(
    { trainer },
    { team, trainer },
    { upsert: true, new: true }
  );

  res.status(201).json({ msg: 'ok', pokemonTeam });
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

export const deletePokemonFromTeam = (req, res) => {
  //

  res.status(200).json({ msg: 'User successfully deleted' });
};
