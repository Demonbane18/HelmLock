#include <Servo.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>


const char* ssid = "Lakers";      // change this to your wifi account
const char* password = "March0200$$$";  // change this to your wifi password
const char* myTopic = "servo";   // change this to whatever your like
const char* mqtt_server = "test.mosquitto.org";
static const int servopin1 = D0; //Pin for servo 1
static const int servopin2 = D1; // Pin for servo 2
static const int servopin3 = D2; //Pin for servo 3
static const int servopin4 = D6; //Pin for servo 4
static const int servopin5 = D7; // Pin for servo 5
static const int servopin6 = D8; //Pin for servo 6


Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;
Servo servo6;

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
        delay(20);
    }
  } else if((char)payload[0] == '0') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo1.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }

   else if ((char)payload[0] == '3') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo2.write(angle);
        delay(20);
    }
  } else if((char)payload[0] == '2') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo2.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }

  else if ((char)payload[0] == '5') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo3.write(angle);
        delay(20);
    }
  } else if((char)payload[0] == '4') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo3.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }

  else if ((char)payload[0] == 'b') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo4.write(angle);
        delay(20);
    }
  } else if((char)payload[0] == 'a') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo4.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }

  else if ((char)payload[0] == '9') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo5.write(angle);
        delay(20);
    }
  } else if((char)payload[0] == '8') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo5.write(angle);
        Serial.println(angle);
        delay(20);
    }
  }

  else if ((char)payload[0] == '11') {
    Serial.println("on");
      for(int angle = 0; angle <= angleMax; angle +=angleStep) {
        servo6.write(angle);
        delay(20);
    }
  } else if((char)payload[0] == '10') {
    Serial.println("off");
     for(int angle = 180; angle >= angleMin; angle -=angleStep) {
        servo6.write(angle);
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
  servo1.attach(servopin1);
  servo2.attach(servopin2);
  servo3.attach(servopin3);
  servo4.attach(servopin4);
  servo5.attach(servopin5);
  servo6.attach(servopin6);
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
