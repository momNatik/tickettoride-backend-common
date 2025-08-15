import AMQP from "amqplib";

import { ConnectToQueueAsync } from "./consumption.mjs";
import { CreateChannelAsync, SendMessageToQueue } from "./publisher.mjs";

export default {
  ConnectToQueueAsync,
  CreateChannelAsync,
  SendMessageToQueue,
  ConnectAsync
};

async function ConnectAsync() {
  const opt = {
    credentials: AMQP.credentials.plain(
      process.env.RABBIT_MQ_USER,
      process.env.RABBIT_MQ_PW
    ),
  };

  return await AMQP.connect(process.env.RABBIT_MQ_URL, opt);
}
