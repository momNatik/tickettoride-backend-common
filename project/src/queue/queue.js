import AMQP from "amqplib";
import { ConnectToQueueAsync } from "./consumption.js";
import { CreateChannelAsync, SendMessageToQueue } from "./publisher.js";
export default {
    ConnectToQueueAsync,
    CreateChannelAsync,
    SendMessageToQueue,
    ConnectAsync
};
async function ConnectAsync() {
    const opt = {
        credentials: AMQP.credentials.plain(process.env.RABBIT_MQ_USER, process.env.RABBIT_MQ_PW),
    };
    return await AMQP.connect(process.env.RABBIT_MQ_URL, opt);
}
