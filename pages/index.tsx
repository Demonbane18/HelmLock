import mqtt from "mqtt";
import type { NextPage } from "next";

const client = mqtt.connect("wss://test.mosquitto.org:8081");
const topic = "servo"; // change this to whatever your want

client.on("connect", () => {
  console.log("connected to mqtt broker.");

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

const emit = (body: "0" | "1" | "2" | "3") => {
  client.publish(topic, body);
};

const Home: NextPage = () => {
  return (
    <>
      <div>
        <h2>Servo 1</h2>
        <button onClick={() => emit("1")}>on</button>
        <button onClick={() => emit("0")}>off</button>
      </div>
      <div>
        <h2>Servo 2</h2>
        <button onClick={() => emit("3")}>on</button>
        <button onClick={() => emit("2")}>off</button>
      </div>
    </>
  );
};

export default Home;