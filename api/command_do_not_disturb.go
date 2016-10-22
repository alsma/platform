// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

package api

import (
	"github.com/mattermost/platform/model"
)

type DoNotDisturbProvider struct {
}

const (
	CMD_DO_NOT_DISTURB = "dnd"
)

func init() {
	RegisterCommandProvider(&DoNotDisturbProvider{})
}

func (me *DoNotDisturbProvider) GetTrigger() string {
	return CMD_DO_NOT_DISTURB
}

func (me *DoNotDisturbProvider) GetCommand(c *Context) *model.Command {
	return &model.Command{
		Trigger:          CMD_DO_NOT_DISTURB,
		AutoComplete:     true,
		AutoCompleteDesc: c.T("api.do_not_disturb.desc"),
		AutoCompleteHint: c.T("api.do_not_disturb.hint"),
		DisplayName:      c.T("api.do_not_disturb.name"),
	}
}

func (me *DoNotDisturbProvider) DoCommand(c *Context, channelId string, message string) *model.CommandResponse {
	rmsg := c.T("api.do_not_disturb.success")
	if len(message) > 0 {
		rmsg = message + " " + rmsg
	}
	//SetStatusOnline(c.Session.UserId, c.Session.Id, true)

	return &model.CommandResponse{ResponseType: model.COMMAND_RESPONSE_TYPE_EPHEMERAL, Text: rmsg}
}
