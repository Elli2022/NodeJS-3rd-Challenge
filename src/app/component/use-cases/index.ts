import createPost from "./post";
import createGet from "./get";
import config from "../../../tests/config";
import { logger } from "../../libs/logger";
import { makeInputObj } from "../entities";
import { checkDir, writeToFile, readFromFile } from "../data-access";
import makeDataManipulation from "../entities/data-manipulation";

const fileDirName = config.FILE_FOLDER_NAME;
const fileDirPath = config.FILE_FOLDER_PATH;
const filename = config.FILE_DB_NAME;
const filePath = config.FILE_DB_PATH;
const errorMsgs = config.ERROR_MSG;

const post = ({ params }) =>
  createPost({
    makeDataManipulation,
    makeInputObj,
    checkDir,
    writeToFile,
    readFromFile,

    logger,
  }).post({ params, filename, fileDirPath, fileDirName, filePath, errorMsgs });

const get = ({ params }) =>
  createGet({
    checkDir,
    readFromFile,
    logger,
  }).get(params, filePath, filename); // Här lägger vi till alla förväntade parametrar

export { post, get };
