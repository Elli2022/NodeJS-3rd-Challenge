export default function createPost({
  makeInputObj,
  checkDir,
  readFromFile,
  writeToFile,
  makeDataManipulation, // <- Lägg till detta
  logger,
}) {
  const dataManipulation = makeDataManipulation(); // <- Skapa en instans här

  return Object.freeze({ post });

  async function post({
    params,
    filename,
    fileDirPath,
    fileDirName,
    filePath,
    errorMsgs,
  }) {
    let user;
    try {
      logger.info(`[USE-CASE][POST] Inserting user to ${filename} - START!`);
      const userFactory = makeInputObj({ params });

      user = {
        username: userFactory.username(),
        password: userFactory.password(),
        created: dataManipulation.transformDate(userFactory.created()), // <- Använd dataManipulation här
        modified: dataManipulation.transformDate(userFactory.modified()), // <- och här
      };

      await checkDir({ fileDirPath, fileDirName });
      const content = await readFromFile({ filePath, filename });
      const duplicate = content.filter((el) => el.username == user.username);

      if (duplicate.length) throw new Error(errorMsgs.EXISTING_USER);
      content.push(user);
      await writeToFile({ content, filePath, filename });
      logger.info("[POST] [USE-CASE] Inserting Object process - DONE!");
      return user;
    } catch (e) {
      logger.info("[POST] [USE-CASE] Inserting Object process - DONE!");
      throw e;
    }
  }
}
