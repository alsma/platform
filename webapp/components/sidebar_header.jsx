// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import Client from 'client/web_client.jsx';
import UserStore from 'stores/user_store.jsx';
import PreferenceStore from 'stores/preference_store.jsx';
import * as Utils from 'utils/utils.jsx';

import StatusIcon from './status_icon.jsx';
import SidebarHeaderDropdown from './sidebar_header_dropdown.jsx';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import {Preferences, TutorialSteps} from 'utils/constants.jsx';
import {createMenuTip} from 'components/tutorial/tutorial_tip.jsx';

export default class SidebarHeader extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = this.getStateFromStores();
    }

    componentDidMount() {
        PreferenceStore.addChangeListener(this.onChange);
        UserStore.addStatusesChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PreferenceStore.removeChangeListener(this.onChange);
        UserStore.removeStatusesChangeListener(this.onChange);
    }

    getStateFromStores() {
        const tutorialStep = PreferenceStore.getInt(Preferences.TUTORIAL_STEP, this.props.currentUser.id, 999);

        return {
            showTutorialTip: tutorialStep === TutorialSteps.MENU_POPOVER && !Utils.isMobile(),
            status: UserStore.getStatus(this.props.currentUser.id)
        };
    }

    onChange() {
        this.setState(this.getStateFromStores());
    }

    toggleDropdown(e) {
        e.preventDefault();

        this.refs.dropdown.toggleDropdown();
    }

    render() {
        var me = this.props.currentUser;
        if (!me) {
            return null;
        }

        const statusIcon = <StatusIcon status={this.state.status}/>;
        const profilePicture = (
            <img
                className='user__picture'
                src={Client.getUsersRoute() + '/' + me.id + '/image?time=' + me.update_at}
            />
        );

        let tutorialTip = null;
        if (this.state.showTutorialTip) {
            tutorialTip = createMenuTip(this.toggleDropdown);
        }

        return (
            <div className='team__header theme'>
                {tutorialTip}
                <a
                    href='#'
                    onClick={this.toggleDropdown}
                >
                    {profilePicture}
                    {statusIcon}
                    <div className='header__info'>
                        <div className='user__name'>{'@' + me.username}</div>
                        <OverlayTrigger
                            trigger={['hover', 'focus']}
                            delayShow={1000}
                            placement='bottom'
                            overlay={<Tooltip id='team-name__tooltip'>{this.props.teamDisplayName}</Tooltip>}
                            ref='descriptionOverlay'
                        >
                            <div className='team__name'>{this.props.teamDisplayName}</div>
                        </OverlayTrigger>
                    </div>
                </a>
                <SidebarHeaderDropdown
                    ref='dropdown'
                    teamType={this.props.teamType}
                    teamDisplayName={this.props.teamDisplayName}
                    teamName={this.props.teamName}
                    currentUser={this.props.currentUser}
                />
            </div>
        );
    }
}

SidebarHeader.defaultProps = {
    teamDisplayName: '',
    teamType: ''
};
SidebarHeader.propTypes = {
    teamDisplayName: React.PropTypes.string,
    teamName: React.PropTypes.string,
    teamType: React.PropTypes.string,
    currentUser: React.PropTypes.object
};
