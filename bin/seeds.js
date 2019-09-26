const mongoose = require("mongoose");
const IngredientA = require("../models/IngredientA");
const IngredientB = require("../models/IngredientB");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error("Error connecting to mongo", err));

  const ingredientsA = [
    {
      name: `gamer girl bath water`,
      data: [`Rehydrated`, `Salt-Simmered`, `Soggy`],
    },
    {
      name: `non-GMO vegetable spritz`,
      data: [`Vitamin Daydream`, `Post-Herbal`, `Broccoli-Misted`],
    },
    {
      name: `motor oil for people`,
      data: [`Go-Go`, `Sludge`, `General Patton's`],
    },
    {
      name: `yeasted breast milk`,
      data: [`Mama Lunches' Sweet`, `Granular Milk`, `Morning Scramble`],
    },
    {
      name: `granola gummy chews`,
      data: [`Deceptively-Crunchy`, `Prescription`, `Kids Menu`],
    },
    {
      name: `zero-calorie [undefined]`,
      data: [`Empty`, `Ephemeral`, `Nutritionally-Void`],
    },
    {
      name: `greenhouse camel cricket flour`,
      data: [`Singing`, `Midnight`, `Jiminy's Hickory`],
    },
    {
      name: `post-vegan dashi stock`,
      data: [`Briny`, `Oceania's`, `Kawaii Desu`],
    },
    {
      name: `churned cow's blood`,
      data: [`Black Pudding`, `Curdled`, `Hearty`],
    },
    {
      name: `spirulina spread`,
      data: [`Seemingly Healthy`, `Moldy`, `Fly-Repelling`],
    },
    {
      name: `Sans Undertalo Tomato`,
      data: [`Bad Time Marinara`, `Gazpacho-Adjacent`, `Hell-Bound`],
    },
    {
      name: `hair of coconut`,
      data: [`Fortified`, `Fuzzy Wuzzy`, `Fibrous`],
    },
    {
      name: `micro flower mix`,
      data: [`Gardener Debris`, `Petting Zoo`, `Decorative`],
    },
    {
      name: `microfibre kimchee gauze`,
      data: [`Spice-Blanketed`, `Sharply Folded`, `Office-Clearing`],
    },
    {
      name: `"Parmesan" "Cheese"`,
      data: [`"Cheese-Crusted"`, `"Savory"`, `"Melty"`],
    },
    {
      name: `I Can't Believe It's Not Tuna`,
      data: [`Chicken of the Research Lab`, `Very Red`, `100% Mercury-Free`],
    }
  ];
  
IngredientA.create(ingredientsA);

  const ingredientsB = [
    {
      name: `dehydrated protein sand`,
      data: [`Meal Cube`, `Charter School Gruel`, `Growth Serum`],
    },
    {
      name: `freeze-dried raspberry steak`,
      data: [`Appetite Suppressant`, `Fruit Tartare`, `Flat ICEE`],
    },
    {
      name: `iguana marrow`,
      data: [`Roasted Cartilage`, `Road Harvest`, `Jungle Juice`],
    },
    {
      name: `flaxmeal bricks`,
      data: [`Colon Purge`, `Transcendental Breakfast`, `Fauxlenta`],
    },
    {
      name: `farm-raised kangaroo feet`,
      data: [`Willoughby Wings`, `Hop-Corn`, `Lucky's Broil`],
    },
    {
      name: `tempered tempeh`,
      data: [`Hot Glue Gunk`, `Nutrient Slab`, `Crikey Crumble`],
    },
    {
      name: `the most gentle lentil`,
      data: [`Split-Pea Shoots`, `Mash`, `Legume Loaf`],
    },
    {
      name: `astroturf rice`,
      data: [`Stuffed Balls`, `Mystery Poke`, `Major League Risotto`],
    },
    {
      name: `cold-smoked pork throat`,
      data: [`Poorly-Rendered Fat`, `Pig Screams`, `Frozen Oink`],
    },
    {
      name: `Five Guys peanut cheese`,
      data: [`Griddle Pizza`, `Sticky Salad`, `Allergy Trigger Dip`],
    },
    {
      name: `fungal spore cake`,
      data: [`Fungus Fiesta`, `O Horizon Bread Pudding`, `Brains Blast Blitz`],
    },
    {
      name: `chicken-grazed pasture`,
      data: [`Cage-Free Casserole`, `Wet Pulp`, `Mulch Mix`],
    },
    {
      name: `cultured "yeat"`,
      data: [`Balloon Steak`, `Buffalo Shoulder`, `Shrink-Wrap Roll`],
    },
    {
      name: `sourdough ender`,
      data: [`Erratic Bruschetta`, `Tortilla Finale`, `Spite Scones`],
    },
    {
      name: "artisanal Loambucha®",
      data: [`Literal Dirt Cup`, `Mudslide`, `Packed Earth Lasagna`],
    },
    {
      name: "Belarusian bread beer",
      data: [`Okróshka`, `Booze Stew`, `Gluten Bomb`],
    }
  ];

  IngredientB.create(ingredientsB);


  // function shuffleArray(array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }