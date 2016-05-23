import {ACTIONS} from '../constants.js';
import {getApp} from './firebaseApp.js';
let isSignedIn = false;
let store;

const TYPES = {
  PROJECT: {
    dbPath: 'data/projects',
    actions: {
      upsert: project => store.dispatch({type: ACTIONS.UPSERT_PROJECT, ...project}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_PROJECT, key}),
    },
  },
  SCREEN: {
    dbPath: 'data/screens',
    actions: {
      upsert: screen => store.dispatch({type: ACTIONS.UPSERT_SCREEN, ...screen}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_SCREEN, key}),
    },
  },
  BOX: {
    dbPath: 'data/boxes',
    actions: {
      upsert: box => store.dispatch({type: ACTIONS.UPSERT_BOX, ...box}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_BOX, key}),
    },
  },
};

class Watcher {
  constructor(snapshot, type) {
    this.type = type;
    this.key = snapshot.key;
    this.ref = this.type.dbRef.child(this.key);
    this.ref.on('value', this.onChange.bind(this));
  }

  onChange(snapshot) {
    if (!snapshot) return; // this fires when the object is removed. But the child_removed event handles the removal

    this.type.actions.upsert({
      key: this.key,
      val: snapshot.val(),
    });
  }

  remove() {
    this.type.actions.remove(this.key);
    this.ref.off('value', this.onChange);
  }
}

class FirebaseWatcher {
  constructor() {
    this.cache = {};
  }

  watchList(ref, type) {
    ref.on('child_added', snap => this.onChildAdded(snap, type));
    ref.on('child_removed', snap => this.onChildRemoved(snap));
  }

  onChildAdded(snapshot, type) {
    this.cache[snapshot.key] = new Watcher(snapshot, type);
  }

  onChildRemoved(snapshot) {
    this.cache[snapshot.key].remove();
    delete this.cache[snapshot.key];
  }
}

const firebaseWatcher = new FirebaseWatcher();

function onUserChange(userDataSnapshot) {
  if (userDataSnapshot.val()) {
    store.dispatch({
      type: ACTIONS.SIGN_IN_USER, // TODO (davidg): .UPSERT_USER ?
      key: userDataSnapshot.key,
      val: userDataSnapshot.val(),
    });
  }
}

export default {
  bindToStore: (reduxStore) => {
    store = reduxStore;

    const firebaseApp = getApp();


    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user && !isSignedIn) { // user has just signed in
        isSignedIn = true;

        const db = firebaseApp.database().ref();
        const userRef = db.child('users').child(user.uid);

        TYPES.PROJECT.dbRef = db.child(TYPES.PROJECT.dbPath);
        TYPES.SCREEN.dbRef = db.child(TYPES.SCREEN.dbPath);
        TYPES.BOX.dbRef = db.child(TYPES.BOX.dbPath);

        userRef.on('value', onUserChange);
        firebaseWatcher.watchList(userRef.child('projectKeys'), TYPES.PROJECT);
        firebaseWatcher.watchList(userRef.child('screenKeys'), TYPES.SCREEN);
        firebaseWatcher.watchList(userRef.child('boxKeys'), TYPES.BOX);
      }

      if (isSignedIn && !user) { // user is signing out
        isSignedIn = false;

        store.dispatch({
          type: ACTIONS.SIGN_OUT,
        });
      }
    });
  }
};