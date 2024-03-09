import subprocess
import re
import decky_plugin
import logging


logging.basicConfig(filename=decky_plugin.DECKY_PLUGIN_LOG_DIR + "/python.log",
                    format="[NordVPNDeck] %(asctime)s %(levelname)s %(message)s",
                    filemode="w+",
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

class Plugin:
    async def isInstalled(self):
        try:
            str(subprocess.run(["nordvpn"], capture_output=True, text=True).stdout)
            logger.info("Is installed: True")
            return True
        except Exception:
            logger.info("Is installed: False")
            return False

    async def getVersion(self):
        subprocess.run(["nordvpn", "version"], capture_output=True, text=True).stdout
        ver = re.search(r"\d+(\.\d+)+", str(subprocess.run(["nordvpn", "version"], capture_output=True, text=True).stdout)).group()
        logger.info("Returned version: " + ver)
        return ver

    async def getCountries(self):
        logger.info("Get countries returned: " + str(subprocess.run(["nordvpn", "countries"], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(subprocess.run(["nordvpn", "countries"], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", "")

    async def getCities(self, country):
        if country == None: return "NoCountrySelected"
        logger.info("Get cities returned: " + str(subprocess.run(["nordvpn", "cities", country], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", ""))
        return str(subprocess.run(["nordvpn", "cities", country], capture_output=True, text=True).stdout).replace("-", "").replace("\n", "").replace("    ", "")

    async def isConnected(self):
        logger.info("Is connected: " + (not str(subprocess.run(["nordvpn", "status"], capture_output=True, text=True).stdout).__contains__("Disconnected")))
        return not str(subprocess.run(["nordvpn", "status"], capture_output=True, text=True).stdout).__contains__("Disconnected")
        
    async def disconnect(self):
        logger.info("Disconnecting")
        str(subprocess.run(["nordvpn", "disconnect"], capture_output=True, text=True).stdout)

    async def autoConnect(self):
        logger.info("Autoconnecting")
        str(subprocess.run(["nordvpn", "connect"], capture_output=True, text=True).stdout)

    async def connect(self, array):
        logger.info("Connecting to server in: " + array[0] + " " + array[1])
        str(subprocess.run(["nordvpn", "connect", array[0], array[1]], capture_output=True, text=True).stdout)

    async def set(self, name, value):         
        self.settings = []  
        if(value):
            value = "enabled"
        else:
            value = "disabled"
        logger.info("Setting: " + name + " to " + value)
        str(subprocess.run(["nordvpn", "set", name, value], capture_output=True, text=True).stdout)
        self.parseSettings()

    async def getSettingsRaw(self):
        return "Technology:" + str(subprocess.run(["nordvpn", "settings"], capture_output=True, text=True).stdout).split("Technology:")[1]

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
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[0]

    async def getRouting(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[1]
    
    async def getAnalytics(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[2]

    async def getKillSwitch(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[3]

    async def getThreatProtectionLite(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[4]

    async def getNotify(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[5]

    async def getAutoConnect(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[6]

    async def getIPv6(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[7]

    async def getLanDiscovery(self):
        if(len(self.settings) == 0): self.parseSettings()
        return self.settings[8]

    async def setFirewall(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("firewall", state)

    async def setRouting(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("routing", state)

    async def setAnalytics(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("analytics", state)

    async def setKillSwitch(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("killswitch", state)

    async def setThreatProtectionLite(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("threatprotectionlite", state)

    async def setNotify(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("notify", state)

    async def setAutoConnect(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("autoconnect", state)

    async def setIPv6(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("ipv6", state)

    async def setLanDiscovery(self, state):
        if(len(self.settings) == 0): self.parseSettings()
        self.set("lan-discovery", state)

    async def resetDefaults(self):
        logger.info("Resetting to defaults")
        str(subprocess.run(["nordvpn", "set", "defaults"], capture_output=True, text=True).stdout)
        if(len(self.settings) == 0): self.parseSettings()

    async def isLoggedIn(self):
        logger.info("Called isLogin")
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service")
    
    async def logout(self):
        try:
            str(subprocess.run(["nordvpn", "logout"], capture_output=True, text=True).stdout)
            logger.info("Logging out succeeded")
            return True
        except subprocess.CalledProcessError:
            logger.info("Logging out failed")
            return False

    async def getEmail(self):
        logger.info("Returning email: " + re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout)).group())
        return re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout)).group()

    async def isSubscriptionActive(self):
        logger.info("Is subscription active: " + str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service: Active"))
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).__contains__("VPN Service: Active")

    async def getSubscriptionExpireDate(self):
        logger.info("Returned expire info: " + str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).split("Expires on ")[1].replace(")", ""))
        return str(subprocess.run(["nordvpn", "account"], capture_output=True, text=True).stdout).split("Expires on ")[1].replace(")", "")    