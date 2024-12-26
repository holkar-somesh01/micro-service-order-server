import amqp, { Channel, Connection } from 'amqplib/callback_api';
import dotenv from 'dotenv';
import { connect } from 'amqplib';
import { Product } from '../model/Product';
import { addProduct } from '../controller/cart.controller';

// Load environment variables
dotenv.config();

const RABBITMQ_URL: string = process.env.RABBITMQ_URL as string;

let channel: Channel | null = null;
let connection: Connection | null = null;

// Connect to RabbitMQ using async/await
const connectToRabbitMQ = async (): Promise<void> => {
    try {
        const conn = await connect(RABBITMQ_URL);
        connection = conn;
        channel = await conn.createChannel();
        // channel.consume("sachin", (msg) => {

        // })
        // reqLister()
        addProduct()
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};



interface MessagePayload {
    [key: string]: any;
}

const publishToQueue = async (queueName: string, message: MessagePayload): Promise<void> => {
    try {
        if (!channel) {
            throw new Error('Channel not initialized.');
        }
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to queue ${queueName}:`, message);
    } catch (error) {
        console.error(`Failed to publish message to queue ${queueName}:`, error);
    }
};

const consumeQueue = async (queueName: string, callback: (data: MessagePayload) => void): Promise<void> => {
    try {
        if (!channel) {
            throw new Error('Channel not initialized.');
        }
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, (msg) => {
            if (msg) {
                const data: MessagePayload = JSON.parse(msg.content.toString());
                callback(data);
            }
        }, { noAck: true });
    } catch (error) {
        console.error(`Failed to consume messages from queue ${queueName}`, error);
    }
};

const reqLister = async (): Promise<void> => {
    console.log("COnnteddted");



    await consumeQueue("myName", (data) => {
        console.log(data);

    })


    await consumeQueue("createOrder", async (data) => {
        console.log(data);

        try {
            await Product.create({
                name: data.name,
                desc: data.desc,
                price: data.price,
                pId: data._id,
                images: data.images,
            });
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    });
    await consumeQueue("updateProdQueue", async (data) => {
        console.log("updated data", data);

        try {
            const result = await Product.findOne({ pId: data._id })
            await Product.findByIdAndUpdate(result?._id, {
                name: data.name,
                desc: data.desc,
                price: data.price,
                pId: data._id,
                images: data.images,
            });
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    });
};






export { publishToQueue, consumeQueue, connectToRabbitMQ };