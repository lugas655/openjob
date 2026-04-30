const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = process.env.RABBITMQ_USER || 'guest';
    const password = process.env.RABBITMQ_PASSWORD || 'guest';

    const url = `amqp://${user}:${password}@${host}:${port}`;
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log('RabbitMQ Connected');
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
  }
};

const publishMessage = async (queue, message) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue ${queue}`);
  } catch (error) {
    console.error('RabbitMQ Publish Error:', error);
  }
};

// Initialize connection
connectRabbitMQ();

module.exports = {
  publishMessage,
};
