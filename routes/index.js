const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const countries = require("../countries");

// Helper: convert country ISO code to flag emoji
function getFlagEmoji(isoCode) {
  if (!isoCode) return "🌐";
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}

// Build the pre-filled WhatsApp message
function buildMessage() {
  const igLink = process.env.INSTAGRAM_LINK || "[Instagram Link]";
  return `Hello 👋\nWe are Sughosh Technolab — your complete Digital Growth Partner.\n\nWe help businesses with:\n• Website Development\n• Digital Marketing\n• Branding & Designing\n• Video Content Creation (Reels, Shorts, YouTube)\n• Business Automation (CRM / ERP Systems)\n\nFrom presence to performance — we handle your full digital journey.\n📸 Instagram: ${igLink}\n\nLet's grow your business digitally. 🐚`;
}

// GET Home Page
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10);
    res.render("index", {
      contacts,
      countries,
      getFlagEmoji,
      success: null,
      error: null,
      waLink: null,
      message: buildMessage(),
    });
  } catch (err) {
    console.error(err);
    res.render("index", {
      contacts: [],
      countries,
      getFlagEmoji,
      success: null,
      error: "Server error. Please try again.",
      waLink: null,
      message: buildMessage(),
    });
  }
});

// POST - Send WhatsApp Message
router.post("/send", async (req, res) => {
  const renderData = { countries, getFlagEmoji, message: buildMessage() };
  try {
    const { countryCode, phoneNumber, whereToConnect } = req.body;

    if (!countryCode || !phoneNumber) {
      const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10);
      return res.render("index", {
        ...renderData,
        contacts,
        success: null,
        error: "Country code and phone number are required.",
        waLink: null,
      });
    }

    const cleanCode = countryCode.replace(/[^0-9]/g, "");
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    const fullNumber = cleanCode + cleanPhone;

    const existing = await Contact.findOne({
      countryCode: cleanCode,
      phoneNumber: cleanPhone,
    });

    if (existing) {
      if (whereToConnect && whereToConnect.trim()) {
        const existingValues = existing.whereToConnect
          ? existing.whereToConnect.split(",").map((v) => v.trim())
          : [];
        if (!existingValues.includes(whereToConnect.trim())) {
          existing.whereToConnect = existing.whereToConnect
            ? existing.whereToConnect + ", " + whereToConnect.trim()
            : whereToConnect.trim();
          await existing.save();
        }
      }
    } else {
      await new Contact({
        countryCode: cleanCode,
        phoneNumber: cleanPhone,
        whereToConnect: whereToConnect ? whereToConnect.trim() : "",
      }).save();
    }

    const waLink = `https://wa.me/${fullNumber}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10);

    res.render("index", {
      ...renderData,
      contacts,
      success: `WhatsApp link generated for +${cleanCode} ${cleanPhone}`,
      error: null,
      waLink,
    });
  } catch (err) {
    console.error(err);
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10);
    res.render("index", {
      ...renderData,
      contacts,
      success: null,
      error: "Something went wrong. Please try again.",
      waLink: null,
    });
  }
});

// GET - History page
router.get("/history", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render("history", { contacts, getFlagEmoji });
  } catch (err) {
    res.render("history", { contacts: [], getFlagEmoji });
  }
});

// DELETE - Remove a contact
router.post("/delete/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/history");
  } catch (err) {
    res.redirect("/history");
  }
});

module.exports = router;
