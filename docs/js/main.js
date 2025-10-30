// Funzione di esempio per futura logica JS dinamica
function toggleContent(id) {
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle('d-none');
    }
  }
  
function handleCardClick(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    setTimeout(() => card.classList.remove('flipped'), 10000); // ritorna dopo 5s
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".license-btn"); // solo i pulsanti, salta il primo paragrafo

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            const contentId = `content${index + 2}`; // il primo pulsante corrisponde a content2
            const textId = `toggle-text${index + 2}`;
            const box = document.getElementById(contentId);
            const span = document.getElementById(textId);
            const arrow = btn.querySelector("img");

            if (!box || !span) return;

            const isVisible = box.offsetParent !== null;

            // Alterna visibilità
            box.style.display = isVisible ? "none" : "block";

            // Cambio testo
            if (!span.dataset.original) span.dataset.original = span.textContent;
            span.textContent = isVisible ? span.dataset.original : "Hide";

            // Ruota freccia
            if (arrow) {
                arrow.classList.remove("arrow-up", "arrow-down");
                arrow.classList.add(isVisible ? "arrow-down" : "arrow-up");
            }
        });
    });
});


function animateLogo() { // Animazione logo WDL
  const logo = document.getElementById('wdl-logo');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('show');
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  animateLogo();
});

// === Ricerca intelligente pagine/sinonimi ===
const pageKeywords = [
  {
    name: "Mobility",
    url: "boxes/mobility/mobility.html",
    keywords: [
      "taxi", "transport", "bus", "tram", "car", "limousine", "rickshaw", "sharing", "public transport", "private transport", "move", "get around", "shuttle",
      "limousine", "mobility", "private-transport", "public-transport", "rickshaw", "sharing",
      "ride", "journey", "commute", "driver", "passenger", "vehicle", "fleet", "ride-hailing", 
      "carpool", "car-sharing", "bike", "e-bike", "bicycle", "scooter", "e-scooter", "micro-mobility", 
      "logistics", "delivery", "route", "navigation", "traffic", "congestion", "lane", "road", "highway", 
      "parking", "garage", "station", "terminal", "hub", "metro", "subway", "train", "railway", "monorail", 
      "cable-car", "ferry", "ship", "airplane", "airport", "rideshare", "pulman", "pullman", "autobus"
    ]
  },
  {
    name: "Luggage Stores",
    url: "boxes/luggage-store/luggage-store.html",
    keywords: [
      "deposito bagagli", "valigia", "luggage", "storage", "bag", "locker", "deposit", "left luggage", "suitcase", "store", "baggage", "deposito",
      "bag drop", "baggage claim", "lost and found", "cloakroom", "baggage storage", "luggage room", "baggage service", "luggage pickup", "luggage drop-off", "luggage collection", "baggage office", "luggage assistance", "baggage handler", "luggage delivery", "luggage transfer", "luggage point", "baggage area", "luggage counter", "luggage check", "baggage check", "luggage safe", "baggage safe",
      "logo", "luggage storage", "florence", "best option", "comparison", "services", "price", "insurance", "flexibility", "location", "payment options", "bounce", "luggagepoint", "luggage point", "bag storage", "luggage deposit", "florence luggage", "luggage lockers", "bounce insurance", "full-day storage", "24h storage", "daily rate", "bag size", "small bag", "standard bag", "oversized bag", "handbags", "totes", "carry-on", "backpack", "bikes", "golf bags", "large suitcases", "theft insurance", "damage insurance", "loss coverage", "online booking", "paypal", "apple pay", "credit card", "refund", "cancellation", "bounce credit", "partner shops", "cafes", "hotels", "flexible hours", "reviews", "drop-off location", "positive comments", "rating 4.5", "luggagepoint.it", "santa maria novella", "via della scala", "ponte vecchio", "borgo san jacopo", "hourly rate", "daily prices", "standard locker", "large locker", "surveillance", "pin access", "secure storage", "cash payment", "discount code", "wheredolocals", "online refund", "in-person payment", "luggage facility", "professional storage", "key locker", "dedicated storage", "equipment", "security", "oversized luggage", "valuable luggage", "laptops", "cameras", "designer luggage", "official booking", "support", "refund policy", "claim requirements", "terms and conditions", "luggage insurance", "storage comparison", "luggage in florence", "luggage", "santa", "maria", "novella", "luggage", "near", "ponte vecchio", "long-term", "luggage", "storage"
    ]
  },
  {
    name: "Wine",
    url: "boxes/wine/wine-home.html",
    keywords: [
      "vino", "wine tasting", "cantina", "degustazione", "bottle", "winery", "enoteca", "drink", "red wine", "white wine", "fill bottle", "wine bar",
      "grape-harvest", "vineyard-view", "red-cabernet", "white-chardonnay", "rose-blush", "wine-cellar", "cork-puller", "wine-tasting", "sommelier-note", "vintage-selection", "oak-barrel", "wine-crystal", "sparkling-bottle", "wine-decant", "barrel-aging", "wine-journey", "wine-pairing", "grape-essence", "vineyard-walk", "wine-experience", "tasting-room", "terroir-story", "fine-reserve", "wine-collection", "wine-ritual", "glass-of-grape", "wine-aroma", "fermentation-process", "bottle-uncork", "vinification", "wine-flavors", "cellar-door", "bouquet-note", "vineyard-sunset", "merlot-magic", "cabernet-symphony", "wine-safari", "grape-journey", "tasting-notebook", "wine-culture", "vintage-harvest", "fermented-joy"
    ]
  },  
  {
    name: "Fill Your Bottle",
    url: "boxes/wine/fill-bottle.html",
    keywords: [
      "wine", "bottle", "refill", "tasting", "experience", "vineyard", "grapes", "winery", "sommelier", "flavors", "aromas", "pairing",
      "florentine vinaini", "vinaini", "vinai", "florence wine", "vino sfuso", "bulk wine", "tuscan wine", "tuscany wine", "tap wine", "wine shop", "neighborhood wine shop", "traditional wine", "local wine", "fill your bottle", "bring your own bottle", "demijohn", "fiasco", "refill wine", "refill shop", "wine refill", "stainless steel tank", "wine barrel", "local winery", "tuscan producer", "small winery", "authentic wine", "sustainable wine", "budget wine", "eco wine", "traditional florence", "florentine tradition", "vino alla spina", "vino toscano", "fill bottle wine", "buy empty bottle", "wine by liter", "refill station", "bulk wine florence", "florence vinai", "florence vinaino", "florence vinaini", "wine filling", "refillable bottle", "zero waste wine", "eco friendly wine", "tuscan tradition", "tuscan culture", "local experience", "florence local shop", "wine culture", "refillable wine bottle", "bulk refill", "authentic florence", "sustainable drinking", "florentine heritage", "florence enoteca", "florence bulk wine shop", "florence refill shop", "florence traditional shop", "vino sfuso firenze"
    ]
  },
  {
    name: "Wellness",
    url: "boxes/wellness/wellness.html",
    keywords: [
      "spa", "relax", "massaggio", "beauty", "soulspace", "yoga", "benessere", "wellbeing", "treatment", "wellness center", "massage", "health",
      "welness", "spa", "massage", "meditation", "aromatherapy", "sound-bath", "detox", "hot-stone", "sauna", "steam-bath", "reflexology", "reiki", "fitness", "pilates", "mindfulness", "stretching", "holistic-care", "wellness-retreat", "floatation", "hydrotherapy", "beauty-treatment"
    ]
  },
  {
    name: "Experiences",
    url: "boxes/experiences/experience.html",
    keywords: [
      "tour", "activity", "florence", "ebike", "painting", "cooking", "chianti", "van tour", "walking", "adventure", "things to do", "eventi", "local experience",
      "Experiences", "wine-tasting", "cooking-class", "vineyard-tour", "city-tour", "historical-walk", "chocolate-making", "art-gallery", "craft-workshop", "photography-tour", "horseback-riding", "river-cruise", "local-market", "ceramic-class", "truffle-hunting", "olive-oil-tasting", "cheese-making", "cultural-show", "guided-hike", "adventure-park",
      "500-tour", "scooter-tour", "classic-car-tour", "vintage-bike-tour", "countryside-drive", "scenic-loop", "adventure-ride", "road-trip", "guided-ride", "italian-highway-tour", "sunset-tour", "mountain-tour", "coastal-tour", "city-loop", "countryside-safari", "historic-route", "panoramic-tour", "photo-tour", "wine-region-tour", "heritage-route", "speed-tour",
      "cheflapo", "cooking-class", "pasta-making", "sauce-masterclass", "italian-cuisine", "dessert-class", "culinary-workshop", "pizza-masterclass", "regional-cooking", "chef-experience", "kitchen-tour", "tasting-session", "food-pairing", "fresh-ingredients-class", "gourmet-class", "traditional-recipes", "hands-on-cooking", "dinner-prep", "farm-to-table-class", "culinary-demo", "artisan-cooking",
      "chefvary", "fine-dining-experience", "tasting-menu", "kitchen-tour", "gourmet-workshop", "plating-class", "chef-demo", "culinary-lesson", "regional-specialties", "wine-pairing", "food-pairing", "dessert-workshop", "market-tour", "fresh-ingredients", "seasonal-menu", "cooking-techniques", "chef-interaction", "hands-on-prep", "signature-dishes", "chef-table", "behind-the-scenes",
      "chianti", "wine-tasting", "vineyard-visit", "cellar-tour", "wine-pairing", "sommelier-session", "wine-workshop", "olive-oil-tasting", "wine-tour", "vineyard-lunch", "barrel-tasting", "harvest-experience", "regional-wines", "wine-blending", "wine-trail", "winery-tour", "wine-dinner", "wine-education", "tasting-event", "wine-region-tour", "vineyard-walk",
      "drink-and-paint", "painting-class", "art-session", "wine-and-paint", "creative-evening", "sip-and-paint", "canvas-workshop", "acrylic-painting", "watercolor-class", "guided-painting", "paint-party", "artistic-evening", "art-therapy", "brush-session", "sketching-class", "painting-tutorial", "group-painting", "cocktail-paint", "evening-workshop", "social-painting", "art-experience",
      "e-bike", "bike-tour", "guided-ride", "countryside-ride", "scenic-route", "city-ride", "electric-tour", "nature-ride", "forest-trail", "mountain-ride", "sunset-ride", "coastal-ride", "vineyard-ride", "historic-route", "adventure-bike", "panoramic-ride", "eco-tour", "river-trail", "countryside-loop", "group-ride", "e-bike-hire",
      "experience", "adventure", "workshop", "tasting", "guided-tour", "hands-on-activity", "cultural-experience", "craft-session", "local-immersion", "day-trip", "culinary-experience", "art-class", "wellness-session", "outdoor-activity", "sport-experience", "interactive-event", "immersive-tour", "themed-activity", "seasonal-experience", "workshop-day", "sensory-experience",
      "florence-tour", "city-tour", "walking-tour", "museum-visit", "historic-walk", "guided-tour", "art-tour", "cathedral-visit", "piazza-tour", "renaissance-tour", "heritage-walk", "local-guide", "cultural-walk", "hidden-gems-tour", "architecture-tour", "evening-tour", "food-tour", "river-walk", "landmark-visit", "photo-tour", "city-loop",
      "painting-lesson", "art-class", "drawing-lesson", "watercolor-class", "acrylic-class", "canvas-session", "guided-painting", "sketch-class", "masterclass", "creative-workshop", "brush-techniques", "still-life-class", "portrait-lesson", "painting-demo", "group-class", "art-exercise", "evening-class", "art-techniques", "hands-on-session", "beginner-class", "advanced-class",
      "pasta-experience", "pasta-making", "gnocchi-class", "ravioli-workshop", "fresh-pasta", "regional-recipes", "cooking-demo", "culinary-lesson", "handmade-pasta", "traditional-pasta", "sauce-making", "tasting-session", "italian-cuisine", "dough-lesson", "pasta-shaping", "kitchen-workshop", "chef-guided-class", "pasta-pairing", "hands-on-cooking", "pasta-tour", "culinary-experience",
      "pool-pints", "pool-party", "bar"
    ]
  },
  {
    name: "Pasta Experience",
    url: "boxes/experiences/pasta-experience.html",
    keywords: [
      "pasta", "cooking", "culinary", "italian cuisine", "hands-on", "workshop", "food experience", "local ingredients", "chef", "gourmet",
      "chef varinia cappeletti", "varinia cappeletti", "chef lapo tardelli", "lapo tardelli", "pasta experience", "pasta class", "pasta workshop", "pasta course", "cooking class", "cooking school", "pasta making", "handmade pasta", "artisanal pasta", "fresh pasta", "tuscan pasta", "tuscan cooking", "tuscan wine", "wine tasting", "oltrarno", "santo spirito", "lungarno guicciardini", "ponte vecchio", "florence pasta class", "florence cooking class", "florence pasta experience", "florence cooking school", "florence workshop", "boutique cooking atelier", "refined cooking", "seasonal menu", "seasonal cooking", "organic ingredients", "local ingredients", "organic products", "modern cooking school", "culinary atelier", "tailored culinary experience", "hands-on class", "small group cooking", "group cooking", "communal dining", "vibrant class", "historic palazzo", "tuscan cuisine", "italian cuisine", "truffle ravioli", "ricotta ravioli", "nutmeg tortellini", "fettuccine alla chitarra", "tomato sauce pasta", "spinach tagliatelle", "lemon cream sauce", "sage butter", "beetroot ravioli", "ricotta walnut filling", "turmeric pici", "mushroom gnocchi", "porcini sauce", "carrot farfalle", "zucchini mint sauce", "hibiscus ravioli", "ricotta lemon filling", "pistachio crumble", "chocolate salami dessert", "bruschette aperitivo", "dessert included", "recipe pack", "take-home recipes", "wine pairing", "organic tuscan wine", "sparkling wine", "sangiovese wine", "arialdo wine", "wine bottles for purchase", "local wine", "certified organic wine", "cooking with wine", "pasta and sauces", "pasta dough", "egg pasta", "no egg pasta", "vegetarian pasta", "colorful pasta", "tinted pasta", "food and wine florence", "culinary journey florence", "authentic pasta experience", "boutique cooking experience", "premium cooking class", "pasta tasting", "florence food experience", "tuscan food", "italian food", "authentic experience", "high-end cooking", "gourmet pasta", "sustainable cooking", "florence chef class", "pasta lab", "pasta atelier", "florence hands-on cooking", "florentine experience", "best pasta class florence", "pasta lesson florence", "traditional pasta making", "pasta art", "pasta creations", "pasta tasting florence", "florence workshop pasta", "pasta school florence", "cooking course florence", "cooking in florence", "pasta and wine experience", "tuscan food experience", "italian cooking experience", "florence culinary school", "florence cuisine", "florence gastronomy", "pasta tour florence", "learn to make pasta", "pasta masterclass", "small group class florence", "food lovers florence"
    ]
  },
  {
    name: "Discover Florence",
    url: "boxes/experiences/florence-tour.html",
    keywords: [
      "florence", "tour", "city", "walking", "sightseeing", "history", "art", "culture", "landmarks", "museums", "architecture", "local guide",
      "florence", "florence tours", "discover florence", "florence experience", "florence sightseeing", "florence city tour", "florence activities", "florence attractions", "florence landmarks", "florence hidden gems", "tuscany tours", "tuscan experience", "florentine charm", "florentine history", "florence highlights", "explore florence", "walking tour", "guided walking tour", "private walking tour", "historic walking tour", "florence walking experience", "city walking tour", "food walking tour", "artisan walking tour", "oltrarno tour", "florence artisan tour", "florence food tour", "museums florence", "private guide", "local guide", "expert guide", "e-bike", "e-bike tour", "e-bike experience", "e-bike rental", "electric bike", "electric bicycle", "schind e-bike", "tuscan hills", "marignolle", "arcetri", "villa dei lari", "strozzi machiavelli villa", "porta romana", "florence countryside", "florence bike tour", "florence cycling", "e-bike florence", "tuscany e-bike", "scenic bike ride", "florence outdoor activity", "sustainable tourism", "eco-friendly tour", "private e-bike tour", "self-guided tour", "staff accompaniment", "private experience", "helmets provided", "safety helmets", "e-bike safety", "e-bike rental price", "e-bike duration", "e-bike booking", "francesco contact", "florence staff", "florence hills", "florence panorama", "dolce vita tour", "live the dolce vita", "fiat 500 tour", "fiat 500 florence", "vintage car tour", "vintage car experience", "classic fiat 500", "efiat 500", "electric fiat 500", "vintage vibes", "scenic drive", "city drive", "florence drive tour", "florence panoramic tour", "florence sunset tour", "florence hills tour", "florence night tour", "florence private driver", "fiat 500 driver", "private car tour", "private vintage tour", "eco-friendly car", "electric car florence", "florence pickup", "florence drop-off", "hotel pickup", "private vehicle", "3 person car", "personalized tour", "custom route", "custom itinerary", "iconic landmarks", "duomo florence", "ponte vecchio", "piazzale michelangelo", "fiesole", "san miniato al monte", "florence viewpoint", "panoramic view", "wine window", "artisan tour", "artisan shops", "goldsmiths", "leather shops", "local craftsmanship", "florence artisans", "prosecco toast", "sunset prosecco", "picnic tour", "hills picnic", "tuscan picnic", "gourmet picnic", "secret garden tour", "hidden gardens", "countryside experience", "wine included", "bottle of wine", "local delicacies", "tuscan wine", "tuscan countryside", "night cruise", "night drive", "florence night view", "florence after dark", "illuminated florence", "prosecco included", "electric fiat 500", "eco tour florence", "professional driver", "local storyteller", "guided driver", "bespoke experience", "advance booking", "reservation required", "price per car", "price per person", "classic tour", "artisan and wine windows tour", "sunset tour", "hills and picnic tour", "hills picnic secret garden", "6 hour tour", "rates per vehicle", "voicemap", "voicemap tour", "voicemap app", "voicemap florence", "voicemap audio guide", "gps audio tour", "gps guided tour", "offline tour", "offline map", "self-guided audio tour", "audio storytelling", "audio walks", "audio drives", "audio cycling", "local storytellers", "journalists", "filmmakers", "podcasters", "tour guides", "gps autoplay", "offline mode", "immersive experience", "audio narration", "florence voicemap", "explore with voicemap", "podcasts florence", "florence stories", "florence audio stories", "discover florence self guided", "marignolle tour", "arcetri tour", "villa dei lari e-bike", "dolce vita experience", "dolce vita florence", "fiat 500 vintage", "florence classic car", "florence car rental tour", "florence scenic route", "florence historical drive", "eco sustainable tour", "florence electric experience", "florence cultural tour", "florence romantic tour", "florence couples tour", "florence group tour", "florence private group", "florence adventure", "florence leisure", "florence travel", "tuscany travel", "florence excursions"
    ]
  },
  {
    name: "Drinking Water In Florence",
    url: "boxes/water/water.html",
    keywords: [
      "acqua", "water", "fontanello", "drinking", "tap water", "bottle refill", "fountain", "bere", "refill", "potabile", "free water", "hydration",
      "fountain", "swimming-pool", "lake", "river", "waterfall", "hot-spring", "beach", "spa-pool", "jacuzzi", "waterpark", "thermal-bath", "boating", "kayak", "paddleboarding", "scuba-diving", "snorkeling", "sailing", "hydro-therapy", "mineral-spring", "river-cruise",
      "tap water florence", "florence tap water", "is tap water drinkable", "drinkable water florence", "florence water quality", "florence water safety", "publiacqua", "arpat", "florence water analysis", "florence water standards", "eu water standards", "italian water quality", "best water europe", "italy tap water", "safe to drink water", "filtered water florence", "disinfection water", "ozone treatment", "chlorine dioxide", "florence water monitoring", "florence water parameters", "chemical parameters", "physical parameters", "water testing florence", "florence municipality", "water signage italy", "not drinkable water sign", "florence fountains", "florence public fountains", "fontanello", "florence luxury fountains", "purified water florence", "sparkling water florence", "chilled water florence", "cold water fountain", "reusable bottle florence", "refillable bottle", "refill station florence", "refill water florence", "sustainable drinking", "zero waste florence", "eco friendly florence", "florence locals habits", "florentine habits", "still water", "sparkling water", "acqua frizzante", "acqua naturale", "fill bottle florence", "refill bottle florence", "fountain"
    ]
  },
  {
    name: "Street Food",
    url: "boxes/street-food/street-food.html",
    keywords: [
      "cibo di strada", "panino", "kebab", "arancino", "bakery", "falafel", "night bakeries", "street", "food truck", "snack", "takeaway", "fast food",
      "panini", "tacos", "pizza-slice", "gelato", "crepes", "hot-dog", "kebab", "dumplings", "falafel", "burgers", "sandwiches", "churros", "empanadas", "fries", "bao", "samosas", "street-desserts", "local-snacks", "wraps", "skewers",
      "night bakery", "night bakeries", "secret night bakeries", "late night food florence", "midnight bakery florence", "florence bakery", "florence desserts", "florence pastries", "hidden bakeries florence", "florence night spots", "florence food night", "rosticceria tavola marocchina", "tavola marocchina", "moroccan food florence", "moroccan restaurant florence", "marocchina florence", "maroccan cuisine", "authentic moroccan food", "tajine florence", "couscous florence", "fried sardines", "grilled sardines", "beef tajine", "chicken tajine", "vegan tajine", "vegetarian tajine", "msemmen", "moroccan bread", "mint tea", "traditional moroccan tea", "florence halal food", "florence african food", "florence ethnic food", "marocchina near mercato centrale", "mercato centrale florence", "family run restaurant", "homemade food florence", "affordable restaurant florence", "jamm’bell", "jamm bell", "neapolitan pizzeria florence", "napoli pizza florence", "piazza puccini", "le cascine park", "cascine park florence", "southern italy food", "fritti", "fried bites", "arancini", "crocchè", "street food florence", "napoli street food", "comfort food florence", "authentic pizza florence", "handmade pizza florence", "porca vacca", "i’cchebab", "icchebab", "il kebab dal cuore toscano", "kebab florence", "tuscan kebab", "fusion kebab", "turkish tuscan fusion", "piazza dalmazia", "piazza leopoldo", "florence kebab", "florence street food", "florence fast food", "panini kebab", "piadina kebab", "kebab plate", "vegetarian kebab", "vegan kebab", "icchebab reviews", "restaurant guru", "tripadvisor florence", "best kebab florence", "tuscan turkish cuisine", "atomic falafel", "falafel florence", "palestinian food florence", "middle eastern food florence", "cavour 116r", "via camillo cavour", "hummus", "tabbouleh", "baba ganoush", "vegetarian falafel", "vegan falafel", "falafel wrap", "hummus plate", "mediterranean food florence", "atomic falafel florence", "best falafel florence", "street food florence center", "florence lunch", "florence dinner", "florence quick bite", "florence takeaway", "warm hospitality florence", "local favorite florence", "middle eastern restaurant florence", "gelateria la carraia", "la carraia", "gelato florence", "artisan gelato", "florence ice cream", "ponte alla carraia", "historical gelateria", "classic stracciatella", "ricotta pear gelato", "natural ingredients gelato", "fresh milk gelato", "italian gelato florence", "traditional gelato", "since 1990", "creamy gelato", "best gelato florence", "gelateria near ponte vecchio", "arancin", "sicilian arancini florence", "sicilian street food florence", "arancini florence", "fresh arancini", "hot arancini", "arancin florence", "santa maria novella station", "firenze rifredi station", "rifredi area florence", "tram florence", "urban food florence", "sicilian specialties", "cannoli", "cassata", "granita", "brioche", "whipped cream", "fresh pastries florence", "sicilian desserts florence", "granita florence", "cannolo florence", "sicilian bakery florence", "air conditioned restaurant", "quick lunch florence", "friendly staff florence", "local owners florence", "quality street food florence", "affordable food florence", "price arancini", "price granita", "under bridge florence", "florence train area", "florence urban zone", "florence locals favorite", "best street food florence", "florence authentic food", "florence multicultural food", "florence international cuisine", "florence cheap eats", "florence food gems", "hidden gems florence", "florence off the beaten path", "florence food map", "florence insider food", "florence local spots", "florence casual dining", "florence take away", "florence dine in", "florence eat like local", "florence late night eats", "florence ethnic street food", "florence mediterranean street food", "florence sweet shop", "florence dessert shop", "florence cheap restaurants", "florence local cuisine", "florence world food", "florence traditional food", "florence authentic esperienza"
    ]
  },
  {
    name: "Secret Night Bakeries",
    url: "boxes/street-food/night-bakeries.html",
    keywords: [
      "night", "bakeries", "secret", "food", "street", "snack", "pastry", "local", "hidden", "experience",
      "gelateria carraia", "gelato la carraia", "la carraia florence", "gelateria florence", "artisan gelato florence", "ponte alla carraia", "italian desserts florence", "late night desserts florence", "panificio santini", "santini bakery", "santini florence", "alfio santini", "piazza francesco ferrucci", "piazza ferrucci", "florence late night bakery", "florence night bakery", "florence bakery", "bakery florence", "late night pastries florence", "warm pastries florence", "italian bakery florence", "authentic italian desserts", "authentic italian bakery", "campo di marte", "campo di marte bakery", "campo di marte station", "campo di marte train station", "stadio artemio franchi", "fiorentina stadium", "campo d’arrigo", "i’ pastaio", "pastaio florence", "i pastaio campo di marte", "late night bakery florence", "night pastries florence", "pizza by slice florence", "pizza al trancio", "pizza al trancio florence", "sweet pastries florence", "savory pastries florence", "schiacciata florence", "florentine schiacciata", "italian croissants", "cornetti florence", "custard cream cornetto", "apricot jam cornetto", "blackberry jam cornetto", "multigrain pastries", "chocolate sacchettini", "sacchettini", "sweet sacchettini", "warm chocolate pastry", "florence night food", "midnight snacks florence", "florence after hours", "florence street food", "florence late night food", "florence open late", "florence pastry shop", "florence bakery lab", "florence authentic experience", "florence food culture", "florence locals spot", "florentine tradition", "florence hidden gems", "florence night spot", "florence dessert place", "florence night bread", "florence fresh bread", "fresh pastries florence", "florence sweet and savory", "florence foodie", "florence eat like local", "florence midnight bakery", "florence early morning bakery", "open late florence", "florence bakery map", "florence bakery near ferrucci", "florence bakery near campo di marte", "florence bakery near stadium", "florence bakery by car", "florence bakery by bike", "florence footbridge campo di marte", "florence late night pizza", "florence sweet shop", "florence pastry", "florence traditional bakery", "florence artisan bakery", "florence 24h bakery", "florence nocturnal bakery", "florence historical bakery", "florence bread shop", "florence panificio", "florence italian bread", "florence sweet corner", "florence night stop", "florence locals favorite", "florence culinary history", "florence authentic bakery", "florence schiacciata bakery", "florence pizza bakery", "florence open all night", "florence bakery experience"
    ]
  },
  {
    name: "Shopping",
    url: "boxes/shopping/shopping.html",
    keywords: [
      "negozi", "shop", "boutique", "fashion", "abbigliamento", "cheese", "bastah", "monaco", "local", "souvenir", "market", "store",
      "souvenir-shop", "artisan-shop", "fashion-boutique", "vintage-store", "jewelry-shop", "leather-shop", "local-market", "craft-shop", "bookshop", "antique-shop", "designer-store", "textile-shop", "chocolate-shop", "perfume-shop", "home-decor", "farmers-market", "specialty-food", "handmade-goods", "local-art", "ceramics-shop",
      "local cheese", "local cheeses", "formaggi toscani", "tuscan cheese", "tuscan cheeses", "fonte dei serri", "fonte dei serri poppi", "artisanal cheese", "handmade cheese tuscany", "mozzarella fiordilatte", "fiordilatte mozzarella", "mozzarella bocconcini", "robiola", "robiola fiorita", "robiola fresca", "stracchino", "primosale", "fresh ricotta", "ricotta fresca", "dried ricotta", "ricotta secca", "fiordiricotta", "scamorza", "caciocavallo", "caciotta fresca", "caciotta semi aged", "caciotta aged", "caciotta fiorita", "tuscan caciotta", "pecorino", "tuscan pecorino", "yogurt", "small yogurt", "large yogurt", "kefir", "kefir tuscany", "tuscan dairy products", "cheese basket", "tasting basket", "gift basket", "fresh and balanced basket", "aged and elegant basket", "cheese gift box", "tuscan cheese basket", "cheese delivery florence", "cheese pickup florence", "farm to table florence", "dairy farm tuscany", "family run farm", "artisanal production tuscany", "sustainable farm", "poppi tuscany cheese", "mozzarella florence", "best mozzarella florence", "mozzarella fiordilatte florence", "fiordilatte florence", "authentic tuscan cheese", "florentine cheese", "cheese market florence", "cheese tasting florence", "local market florence", "cheese home delivery florence", "cheese lovers florence", "tuscan tradition cheese", "italian cheese experience", "florence foodie",
      "sant’ambrogio market", "mercato sant’ambrogio", "porta romana", "porta romana florence", "piazza tasso", "piazza tasso florence", "fiorentina stadium", "stadio artemio franchi", "novoli", "gavinana", "cure", "isolotto", "poppi", "tuscany", "florence city center", "florence local pickup", "florence cheese pickup", "florence delivery", "home delivery florence", "consegna domicilio firenze", "ritira in mercato firenze",
      "authentic flavors tuscany", "authentic tuscan products", "tuscan cuisine", "tuscan flavors", "tuscan specialties", "florentine gastronomy", "sustainable lifestyle florence", "farm delivery florence", "eco friendly shopping florence", "local food florence", "artisanal products florence", "handmade in tuscany", "local experience florence", "florence gourmet", "florence foodie", "florence authentic experience", "florence gift idea", "florence specialty foods", "florence local producers", "florence small business", "florence craftsmanship", "florence creativity", "florence modern design"
    ]
  },
  {
    name: "Nightlife & Events",
    url: "boxes/nightlife/nightlife.html",
    keywords: [
      "night", "club", "bar", "eventi", "serata", "music", "party", "concert", "dj", "serre", "tenax", "bioritmo",
      "nightclub", "bar", "lounge", "disco", "live-music", "rooftop-bar", "pub", "cocktail-bar", "jazz-club", "karaoke", "speakeasy", "wine-bar", "salsa-club", "dance-club", "music-festival", "cabaret", "comedy-club", "late-night-cafe", "DJ-event", "pool-bar",
      "tenax", "tenax florence", "tenax firenze", "tenax nightclub", "tenax novoli", "tenax via pratese", "tenax nobody’s perfect", "tenax techno", "tenax house", "tenax electronic music", "tenax events", "tenax lineup", "tenax guest list", "tenax table booking", "tenax underground club", "tenax live music", "tenax dj set", "tenax clubbing", "tenax 1981", "tenax history", "tenax room 01", "tenax room 02",
      "lattex plus", "lattex+", "lattex plus florence", "lattex plus firenze", "lattex plus techno", "lattex plus house", "lattex plus experimental", "lattex plus events", "lattex plus collective", "lattex plus festival", "lattex plus lineup", "lattex plus underground", "lattex plus culture", "lattex plus visual arts", "lattex plus djs", "lattex plus producers", "lattex plus community", "lattex plus international",
      "habana 500", "la habana 500", "habana500", "habana 500 florence", "salsa", "bachata", "latin music", "nightclub", "cocktails", "live music", "habana 500 riverside", "habana 500 lungarno pecori giraldi", "salsa florence", "bachata florence", "latin club florence", "tropical night florence",
      "florence nightlife", "firenze nightlife", "florence clubs", "firenze clubs", "florence dance", "florence parties", "firenze eventi", "florence dj set", "florence live music", "florence house music", "florence techno", "florence electronic music", "florence latin night", "florence underground", "florence drinks", "florence aperitivo", "florence after dinner", "florence weekend nightlife", "groovy nights florence"
    ]
  },
  {
    name: "Weekly Tips",
    url: "boxes/nightlife/weekly-tips.html",
    keywords: [
      "tips", "weekly", "advice", "recommendations", "local", "insights", "guides", "explore", "discover", "experience"
    ]
  },
  {
    name: "Private Event Space",
    url: "boxes/private-space/private-space.html",
    keywords: [
      "event", "private", "location", "party", "affitto", "space", "meeting", "venue", "sala", "room", "eventi privati", "prenotazione",
      "villa", "apartment-rent", "secluded-garden", "terrace", "private-pool", "rooftop-suite", "luxury-apartment", "private-cabin", "penthouse", "beach-house", "private-terrace", "private-lounge", "meditation-room", "home-studio", "private-sauna", "private-dining", "retreat-space", "spa-suite", "garden-cottage", "private-balcony",
      "private event space", "private event spaces", "event space florence", "event spaces florence", "private venue florence", "private venues florence", "event venue florence", "event venues florence", "rent event space florence", "rent venue florence", "exclusive venue florence", "exclusive event space florence", "luxury event space florence", "florence private rental", "florence venue rental", "florence event location", "location eventi firenze", "spazio eventi firenze", "location privata firenze", "affitto location firenze",
      "wedding florence", "weddings florence", "private wedding florence", "romantic wedding florence", "gala dinner florence", "private dinner florence", "celebration florence", "private party florence", "soirée florence", "reception florence", "corporate event florence", "company event florence", "business event florence", "fashion show florence", "product launch florence", "art exhibition florence", "cultural event florence", "luxury event florence", "intimate event florence",
      "historic venue florence", "elegant venue florence", "charming venue florence", "authentic florentine venue", "timeless venue florence", "prestigious venue florence", "indoor event space florence", "outdoor event space florence", "terrace event florence", "terrace venue florence", "open-air venue florence", "indoor hall florence", "winter venue florence", "summer venue florence", "flexible layout venue florence", "customizable venue florence",
      "event planning florence", "catering florence", "private catering florence", "professional setup florence", "full service events florence", "tailored event florence", "custom event florence", "event organization florence", "event support florence", "curated catering florence",
      "florence city center venue", "florence historic center event", "florence landmarks venue", "florence art and culture venue", "heart of florence venue", "florence downtown event", "florence central location", "florence exclusive location"
    ]
  },
  {
    name: "Ship Your Package",
    url: "boxes/ship-package/ship-package.html",
    keywords: [
      "spedizione", "ship", "package", "parcel", "posta", "mail", "send", "delivery", "courier", "box", "shipping", "inviare",
      "ferry", "sailing-trip", "boat-tour", "private-charter",
      "dhl shipping", "dhl florence", "dhl firenze", "dhl italy", "dhl international shipping", "dhl domestic shipping", "dhl parcel", "dhl courier", "dhl package", "dhl pickup", "dhl delivery", "dhl door-to-door", "dhl door pickup", "dhl urgent shipment", "dhl express", "dhl tracking", "dhl online tracking", "dhl customs assistance", "shipping from italy", "send package florence", "send package italy", "send parcel florence", "send parcel italy", "dhl discount", "dhl shipping discount", "dhl 10% discount", "dhl 20% discount", "dhl personalized quote", "dhl shipping"
    ]
  },
  {
    name: "Restaurants",
    url: "boxes/restaurants/restaurants.html",
    keywords: [
      "ristorante", "trattoria", "osteria", "eat", "food", "dining", "cibo", "dove mangiare", "ristoranti", "menu", "chef", "lunch", "dinner",
      "experience", "adventure", "workshop", "tasting", "pasta", "guided-tour", "hands-on-activity", "cultural-experience", "craft-session", "local-immersion", "day-trip", "culinary-experience", "art-class", "wellness-session", "outdoor-activity", "sport-experience", "interactive-event", "immersive-tour", "themed-activity", "seasonal-experience", "workshop-day", "sensory-experience",
      "sant’ambrogio florence", "sant’ambrogio restaurant", "da ruggero", "da ruggero florence", "da ruggero firenze", "grotta parri", "grotta parri florence", "grotta parri firenze", "i briganti", "i briganti florence", "i briganti firenze", "i’brindellone", "i’brindellone florence", "i’brindellone firenze", "la casalinga", "la casalinga florence", "la casalinga firenze", "florentine steak", "tuscan cuisine", "authentic florentine cuisine", "hidden gem florence", "cozy restaurant florence", "historic restaurant florence", "traditional tuscan food",
      "pizzaiuolo", "pizzaiuolo florence", "pizzaiuolo firenze", "authentic neapolitan pizza", "i tarocchi", "i tarocchi florence", "i tarocchi firenze", "crisp pizza", "neapolitan pizza florence", "pizza haven florence",
      "seafood", "marina di santo spirito", "marina di santo spirito florence", "marina di santo spirito firenze", "seafood florence", "seafood restaurant florence", "artistic vibe restaurant", "historic charm restaurant",
      "vegetarian", "vegan", "gluten free", "la brac", "la brac florence", "la brac firenze", "vegetarian restaurant florence", "fun elegant interior florence", "raw", "raw florence", "raw firenze", "vegan restaurant florence", "gluten free restaurant florence",
      "odeon", "odeon restaurant", "odeon florence", "de bardi", "de bardi florence", "de bardi firenze", "elegant architecture restaurant", "bold architecture restaurant",
      "city center restaurant florence", "cafe florence", "bar florence", "florence food", "florence dining", "florence historic restaurants"
    ]
  },
  {
    name: "Cibreo",
    url: "boxes/restaurants/cibreo.html",
    keywords: [
      "cibreo", "restaurant", "florence", "italian cuisine", "traditional", "fine dining", "chef", "menu", "lunch", "dinner", "tuscan food", "local ingredients"
    ]
  }
];

function positionSuggestionsBox() {
  const searchBar = document.getElementById('search-bar');
  const suggestionsBox = document.getElementById('search-suggestions');
  if (!searchBar || !suggestionsBox) return;
  const rect = searchBar.getBoundingClientRect();
  suggestionsBox.style.position = 'absolute';
  suggestionsBox.style.zIndex = '9999';
  suggestionsBox.style.top = `${window.scrollY + rect.bottom + 4}px`; // 4px di margine sotto la barra
  suggestionsBox.style.left = `${window.scrollX + rect.left}px`;
  suggestionsBox.style.width = `${rect.width}px`;
  suggestionsBox.style.maxWidth = `${rect.width}px`;
}

const searchBar = document.getElementById('search-bar');
const suggestionsBox = document.getElementById('search-suggestions');

if (searchBar) {
  searchBar.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    if (!query) {
      suggestionsBox.classList.add('d-none');
      suggestionsBox.innerHTML = '';
      return;
    }
    const results = pageKeywords.filter(page =>
      page.name.toLowerCase().includes(query) ||
      page.keywords.some(k => k.toLowerCase().includes(query))
    );
    if (results.length === 0) {
      suggestionsBox.classList.add('d-none');
      suggestionsBox.innerHTML = '';
      return;
    }
    suggestionsBox.innerHTML = results.map(page =>
      `<div class="suggestion-item" data-url="${page.url}"><strong>${page.name}</strong><br><span class="suggestion-keywords">${page.keywords.slice(0,4).join(', ')}</span></div>`
    ).join('');
    suggestionsBox.classList.remove('d-none');
    positionSuggestionsBox();
  });

  searchBar.addEventListener('focus', positionSuggestionsBox);
  window.addEventListener('resize', positionSuggestionsBox);
  window.addEventListener('scroll', positionSuggestionsBox);

  suggestionsBox.addEventListener('click', function (e) {
    const item = e.target.closest('.suggestion-item');
    if (item && item.dataset.url) {
      window.location.href = item.dataset.url;
    }
  });

  document.addEventListener('click', function (e) {
    if (!suggestionsBox.contains(e.target) && e.target !== searchBar) {
      suggestionsBox.classList.add('d-none');
    }
  });
}
