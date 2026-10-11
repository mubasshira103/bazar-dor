import type { Product, Category } from "@/types/product";

export const categories: Category[] = [
  { slug: "chal", name: "চাল", emoji: "🍚" },
  { slug: "dal", name: "ডাল", emoji: "🫘" },
  { slug: "tel", name: "তেল", emoji: "🫙" },
  { slug: "sobji", name: "সবজি", emoji: "🥬" },
  { slug: "mach", name: "মাছ", emoji: "🐟" },
  { slug: "mangsho", name: "মাংস", emoji: "🍗" },
  { slug: "dim-dudh", name: "ডিম-দুধ", emoji: "🥚" },
  { slug: "moshla", name: "মসলা", emoji: "🌶️" }
];

const seed = [
  ["sornamushi-chal","স্বর্ণমাছি চাল","chal","🍚","প্রতি কেজি",148,2.1],
  ["miniket-chal","মিনিকেট চাল","chal","🍚","প্রতি কেজি",99,-2.9],
  ["najir-chal","নাজির চাল","chal","🍚","প্রতি কেজি",78,0],
  ["bashmati-chal","বাসমতি চাল","chal","🍚","প্রতি কেজি",66,3.6],
  ["mosur-dal","মসুর ডাল","dal","🫘","প্রতি কেজি",142,2.9],
  ["chola","ছোলা","dal","🫘","প্রতি কেজি",120,-2.4],
  ["peyaj","পেঁয়াজ","sobji","🧅","প্রতি কেজি",54,2.0],
  ["begun","বেগুন","sobji","🍆","প্রতি কেজি",44,4.8],
  ["alu","আলু","sobji","🥔","প্রতি কেজি",35,-1.7],
  ["morich","কাঁচা মরিচ","sobji","🌶️","প্রতি কেজি",90,5.1],
  ["roshun","রসুন","sobji","🧄","প্রতি কেজি",185,-1.2],
  ["ada","আদা","sobji","🫚","প্রতি কেজি",85,3.0],
  ["ilish","ইলিশ মাছ","mach","🐟","প্রতি কেজি",1250,3.5],
  ["rui","রুই মাছ","mach","🐟","প্রতি কেজি",360,-2.1],
  ["broiler","ব্রয়লার মুরগি","mangsho","🍗","প্রতি কেজি",210,-1.5],
  ["beef","গরুর মাংস","mangsho","🥩","প্রতি কেজি",780,1.1],
  ["dim","ডিম","dim-dudh","🥚","প্রতি ডজন",158,2.7],
  ["soyabean-oil","সয়াবিন তেল","tel","🫙","প্রতি লিটার",185,-0.8],
  ["holud","হলুদ","moshla","🟡","প্রতি কেজি",320,1.4],
  ["dudh","দুধ","dim-dudh","🥛","প্রতি লিটার",95,0]
] as const;

const markets = [
  { name: "সদর বাজার", district: "রাজশাহী", factor: 1 },
  { name: "নিউ মার্কেট", district: "ঢাকা", factor: 1.08 },
  { name: "রেলওয়ে বাজার", district: "খুলনা", factor: 0.96 },
  { name: "কাঁচাবাজার", district: "চট্টগ্রাম", factor: 1.04 },
  { name: "সিটি বাজার", district: "সিলেট", factor: 1.02 },
  { name: "মেইন বাজার", district: "ময়মনসিংহ", factor: 0.98 }
];

export const products: Product[] = seed.map((s, index) => {
  const [slug, name, category, emoji, unit, price, change] = s;
  const p = Number(price);
  const categoryName = categories.find(c => c.slug === category)?.name ?? "অন্যান্য";
  const marketRows = markets.map((m, i) => {
    const v = Math.round(p * m.factor * (1 + ((i % 3) - 1) * 0.025));
    return { name: m.name, district: m.district, min: Math.round(v * 0.94), max: Math.round(v * 1.06), price: v };
  });
  return {
    id: index + 1, slug, name, category, categoryName, emoji, unit, price: p, change: Number(change),
    description: `${name} এর আজকের সম্ভাব্য খুচরা বাজারদর ও বাজারভিত্তিক মূল্য তুলনা।`,
    minPrice: Math.min(...marketRows.map(m => m.min)),
    maxPrice: Math.max(...marketRows.map(m => m.max)),
    averagePrice: Math.round(marketRows.reduce((a, m) => a + m.price, 0) / marketRows.length),
    markets: marketRows
  };
});

export function formatBengaliNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(value);
}
