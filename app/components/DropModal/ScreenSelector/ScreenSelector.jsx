import React from 'react';
const {PropTypes} = React;
import forOwn from 'lodash/forOwn';

import Button from '../../Button/Button.jsx';
import Icon from '../../Icon/Icon.jsx';

import {
  COLORS,
  DIMENSIONS,
  ELEMENT_IDS,
  ICONS,
  MODALS,
} from '../../../constants.js';

const ScreenSelector = props => {
  const screens = [];

  const coordinates = props.getCoordinates(ELEMENT_IDS.SCREEN_SELECTOR_BUTTON);

  const styles = {
    back: {
      ...props.styles.back,
      padding: 0,
      ...coordinates,
    },
    title: {
      height: DIMENSIONS.SPACE_L,
      paddingTop: 19,
      borderBottom: `1px solid ${COLORS.WHITE}`,
      textTransform: 'uppercase',
      fontSize: 19,
    },
    listItem: {
      height: DIMENSIONS.SPACE_M,
      textAlign: 'left',
      padding: '6px',
      cursor: 'pointer',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    listItemName: {
      textAlign: 'left',
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    listItemGear: {
      color: COLORS.WHITE,
      flex: 0,
      opacity: 0.5,
    },
    addNew: {
      margin: `${DIMENSIONS.SPACE_M}px auto`,
      padding: 8,
      width: DIMENSIONS.SPACE_L * 3,
      background: COLORS.WHITE,
      color: COLORS.GRAY_DARK,
      fontWeight: 400,
    }
  };

  forOwn(props.screens, (screen, key) => {
    const style = {...styles.listItem};

    if (key === props.currentScreenKey) {
      style.backgroundColor = COLORS.PRIMARY;
      style.borderBottom = `1px solid ${COLORS.PRIMARY_LIGHT}`;
      style.borderTop = `1px solid ${COLORS.PRIMARY_LIGHT}`;
    }

    screens.push(
      <div
        key={key}
        style={style}
      >
        <button
          style={styles.listItemName}
          title={screen.description}
          onClick={() => {
            props.navigateToScreen(key);
          }}
        >
          {screen.name}
        </button>

        <button
          style={styles.listItemGear}
          title="Edit this screen"
          onClick={() => {
            props.navigateToScreen(key);
            props.showModal(MODALS.EDIT_SCREEN);
          }}
        >
          <Icon
            icon={ICONS.GEAR}
            size={20}
            color={styles.listItemGear.color}
          />
        </button>
      </div>
    )
  });

  return (
    <div style={styles.back}>
      {props.triangle}

      <h2 style={styles.title}>Screens</h2>

      {screens}

      <Button
        style={styles.addNew}
        onClick={() => {
          props.showModal(MODALS.ADD_SCREEN);
        }}
      >
        Add a new screen
      </Button>
    </div>
  );
};

ScreenSelector.propTypes = {
  // state
  styles: PropTypes.object,
  currentScreenKey: PropTypes.string.isRequired,
  screens: PropTypes.object,
  projects: PropTypes.object,

  // actions
  navigateToScreen: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default ScreenSelector;