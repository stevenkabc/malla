import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import {
  ACTIONS,
  SIGN_IN_STATUSES,
} from '../../constants.js';

// this is only called from the firebase watchers.
// so we know we'll get the entire object (e.g. project, screen, etc.)
// so removing nested things (users on a project) takes effect, we just switch out the whole object
function upsert(state, action) {
  const nextState = merge({}, state);

  nextState[action.key] = action.val;

  return nextState;
}

const projects = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_PROJECT:
      return upsert(state, action);

    case ACTIONS.REMOVE_PROJECT: {
      const newState = cloneDeep(state);
      delete newState[action.key];
      return newState;
    }

    case ACTIONS.SIGN_OUT:
      return {};

    default:
      return state;
  }
};

const screens = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_SCREEN: {
      return upsert(state, action);
    }

    case ACTIONS.REMOVE_SCREEN: {
      const newState = cloneDeep(state);
      delete newState[action.key];
      return newState;
    }

    case ACTIONS.SIGN_OUT: {
      return {};
    }

    default:
      return state;
  }
};

const boxes = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.UPSERT_BOX: {
      return upsert(state, action);
    }

    case ACTIONS.REMOVE_BOX: {
      const newState = cloneDeep(state);
      delete newState[action.key];
      return newState;
    }

    case ACTIONS.CLEAR_BOXES:
    case ACTIONS.SIGN_OUT:
      return {};

    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SIGN_IN_USER: // this gets used for updating the user as well. Probably shouldn't
      return {
        ...state,
        ...action.val,
        uid: action.key,
        signInStatus: SIGN_IN_STATUSES.SIGNED_IN,
      };

    case ACTIONS.SIGN_OUT: // remove all user details, except status
      return {
        signInStatus: SIGN_IN_STATUSES.SIGNED_OUT,
      };

    default:
      return state;
  }
};

export default {
  boxes,
  screens,
  projects,
  user,
};
