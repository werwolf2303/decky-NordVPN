import subprocess
import re


class Plugin:

    def execute(self, command):
        return subprocess.run(command, capture_output=True, text=True).stdout

    def isInstalled(self):
        try:
            self.execute(["nordvpn"])
            return True
        except Exception:
            return False

    def getVersion(self):
        return re.search(r"\d+(\.\d+)+", self.execute(["nordvpn", "version"])).group()

    def getAccount(self):
        return self.Account(self)

    def getCountries(self):
        return self.execute(["nordvpn", "countries"]).replace("-", "").replace("\n", "").replace("    ", "").split(", ")

    def getCities(self, country):
        if country == None: return "NoCountrySelected"
        return self.execute(["nordvpn", "cities", country]).replace("-", "").replace("\n", "").replace("    ", "").split(", ")

    def isConnected(self):
        return not self.execute(["nordvpn", "status"]).__contains__("Disconnected")

    def getConnection(self):
        return self.Connection(self)

    def getSettings(self):
        return self.Settings(self)
        
    def disconnect(self):
            self.execute(["nordvpn", "disconnect"])

    def autoConnect(self):
        self.execute(["nordvpn", "connect"])

    def connect(self, country, city):
        self.execute(["nordvpn", "connect", country, city])

    def set(self, name, value):            if(value):
            value = "enabled"
        else:
            value = "disabled"
        self.execute(["nordvpn", "set", name, value])

    def getSettingsRaw(self):
        return "Technology:" + self.execute(["nordvpn", "settings"]).split("Technology:")[1]

    def parseSettings(self):
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

    def getFirewall(self):
        return self.settings[0]

    def getRouting(self):
        return self.settings[1]
    
    def getAnalytics(self):
        return self.settings[2]

    def getKillSwitch(self):
        return self.settings[3]

    def getThreatProtectionLite(self):
        return self.settings[4]

    def getNotify(self):
        return self.settings[5]

    def getAutoConnect(self):
        return self.settings[6]

    def getIPv6(self):
        return self.settings[7]

    def getLanDiscovery(self):
        return self.settings[8]

    def setFirewall(self, state):
        self.set("firewall", state)

    def setRouting(self, state):
        self.set("routing", state)

    def setAnalytics(self, state):
        self.set("analytics", state)

    def killSwitch(self, state):
        self.set("killswitch", state)

    def setThreatProtectionLite(self, state):
        self.set("threatprotectionlite", state)

    def setNotify(self, state):
        self.set("notify", state)

    def setAutoConnect(self, state):
        self.set("autoconnect", state)

    def setIPv6(self, state):
        self.set("ipv6", state)

    def setLanDiscovery(self, state):
        self.set("lan-discovery", state)

    def resetDefaults(self):
        self.execute(["nordvpn", "set", "defaults"])

    def isLoggedIn(self):
        return not self.execute(["nordvpn", "account"]).__contains__("You are not logged in.")

    def login(self):
        ret = self.execute(["nordvpn", "login"]).replace("Continue in the browser: ", "")
        if ret.__contains__("You are already"):
            return "AlreadyLoggedIn"
        else:
            return re.search(r"(?P<url>https?://[^\s]*)", ret).group()

    def logout(self):
        try:
            self.execute(["nordvpn", "logout"])
            return True
        except subprocess.CalledProcessError:
            return False

    def getEmail(self):
        return re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", self.execute(["nordvpn", "account"])).group()

    def isSubscriptionActive(self):
        return self.execute(["nordvpn", "account"]).__contains__("VPN Service: Active")

    def getSubscriptionExpireDate(self):
        return self.execute(["nordvpn", "account"]).split("Expires on ")[1].replace(")", "")    