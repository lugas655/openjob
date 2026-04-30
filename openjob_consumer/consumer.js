require('dotenv').config();
const amqp = require('amqplib');

const startConsumer = async () => {
  try {
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = process.env.RABBITMQ_USER || 'guest';
    const password = process.env.RABBITMQ_PASSWORD || 'guest';

    const url = `amqp://${user}:${password}@${host}:${port}`;
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const queue = 'export:applications';
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        console.log(`[x] Received message from ${queue}:`, payload);
        
        // Memproses message (console.log saja cukup sesuai requirement)
        console.log(`Processing application ID: ${payload.application_id}`);

        // Acknowledge message
        channel.ack(msg);
      }
    }, { noAck: false });

  } catch (error) {
    console.error('Consumer Connection Error:', error);
  }
};

startConsumer();
