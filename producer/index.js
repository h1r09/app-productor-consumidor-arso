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
          value: `La hora del productor es ${new Date().toLocaleString()} y este es el mensjae número ${message}`,
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
