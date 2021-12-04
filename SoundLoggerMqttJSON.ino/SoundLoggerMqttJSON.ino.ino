/*
  Datalogger MQTT client - JSON
  Connects to an MQTT broker and uploads data.
  Uses realtime clock on the SAMD21 (MKR boards and Nano 33 IoT) to
  keep time.
  Works with MKR1010, MKR1000, Nano 33 IoT
  Uses the following libraries:
   http://librarymanager/All#WiFi101  // use this for MKR1000
   http://librarymanager/All#WiFiNINA  // use this for MKR1010, Nano 33 IoT
   http://librarymanager/All#ArduinoMqttClient
   http://librarymanager/All#Arduino_JSON
   http://librarymanager/All#RTCZero
   http://librarymanager/All#Adafruit_TCS34725 (for the sensor)
  created 13 Jun 2021
  by Tom Igoe
*/
// include required libraries and config files
#include <SPI.h>
//#include <WiFi101.h>        // for MKR1000 modules
#include <WiFiNINA.h>         // for MKR1010 modules and Nano 33 IoT modules
// for simplifying JSON formatting:
#include <Arduino_JSON.h>
// realtime clock module on the SAMD21 processor:
#include <RTCZero.h>
#include <ArduinoMqttClient.h>
// I2C and light sensor libraries:
#include <Wire.h>
#include <Adafruit_TCS34725.h>
// network names and passwords:
#include "arduino_secrets.h"

/*---------- sensor variables for microphone -------------*/
// both are anlaog
#define daokiPin A0
#define max4466Pin A1
int daokiValue = 0;
int max4466Value = 0;

int countDaoki = 0;
int countMax4466 = 0;

int sumDaokiValue = 0;
int sumMax4466Value = 0;

int avgDaokiValue = 0;
int avgMax4466Value = 0;

// Sample window width in milliseconds (50 ms = 20Hz)
int sampleWindow = 50;
int peakDifference = 0;

const unsigned long eventInterval = 1000;
unsigned long previousTime = 0;
/*---------- sensor variables END -------------*/


// initialize WiFi connection using SSL
// (use WIFiClient and port number 1883 for unencrypted connections):
WiFiSSLClient wifi;
MqttClient mqttClient(wifi);
String addressString = "";

// details for MQTT client:
// char broker[] = "testjung1.cloud.shiftr.io";
char broker[] = "public.cloud.shiftr.io";
int port = 8883;
char topic[] = "ITPcenterDecibel";
const char willTopic[] = "ITPcenter/will";
String clientID = "ITPcenter";
const char location[] = "floorCenter";

// initialize RTC:
RTCZero rtc;
unsigned long startTime = 0;

// a JSON variable for the body of your requests:
JSONVar body;

// timestamp for the sensor reading and send:
long lastSendTime = 0;

// interval between requests, in minutes:
float sendInterval = 2;
// time before broker should release the will, in ms:
long int keepAliveInterval =  sendInterval * 10 * 60 * 1000;
// initialize the light sensor:
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_1X);
// number of successful readings that have been sent:
unsigned long readingCount = 0;

void setup() {
  Serial.begin(9600);              // initialize serial communication
  pinMode(daokiPin, INPUT);
  pinMode(max4466Pin, INPUT);    // pin mode

  // if serial monitor is not open, wait 3 seconds:
  if (!Serial) delay(3000);
  // start the realtime clock:
  rtc.begin();
  // array for WiFi MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      // if the byte is less than 16, add a 0 placeholder:
      addressString += "0";
    }
    // add the hexadecimal representation of this byte
    // to the address string:
    addressString += String(mac[i], HEX);
  }

  // add the MAC address to the sensor as an ID:
  body["uid"] = addressString;
  // add the location:
  body["location"] = location;

  // set the credentials for the MQTT client:
  // set a will message, used by the broker when the connection dies unexpectantly
  // you must know the size of the message before hand, and it must be set before connecting
  String willPayload = "sensor died";
  bool willRetain = true;
  int willQos = 1;
  // add location name to the client:
  clientID += location;
  mqttClient.setId(clientID);
  mqttClient.setUsernamePassword(SECRET_MQTT_USER, SECRET_MQTT_PASS);
  mqttClient.setKeepAliveInterval(keepAliveInterval);
  mqttClient.beginWill(willTopic, willPayload.length(), willRetain, willQos);
  mqttClient.print(willPayload);
  mqttClient.endWill();
}

void loop() {
  //if you disconnected from the network, reconnect:
  if (WiFi.status() != WL_CONNECTED) {
    connectToNetwork();
  }

  // if not connected to the broker, try to connect:
  if (!mqttClient.connected()) {
    Serial.println("reconnecting to broker");
    connectToBroker();
  } else {
    // If the client is not connected:  if (!client.connected()) {
    // and the request interval has passed:
    if (abs(rtc.getMinutes() - lastSendTime) >= sendInterval) {
      // read the sensor
      readSensor();
      // print it:
      Serial.println(JSON.stringify(body));
      // send:
      mqttClient.beginMessage(topic);
      // add the value:
      mqttClient.print(JSON.stringify(body));
      // send the message:
      mqttClient.endMessage();
      // increment the reading count:
      readingCount++;
      // take note of the time you make your request:

      // reset daoki and max4466 values
      sumDaokiValue = 0;
      countDaoki = 0;
      avgDaokiValue = 0;
      sumMax4466Value = 0;
      countMax4466 = 0;
      avgMax4466Value = 0;

      lastSendTime = rtc.getMinutes();
    }
  }

  // this sould be done every one seconds
  // overall value should be added, which should be averaged afterwards
  unsigned long currentTime = millis();
  if (currentTime - previousTime >= eventInterval) {
    readDaokiValue();
    sumDaokiValue += daokiValue;
    countDaoki++;
    avgDaokiValue = int(sumDaokiValue / countDaoki);

    readMax4466Value();
    sumMax4466Value += max4466Value;
    countMax4466 ++;
    avgMax4466Value = int(sumMax4466Value / max4466Value);

    //    Serial.print(daokiValue);
    //    Serial.print(", ");
    //    Serial.print(sumDaokiValue);
    //    Serial.print(", ");
    //    Serial.print(countDaoki);
    //    Serial.print(", ");
    //    Serial.print(avgDaokiValue);
    //    Serial.println();

    Serial.print(max4466Value);
    Serial.print(", ");
    Serial.print(sumMax4466Value);
    Serial.print(", ");
    Serial.print(countMax4466);
    Serial.print(", ");
    Serial.print(avgMax4466Value);
    Serial.println();

    // take note of the time you make your request:
    previousTime = currentTime;
  }
}
/*
  readSensor. You could replace this with any sensor, as long as
  you put the results into the body JSON object
  Reading two sensor values
*/

void readSensor() {
  // update elements of request body JSON object:
  //  int daokiValueToSend = readDaokiValue();

  body["timeStamp"] = rtc.getEpoch();
  body["daokiValue"] = avgDaokiValue;
  body["max4466Value"] = avgMax4466Value;

  // after reading, reset the sumDaokiValue

}

// Read it
void readDaokiValue() {
  daokiValue = analogRead(daokiPin);
  //  return daokiValue;
}

void readMax4466Value()
{
  // record start time
  double startMillis = millis();

  // this will be the highest peak, so start it very small
  int signalMax = 0;

  // this will be the lowest peak, so start it very high
  int signalMin = 1024;

  // will hold the current value from the microphone
  int sample;

  // collect data for 50 ms
  while ( (millis() - startMillis) < sampleWindow )
  {
    // read a value from mic and record it into sample variable
    sample = analogRead(max4466Pin);

    // toss out spurious readings
    if (sample < 1024)
    {

      // if the current sample is larger than the max
      if (sample > signalMax)
      {
        // this is the new max -- save it
        signalMax = sample;
      }
      // otherwise, if the current sample is smaller than the min
      else if (sample < signalMin)
      {
        // this is the new min -- save it
        signalMin = sample;
      }
    }
  }

  // now that we've collected our data,
  // determine the peak-peak amplitude as max - min
  peakDifference = signalMax - signalMin;
  max4466Value = peakDifference;

  // give it back to the caller of this method
  //  return peakDifference;
}

void connectToNetwork() {
  // try to connect to the network:
  while ( WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect to: " + String(SECRET_SSID));
    //Connect to WPA / WPA2 network:
    WiFi.begin(SECRET_SSID, SECRET_PASS);
    delay(2000);
  }
  Serial.println("connected.");

  // set the time from the network:
  unsigned long epoch;
  do {
    Serial.println("Attempting to get network time");
    epoch = WiFi.getTime();
    delay(2000);
  } while (epoch == 0);

  // set the RTC:
  rtc.setEpoch(epoch);
  if (startTime == 0) startTime = rtc.getEpoch();
  IPAddress ip = WiFi.localIP();
  Serial.print(ip);
  Serial.print("  Signal Strength: ");
  Serial.println(WiFi.RSSI());
}

boolean connectToBroker() {
  // if the MQTT client is not connected:
  if (!mqttClient.connect(broker, port)) {
    // print out the error message:
    Serial.print("MOTT connection failed. Error no: ");
    Serial.println(mqttClient.connectError());
    // return that you're not connected:
    return false;
  }
  // once you're connected, you can proceed:
  mqttClient.subscribe(topic);
  // return that you're connected:
  return true;
}
