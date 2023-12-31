export default function makeInputObjectFactory({ md5, sanitize }) {
  let localErrorMsgs = {};

  function inputObj({ params, errorMsgs }) {
    const {
      username,
      password,
      email,
      name,
      surname,
      created = Date.now(),
      modified = Date.now(),
    } = params;

    return Object.freeze({
      username: () => checkUsername({ username, errorMsgs }),
      password: () => checkPassword({ password, errorMsgs }),
      email: () => checkEmail({ email, errorMsgs }),
      name: () => checkName({ name, errorMsgs }),
      surname: () => checkName({ name: surname, errorMsgs }),
      created: () => created,
      modified: () => modified,
    });
  }

  function checkUsername({ username, errorMsgs }) {
    checkRequiredParam({
      param: username,
      paramName: "username",
      errorMsgs,
    });

    if (!strValidator(username)) {
      throw new Error(`${errorMsgs.INVALID_STRING}username`);
    }

    username = sanitize(username);
    return username;
  }

  function checkPassword({ password, errorMsgs }) {
    checkRequiredParam({
      param: password,
      paramName: "password",
      errorMsgs,
    });
    password = sanitize(password);
    password = hash({ param: password });
    return password;
  }

  function checkEmail({ email, errorMsgs }) {
    checkRequiredParam({
      param: email,
      paramName: "email",
      errorMsgs,
    });

    if (!emailValidator(email)) {
      throw new Error(`${errorMsgs.INVALID_EMAIL}`);
    }

    email = sanitize(email);
    return email;
  }

  function emailValidator(email: any) {
    // Enkel regex för att validera e-post
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function checkName({ name, errorMsgs }) {
    checkRequiredParam({
      param: name,
      paramName: "name",
      errorMsgs,
    });

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error(`${errorMsgs.INVALID_STRING}name`);
    }

    name = sanitize(name);
    return name;
  }

  function hash({ param }) {
    return md5(param);
  }

  function checkRequiredParam({ param, paramName, errorMsgs }) {
    if (!param || param === "")
      throw new Error(`${errorMsgs.MISSING_PARAMETER}${paramName}`);
    return;
  }

  // validerar strängen: ska vara större än 4 karaktärer men mindre än 25 och får bara vara små bokstäver och siffror
  function strValidator(str: any) {
    return (
      str.length > 4 &&
      str.length < 25 &&
      str.match(/^[a-z0-9]+$/) && // Endast små bokstäver och siffror för hela strängen
      str.split("")[0].match(/[a-z]/) // Startar med en liten bokstav
    );
  }

  return Object.freeze({ inputObj });
}
