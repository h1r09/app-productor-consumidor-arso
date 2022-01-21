const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "arso-producer",
  brokers: [
    "kafka-service-1.default.svc.cluster.local:9092",
    "kafka-service-2.default.svc.cluster.local:9092",
  ],
});

const producer = kafka.producer();

let message = 0;

const runProducer = async () => {
  await producer.connect();

  setInterval(async () => {
    message++;

    await producer.send({
      topic: "arso-topic",
      messages: [
        {
          value: `La fecha y hora del productor son ${new Date().toLocaleString()} y es el mensaje número ${message}`,
          //value: `La fecha es ${new Date().toLocaleString()}`,
        },
      ],
    });
  }, 10000);
};

runProducer().then(() => {
  console.log("El productor está produciendo mensajes");
});

process.on("beforeExit", (code) => {
  producer.disconnect().then(() => process.exit(code));
});
