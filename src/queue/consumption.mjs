import amqp from "amqplib";

export async function ConnectToQueueAsync(options, handler) {
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

  const queue = await channel.assertQueue(options.queueName, {
    exclusive: true,
  });

  console.log("Waiting for messages....");

  // binding the queue
  const binding_key = "";
  channel.bindQueue(queue.queue, options.exchangeName, binding_key);

  console.log("consuming messages from queue: ", queue.queue);

  channel.consume(queue.queue, async (msg) => {
    if (msg.content) {
      const msgData = JSON.parse(msg.content);

      console.log("Received object: ", JSON.stringify(msgData));

      await handler(msgData);
    }

    channel.ack(msg);
  });
}
