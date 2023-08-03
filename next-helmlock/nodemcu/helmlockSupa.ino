
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <SimpleTimer.h>
SimpleTimer timer;

// #define BLYNK_TEMPLATE_ID "TMPL6trL5qyX_"
// #define BLYNK_TEMPLATE_NAME "HelmLock"
// #define BLYNK_AUTH_TOKEN "_laGUkJW62vXNbxZ4mM8x9ZM0LOmM9Xm"

// Replace with your network credentials
const char* ssid     = "NET_NEUTRALITY";
const char* password = "Purplecrafters123!";

// supabase credentials
String API_URL = "https://deppypigxlvjocecneox.supabase.co";
String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHB5cGlneGx2am9jZWNuZW94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4OTgzMDcxNSwiZXhwIjoyMDA1NDA2NzE1fQ.J0HMBOF_frjbec0u3DGvYq6C0IwmhtzmsuggBCtcN9s";
String TableName = "alarms";
const int httpsPort = 443;

// Sending interval of the packets in seconds
//int sendinginterval = 1200; // 20 minutes
int sendinginterval = 120; // 2 minutes
//int sendinginterval = 60; // 1 min

HTTPClient https;
WiFiClientSecure client;
int flag=0;
int status;
int a;

void notifyOnButtonPress()
{
  int Alarm3 = digitalRead(D3);
  //set locker number
  a = 3;
  if (Alarm3==1 && flag==0) {
    Serial.println("Someone Opened locker 3");
   // Blynk.logEvent("alarm","Alert : Someone Opened the locker!");
    status=1;
    flag=1;
  }
  else if (Alarm3==0)
  {
    status=0;
    flag=0;
    Serial.println("Locker 3 is closed");
  }
}
void setup()
{
    // HTTPS is used without checking credentials 
    client.setInsecure();

     // Connect to the WIFI 
    Serial.begin(115200);
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    }
  
     // Print local IP address
    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    // reed switch pin
    pinMode(D3,INPUT_PULLUP);
    timer.setInterval(16000L,notifyOnButtonPress); 
}



void loop()
{
    // If connected to the internet turn the Builtin led On and attempt to send a message to the database 
    timer.run();
  if (WiFi.status() == WL_CONNECTED) {
   

    // Read all sensors
    String requestData="/0";
    if (status==1){
      requestData="{\"status\":\"open\"}";
    } else {
      requestData="{\"status\":\"close\"}";
    }
    // Send the a post request to the server
    https.begin(client,API_URL+"/rest/v1/"+TableName+"?alarm_number=eq."+a);
    https.addHeader("Content-Type", "application/json");
    https.addHeader("Prefer", "return=representation");
    https.addHeader("apikey", API_KEY);
    https.addHeader("Authorization", "Bearer " + API_KEY);

    int httpCode = https.PATCH(requestData);   //Send the request
    String payload = https.getString(); 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
    https.end();
  }else{
    Serial.println("Error in WiFi connection");
  }
  delay(10000);  //wait to send the next request
  
}
