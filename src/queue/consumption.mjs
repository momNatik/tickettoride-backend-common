export async function ConnectToQueueAsync(connection, queueName, handler) {
  const channel = await connection.createChannel();

  const queue = await channel.assertQueue(queueName, {
    exclusive: true,
  });

  console.log("Consuming messages from queue: ", queue.queue);

  channel.consume(queue.queue, async (msg) => {
    if (msg.content) {
      const msgData = JSON.parse(msg.content);

      console.log("Received object: ", JSON.stringify(msgData));

      await handler(msgData);
    }

    channel.ack(msg);
  });
}
