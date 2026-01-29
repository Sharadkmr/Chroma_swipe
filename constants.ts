
import { ColorDefinition } from './types';

const tailwindHues = [
  'slate', 'zinc', 'red', 'orange', 'amber', 'yellow', 'lime', 
  'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 
  'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

const shadeWeights = [300, 400, 500, 600, 700, 800];

// Fancy naming engine for "Lipstick / Nail Polish" style names
const getFancyName = (hue: string, shade: number): string => {
  const names: Record<string, string[]> = {
    red: ['Crimson Velvet', 'Scarlet Fever', 'Ruby Romance', 'Cherry Bomb', 'Wine Not?', 'Siren Song'],
    pink: ['Bubblegum Bliss', 'Fuchsia Flash', 'Rose Petal', 'Pink Peony', 'Dusty Rose', 'Cotton Candy'],
    rose: ['Antique Rose', 'Wild Berry', 'Midnight Rose', 'Petal Pusher', 'Blush Crush'],
    fuchsia: ['Electric Orchid', 'Magenta Magic', 'Barbie Dream', 'Hot Gossip', 'Party Pink'],
    purple: ['Grape Expectations', 'Midnight Plum', 'Violet Vixen', 'Amethyst Aura', 'Lavender Love'],
    violet: ['Ultra Violet', 'Wisteria Whisper', 'Lilac Lace', 'Iris Insight', 'Plum Perfect'],
    indigo: ['Deep Sea', 'Starry Night', 'Ink Well', 'Denim Days', 'Twilight Zone'],
    blue: ['Sapphire Soul', 'Midnight Ocean', 'Azure Sky', 'Royal Rebel', 'Electric Blue'],
    sky: ['Cloud Nine', 'Baby Blue', 'Celestial', 'Clear Day', 'Atmosphere'],
    cyan: ['Tropical Water', 'Turquoise Treat', 'Aqua Marine', 'Lagoon Look', 'Ice Cap'],
    teal: ['Peacock Pride', 'Oceanic', 'Deep Forest', 'Mermaid Tail', 'Teal Temptation'],
    emerald: ['Jade Jewel', 'Luck of the Irish', 'Envy Me', 'Forest Green', 'Hidden Valley'],
    green: ['Minty Fresh', 'Lime Light', 'Grass Is Greener', 'Sage Advice', 'Fern Fever'],
    lime: ['Zesty Lime', 'Sour Apple', 'Neon Grass', 'Key Lime Pie', 'Electric Eel'],
    yellow: ['Golden Hour', 'Honey Hush', 'Lemon Meringue', 'Mellow Yellow', 'Sun Kissed'],
    amber: ['Toasted Pecan', 'Tiger Lily', 'Burnt Sugar', 'Caramel Candy', 'Autumn Leaf'],
    orange: ['Sunset Sizzle', 'Apricot Aura', 'Mandarin Mist', 'Coral Castle', 'Flame Thrower'],
    slate: ['Stone Cold', 'Pavement Pride', 'Concrete Jungle', 'Grey Ghost', 'Urban Chic'],
    zinc: ['Metal Matte', 'Industrial', 'Titanium', 'Pewter Power', 'Steel Stare']
  };

  const hueNames = names[hue] || ['Mystery Shade'];
  const index = Math.floor((shade / 100) % hueNames.length);
  const suffix = shade > 600 ? 'Deep' : shade < 400 ? 'Light' : '';
  
  return `${hueNames[index]}${suffix ? ' ' + suffix : ''}`;
};

const generateColors = (): ColorDefinition[] => {
  const result: ColorDefinition[] = [];
  
  tailwindHues.forEach(hue => {
    shadeWeights.forEach(shade => {
      const id = `${hue}-${shade}`;
      const name = getFancyName(hue, shade);
      
      result.push({
        id,
        name,
        hex: '',
        textColor: `text-${hue}-${shade}`,
        bgTailwind: `bg-${hue}-${shade}`,
        borderTailwind: `border-${hue}-${shade + 100 > 950 ? 950 : shade + 100}`,
        hue,
        shade
      });
    });
  });

  return result;
};

export const COLORS: ColorDefinition[] = generateColors();

export const getSimilarColors = (target: ColorDefinition, count: number): ColorDefinition[] => {
  const sameHue = COLORS.filter(c => c.hue === target.hue && c.id !== target.id);
  const hueIndex = tailwindHues.indexOf(target.hue);
  const adjacentHues = [
    tailwindHues[hueIndex - 1],
    tailwindHues[hueIndex + 1]
  ].filter(Boolean);
  
  const adjacentColors = COLORS.filter(c => adjacentHues.includes(c.hue));
  const pool = [...sameHue, ...adjacentColors].sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
};

export const APP_CONFIG = {
  SWIPE_THRESHOLD: 100,
  ANIMATION_DURATION: 0.3,
};
