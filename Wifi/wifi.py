import os
import json
import re
raw = os.popen("iwlist wlan0 scanning").read()
rawnetworks = raw.split("Cell")
networks = []

for i in range(len(rawnetworks) - 1):
    networks.append({})
    networks[i]["mac"] = rawnetworks[i+1].split("Address")[1].split()[1].replace("\n","")
    networks[i]["SSID"] = rawnetworks[i+1].split("ESSID")[1].split()[0].split("\"")[1].replace("\n","")
    networks[i]['frequency'] = rawnetworks[i+1].split("Frequency")[1].split()[0].split()[0].split(":")[1].replace("\n","")
    networks[i]['channel'] = re.findall(r'Channel:.*', rawnetworks[i+1])[0].replace("Channel:","")
    networks[i]['quality'] = rawnetworks[i+1].split("Quality=")[1].split()[0].split("/")[0].replace("\n","")
    networks[i]['signal'] = rawnetworks[i+1].split("Signal level=")[1].split()[0].split("/")[0].replace("\n","")

    if rawnetworks[i+1].split("Encryption key")[1].split()[0] == ":on":
       networks[i]["encrypted"] = True
       ies = re.findall(r'IE: .*', rawnetworks[i+1])
       for ie in ies:
          if "Unknown:" not in ie:
              networks[i]["securityType"] = ie.replace("IEEE ", "").replace("Version 1", "").replace("802.11i/","")

       networks[i]["cypher"] = re.findall(r'Group Cipher : .*', rawnetworks[i+1])[0].replace("Group Cipher : ")
    else:
       networks[i]["encrypted"] = False
    print networks[i]
print json.dumps(networks[i])