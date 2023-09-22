export const VALID_REQUIRE = () => ({ type: "REQUIRE" });
export const VALID_MINLENGTH = (val) => ({ type: "MINLENGTH", val });
export const VALID_MAXLENGTH = (val) => ({ type: "MAXLENGTH", val });

export const VALID_NAME = (val) => ({ type: "NAME", val });
export const VALID_PHONE = (val) => ({ type: "PHONE", val });
export const VALID_EMAIL = () => ({ type: "EMAIL" });
export const VALID_ZIP = () => ({ type: "ZIP" });
export const VALID_PASS = () => ({ type: "PASS" });
export const VALID_PASSC = (val) => ({ type: "PASSC", val });
export const VALID_FILE = () => ({ type: "FILE" });

export const validate = (value, validators) => {
  let isValid = true;

  for (const validator of validators) {
    if (validator.type === "REQUIRE") {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === "MINLENGTH") {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === "MAXLENGTH") {
      isValid = isValid && value.trim().length <= validator.val;
    }

    if (validator.type === "NAME") {
      isValid = isValid && /^[A-Z][a-zA-Z '-.,]{2,32}$|^$/.test(value);
    }
    if (validator.type === "PHONE") {
      isValid =
        isValid &&
        value.trim().length === 10 &&
        /^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/.test(
          value
        );
    }
    if (validator.type === "EMAIL") {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === "ZIP") {
      isValid = isValid && /^[0-9]{6}$|^$/.test(value);
    }
    if (validator.type === "PASS") {
      isValid =
        isValid &&
        /(?=^.{8,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/.test(
          value
        );
    }
    if (validator.type === "PASSC") {
      isValid = isValid && value.trim() === validator.val;
    }
  }
  return isValid;
};
