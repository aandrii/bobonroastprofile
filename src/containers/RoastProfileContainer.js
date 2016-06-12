import { connect } from 'react-redux';
import RoastProfile from '../components/RoastProfile';
import { compareRoasts, addFirstCrack } from '../actions';
import C from '../constants';

const mapStateToProps = (state, ownProps) => {
  if (typeof state.roasts[ownProps.params.roastId] !== 'undefined') {
    let compare = null;

    if (state.roasts[ownProps.params.roastId].hasOwnProperty('compare') &&
        state.roasts[ownProps.params.roastId].compare
    ) {
      compare = state.roasts[state.roasts[ownProps.params.roastId].compare];
    }

    return {
      ...state.roasts[ownProps.params.roastId],
      roastId: ownProps.params.roastId,
      roastInProgress: state.roastInProgress,
      compare,
      roastIds: Object.keys(state.roasts).map(roastId => {
        return {
          id: roastId,
          value: state.roasts[roastId].beansName,
          roastStart: state.roasts[roastId].roastStart
        };
      }).filter(v => {
        return v.id !== ownProps.params.roastId;
      })
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeCompare: (e, roastId) => {
      dispatch(compareRoasts(roastId, e.target.value));
    },
    compareRoasts: (roastId, compareId) => {
      dispatch(compareRoasts(roastId, compareId));
    },
    addFirstCrack: (roastId, roastStart) => {
      let uid = C.FIREBASE.auth().currentUser.uid;
      let ref = C.FIREBASE.app().database().ref(`/roasts/${uid}/${roastId}/firstCrack`);
      let firstCrackTime = Date.now() - roastStart;
      dispatch(addFirstCrack(roastId, firstCrackTime));
      ref.set(firstCrackTime);
    }
  };
};

const RoastProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoastProfile);

export default RoastProfileContainer;
