import { Consumer, Kafka, Producer } from 'kafkajs'

const kafka = new Kafka({
    clientId: '',
    brokers: [''],
})

let producer: null | Producer = null
let consumer: null | Consumer = null

export async function createProducer() {
    // to optimise we use the old connection if available
    if (producer) return producer
    const _producer = kafka.producer()
    try {
        await _producer.connect()
        producer = _producer
        return producer
    }
    catch (error) {
        console.log('Error connecting kafka producer', error);
        return
    }
}

export async function createConsumer() {
    // to optimise if some connection available, we use that
    if (consumer) return consumer
    const _consumer = kafka.consumer({ groupId: "default" })
    try {
        await _consumer.connect()
        await _consumer.subscribe({ topic: 'chat-topic', fromBeginning: true })
        consumer = _consumer
        return consumer
    }
    catch (error) {
        console.log('Error connecting kafka consumer', error);
        return
    }
}

export async function produceMessages(toUserId: string,message: any) {
    const producer = await createProducer();
    try {
        await producer.send({
            topic: 'chat-topic',
            messages: [
                { value: message },
            ],
        })
        return
    }
    catch (error) {
        console.log('Error producing msg', error);
    }
}

export async function consumeMessages(messages: string | string[]) {
    const consumer = await createConsumer()
    await consumer.run({
        eachMessage: async ({ message, pause }) => {
            console.log({
                value: message.value.toString(),
            })
        },
    })
}