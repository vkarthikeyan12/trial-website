from flask import Flask, render_template

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Content lives here as plain data. Edit this to update the site — nothing
# below needs to change unless you're adding a new section.
# ---------------------------------------------------------------------------

PROFILE = {
    "name": "Karthikeyan V.",
    "handle": "vkarthikeyan12",
    "title": "Software Engineer — AI/ML & Cybersecurity",
    "location": "Nagpur, India",
    "education": "B.Tech, JDCOEM",
    "bio": (
        "I build things at the intersection of machine learning and security — "
        "from real-time computer vision to offensive-security tooling. Most of "
        "what's here started as a 'wait, can I actually do that?' side project."
    ),
    "email": "karthikeyan@vkarthikeyan.com",  # TODO: replace with your real address
    "links": {
        "github": "https://github.com/vkarthikeyan12",
        "linkedin": "https://www.linkedin.com/in/karthikeyan-venkatesan/",
        "leetcode": "https://leetcode.com/u/NBDQvKHQHg/",
        "tryhackme": "https://tryhackme.com/p/anony",
        "orcid": "https://orcid.org/0000-0003-2084-0149",
    },
}

SKILLS = [
    {
        "category": "languages",
        "items": ["Python", "C++", "JavaScript", "SQL"],
    },
    {
        "category": "ml_cv",
        "items": ["TensorFlow", "PyTorch", "OpenCV", "scikit-learn", "GANs"],
    },
    {
        "category": "security",
        "items": ["Network Recon", "Log Analysis", "CTF / TryHackMe", "Linux Hardening"],
    },
    {
        "category": "tools",
        "items": ["Git", "Flask", "Docker", "Pygame", "Render"],
    },
]

PROJECTS = [
    {
        "name": "AIDoodlePredictor",
        "desc": "Predicts hand-drawn doodles in real time using a neural net trained on the Quick, Draw! dataset.",
        "stack": ["Python", "TensorFlow"],
        "url": "https://github.com/vkarthikeyan12/AIDoodlePredictor",
    },
    {
        "name": "Sketch2Image",
        "desc": "Converts hand-drawn sketches or edge maps into realistic colored images with a Pix2Pix GAN.",
        "stack": ["Python", "PyTorch"],
        "url": "https://github.com/vkarthikeyan12/Sketch2Image",
    },
    {
        "name": "Sign_Language_Interpreter",
        "desc": "Detects sign-language gestures via webcam and translates them into text/speech using CV.",
        "stack": ["Python", "OpenCV"],
        "url": "https://github.com/vkarthikeyan12/Sign_Language_Interpretor",
    },
    {
        "name": "InvisibilityCloak",
        "desc": "Real-time invisibility-cloak effect — detects a cloak color and replaces it with the captured background.",
        "stack": ["Python", "OpenCV"],
        "url": "https://github.com/vkarthikeyan12/InvisibilityCloak",
    },
    {
        "name": "KeystrokeLogger",
        "desc": "Lab-based activity logger built for ethical cybersecurity research and simulation on Windows.",
        "stack": ["Python", "Security"],
        "url": "https://github.com/vkarthikeyan12/KeystrokeLogger",
    },
    {
        "name": "bomberman",
        "desc": "A Bomberman-style arcade game on a tile grid — bombs, breakable blocks, and basic enemy AI.",
        "stack": ["Python", "Pygame"],
        "url": "https://github.com/vkarthikeyan12/bomberman",
    },
]


@app.route("/")
def index():
    return render_template(
        "index.html",
        profile=PROFILE,
        skills=SKILLS,
        projects=PROJECTS,
    )


if __name__ == "__main__":
    app.run(debug=True)
