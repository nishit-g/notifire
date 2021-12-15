import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@notifire/core';

import Sms77Client, { SmsJsonResponse, SmsParams } from 'sms77-client';

if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

export class Sms77SmsProvider implements ISmsProvider {
  id = 'sms77';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  private sms77Client: Sms77Client;

  constructor(
    private config: {
      apiKey: string;
      from?: string;
    }
  ) {
    this.sms77Client = new Sms77Client(config.apiKey, 'Notifire');
  }

  async sendMessage(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const params: SmsParams = {
      from: this.config.from,
      json: true,
      text: options.content,
      to: options.to,
    };

    const sms77Response = <SmsJsonResponse>await this.sms77Client.sms(params);

    return {
      id: sms77Response.messages[0].id,
      date: new Date().toISOString(),
    };
  }
}