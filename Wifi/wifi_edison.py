import os
import sys
import json
import re
import urllib
import urllib2
import time
from datetime import datetime

while (True):
  dtime = str(datetime.now())
  raw = os.popen("iwlist wlan0 scanning").read()
  rawnetworks = raw.split("Cell")
  networks = []

  try:
    for i in range(len(rawnetworks) - 1):
        networks.append({})
        networks[i]["BSSID"] = rawnetworks[i+1].split("Address")[1].split()[1].replace("\n","")
        networks[i]["SSID"] = rawnetworks[i+1].split("ESSID")[1].split()[0].split("\"")[1].replace("\n","")
        networks[i]['frequency'] = rawnetworks[i+1].split("Frequency")[1].split()[0].split()[0].split(":")[1].replace("\n","")
        networks[i]['channel'] = re.findall(r'Channel:.*', rawnetworks[i+1])[0].replace("Channel:","")
        networks[i]['quality'] = rawnetworks[i+1].split("Quality=")[1].split()[0].split("/")[0].replace("\n","")
        networks[i]['signal'] = rawnetworks[i+1].split("Signal level=")[1].split()[0].split("/")[0].replace("\n","")
        networks[i]['time'] = dtime

        if rawnetworks[i+1].split("Encryption key")[1].split()[0] == ":on":
           networks[i]["encrypted"] = True
           ies = re.findall(r'IE: .*', rawnetworks[i+1])
           for ie in ies:
              if "Unknown:" not in ie:
                  networks[i]["securityType"] = ie.replace("IEEE ", "").replace("Version 1", "").replace("802.11i/","").replace("IE:", "").replace(" ","")

           networks[i]["cypher"] = re.findall(r'Group Cipher : .*', rawnetworks[i+1])[0].replace("Group Cipher : ", "")
        else:
           networks[i]["encrypted"] = False

    try:
      req = urllib2.Request("http://" + sys.argv[1] + "/node/report", urllib.urlencode({"networks" : json.dumps(networks), "key" : "10af6925f0f94b400ddb3183569d958532232e2732de0a5bb4cc64de1e62"}))
      req.add_header("Content-type", "application/x-www-form-urlencoded")
      response = urllib2.urlopen(req)

      print "Sent wireless list (" + len(networks) + " clients) to " + sys.argv[1] + "!"
    except:
      print "Failed to send wireless list to " + sys.argv[1] + ", trying again in one minute."
  except:
    pass

  time.sleep(60*1)