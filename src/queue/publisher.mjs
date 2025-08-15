export async function CreateChannelAsync(connection, queueName) {
  const channel = await connection.createConfirmChannel();

  const channelOptions = {
    durable: false,
  };

  await channel.assertQueue(queueName, channelOptions);

  return channel;
}

export async function SendMessageToQueue(channel, queueName, message) {
  const options = {
    persistent: true,
  };

  const buffer = Buffer.from(JSON.stringify(message));
  
  channel.sendToQueue(queueName, buffer, options, function (err, ok) {
  });

  await channel.waitForConfirms();
}
