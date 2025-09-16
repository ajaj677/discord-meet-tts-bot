import discord
import pyttsx3
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# ====== TTS Engine Setup ======
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# ====== Selenium Options Setup ======
options = Options()
options.add_argument("--use-fake-ui-for-media-stream")  # Bypass camera/mic popups

options.add_argument("--disable-infobars")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--no-sandbox")
options.add_argument("--start-maximized")
options.add_argument("--disable-blink-features=AutomationControlled")

driver = None  # Will hold our Chrome instance

# ====== Join Meet Function ======
def join_meet(url):
    global driver
    driver = webdriver.Chrome(options=options)
    full_url = url + "?authuser=0&hs=122&pli=1&mute=1"  # Mute mic/cam on join
    driver.get(full_url)
    time.sleep(8)  # Let Meet load

    try:
        # Click "Join now" button
        join_button = driver.find_element("xpath", '//button[span[contains(text(), "Join now")]]')
        join_button.click()
        print("✅ Joined the Meet.")
    except Exception as e:
        print("❌ Could not join Meet:", e)

# ====== Discord Bot Setup ======
intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"🤖 Logged in as {client.user}")

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    # === JOIN GOOGLE MEET ===
    if message.content.startswith("!join"):
        url = message.content.split(" ")[1]
        join_meet(url)
        await message.channel.send("✅ Bot has joined the Meet!")

    # === TEXT TO SPEECH ===
    elif message.content.startswith("!say"):
        text = message.content[5:]
        speak(text)
        await message.channel.send(f"🗣️ Speaking: `{text}`")

    # === LEAVE MEET ===
    elif message.content.startswith("!leave"):
        global driver
        if driver:
            driver.quit()
            driver = None
            await message.channel.send("👋 Bot has left the Meet.")
        else:
            await message.channel.send("❌ Bot is not in a Meet.")

# ====== START DISCORD BOT ======
client.run("YOUR_BOT_TOKEN")  # Replace this with your bot token
