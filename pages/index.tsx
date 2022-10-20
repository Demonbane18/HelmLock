import mqtt from "mqtt";
import type { NextPage } from "next";

const client = mqtt.connect("wss://test.mosquitto.org:8081");
const topic = "test"; // change this to whatever your want

client.on("connect", () => {
  console.log("connected to mqtt broker.");

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});
function handleOn() {
  console.log('on');
}

function handleOff() {
  console.log('off');
}

const emit = (body: "0" | "1") => {
  client.publish(topic, body);
};

const Home: NextPage = () => {
  return (
    <>
      <button onClick={() => {emit("1"),handleOn()}}>on</button>
      <button onClick={() => {emit("0"),handleOff()}}>off</button>
    </>
  );
};

export default Home;
