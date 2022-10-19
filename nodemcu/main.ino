#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <PubSubClient.h>

#define WIFI_SSID "Unidentified Network"             //Enter Wifi Name
#define WIFI_PASS "D3C3n@F4M!Ly"         //Enter wifi Password
#define myTopic  "test"   // change this to whatever your like
#define mqtt_server  "test.mosquitto.org"

#define RELAY_PIN  5  // D1




WiFiClient espClient;
PubSubClient client(espClient);
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

void handler(char* topic, byte* payload, unsigned int length) {

  if ((char)payload[0] == '1') {
    Serial.println("on");
    digitalWrite(RELAY_PIN, HIGH);  // on
  } if ((char)payload[0] == '0') {
    Serial.println("off");
    digitalWrite(RELAY_PIN, LOW);  // off
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.publish(myTopic, "esp connected");
      client.subscribe(myTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(handler);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();
}