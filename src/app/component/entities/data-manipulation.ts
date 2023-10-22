export default function makeDataManipulation() {
  function transformDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Transformera till ett lokalt datum- och tidssträngformat
  }

  return {
    transformDate,
  };
}
