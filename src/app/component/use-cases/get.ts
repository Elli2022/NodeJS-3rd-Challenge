export default function createGet({ checkDir, readFromFile, logger }) {
  return Object.freeze({ get });

  async function get(params, filePath, filename) {
    try {
      logger.info(`[USE-CASE] [GET] Reading from files ${filename} -START!`);

      const fileContent = await readFromFile({ filePath, filename });

      logger.info(`[USE-CASE] [GET] Reading from files ${filename} -END!`);
      return fileContent; // Antagligen är det redan i JSON-format, eftersom readFromFile bör hantera JSON-parsing.
    } catch (e) {
      throw e.message;
    }
  }
}
