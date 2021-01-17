#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <math.h>
#include <string.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ChainableLED.h>
#include <typeinfo>
using namespace std;



#define GPIO_ESP_LED 13
#define buzzerPin 26
#define presenceSensor 36
#define lightSensor 34
#define NUM_LEDS  1 //Defines the num of LEDs used

ChainableLED leds(14, 32, NUM_LEDS);//defines the pin used

int globalColorR = 0;
int globalColorG = 0;
int globalColorB = 0;
int lightIntensitySensor;
int manualIntensity = -1;

int nbMinutesAbs = 30;
const int ReadPresenceTaskDelay = 1000; //en ms
int timeBeforeResetSound = round(nbMinutesAbs * 60 * 1000 * (1000 / ReadPresenceTaskDelay)); // minutes


TaskHandle_t xTaskPlaySoundHandle = NULL;

const float note[12] = {65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47
                       };

int nombreDeNotes = 32;
int tempo = 150; // plus c'est petit, plus c'est rapide
int melodie[][3] = { {4, 2, 2}, {5, 2, 1}, {7, 2, 3}, {0, 3, 6},
  {2, 2, 2}, {4, 2, 1}, {5, 2, 8},
  {7, 2, 2},  {9, 2, 1},  {11, 2, 3},  {5, 3, 6},
  {9, 2, 2}, {11, 2, 1}, {0, 3, 3}, {2, 3, 3}, {4, 3, 3},
  {4, 2, 2}, {5, 2, 1}, {7, 2, 3}, {0, 3, 6},
  {2, 3, 2}, {4, 3, 1}, {5, 3, 8},
  {7, 2, 2}, {7, 2, 1}, {4, 3, 3}, {2, 3, 2},
  {7, 2, 1}, {5, 3, 3}, {4, 3, 2}, {2, 3, 1}, {0, 3, 8}
};

//connexion WIFI
//const char* ssid = "freeboxDFR";
const char* ssid = "";

//const char* password = "passwod";
const char* password = "";


//port
AsyncWebServer server(80);

String LED_MOD = "";

char presence[4];


void vReadPresence( void *pvParameters )
{
  static float RPresenceSensor; //Resistance of sensor in K
  static int presenceThresholdValue = 10;
  
  

  int timePassedFromLastSound = 0;
  bool playSound = true;



  for ( ;; ) // <- boucle infinie
  {
    //Serial.println(timePassedFromLastSound);
    //Serial.println(timeBeforeResetSound);
    if (timePassedFromLastSound >= timeBeforeResetSound)
    {
      playSound = true;
    }
    int sensorValue = analogRead(presenceSensor);
    
    RPresenceSensor = (float)(1023 - sensorValue) * 10 / sensorValue;
    if (RPresenceSensor < presenceThresholdValue)
    {
      digitalWrite(GPIO_ESP_LED, HIGH);
      strcpy(presence, "Yes");
      if (playSound)
      {
        xTaskCreate(vPlaySound, "vPlaySound", 10000, NULL, 3, &xTaskPlaySoundHandle);
        playSound = false;
        
        HTTPClient http;
        http.begin("http://192.168.1.12:80/hpPlaying");
        http.addHeader("Content-Type", "application/json");
        // Data to send with HTTP POST
        String httpRequestData = "{\"source\":\"esp32\",\"time\":\""+String(nbMinutesAbs)+"\"}";           
        // Send HTTP POST request
        int httpResponseCode = http.POST(httpRequestData);
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
          
        // Free resources
        http.end();
      }
      timePassedFromLastSound = 0;
    }
    else
    {
      digitalWrite(GPIO_ESP_LED, LOW);
      strcpy(presence, "No");
      timePassedFromLastSound = timePassedFromLastSound + ReadPresenceTaskDelay;
    }
    Serial.printf("There is a presence :%s\n",presence);
    vTaskDelay(ReadPresenceTaskDelay);
  }
}


void vReadLightIntensity( void *pvParameters )
{
  static float RlightSensor; //Resistance of sensor in K
  static int taskDelay = 1000; //en ms

  for ( ;; ) // <- boucle infinie
  {
    int sensorValue = analogRead(lightSensor);
    lightIntensitySensor = sensorValue;
    //Serial.println(lightIntensity);
    vTaskDelay(taskDelay);
  }
}

void vPlaySound( void *pvParameters )
{
  int frequence;

  for ( int i = 0; i < nombreDeNotes ; i++ ) {
    frequence = round(note[melodie[i][0]] * 2.0 * (melodie[i][1] - 1));

    ledcSetup(0, frequence, 12);
    ledcWrite(0, 2048);  // rapport cyclique 50%
    delay(tempo * melodie[i][2] - 50);
    ledcWrite(0, 0); // rapport cyclique 0% (silence, pour séparer les notes adjacentes)
    delay(100);
  }
  vTaskDelete(NULL);
}

void vPlayLEDS( void *pvParameters )
{
  float hue = 0.0;
  boolean up = true;

  for (;;) {
    if (LED_MOD == "multiWave") {
      for (byte i = 0; i < NUM_LEDS; i++) {
        leds.setColorHSB(i, hue, 1.0, 0.5);
      }

      delay(50);

      if (up) {
        hue += 0.025;
      } else {
        hue -= 0.025;
      }

      if (hue >= 1.0 && up) {
        up = false;
      } else if (hue <= 0.0 && !up) {
        up = true;
      }
    }
    else if (LED_MOD == "continuRGB") {
      float lightIntensity;
      lightIntensity = (float)lightIntensitySensor/2400;

      
      
      int plus_petit = min(min(globalColorR,globalColorG),globalColorB);
      if (plus_petit==0)
      {
        if(min(max(max(globalColorR,globalColorG),globalColorB),255)!=0)
        {
          plus_petit=min(max(max(globalColorR,globalColorG),globalColorB),255);
        }
        else
        {
          plus_petit=255;
        }
      }
      int R = (int)min((int)round(globalColorR*lightIntensity),255);
      int G = (int)min((int)round(globalColorG*lightIntensity),255);
      int B = (int)min((int)round(globalColorB*lightIntensity),255);
      if(R==0){ R = (int)round(globalColorR/plus_petit);}
      if(G==0){ G = (int)round(globalColorG/plus_petit);}
      if(B==0){ B = (int)round(globalColorB/plus_petit);}
        
      leds.setColorRGB(0, R,G,B);
      
    }
    else if (LED_MOD == "continuRGBmanualIntensity") {
      float lightIntensity;
      lightIntensity = (float) manualIntensity/100;
      
      int plus_petit = min(min(globalColorR,globalColorG),globalColorB);
      if (plus_petit==0)
      {
        if(min(max(max(globalColorR,globalColorG),globalColorB),255)!=0)
        {
          plus_petit=min(max(max(globalColorR,globalColorG),globalColorB),255);
        }
        else
        {
          plus_petit=255;
        }
      }
      int R = (int)min((int)round(globalColorR*lightIntensity),255);
      int G = (int)min((int)round(globalColorG*lightIntensity),255);
      int B = (int)min((int)round(globalColorB*lightIntensity),255);
        
      leds.setColorRGB(0, R,G,B);
      
    }
    else
    {
      globalColorR = 255;
      globalColorG = 255;
      globalColorB = 255;

      leds.setColorRGB(0, 
                      max((int)min((int)round(globalColorR*lightIntensitySensor/2400+1),(int)255),0),  
                      max((int)min((int)round(globalColorG*lightIntensitySensor/2400+1),(int)255),0),  
                      max((int)min((int)round(globalColorB*lightIntensitySensor/2400+1),(int)255),0));
    }

  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("Start");

  pinMode(GPIO_ESP_LED, OUTPUT);
  ledcAttachPin(buzzerPin, 0);

  //Connexion au WIFI
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  //Demarrage du serveur
  server.begin();
  Serial.println("HTTP server started");


  // Route for root /
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    String response = "{";
           response += "\"message\":\"Welcome\"";
           response += "}";
    request->send(200, "application/json", response);
  });

  server.on("/playHP", HTTP_GET, [](AsyncWebServerRequest * request) {
    xTaskCreate(vPlaySound, "vPlaySound", 10000, NULL, 3, &xTaskPlaySoundHandle);
    String response = "{";
           response += "\"message\":\"HpIsPlaying\"";
           response += "}";
    request->send(200, "application/json", response);
  });

  server.on("/modifyTimeBeforeReplay", HTTP_POST, [](AsyncWebServerRequest * request) {
    if (request->hasParam("time", true))
    {
        nbMinutesAbs = request->getParam("time", true)->value().toInt();
        timeBeforeResetSound = round(nbMinutesAbs * 60 * 1000 * (1000 / ReadPresenceTaskDelay)); // minutes
    }
    String response = "{";
           response += "\"message\":\"timeChanged\"";
           response += "}";
    request->send(200, "application/json",response);
  });

  server.on("/getTimeBeforeReplay", HTTP_GET, [](AsyncWebServerRequest * request) {

    String response = "{";
           response += "\"timeBeforeReplay\":\""+String(nbMinutesAbs)+"\"";
           response += "}";
    request->send(200, "application/json", response);
  });
  //
  server.on("/modifyColor", HTTP_POST, [](AsyncWebServerRequest * request) {
    if (request->hasParam("led_mod", true)) {
      LED_MOD = (String) request->getParam("led_mod", true)->value();
      
      if (request->hasParam("intensity", true))
      {
        manualIntensity = request->getParam("intensity", true)->value().toInt();
      }
      if (request->hasParam("R", true) && request->hasParam("G", true) && request->hasParam("B", true)) {
          globalColorR = request->getParam("R", true)->value().toInt();
          globalColorG = request->getParam("G", true)->value().toInt();
          globalColorB = request->getParam("B", true)->value().toInt();
      }
    }
    String response = "{";
           response += "\"message\":\"Modified\"";
           response += "}";
    request->send(200,"application/json", response);
  });

  server.on("/getIntensitySensor", HTTP_GET, [](AsyncWebServerRequest * request) {
    String response = "{";
           response += "\"name\":\"Grove Light Sensor V1.2\",";
           response += "\"lightIntensity\":\""+String(lightIntensitySensor)+"\"";
           response += "}";
    request->send(200, "application/json", response);
  });

  server.on("/getPresenceSensor", HTTP_GET, [](AsyncWebServerRequest * request) {
    String response = "{";
           response += "\"name\":\"PIR Motion Sensor v1.2\",";
           response += "\"presence\":\""+String(presence)+"\"";
           response += "}";
    request->send(200, "application/json", response);
  });
  

  server.on("/getLedValues", HTTP_GET, [](AsyncWebServerRequest * request) {
    String response = "{";
           response += "\"number of Leds\":\""+String(NUM_LEDS)+"\",";
           response += "\"R\":\""+String(globalColorR)+"\",";
           response += "\"G\":\""+String(globalColorG)+"\",";
           response += "\"B\":\""+String(globalColorB)+"\",";
           response += "\"intensity\":\""+String(manualIntensity)+"\",";
           response += "\"mod\":\""+String(LED_MOD)+"\"";
           response += "}";
    request->send(200, "application/json", response);
  });


  

  xTaskCreate(
    vReadPresence, /* Task function. */
    "vReadPresence", /* name of task. */
    10000, /* Stack size of task */
    NULL, /* parameter of the task */
    3, /* priority of the task */
    NULL); /* Task handle to keep track of created task */


   xTaskCreate(
    vReadLightIntensity, /* Task function. */
    "vReadLightIntensity", /* name of task. */
    10000, /* Stack size of task */
    NULL, /* parameter of the task */
    3, /* priority of the task */
    NULL); /* Task handle to keep track of created task */
    
  xTaskCreate(
    vPlayLEDS, /* Task function. */
    "vPlayLEDS", /* name of task. */
    10000, /* Stack size of task */
    NULL, /* parameter of the task */
    4, /* priority of the task */
    NULL); /* Task handle to keep track of created task */

 
    
}



void loop() {

}
