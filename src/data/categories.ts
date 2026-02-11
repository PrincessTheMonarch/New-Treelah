import {
  Baby,
  Cake,
  Heart,
  Mars,
  PartyPopper,
  Trophy,
  Venus,
} from 'lucide-react';
import {
  baby_showers,
  birthdays,
  corporate,
  her,
  him,
  kids,
  milestones,
  weddings,
} from '../assets/images';
import {
  oggiBlack,
  oggiBrown,
  perfume,
  richwanaz,
  tomFord2,
  tracksuitGoldWhiteBlack,
  tracksuitWhiteAndBlack,
  tracksuitWhiteOxbloodBlack,
} from '../assets/products';

export const celebrationCategories = [
  {
    name: 'Birthdays',
    image: birthdays,
    icon: Cake,
    description: 'Make their day extra special',
  },
  {
    name: 'Weddings',
    image: weddings,
    icon: Heart,
    description: 'Celebrate their forever',
  },
  {
    name: 'Baby Showers',
    image: baby_showers,
    icon: Baby,
    description: 'Welcome the little one',
  },
  {
    name: 'Life Milestones & Achievements',
    image: milestones,
    icon: Trophy,
    description: 'Celebrate their success',
  },
];

export const recipientCategories = [
  {
    name: 'For Him',
    image: him,
    icon: Mars,
    description: "Gifts he'll love",
  },
  {
    name: 'For Her',
    image: her,
    icon: Venus,
    description: 'Elegant & beautiful',
  },
  {
    name: 'For Kids',
    image: kids,
    icon: PartyPopper,
    description: 'Fun & playful',
  },
  {
    name: 'Corporate Gifts',
    image: corporate,
    icon: Trophy,
    description: 'Professional & thoughtful',
  },
];

export const featuredProducts = [
  {
    id: 1,
    image: perfume,
    title: 'Armaf Club de Nuit Intense Man Eau de Toilette - 105ml',
    price: '₦85,000',
    // originalPrice: '$129.99',
    // badge: '30% OFF',
    tag: 'Bestseller',
  },
  {
    id: 2,
    image: tomFord2,
    title: "Tom Ford Men's Luxury Brogue Corporate Shoes",
    price: '₦100,000',
    tag: 'For Him',
  },
  {
    id: 3,
    image: richwanaz,
    title: "Richwanaz Men's Premium Patent Leather Loafers - Wine Red",
    price: '₦128,000',
    badge: 'New Arrival',
  },
  {
    id: 4,
    image: oggiBlack,
    title: "Oggi Men's Luxury Scritto Engraved Leather Loafers - Black",
    price: '₦90,000',
    tag: 'For Him',
  },
  {
    id: 5,
    image: oggiBrown,
    title: "Oggi Men's Luxury Scritto Engraved Leather Loafers - Brown",
    price: '₦90,000',
    tag: 'For Him',
  },
  {
    id: 6,
    image: tracksuitGoldWhiteBlack,
    title: "Men's Luxury Tracksuit - Gold, White & Black",
    price: '₦19,000',
    tag: 'For Him',
  },
  {
    id: 7,
    image: tracksuitWhiteOxbloodBlack,
    title: "Men's Luxury Tracksuit - White, Oxblood & Black",
    price: '₦19,000',
    tag: 'For Him',
  },
  {
    id: 8,
    image: tracksuitWhiteAndBlack,
    title: "Men's Luxury Tracksuit - White & Black",
    price: '₦19,000',
    tag: 'For Him',
  },
];

// export const trendingProducts = [
//   {
//     id: 9,
//     image:
//       'https://images.unsplash.com/photo-1619252872371-c82ac4d9e86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzYxNTU1NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     title: 'Birthday Party Surprise Box - Deluxe',
//     price: '$69.99',
//     tag: 'Trending',
//   },
//   {
//     id: 10,
//     image:
//       'https://images.unsplash.com/photo-1581720848209-9721f8fa30ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxNTQ0OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     title: 'Wedding Wishes - Elegant Flower Arrangement',
//     price: '$179.99',
//     badge: 'Premium',
//   },
//   {
//     id: 11,
//     image:
//       'https://images.unsplash.com/photo-1695649912699-435a5bc20203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hvY29sYXRlJTIwdHJlYXRzfGVufDF8fHx8MTc2MTY0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
//     title: 'Gourmet Treats Collection - Sweet Indulgence',
//     price: '$79.99',
//     originalPrice: '$99.99',
//     badge: '20% OFF',
//   },
//   {
//     id: 12,
//     image:
//       'https://images.unsplash.com/photo-1602347880090-a144f5b4d62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYxNTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     title: 'Personalized Gift Box - Make it Special',
//     price: '$99.99',
//     tag: 'Customizable',
//   },
// ];

// export const personalizedProducts = [
//   {
//     id: 13,
//     image:
//       'https://images.unsplash.com/photo-1759158963837-ce2f1524b813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBtdWclMjBjdXN0b218ZW58MXx8fHwxNzYxNjUwMjcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Custom Name Ceramic Mug - Personalized',
//     price: '$24.99',
//     tag: 'Bestseller',
//   },
//   {
//     id: 14,
//     image:
//       'https://images.unsplash.com/photo-1724490056260-44bf1de2617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0c2hpcnQlMjBkZXNpZ258ZW58MXx8fHwxNzYxNTkzMjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Personalized T-Shirt - Your Design',
//     price: '$29.99',
//     tag: 'Popular',
//   },
//   {
//     id: 15,
//     image:
//       'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBkaWFyeSUyMG5vdGVib29rfGVufDF8fHx8MTc2MTY1MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Leather Journal with Custom Monogram',
//     price: '$39.99',
//     tag: 'Premium',
//   },
//   {
//     id: 16,
//     image:
//       'https://images.unsplash.com/photo-1761210875101-1273b9ae5600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdyYXZlZCUyMGpld2VscnklMjBuZWNrbGFjZXxlbnwxfHx8fDE3NjE2NTAyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Engraved Name Necklace - Sterling Silver',
//     price: '$89.99',
//     originalPrice: '$119.99',
//     badge: '25% OFF',
//   },
//   {
//     id: 17,
//     image:
//       'https://images.unsplash.com/photo-1592999641298-434e28c11d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjB3YXRlciUyMGJvdHRsZSUyMGZsYXNrfGVufDF8fHx8MTc2MTY1MDI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Custom Stainless Steel Flask - Engraved',
//     price: '$34.99',
//     tag: 'For Him',
//   },
//   {
//     id: 18,
//     image:
//       'https://images.unsplash.com/photo-1717687620648-71efdd468192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwaG90byUyMGZyYW1lfGVufDF8fHx8MTc2MTY1MDI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Personalized Photo Frame - Family Memories',
//     price: '$44.99',
//     tag: 'Sentimental',
//   },
//   {
//     id: 19,
//     image:
//       'https://images.unsplash.com/photo-1759493946930-150aee20977c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBrZXljaGFpbnxlbnwxfHx8fDE3NjE2NTAyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Custom Keychain with Initials',
//     price: '$19.99',
//     badge: 'New',
//   },
//   {
//     id: 20,
//     image:
//       'https://images.unsplash.com/photo-1651936485213-55d235bef896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vZ3JhbSUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzYxNjUwMjc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
//     title: 'Monogrammed Canvas Tote Bag',
//     price: '$32.99',
//     tag: 'For Her',
//   },
// ];
