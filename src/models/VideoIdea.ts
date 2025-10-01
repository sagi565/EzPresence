export interface VideoIdea {
  id: string;
  idea: string;
  title: string;
  description: string;
  prompt: string;
}

export const generateRandomIdeas = (count: number = 4): VideoIdea[] => {
  const ideaTemplates = [
    {
      ideaBase: "A chef grilling {item} on a hot grill, talking about how customers will love the {adjective} {flavor}",
      titleBase: "The {adjective} {item} on the Grill Surprise",
      descriptionBase: "A charismatic chef presents MeatBar's new twist - {item}. Perfect solution for lovers of {flavor} flavors! #MeatBar #Burger #{hashtag}",
      promptBase: "Middle-aged chef with dark hair, wearing white chef uniform, standing next to a blazing grill with visible flames. Carefully placing thick, golden {item} slices on the grill grate. The {item} sizzles and caramelizes as sweet juices drip. The chef looks directly at the camera with a confident smile, gesturing toward the grilled {item} and speaking enthusiastically. Warm kitchen lighting illuminates the scene with MeatBar branding visible in the background.",
    },
    {
      ideaBase: "Two {items} talking about how MeatBar is about to put them into the {dish}",
      titleBase: "The {items} Waiting for Their Big Moment",
      descriptionBase: "Two {items} getting excited about becoming part of MeatBar's legendary {dish}. A funny and original video showcasing the {adjective} side! #MeatBar #Burger #{hashtag}",
      promptBase: "Two animated {items} with cute faces and big eyes sitting on a kitchen counter at MeatBar restaurant. The first {item}, excited, says: 'Did you hear? MeatBar is going to put us in their {adjective} {dish}!' The second {item} jumps with excitement and replies: 'Finally! I've been waiting for this moment my whole life!' Both smile and hug happily. In the background, a blazing grill and cooking burgers are visible. Warm and pleasant lighting, comedic and arrogant atmosphere.",
    },
    {
      ideaBase: "A MeatBar customer is disappointed there's no {item} in the burger. The chef hears from the kitchen and says 'You know what, for you we'll do anything'",
      titleBase: "Service Beyond Expectations",
      descriptionBase: "A heartwarming moment proving why MeatBar is more than a restaurant - it's family! When a customer wants something special, we do everything to see them happy. #MeatBar #Burger",
      promptBase: "Young customer in a {color} t-shirt sitting at a table in the vibrant MeatBar restaurant. Holding a large burger and biting into it, but face shows slight disappointment. Whispers to himself: 'I was dying for some {item}.' In the open kitchen in the background, a middle-aged chef with a white chef's hat and stained apron hears the words. He stops his work, confidently raises his head and says clearly with a genuine smile: 'You know what, for you we'll do anything!' Camera smoothly transitions from the surprised customer to the chef already starting to cut fresh {item}. Background filled with lively restaurant sounds, warm lighting and signature MeatBar design.",
    },
    {
      ideaBase: "Brilliant marketing video of the burger being built with cinematic focus on all its ingredients, emphasizing {item}",
      titleBase: "The Perfect Burger in Cinematic View",
      descriptionBase: "Premium video revealing every secret of our new burger. Every layer, every flavor, every detail - at a breathtaking pace. More than food, it's art! #MeatBar #Burger",
      promptBase: "Sophisticated cinematic production in extreme slow-motion. Shot begins with a fresh, golden {bun} placed on a black marble surface. Crisp, green iceberg lettuce leaves land gently, followed by ripe red tomato slices with glistening water droplets. A thick, hot beef patty is carefully placed, with golden cheddar cheese starting to melt and ooze hypnotically. As the cinematic highlight - a {item} slice with perfect grill marks and dripping juice lands delicately, creating a dramatic effect. Camera moves between different angles with changing depth of field, capturing every detail in microscopic magnification. Cinematic lighting with reflectors creates dramatic shine and shadows. The finale presents the perfect burger on a black branded MeatBar plate.",
    },
  ];

  const items = ['pineapple', 'avocado', 'bacon', 'mushrooms', 'jalapeños', 'caramelized onions', 'fried egg', 'crispy chicken'];
  const adjectives = ['juicy', 'crispy', 'savory', 'smoky', 'spicy', 'tangy', 'sweet', 'grilled'];
  const flavors = ['sweet and salty', 'tangy and spicy', 'rich and savory', 'smoky and sweet'];
  const dishes = ['juicy burger', 'signature sandwich', 'premium steak', 'deluxe burger'];
  const hashtags = ['Grilled', 'Fresh', 'Delicious', 'Premium', 'Special'];
  const colors = ['blue', 'red', 'green', 'black', 'white'];
  const buns = ['brioche bun', 'sesame bun', 'pretzel bun', 'potato bun'];

  const ideas: VideoIdea[] = [];

  for (let i = 0; i < count; i++) {
    const template = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const bun = buns[Math.floor(Math.random() * buns.length)];

    const replacements: Record<string, string> = {
      '{item}': item,
      '{items}': item + 's',
      '{adjective}': adjective,
      '{flavor}': flavor,
      '{dish}': dish,
      '{hashtag}': hashtag,
      '{color}': color,
      '{bun}': bun,
    };

    const replace = (str: string) => {
      let result = str;
      Object.entries(replacements).forEach(([key, value]) => {
        result = result.replace(new RegExp(key, 'g'), value);
      });
      return result;
    };

    ideas.push({
      id: `idea-${i + 1}-${Date.now()}`,
      idea: replace(template.ideaBase),
      title: replace(template.titleBase),
      description: replace(template.descriptionBase),
      prompt: replace(template.promptBase),
    });
  }

  return ideas;
};