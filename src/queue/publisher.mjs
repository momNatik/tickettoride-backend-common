import amqp from "amqplib";

export async function OpenChannelAsync(options) {
  const opt = {
    credentials: amqp.credentials.plain(
      process.env.RABBIT_MQ_USER,
      process.env.RABBIT_MQ_PW
    ),
  };

  const connection = await amqp.connect(process.env.RABBIT_MQ_URL, opt);
  const channel = await connection.createConfirmChannel();

  const channelOptions = {
    durable: false,
  };

  await channel.assertQueue(options.queueName, channelOptions);

  return {
    channel: channel,
    queueName: options.queueName,
  };
}

export async function SendMessageToQueue(channelInfo, message) {
  const options = {
    persistent: true,
  };

  const buffer = Buffer.from(JSON.stringify(message));
  channelInfo.channel.sendToQueue(
    channelInfo.queueName,
    buffer,
    options,
    function (err, ok) {
      const acknowledgeStatus = err !== null ? "nack" : "ack";
      Log(uniqueId, acknowledgeStatus);
    }
  );

  await channelInfo.channel.waitForConfirms();
  console.log(`Message processed`);
}
