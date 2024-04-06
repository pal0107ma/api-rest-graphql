import { request, response } from 'express';
import  internalErrorServer  from '../../helpers/internalErrorServer.js';

const updateUser = (req = request, res = response) => {
  try {
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default updateUser;
