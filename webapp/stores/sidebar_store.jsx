// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import AppDispatcher from '../dispatcher/app_dispatcher.jsx';
import EventEmitter from 'events';

import Constants from 'utils/constants.jsx';
const ActionTypes = Constants.ActionTypes;

const ACTION_TO_STATE_MAP = {
    [ActionTypes.TOGGLE_LEFT_SIDEBAR]: 'left',
    [ActionTypes.TOGGLE_RIGHT_SIDEBAR]: 'right',
    [ActionTypes.TOGGLE_RIGHT_SLIDEABLE_VIEW]: 'rightSlideableView',
};

const CHANGE_EVENT = 'changed';
const initalState = {
    left: false,
    right: false,
    rightSlideableView: false
};

class SidebarStoreClass extends EventEmitter {
    constructor() {
        super();

        this.handleEventPayload = this.handleEventPayload.bind(this);
        this.dispatchToken = AppDispatcher.register(this.handleEventPayload);

        this.state = { ...initalState };
    }

    getState() {
        return this.state;
    }

    emitChange() {
        this.emit(CHANGE_EVENT, this.state);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    handleEventPayload(payload) {
        // toggle event handlers should accept a boolean show/hide value and can accept a map of arguments
        const { type, value } = payload.action; //eslint-disable-line no-use-before-define

        switch (type) {
        case ActionTypes.TOGGLE_LEFT_SIDEBAR:
        case ActionTypes.TOGGLE_RIGHT_SIDEBAR:
        case ActionTypes.TOGGLE_RIGHT_SLIDEABLE_VIEW:
            this.state[ACTION_TO_STATE_MAP[type]] = value;
            this.emitChange();
            break;
        case ActionTypes.HIDE_SIDEBARS:
            this.state = { ...initalState };
            this.emitChange();
            break;
        }
    }
}

const SidebarStore = new SidebarStoreClass();
export default SidebarStore;
