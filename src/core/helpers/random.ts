export function getRandomNumber(min: number, max: number, decimal = 0): number {
  return +(Math.random() * (max - min) + min).toFixed(decimal);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = getRandomNumber(0, items.length - 1);
  const endPosition =
    startPosition + getRandomNumber(startPosition, items.length - 1);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  console.log(items);

  return items[getRandomNumber(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5;
}
