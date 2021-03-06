import React from 'react';
const {PropTypes} = React;

import Button from '../../Button/Button.jsx';
import PageModalWrapper from '../PageModalWrapper.jsx';

import {
  COLORS,
  DIMENSIONS,
  INTERACTIONS,
} from '../../../constants.js';
import {EVENTS} from '../../../tracker.js';

const styles = {
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: DIMENSIONS.SPACE_S,
  },
  button: {
    width: '100%',
    color: COLORS.WHITE,
    marginBottom: DIMENSIONS.SPACE_S,
    height: DIMENSIONS.SPACE_L,
  },
  facebookButton: {
    backgroundColor: '#3B5998',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
};

const SignInModal = props => {
  const signIn = provider => {
    props.hideModal();
    props.setInteraction(INTERACTIONS.USER_WAITING_TO_SIGN_IN);
    props.initiateSignIn(provider);
  };

  return (
    <PageModalWrapper
      {...props}
      title="Sign in"
      width={DIMENSIONS.SPACE_L * 6}
      showOk={false}
    >
      <p style={styles.title}>Choose your flavor</p>

      <Button
        style={{...styles.button, ...styles.facebookButton}}
        onClick={() => signIn('facebook')}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_FACEBOOK}
        label="Social sign in modal"
      >
        Facebook
      </Button>

      <Button
        style={{...styles.button, ...styles.googleButton}}
        onClick={() => signIn('google')}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_GOOGLE}
        label="Social sign in modal"
      >
        Google
      </Button>
    </PageModalWrapper>
  );
};

SignInModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  setInteraction: PropTypes.func.isRequired,
  initiateSignIn: PropTypes.func.isRequired,
};

export default SignInModal;
