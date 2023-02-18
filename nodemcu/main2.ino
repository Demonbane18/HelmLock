#include <Servo_ESP32.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Grandeur.h>

/*for grandeur credentials*/
const char* apiKey = " grandeurle9radca01lc0jnhg4v96ox6";
const char* deviceID = "devicele9rrw4i01lh0jnhejd94683";
const char* token = "ba0381edf50711a398d13655d0439bc73cfde08411fac090b216350f1257e6fd";  


/* Create variable to hold project and device */
Grandeur::Project project;
Grandeur::Project::Device device;
  

const char* ssid = "Lakers";      // change this to your wifi account
const char* password = "March0200$$$";  // change this to your wifi password
const char* myTopic = "servo";   // change this to whatever your like
const char* mqtt_server = "test.mosquitto.org";
static const int servopin1 = 15; //Pin for servo 1
static const int servopin2 = 16; // Pin for servo 2
static const int DOOR_SENSOR_PIN = 2; //Pin for Reed switch


Servo_ESP32 servo1;
Servo_ESP32 servo2;

int doorState=0;
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
}


void reedStatus (const char* code,int state) {   // You can write any type int/double/bool/const char* in place of int and it'll cast status to that type.
  // This method prints "state" value after it is updated on Grandeur.
  Serial.print("State: ");
  Serial.println (state); 
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
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP);
  servo1.attach(servopin1);
  servo2.attach(servopin2);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(handler);
   project = grandeur.init(apiKey, token);
   device = project.device(deviceID);

}

void loop() {
    if (project.isConnected()) 
    {
  doorState = digitalRead(DOOR_SENSOR_PIN); // read state
 
  if (doorState == HIGH) {                         
    Serial.println("The door is open");
    delay(1000);
  } else {
    Serial.println("The door is closed");
    delay(1000);
  }
       device.data().set("state",doorState,reedStatus);    // This requests to set the "state" variable on every loop and calls reedStatus() function when the
  // variable is actually updated on Grandeur. 
    project.loop();  
 }
  
  if (!client.connected()) {
    reconnect();
  }

  client.loop();
}