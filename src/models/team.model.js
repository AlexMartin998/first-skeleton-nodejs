'use strict';

import { Schema, model } from 'mongoose';

const TeamSchema = new Schema(
  {
    team: {
      type: Array,
      required: [true, 'Team is required!'],
      default: [],
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Team', TeamSchema);
