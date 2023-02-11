#include <Servo_ESP32.h>
#include <WiFi.h>
#include <Servo_ESP32.h>
#include <PubSubClient.h>

const char* ssid = "Lakers";      // change this to your wifi account
const char* password = "March0200$$$";  // change this to your wifi password
const char* myTopic = "servo";   // change this to whatever your like
const char* mqtt_server = "test.mosquitto.org";
static const int servopin = 15; //printed G14 on the board

Servo_ESP32 servo1;

int angle =0;
int angleStep = 5;

int angleMin =0;
int angleMax = 180;

WiFiClient espClient;
PubSubClient client(espClient);
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

void handler(char* topic, byte* payload, unsigned int length) {
  if ((char)payload[0] == '1') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo1.write(angle);
        Serial.println(angle);
        delay(20);
    }
  } else {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo1.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

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
      client.publish(myTopic, "ESP32 connected");
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
  Serial.begin(115200);
  servo1.attach(servopin);
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
