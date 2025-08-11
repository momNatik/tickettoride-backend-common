import amqp from "amqplib";

export async function OpenChannelAsync(options) {
  const opt = {
    credentials: amqp.credentials.plain(
      process.env.RABBIT_MQ_USER,
      process.env.RABBIT_MQ_PW
    ),
  };

  const connection = await amqp.connect(process.env.RABBIT_MQ_URL, opt);
  const channel = await connection.createChannel();

  await channel.assertExchange(
    options.exchangeName,
    process.env.EXCHANGE_TYPE,
    {
      durable: false,
    }
  );

  return {
    channel: channel,
    exchangeName: options.exchangeName,
    queueName: options.queueName,
  };
}

export async function SendMessageToQueue(channelInfo, message) {
  await channelInfo.channel.publish(
    channelInfo.exchangeName,
    channelInfo.queueName,
    Buffer.from(message)
  );
}
