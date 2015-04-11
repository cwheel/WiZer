import os
import json
raw = os.popen("iwlist wlan0 scanning").read()
rawnetworks = raw.split("Cell")
networks = []

for i in range(len(rawnetworks) - 1):
    networks.append({})
    networks[i]["mac"] = rawnetworks[i+1].split("Address")[1].split()[1].replace("\n","")
    networks[i]["SSID"] = rawnetworks[i+1].split("ESSID")[1].split()[0].split("\"")[1].replace("\n","")
    networks[i]['standard'] = rawnetworks[i+1].split("IEEE 802.11")[1].split()[0].split()[0].replace("\n","")
    networks[i]['frequency'] = rawnetworks[i+1].split("Frequency")[1].split()[0].split()[0].split(":")[1].replace("\n","")
    networks[i]['channel'] = rawnetworks[i+1].split("Channe")[1].split()[1].split(")")[0].replace("\n","")
    networks[i]['speed'] = rawnetworks[i+1].split("Bit Rates:")[1].split("\n")[0].replace("\n","")
    networks[i]['quality'] = rawnetworks[i+1].split("Quality=")[1].split()[0].split("/")[0].replace("\n","")
    networks[i]['signal'] = rawnetworks[i+1].split("Signal level=")[1].split()[0].split("/")[0].replace("\n","")

    if rawnetworks[i+1].split("Encryption key")[1].split()[0] == ":on":
       networks[i]["encrypted"] = True
       networks[i]["securityType"] = rawnetworks[i+1].split("IE:")[1].replace("IEEE","").replace("802.11i/","").split()[0]
       networks[i]["cypher"] = rawnetworks[i+1].split("Group Cipher : ")[1].split()[0]
    else:
       networks[i]["encrypted"] = False
    print networks[i]
print json.dumps(networks[i])