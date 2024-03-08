import subprocess
import re
import logging

logging.basicConfig(filename="/tmp/nordvpndeck.log",
                    format="[NordVPNDeck] %(asctime)s %(levelname)s %(message)s",
                    filemode="w+",
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


class Plugin:

    async def execute(self, command):
        out = subprocess.run(command).stdout
        logger.info("Command '" + command + "' returned: " + out)
        return out

    async def isInstalled(self):
        try:
            str(self.execute(self, ["nordvpn"]))
            logger.info("Is installed: True")
            return True
        except Exception:
            logger.info("Is installed: False")
            return False

    async def getVersion(self):
        ver = re.search(r"\d+(\.\d+)+", str(self.execute(self, ["nordvpn", "version"]))).group()
        logger.info("Returned version: " + ver)
        return ver

    async def getCountries(self):
        logger.info("Get countries returned: " + str(self.execute(self, ["nordvpn", "countries"])).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(self.execute(self, ["nordvpn", "countries"])).replace("-", "").replace("\n", "").replace("    ", "").split(", ")

    async def getCities(self, country):
        if country == None: return "NoCountrySelected"
        logger.info("Get cities returned: " + str(self.execute(self, ["nordvpn", "cities", country])).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(self.execute(self, ["nordvpn", "cities", country])).replace("-", "").replace("\n", "").replace("    ", "").split(", ")

    async def isConnected(self):
        logger.info("Is connected: " + (not str(self.execute(self, ["nordvpn", "status"])).__contains__("Disconnected")))
        return not str(self.execute(self, ["nordvpn", "status"])).__contains__("Disconnected")
        
    async def disconnect(self):
            str(self.execute(self, ["nordvpn", "disconnect"]))

    async def autoConnect(self):
        str(self.execute(self, ["nordvpn", "connect"]))

    async def connect(self, country, city):
        str(self.execute(self, ["nordvpn", "connect", country, city]))

    async def set(self, name, value):            
        if(value):
            value = "enabled"
        else:
            value = "disabled"
        str(self.execute(self, ["nordvpn", "set", name, value]))

    async def getSettingsRaw(self):
        return "Technology:" + str(self.execute(self, ["nordvpn", "settings"])).split("Technology:")[1]

    async def parseSettings(self):
        self.settings = []
        for line in self.getSettingsRaw().split("\n"):
            if line.__contains__("Technology:"): continue
            if line.__contains__("Firewall Mark:"): continue
            if line.__contains__("Meshnet:"): continue
            if line.__contains__("DNS:"): continue
            if line.__eq__(""): continue

            state = line.split(": ")[1]
            if(state.__eq__("enabled")):
                state = True
            else:
                state = False
            self.settings.append(state)

    async def getFirewall(self):
        return self.settings[0]

    async def getRouting(self):
        return self.settings[1]
    
    async def getAnalytics(self):
        return self.settings[2]

    async def getKillSwitch(self):
        return self.settings[3]

    async def getThreatProtectionLite(self):
        return self.settings[4]

    async def getNotify(self):
        return self.settings[5]

    async def getAutoConnect(self):
        return self.settings[6]

    async def getIPv6(self):
        return self.settings[7]

    async def getLanDiscovery(self):
        return self.settings[8]

    async def setFirewall(self, state):
        self.set("firewall", state)

    async def setRouting(self, state):
        self.set("routing", state)

    async def setAnalytics(self, state):
        self.set("analytics", state)

    async def killSwitch(self, state):
        self.set("killswitch", state)

    async def setThreatProtectionLite(self, state):
        self.set("threatprotectionlite", state)

    async def setNotify(self, state):
        self.set("notify", state)

    async def setAutoConnect(self, state):
        self.set("autoconnect", state)

    async def setIPv6(self, state):
        self.set("ipv6", state)

    async def setLanDiscovery(self, state):
        self.set("lan-discovery", state)

    async def resetDefaults(self):
        str(self.execute(self, ["nordvpn", "set", "defaults"]))

    async def isLoggedIn(self):
        return not str(self.execute(self, ["nordvpn", "account"])).__contains__("You are not logged in.")

    async def login(self):
        ret = str(self.execute(self, ["nordvpn", "login"])).replace("Continue in the browser: ", "")
        if ret.__contains__("You are already"):
            return "AlreadyLoggedIn"
        else:
            return re.search(r"(?P<url>https?://[^\s]*)", ret).group()

    async def logout(self):
        try:
            str(self.execute(self, ["nordvpn", "logout"]))
            return True
        except subprocess.CalledProcessError:
            return False

    async def getEmail(self):
        return re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", str(self.execute(self, ["nordvpn", "account"]))).group()

    async def isSubscriptionActive(self):
        return str(self.execute(self, ["nordvpn", "account"])).__contains__("VPN Service: Active")

    async def getSubscriptionExpireDate(self):
        return str(self.execute(self, ["nordvpn", "account"])).split("Expires on ")[1].replace(")", "")    