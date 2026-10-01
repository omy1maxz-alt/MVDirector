export const MOMENTS = [
  { name: 'Walking through neighborhoods', tags: ['outdoor', 'urban'] },
  { name: 'Waiting at crosswalks', tags: ['outdoor', 'urban', 'transit'] },
  { name: 'Looking through train windows', tags: ['transit', 'travel', 'window'] },
  { name: 'Shopping at convenience stores', tags: ['urban', 'indoor', 'errand'] },
  { name: 'Drinking coffee', tags: ['indoor', 'outdoor', 'leisure'] },
  { name: 'Reading books', tags: ['indoor', 'outdoor', 'leisure', 'quiet'] },
  { name: 'Listening to music', tags: ['indoor', 'outdoor', 'leisure', 'quiet'] },
  { name: 'Watching rain', tags: ['indoor', 'window', 'quiet'] },
  { name: 'Feeding animals', tags: ['outdoor', 'park', 'leisure'] },
  { name: 'Buying flowers', tags: ['urban', 'errand', 'outdoor'] },
  { name: 'Waiting for buses', tags: ['outdoor', 'urban', 'transit'] },
  { name: 'Taking photos', tags: ['outdoor', 'urban', 'leisure', 'travel'] },
  { name: 'Looking at the sunset', tags: ['outdoor', 'quiet', 'day'] },
  { name: 'Cooking', tags: ['indoor', 'leisure'] },
  { name: 'Cleaning', tags: ['indoor'] },
  { name: 'Stretching', tags: ['indoor', 'outdoor', 'leisure'] },
  { name: 'Checking messages', tags: ['indoor', 'outdoor', 'urban'] },
  { name: 'Sitting quietly', tags: ['indoor', 'outdoor', 'quiet'] },
  { name: 'People watching', tags: ['outdoor', 'urban', 'social', 'quiet'] },
  { name: 'Traveling', tags: ['transit', 'travel'] },
  { name: 'Watching football matches', tags: ['indoor', 'outdoor', 'social', 'stadium'] },
  { name: 'Airport moments', tags: ['travel', 'transit'] },
  { name: 'Hotel mornings', tags: ['travel', 'indoor'] },
  { name: 'Late-night convenience store visits', tags: ['urban', 'indoor', 'night', 'errand'] },
];

export const ENVIRONMENTS = [
  { name: 'Residential streets', tags: ['outdoor', 'urban'] },
  { name: 'Train stations', tags: ['transit', 'travel', 'urban'] },
  { name: 'Airports', tags: ['travel', 'transit'] },
  { name: 'Parks', tags: ['outdoor', 'park'] },
  { name: 'Markets', tags: ['urban', 'errand', 'outdoor'] },
  { name: 'Apartment balconies', tags: ['outdoor', 'indoor', 'quiet'] },
  { name: 'Rooftops', tags: ['outdoor', 'urban', 'quiet'] },
  { name: 'Quiet cafés', tags: ['indoor', 'leisure', 'quiet'] },
  { name: 'Libraries', tags: ['indoor', 'leisure', 'quiet'] },
  { name: 'Bus stops', tags: ['outdoor', 'urban', 'transit'] },
  { name: 'Riversides', tags: ['outdoor', 'park', 'quiet'] },
  { name: 'Beach walks', tags: ['outdoor', 'travel', 'quiet'] },
  { name: 'Mountain villages', tags: ['outdoor', 'travel', 'quiet'] },
  { name: 'University campuses', tags: ['outdoor', 'indoor', 'social'] },
];

export const ATMOSPHERES = [
  { name: 'Gentle wind', tags: ['outdoor', 'day'] },
  { name: 'Moving tree shadows', tags: ['outdoor', 'park', 'day'] },
  { name: 'Passing bicycles', tags: ['outdoor', 'urban'] },
  { name: 'Birds', tags: ['outdoor', 'park', 'quiet'] },
  { name: 'Distant conversations', tags: ['urban', 'social'] },
  { name: 'Traffic far away', tags: ['urban', 'outdoor'] },
  { name: 'Flowing curtains', tags: ['indoor', 'window'] },
  { name: 'Steam from coffee', tags: ['indoor', 'leisure'] },
  { name: 'Rain on windows', tags: ['indoor', 'window', 'quiet'] },
  { name: 'Floating dust', tags: ['indoor', 'quiet'] },
  { name: 'Morning sunlight', tags: ['indoor', 'outdoor', 'day'] },
  { name: 'Golden hour', tags: ['outdoor', 'travel', 'day'] },
  { name: 'Overcast afternoons', tags: ['outdoor', 'quiet', 'day'] },
  { name: 'Quiet nights', tags: ['outdoor', 'indoor', 'night', 'quiet'] },
];

function shareTag(a: string[], b: string[]) {
  return a.some(tag => b.includes(tag));
}

export const ALL_COMBINATIONS = MOMENTS.flatMap(m =>
  ENVIRONMENTS
    .filter(e => shareTag(m.tags, e.tags))
    .flatMap(e =>
      ATMOSPHERES
        .filter(a => shareTag(e.tags, a.tags) && shareTag(m.tags, a.tags))
        .map(a => ({
          moment: m.name,
          environment: e.name,
          atmosphere: a.name,
          id: `${m.name}|${e.name}|${a.name}`
        }))
    )
);
