import _ from "lodash";
import assert from "assert";
import {EventEmitter} from "events";

const EVENT_CHANGE_NAMESPACE = "change";
const COOKIE_NAMESPACE = "authorisation";
const LOGIN_EMPTY = "Login is empty!";
const PASSWORD_EMPTY = "Password is empty!";

function authorisation (storage) {
  "ngInject";

  var stored = storage.get(COOKIE_NAMESPACE);
  var events = new EventEmitter();
  var authorised = Boolean(stored);
  var authorisedData = stored || {};

  /**
   * when user authorises save data to cookies
   * otherwise delete data from cookies
   */
  function onAuthorisationStateChange () {
    if (authorised) {
      storage.put(COOKIE_NAMESPACE, authorisedData);
    } else {
      storage.remove(COOKIE_NAMESPACE);
    }
  }

  // register authorisation state change event
  events.on(EVENT_CHANGE_NAMESPACE, onAuthorisationStateChange);

  return {
    /**
     * authorise user and create user session
     * and emit state change event
     * @param {{login: string, password: string}} credentials
     */
    authorise({login: login, password: password}) {
      assert.ok(!_.isEmpty(login), LOGIN_EMPTY);
      assert.ok(!_.isEmpty(password), PASSWORD_EMPTY);
      authorised = true;
      authorisedData.login = login;
      authorisedData.password = password;
      events.emit(EVENT_CHANGE_NAMESPACE);
    },
    /**
     * destroy user session
     * and emit state change event
     */
    destroy() {
      authorised = false;
      authorisedData = {};
      events.emit(EVENT_CHANGE_NAMESPACE);
    },
    /**
     * get user data
     * @param {string|null} param
     * @return {*}
     */
    getUserData(param = null) {
      if (_.isNull(param)) {
        return authorisedData;
      } else {
        return _.result(authorisedData, param);
      }
    },
    /**
     * returns if user is authorised
     * @return {boolean}
     */
    isAuthorised() {
      return authorised;
    },
    /**
     * add authorisation sate change listener
     * @note by default when adding state listener it will fire at first time to report current sate
     * @param {Function} cb
     */
    addChangeListener(cb) {
      cb();
      events.on(EVENT_CHANGE_NAMESPACE, cb);
    },
    /**
     * remove authorisation state change listener
     * @param {Function} cb
     */
    removeChangeListener(cb) {
      events.removeListener(EVENT_CHANGE_NAMESPACE, cb);
    }
  };
}

export default authorisation;