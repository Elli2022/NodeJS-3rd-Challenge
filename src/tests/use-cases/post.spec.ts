import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import { expect } from "chai";
import * as path from "path";
import config from "../config";
import { logger } from "../../app/libs/logger";
import { rm, readFile } from "node:fs/promises";
import { makeInputObj } from "../../app/component/entities";
import {
  checkDir,
  readFromFile,
  writeToFile,
} from "../../app/component/data-access";
import createPost from "../../app/component/use-cases/post";
import makeDataManipulation from "../../app/component/entities/data-manipulation";

const post = ({ params }) =>
  createPost({
    makeInputObj,
    checkDir,
    readFromFile,
    writeToFile,
    makeDataManipulation,
    logger,
  }).post({
    params,
    filename: config.FILE_DB_NAME,
    fileDirPath: config.FILE_FOLDER_PATH,
    fileDirName: config.FILE_FOLDER_NAME,
    filePath: config.FILE_DB_PATH,
    errorMsgs: config.ERROR_MSG.post,
  });

describe("Post", () => {
  after(() => rm(config.FILE_FOLDER_PATH, { recursive: true }));

  it("should insert a user", async () => {
    const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
    };
    const results = await post({ params });
    const fileContent = await readFile(config.FILE_DB_PATH, {
      encoding: "utf8",
    });
    const users = JSON.parse(fileContent);
    expect(results).to.have.property("username").equal(params.username);
    expect(users.length).to.equal(1);
    expect(users[0]).to.have.property("username").equal(params.username);
  });

  it("should not insert an empty user", async () => {
    const params = {
      username: undefined,
      password: undefined,
    };
    try {
      await post({ params });
    } catch (err) {
      expect(err).to.equal(config.ERROR_MSG.post.NO_DATA);
    }
  });

  it("should not insert an existing user", async () => {
    const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
    };
    try {
      await post({ params });
    } catch (err) {
      expect(err).to.equal(config.ERROR_MSG.post.EXISTING_USER);
    }
  });

  it("should insert another user", async () => {
    const params = {
      username: config.TEST_DATA.user2.username,
      password: config.TEST_DATA.user2.password,
    };
    await post({ params });
    const results = await readFile(config.FILE_DB_PATH, { encoding: "utf8" });
    expect(Object.keys(JSON.parse(results)).length).to.equal(2);
  });

  it("should not insert a user without a valid email", async () => {
    const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
      email: "invalidEmail",
      name: "Test",
      surname: "User",
    };
    try {
      await post({ params });
    } catch (err) {
      expect(err.message).to.include(config.ERROR_MSG.post.INVALID_EMAIL);
    }
  });

  it("should not insert a user without name or surname", async () => {
    const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
      email: "test@example.com",
      name: "",
      surname: "",
    };
    try {
      await post({ params });
    } catch (err) {
      expect(err.message).to.include(config.ERROR_MSG.post.MISSING_PARAMETER);
    }
  });

  it("should insert a user with valid email, name, and surname", async () => {
    const params = {
      username: config.TEST_DATA.user3.username,
      password: config.TEST_DATA.user3.password,
      email: "test@example.com",
      name: "Test",
      surname: "User",
    };
    const results = await post({ params });
    const fileContent = await readFile(config.FILE_DB_PATH, {
      encoding: "utf8",
    });
    const users = JSON.parse(fileContent);
    expect(results).to.have.property("email").equal(params.email);
    expect(results).to.have.property("name").equal(params.name);
    expect(results).to.have.property("surname").equal(params.surname);
    expect(users.length).to.equal(3);
    expect(users[2]).to.have.property("email").equal(params.email);
    expect(users[2]).to.have.property("name").equal(params.name);
    expect(users[2]).to.have.property("surname").equal(params.surname);
  });
});
