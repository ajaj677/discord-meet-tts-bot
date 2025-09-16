import discord
from discord.ext import commands
import asyncio
import os
from gtts import gTTS

intents = discord.Intents.default()
intents.message_content = True
intents.voice_states = True

bot = commands.Bot(command_prefix="!", intents=intents)

voice_clients = {}  # To keep track of voice connections per guild

@bot.event
async def on_ready():
    print(f"✅ Logged in as {bot.user}")

@bot.command()
async def join(ctx):
    if ctx.author.voice:
        channel = ctx.author.voice.channel
        vc = await channel.connect()
        voice_clients[ctx.guild.id] = vc
        await ctx.send("🔊 Joined VC!")
        print(f"🔊 Joined {channel.name}")
    else:
        await ctx.send("⚠️ You're not in a voice channel.")

@bot.command()
async def say(ctx, *, text: str):
    vc = voice_clients.get(ctx.guild.id)

    if not vc or not vc.is_connected():
        await ctx.send("❌ I'm not in a voice channel. Use `!join` first.")
        return

    try:
        # Generate TTS audio
        tts = gTTS(text)
        tts.save("output.mp3")

        # Play the audio
        if not vc.is_playing():
            vc.play(discord.FFmpegPCMAudio("output.mp3"))
            await ctx.send(f"🗣️ Speaking: `{text}`")
            while vc.is_playing():
                await asyncio.sleep(1)
        else:
            await ctx.send("⏳ I'm already speaking. Wait a bit!")

        os.remove("output.mp3")

    except Exception as e:
        await ctx.send(f"❌ Error: {e}")
        print("❌ Exception:", e)

@bot.command()
async def leave(ctx):
    vc = voice_clients.get(ctx.guild.id)

    if vc and vc.is_connected():
        await vc.disconect()
        await ctx.send("👋 Left the voice channel.")
        print("👋 Disconnected from VC")
        voice_clients.pop(ctx.guild.id, None)
    else:
        await ctx.send("❌ I'm not in a voice channel.")

# Run your bot
bot.run("YOUR_BOT_TOKEN")
