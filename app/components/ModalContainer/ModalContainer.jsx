import {connect} from 'react-redux';

import * as actions from '../../data/actionCreators.js';
import ModalWrapper from './ModalWrapper/ModalWrapper.jsx';

const mapStateToProps = (state) => {
  return {...state}; // modals potentially need everything
};

const mapDispatchToProps = dispatch => {
  return {
    hideModal: modal => {
      dispatch(actions.hideModal(modal));
    },
    signIn: provider => {
      actions.signIn(provider);
    },
    setInteraction: interaction => {
      dispatch(actions.setInteraction(interaction));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper);