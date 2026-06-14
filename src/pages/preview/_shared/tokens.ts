// Verified hotlinkable Wikimedia Commons images (free license).
export const IMG = {
  artMuseum:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Calatrava_-_Milwaukee_Art_Museum%2C_Quadracci_Pavilion_%28B%29.jpg/1920px-Calatrava_-_Milwaukee_Art_Museum%2C_Quadracci_Pavilion_%28B%29.jpg",
  skyline:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/DSCF8676-207_%2850042887223%29.jpg/1920px-DSCF8676-207_%2850042887223%29.jpg",
  thirdWard:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Milwaukee_Boat_Line_tour_July_2022_50_%28Historic_Third_Ward%29.jpg/1920px-Milwaukee_Boat_Line_tour_July_2022_50_%28Historic_Third_Ward%29.jpg",
  riverwalk:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Milwaukee_July_2022_117_%28Milwaukee_Riverwalk%29.jpg/1920px-Milwaukee_July_2022_117_%28Milwaukee_Riverwalk%29.jpg",
  pewaukee:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pewaukee_Lake_-_panoramio.jpg/1920px-Pewaukee_Lake_-_panoramio.jpg",
  foxRiver:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Waukesha_June_2023_025_%28Fox_River%29.jpg/1920px-Waukesha_June_2023_025_%28Fox_River%29.jpg",
  lacLaBelle:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Lac_La_Belle.jpg/1920px-Lac_La_Belle.jpg",
  portWashington:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gfp-wisconsin-port-washington-lighthouse-at-dusk.jpg/1920px-Gfp-wisconsin-port-washington-lighthouse-at-dusk.jpg",
  portSunrise:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Sunrise-at-port-washigton.jpg_-_panoramio.jpg/1920px-Sunrise-at-port-washigton.jpg_-_panoramio.jpg",
  holyHill:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Basilica_and_National_Shrine_of_Mary_Help_of_Christians_at_Holy_Hill.jpg/1920px-Basilica_and_National_Shrine_of_Mary_Help_of_Christians_at_Holy_Hill.jpg",
  // Clarence Peck Residence, Oconomowoc (Waukesha County) — CC BY-SA 3.0 (attribute: Shadowe / Wikimedia Commons).
  waukeshaHome:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Clarence_Peck_Residence.JPG/1920px-Clarence_Peck_Residence.JPG",
};

// TEMP generic stock video (Pexels, free) — wired in only to FEEL the motion/parallax.
// Not Milwaukee-specific; replace with real local drone footage before launch.
export const VID = {
  city: "https://videos.pexels.com/video-files/33134800/14122034_2560_1440_24fps.mp4",
  lake: "https://videos.pexels.com/video-files/4983959/4983959-hd_1920_1080_30fps.mp4",
  autumn: "https://videos.pexels.com/video-files/14108829/14108829-hd_1920_1080_24fps.mp4",
  sunset: "https://videos.pexels.com/video-files/34566842/14645727_2560_1440_60fps.mp4",
  homes: "https://videos.pexels.com/video-files/4457655/4457655-hd_1920_1080_25fps.mp4",
};

export const SOCIAL = {
  phone: "(414) 458-1952",
  phoneHref: "tel:+14144581952",
  facebook: "https://www.facebook.com/LucasMurphyRealtor",
  youtube: "https://www.youtube.com/@LucasMurphy-LivingInMilwaukee/featured",
  google: "https://maps.app.goo.gl/fRXnkYuqMmkL4GH87",
};

// Recognizable local landmark per county for the rotating hero.
export const heroCounties = [
  {
    name: "Milwaukee County",
    place: "The Art Museum & downtown lakefront",
    path: "/areas/milwaukee-county",
    img: IMG.artMuseum,
    video: VID.city,
  },
  {
    name: "Waukesha County",
    place: "Pewaukee Lake & Lake Country",
    path: "/areas/waukesha-county",
    img: IMG.pewaukee,
    video: VID.lake,
  },
  {
    name: "Ozaukee County",
    place: "Port Washington harbor & Cedarburg",
    path: "/areas/ozaukee-county",
    img: IMG.portWashington,
  },
  {
    name: "Washington County",
    place: "Holy Hill above the kettle moraine",
    path: "/areas/washington-county",
    img: IMG.holyHill,
  },
];
